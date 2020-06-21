<?php 

include '../pg_functions.php';
include '../config.php';

// Récupération des variables 
$territoire = $_GET['territoire'];
$territoire_token = $_GET['territoire_token'];
$territoire_sql = $_GET['territoire_sql']; 

$territoire_lon = $_GET['territoire_lon'];
$territoire_lat = $_GET['territoire_lat'];
$territoire_rad = $_GET['territoire_rad'];

$ratios = $_GET['ratios'];

// print($territoire);
// print("</br>");
// print($territoire_token);
// print("</br>");
// print($territoire_sql);


// Filtre spatial en fonction radius / territoire
if ($territoire_sql == "") {
    $filtre_geo = " LEFT JOIN referentiel.entites as b ON st_intersects(a.geom, b.geom) WHERE b.lib_entite = '".$territoire."' and b.id_entite = '".$territoire_token."' ";
	
	if (strpos($territoire, 'PARC NATUREL') !== false) {
		$filtre_geo = " LEFT JOIN referentiel.entites as b ON st_intersects(a.geom, b.geom) WHERE b.lib_entite = '".$territoire."' and b.code_entite = '".$territoire_token."' ";
	} else { 
		$filtre_geo = " LEFT JOIN referentiel.entites as b ON st_intersects(a.geom, b.geom) WHERE b.lib_entite = '".$territoire."' and b.id_entite = '".$territoire_token."' ";
	};

	if (strpos($territoire, 'PARC NATUREL') !== false) {
		$filtre_geo_pos = " LEFT JOIN referentiel.entites as b ON st_intersects(st_pointonsurface(a.geom), b.geom) WHERE b.lib_entite = '".$territoire."' and b.code_entite = '".$territoire_token."' ";
	} else { 
		$filtre_geo_pos = " LEFT JOIN referentiel.entites as b ON st_intersects(st_pointonsurface(a.geom), b.geom) WHERE b.lib_entite = '".$territoire."' and b.id_entite = '".$territoire_token."' ";
	};

	$where_geo = "";
} else {
    $filtre_geo = " LEFT JOIN (".$territoire_sql.") as b ON st_intersects(a.geom, b.geom) ";
    
	$filtre_geo_pos = " LEFT JOIN (".$territoire_sql.") as b ON st_intersects(a.geom, b.geom) ";
    
	$where_geo = "WHERE b.geom IS NOT NULL";
};


// Contours du territoire
$sql_territoire_poly = "
select st_astext(CAST(ST_buffer(CAST((select st_setsrid(st_makepoint(".$territoire_lon.", ".$territoire_lat."),4326)) as geography), ".$territoire_rad.") as geometry) )
";


// Extraction du nombre d'unités de méthanisation sur le territoire.
$sql_nb_unites_metha = "
SELECT 
    site_nom, commune, typologie, tonnage_traite, type_valo, 
    CASE 
		WHEN dimensionnement_nm3_h IS NOT NULL THEN dimensionnement_nm3_h::TEXT || ' NM3/h' 
		ELSE dimensionnement_kwe || ' Kwe' 
	END AS dimensionnement 
FROM geres.rom_unites_metha as a ".$filtre_geo."
".$where_geo." 
";

// Extraction des gisements mobilisables (Brutes / avec ratios / avec STEP)
$sql_gisements = "
WITH donnees AS (
	SELECT 
		-- Bruts hors step
			sum(val_t_brut)::integer AS brut_t, --  tonnes
			(sum(val_m3ch4_brut) * 9.7 / 1000.)::integer AS brut_eq_mwh, -- null::integer AS brut_eq_mwh, -- (sum(val_m3ch4_net_calcule) * 9.7 / 1000.)::integer AS brut_eq_mwh, -- Equivalent MWh / an
			sum(val_m3ch4_brut)::integer AS brut_eq_nm3, -- null::integer AS brut_eq_nm3, -- sum(val_m3ch4_net_calcule)::integer AS brut_eq_nm3, -- Nm3 CH4/an, hypothèse valorisation injection
		-- Mobilisable hors step selon ratios à dire d'experts
			sum(val_t_net_calcule)::integer AS net_t, -- en tonnes par an,
			(sum(val_m3ch4_net_calcule) * 9.7 / 1000.)::integer AS net_eq_mwh, -- Equivalent MWh / an
			sum(val_m3ch4_net_calcule)::integer AS net_eq_nm3 -- Nm3 CH4/an, hypothèse valorisation injection
	FROM geres.rom_bilan_comm_rs 
    WHERE id_comm IN (
		SELECT DISTINCT a.code_entite::integer as id_comm
		FROM (select * from referentiel.entites where rang_entite = 4) AS a
            ".$filtre_geo."
            ".$where_geo." 
    )
)
SELECT 
	'Bruts hors STEP'::TEXT AS \"Gisements\", 
	brut_t AS \"En tonnes/an\", 
	brut_eq_mwh AS \"Equivalent MWh/an\", 
	brut_eq_nm3 AS \"Équivalent Nm3 CH4/an\"
FROM donnees 
UNION ALL 
SELECT 
	'Mobilisable hors STEP, selon ratios à dire d’expert'::TEXT AS \"Gisements\", 
	net_t AS \"En tonnes/an\", 
	net_eq_mwh AS \"Equivalent MWh/an\", 
	net_eq_nm3 AS \"Équivalent Nm3 CH4/an\"
FROM donnees 

-- + STEP 
UNION ALL 
SELECT
	'Gisements des STEP'::TEXT, 
	(sum(prod_tot_kg_ms) / 1000.)::integer, -- NULL::integer, -- (prod_tot_kg_ms / 1000.)::integer,
	sum(prod_mwh_an)::integer,
	sum(prod_tot_nm3_ch4)::integer
FROM geres.rom_step as a
".$filtre_geo." 
".$where_geo."
AND methanisation is false  
";

// Extractio des données pour les graphiques des gisements + sous tableau
$sql_gisements_graph = "
SELECT 
	groupe_rom as \"Type\", 
	sum(val_t_net_calcule)::integer as \"Tonnes/an\", 
	(sum(val_m3ch4_net_calcule) * 9.7 / 1000.)::integer AS \"Mwh/an\"
FROM geres.rom_bilan_comm_rs AS a 
LEFT JOIN geres.rom_tpk_param AS aa USING (id_param)
WHERE id_comm IN (
	SELECT DISTINCT a.code_entite::integer as id_comm
	FROM (select * from referentiel.entites where rang_entite = 4) AS a
		".$filtre_geo."
		".$where_geo." 
)
GROUP BY groupe_rom
";


// Extraction du pouircentage du réseau Gaz 5 km sur le territoire
$sql_reseau_gaz_5km = "
SELECT round((
	(SELECT sum(a.srf_reseau) FROM geres.dbg_grdf_reseau_5km_comm as a".$filtre_geo_pos." ".$where_geo.")
	/
	(SELECT sum(st_area(a.geom)) AS srf_totale FROM referentiel.entites as a ".$filtre_geo_pos." ".$where_geo." and a.rang_entite = 4)	
	* 100.
)::NUMERIC, 1) pct
";


// Extraction du pouircentage du réseau Gaz 10 km sur le territoire
$sql_reseau_gaz_5_10km = "
SELECT round((
	(SELECT sum(a.srf_reseau) FROM geres.dbg_grdf_reseau_5_10km_comm as a ".$filtre_geo_pos." ".$where_geo.")
	/
	(SELECT sum(st_area(a.geom)) AS srf_totale FROM referentiel.entites as a ".$filtre_geo_pos." ".$where_geo." and a.rang_entite = 4)	
	* 100.
)::NUMERIC, 1) pct
";


// Extraction des IAA présentes sur le territoire
$sql_iaa = "
SELECT a.entreprise AS \"Entreprise\", a.nom_com AS \"Commune\", a.code_ape AS \"Activité\" 
FROM geres.dbg_iaa as a 
".$filtre_geo."
".$where_geo." 
";


// Extraction des unités de compostage présentes sur le territoire
$sql_compostage = "
SELECT 
	nom_site AS \"Nom de la plateforme\",  
	commune AS \"Commune\",
	capacite_reglementaire AS \"Capacité règlementaire (t/an)\",
	concat_ws(', ',
		CASE WHEN cap_dechets_verts IS NOT NULL THEN 'Déchets Verts' ELSE null END ,
		CASE WHEN cap_boues IS NOT NULL THEN 'Boues' ELSE null END ,
		CASE WHEN cap_biodechets IS NOT NULL THEN 'Bio déchets' ELSE null END ,
		CASE WHEN cap_dechets_agri IS NOT NULL THEN 'Déchets agricoles' ELSE null END ,
		CASE WHEN cap_bois IS NOT NULL THEN 'Bois' ELSE null END 
	) AS \"Déchets traités\",
    CASE WHEN span <> 'Non' then 'SPAN ' || span::text else 'Non' end as \"Agrément SPAN\"
FROM geres.ddg_plateforme_compostage as a 
".$filtre_geo."
".$where_geo." 
ORDER BY commune, nom_site
";


// $sql_alp = "
// select nom_label, nom_epci as nom
// from (
    // select 'TEPOS' as nom_label, * from geres.alp_carte_plans_epci where stats like '%TEPOS%'
    // union all 
    // select 'TEPOS' as nom_label, * from geres.alp_carte_plans_pays where stats like '%TEPOS%'
    // union all 
    // select 'TEPOS' as nom_label, * from geres.alp_carte_plans_pnr where stats like '%TEPOS%'

    // union all

    // select 'TEPCV' as nom_label, * from geres.alp_carte_plans_epci where stats like '%TEPCV%'
    // union all 
    // select 'TEPCV' as nom_label, * from geres.alp_carte_plans_pays where stats like '%TEPCV%'
    // union all 
    // select 'TEPCV' as nom_label, * from geres.alp_carte_plans_pnr where stats like '%TEPCV%'

    // union all

    // select 'TZDZG' as nom_label, * from geres.alp_carte_plans_epci where stats like '%TZDZG%'
    // union all 
    // select 'TZDZG' as nom_label, * from geres.alp_carte_plans_pays where stats like '%TZDZG%'
    // union all 
    // select 'TZDZG' as nom_label, * from geres.alp_carte_plans_pnr where stats like '%TZDZG%'
// ) as a
// ".$filtre_geo."
// ".$where_geo." 
// "; 

/*
$sql_alp = "
WITH communes AS (
    SELECT a.id_entite AS id_comm, a.geom
    -- FROM cigale.liste_entites_admin AS a 
    FROM referentiel.entites as a
    -- ".$filtre_geo_pos."
    ".$filtre_geo."
    ".$where_geo." 
    AND a.rang_entite = 4  
)

SELECT DISTINCT type_territoire as territoire, 'TEPOS' as nom_label, a.nom_territoire as nom
FROM geres.alp_carte_plans_tepos AS a 
-- LEFT JOIN communes AS b ON st_intersects(a.geom, st_pointonsurface(b.geom))
-- LEFT JOIN communes AS b ON st_relate(a.geom, b.geom, 'T********')
LEFT JOIN communes AS b ON ( st_intersects(a.geom, b.geom)  AND NOT st_touches(a.geom, b.geom)  )
WHERE b.geom IS NOT NULL 

UNION ALL 

SELECT DISTINCT territoire, 'TEPCV' as nom_label, a.nom_territoire as nom
FROM geres.alp_carte_plans_tepcv AS a 
-- LEFT JOIN communes AS b ON st_intersects(a.geom, st_pointonsurface(b.geom))
-- LEFT JOIN communes AS b ON st_relate(a.geom, b.geom, 'T********')
LEFT JOIN communes AS b ON ( st_intersects(a.geom, b.geom)  AND NOT st_touches(a.geom, b.geom)  )
WHERE b.geom IS NOT NULL 

UNION ALL 

SELECT DISTINCT territoire, 'TZDZG' as nom_label, a.nom_territoire as nom 
FROM geres.alp_carte_plans_tzdzg AS a 
-- LEFT JOIN communes AS b ON st_intersects(a.geom, st_pointonsurface(b.geom))
-- LEFT JOIN communes AS b ON st_relate(a.geom, b.geom, 'T********')
LEFT JOIN communes AS b ON ( st_intersects(a.geom, b.geom)  AND NOT st_touches(a.geom, b.geom)  )
WHERE b.geom IS NOT NULL 

UNION ALL 

SELECT DISTINCT territoire, 'CTE' as nom_label, a.nom_territoire as nom 
FROM geres.alp_carte_plans_cte AS a 
-- LEFT JOIN communes AS b ON st_intersects(a.geom, st_pointonsurface(b.geom))
-- LEFT JOIN communes AS b ON st_relate(a.geom, b.geom, 'T********')
LEFT JOIN communes AS b ON ( st_intersects(a.geom, b.geom)  AND NOT st_touches(a.geom, b.geom)  )
WHERE b.geom IS NOT NULL 
";
*/

$sql_alp = "
SELECT territoire, nom_label, nom
FROM (
	SELECT DISTINCT type_territoire as territoire, 'TEPOS' as nom_label, a.nom_territoire as nom, st_area(st_intersection(a.geom, b.geom)) AS srf_int
	FROM geres.alp_carte_plans_tepos AS a 
	-- LEFT JOIN referentiel.entites AS b ON st_intersects(a.geom, b.geom) 
    ".$filtre_geo."
    ".$where_geo." 
) AS a 
WHERE srf_int > 0.1

union all 

SELECT territoire, nom_label, nom
FROM (
	SELECT DISTINCT territoire, 'TEPCV' as nom_label, a.nom_territoire as nom, st_area(st_intersection(a.geom, b.geom)) AS srf_int
	FROM geres.alp_carte_plans_tepcv AS a 
	-- LEFT JOIN referentiel.entites AS b ON st_intersects(a.geom, b.geom) 
    ".$filtre_geo."
    ".$where_geo." 
) AS a 
WHERE srf_int > 0.1

union all 

SELECT territoire, nom_label, nom
FROM (
	SELECT DISTINCT territoire, 'TZDZG' as nom_label, a.nom_territoire as nom, st_area(st_intersection(a.geom, b.geom)) AS srf_int
	FROM geres.alp_carte_plans_tzdzg AS a 
	-- LEFT JOIN referentiel.entites AS c ON st_intersects(a.geom, b.geom) 
    ".$filtre_geo."
    ".$where_geo."
) AS a 
WHERE srf_int > 0.1

union all 

SELECT territoire, nom_label, nom
FROM (
	SELECT DISTINCT territoire, 'CTE' as nom_label, a.nom_territoire as nom, st_area(st_intersection(a.geom, b.geom)) AS srf_int
	FROM geres.alp_carte_plans_cte AS a 
	-- LEFT JOIN referentiel.entites AS b ON st_intersects(a.geom, b.geom) 
    ".$filtre_geo."
    ".$where_geo."
) AS a 
WHERE srf_int > 0.1
";

// Si on a des ratios personalisés, on calcul des stats par group rom 
if(!empty($ratios)) {
	$sql_ratios = "
		WITH ratios_modifies AS (	
	";
	for ($i = 0; $i < count($ratios); $i++) {	
		if (isset($ratios[$i]["id"])){
			$sql_ratios .= '
			SELECT '.$ratios[$i]["id"].' as id_param, '.$ratios[$i]["valeur"].' as ratio_mobilisation_pct
			';
			if ($i+1 < count($ratios)) {$sql_ratios .= ' UNION ALL ';} else {$sql_ratios .= ') ';};
		};
	};	
	$sql_ratios .= "
	, ratios as (
		select
		coalesce(b.id_param, a.id_param) as id_param,
		coalesce(b.ratio_mobilisation_pct, a.ratio_mobilisation_pct) as ratio_mobilisation_pct,
		a.ratio_pom_m3ch4_t as ratio_pom_m3ch4_t,
		a.memo,
		a.id_groupe_rom, groupe_rom
		from geres.rom_tpk_param as a
		left join ratios_modifies as b using (id_param)
	), 	
	bilan_comm as (
		select 
			a.id_comm, 
			a.id_param, 
			case 
				when a.id_param in (1) then coalesce(a.val_t_brut,0)*0.3 -- FFOM: pour prendre uniquement la part bio des tonnages brut OMR/commune
				else coalesce(a.val_t_brut,0) 
			end as val_t_brut, 
			b.ratio_mobilisation_pct, 
			case 
				when a.id_param in (22) then coalesce(a.val_t_net,0) -- 22=equins en t net directemetn pris du fichier car pas de ratio mobilisation fixe
				else case 
					when  a.id_param in (1) then coalesce(a.val_t_brut,0)*0.3*b.ratio_mobilisation_pct/100 --FFOM: pour prendre uniquement la part bio des tonnages brut OMR/commune
					else a.val_t_brut*b.ratio_mobilisation_pct/100
				end 
			end as val_t_net_calcule,
			b.ratio_pom_m3ch4_t, 
			case 
				when a.id_param in (16,21,27) then coalesce(a.val_m3ch4_net,0) -- pas de PoM fixe pour IAA scde trasnfo, elevages hors equin, vin car variable selon les communes/cantons
				else case 
					when a.id_param in (22) then coalesce(a.val_t_net,0)*b.ratio_pom_m3ch4_t -- on ne connait la valeur brute donc on prend directement la valeur nette (equins)
					else case 
						when a.id_param in (29) and a.val_t_brut<5 then null -- pour les grignons, si t<5 on n estime pas les m3Ch4
						else case 
							when a.id_param in (1) then coalesce(a.val_t_brut*0.3*b.ratio_mobilisation_pct/100,0)*b.ratio_pom_m3ch4_t -- FFOM: tonnage brute *part bio* ratio mobilisation * PoM
							else coalesce(a.val_t_brut*b.ratio_mobilisation_pct/100,0)*b.ratio_pom_m3ch4_t -- tonnage brute * ratio mobilisation * PoM
						End
					End
				End
			end as val_m3ch4_net_calcule,
			val_m3ch4_brut,
			b.memo,
			case 
				when a.id_param in (27) then 'vin: pas de ratios, on a direct les valeurs en t_net et m3_net pour tous les types deffluents mélangés' 
				else case 
					when a.id_param in (16, 21) then 'pas de PoM fixe:variable selon les communes'
					else case 
						when a.id_param in (1) then 'FFOM: la valeur brute est calculée en supposant une part biomasse de 30% dans les tonnages OMR'
						else case 
							when a.id_param in (29) and a.val_t_brut<5 then 'quand la donnée est <5 t MB, on ne fait pas le calcul en m3ch4'
							else NULL 
						END
					END
				END
			END as commentaire
		from (
			select * 
			from geres.rom_donnees_commune 
			WHERE id_param not in (5,12,13,20)
		) as a
		left join ratios as b using (id_param)
	
	),
	a as (
		SELECT 
			id_comm, 
			id_groupe_rom, groupe_rom, 
			sum(val_m3ch4_net_calcule) * 9.7 / 1000. AS val, -- m3ch4 en MWh
			sum(val_t_brut) AS val_brute, -- tonnes brutes
			sum(val_t_net_calcule) AS val_nette -- tonnes nettes
		fROM bilan_comm as a 
		left join ratios as b using (id_param)
		group by id_comm, id_groupe_rom, groupe_rom
	),
	final_data as (

		select 
			(sum(\"Déchets collectivités (MWh)\"))::integer AS \"Déchets collectivités (MWh)\",
			(sum(\"Déchets distribution (MWh)\"))::integer AS \"Déchets distribution (MWh)\",
			(sum(\"Déchets sous-produits (MWh)\"))::integer AS \"Déchets sous-produits (MWh)\",
			(sum(\"Déchets agricoles (MWh)\"))::integer AS \"Déchets agricoles (MWh)\",
			(sum(\"Total potentiel rom (MWh)\"))::integer AS \"Total potentiel rom (MWh)\",
			
			(sum(\"Déchets collectivités (t brutes)\"))::integer AS \"Déchets collectivités (t brutes)\",
			(sum(\"Déchets distribution (t brutes)\"))::integer AS \"Déchets distribution (t brutes)\",
			(sum(\"Déchets sous-produits (t brutes)\"))::integer AS \"Déchets sous-produits (t brutes)\",
			(sum(\"Déchets agricoles (t brutes)\"))::integer AS \"Déchets agricoles (t brutes)\",
			(sum(\"Total potentiel rom (t brutes)\"))::integer AS \"Total potentiel rom (t brutes)\",
			
			(sum(\"Déchets collectivités (t nettes)\"))::integer AS \"Déchets collectivités (t nettes)\",
			(sum(\"Déchets distribution (t nettes)\"))::integer AS \"Déchets distribution (t nettes)\",		
			(sum(\"Déchets sous-produits (t nettes)\"))::integer AS \"Déchets sous-produits (t nettes)\",
			(sum(\"Déchets agricoles (t nettes)\"))::integer AS \"Déchets agricoles (t nettes)\",
			(sum(\"Total potentiel rom (t nettes)\"))::integer AS \"Total potentiel rom (t nettes)\"
		from (

			select 
				a.*, 
				b.nom_entite as nom_com, b.geom
			from (
				select 
					a.id_comm, 
					
					b.val as \"Déchets collectivités (MWh)\", 
					c.val as \"Déchets distribution (MWh)\", 
					d.val as \"Déchets sous-produits (MWh)\", 
					e.val as \"Déchets agricoles (MWh)\", 
					f.val as \"Total potentiel rom (MWh)\",
					
					b.val_brute as \"Déchets collectivités (t brutes)\", 
					c.val_brute as \"Déchets distribution (t brutes)\", 
					d.val_brute as \"Déchets sous-produits (t brutes)\", 
					e.val_brute as \"Déchets agricoles (t brutes)\", 
					f.val_brute as \"Total potentiel rom (t brutes)\",		

					b.val_nette as \"Déchets collectivités (t nettes)\", 
					c.val_nette as \"Déchets distribution (t nettes)\", 
					d.val_nette as \"Déchets sous-produits (t nettes)\", 
					e.val_nette as \"Déchets agricoles (t nettes)\", 
					f.val_nette as \"Total potentiel rom (t nettes)\"
					
				from (select distinct id_comm from a) as a
				left join (select * from a where id_groupe_rom = 1) as b using (id_comm)
				left join (select * from a where id_groupe_rom = 2) as c using (id_comm)
				left join (select * from a where id_groupe_rom = 3) as d using (id_comm)
				left join (select * from a where id_groupe_rom = 4) as e using (id_comm)
				left join (select id_comm, sum(val) as val, sum(val_brute) as val_brute, sum(val_nette) as val_nette from a group by id_comm) as f using (id_comm)
			) as a 
			-- left join geres.alp_comm AS b ON a.id_comm = b.insee_com::integer 
			left join (
				select * from referentiel.entites where rang_entite = 4 
			) as b ON a.id_comm = b.code_entite::integer

		) as a 
		".$filtre_geo."
		".$where_geo."
	)

	select 'Déchets agricoles' as \"Type\", \"Déchets agricoles (t nettes)\" as \"Tonnes/an\", \"Déchets agricoles (MWh)\" as \"Mwh/an\"
	from final_data 
	union all 	
	select 'Déchets collectivités' as \"Type\", \"Déchets collectivités (t nettes)\" as \"Tonnes/an\", \"Déchets collectivités (MWh)\" as \"Mwh/an\"
	from final_data 
	union all 	
	select 'Déchets et sous-produits IAA' as \"Type\", \"Déchets sous-produits (t nettes)\" as \"Tonnes/an\", \"Déchets sous-produits (MWh)\" as \"Mwh/an\"
	from final_data 	
	union all 
	select 'Marchés distribution' as \"Type\", \"Déchets distribution (t nettes)\" as \"Tonnes/an\", \"Déchets distribution (MWh)\" as \"Mwh/an\"
	from final_data 
		

			
		
	";
	
} else {
	$sql_ratios = "SELECT 1 as no_ratios;";	
};


// Debug éventuel
// echo(nl2br($sql_territoire_poly));
// echo(nl2br($sql_nb_unites_metha));
// echo(nl2br($sql_gisements));
// echo(nl2br($sql_gisements_graph));
// echo(nl2br($sql_reseau_gaz_5km));
// echo(nl2br($sql_reseau_gaz_5_10km));
// echo(nl2br($sql_iaa));
// echo(nl2br($sql_compostage));
// echo(nl2br($sql_alp));
// echo(nl2br($sql_ratios));

// Execution des requêtes 
$to_execute = array(
	$sql_territoire_poly 
	,$sql_nb_unites_metha
	,$sql_gisements
	,$sql_gisements_graph
	,$sql_reseau_gaz_5km 
	,$sql_reseau_gaz_5_10km
	,$sql_iaa 
	,$sql_compostage 
	,$sql_alp
	,$sql_ratios
);
execute_sql_multi($to_execute);
?>
