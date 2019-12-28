<?php 

include '../pg_functions.php';

// Récup des variables 
$territoire = $_GET['territoire'];
$territoire_token = $_GET['territoire_token'];
$territoire_sql = $_GET['territoire_sql']; 

$territoire_lon = $_GET['territoire_lon'];
$territoire_lat = $_GET['territoire_lat'];
$territoire_rad = $_GET['territoire_rad'];

// Filtre spatial en fonction radius / territoire
if ($territoire_sql == "") {
    // $filtre_geo = " LEFT JOIN cigale.liste_entites_admin as b ON st_intersects(a.geom, b.geom) WHERE b.texte = '".$territoire."' and b.valeur = '".$territoire_token."' ";
    $filtre_geo = " LEFT JOIN referentiel.entites as b ON st_intersects(a.geom, b.geom) WHERE b.lib_entite = '".$territoire."' and b.code_entite = '".$territoire_token."' ";
    // $filtre_geo_pos = " LEFT JOIN cigale.liste_entites_admin as b ON st_intersects(st_pointonsurface(a.geom), b.geom) WHERE b.texte = '".$territoire."' and b.valeur = '".$territoire_token."' ";
    $filtre_geo_pos = " LEFT JOIN referentiel.entites as b ON st_intersects(st_pointonsurface(a.geom), b.geom) WHERE b.lib_entite = '".$territoire."' and b.code_entite = '".$territoire_token."' ";
    $where_geo = "";
} else {
    $filtre_geo = " LEFT JOIN (".$territoire_sql.") as b ON st_intersects(a.geom, b.geom) ";
    $filtre_geo_pos = " LEFT JOIN (".$territoire_sql.") as b ON st_intersects(a.geom, b.geom) ";
    $where_geo = "WHERE b.geom IS NOT NULL";
};


// Exrtraction du gisement organique mobilisable hors step 
// FIXME: Risques que la requête spatiale ne fonctionne pas super bien si limites communes Vs territoire ne correspondent pas à 100%
$sql_mob_t = "
SELECT sum(val_t_net_calcule)::integer as val_t_net_calcule
FROM geres.rom_bilan_comm as a 
WHERE a.id_comm IN (
    SELECT DISTINCT a.id_comm 
    FROM geres.rom_carte_comm_groupe_rom as a
     ".$filtre_geo." 
)
";

$sql_mob_mwh = "
    SELECT sum(\"Total potentiel rom (MWh)\")::INTEGER as tot_mwh
    FROM geres.rom_carte_comm_groupe_rom as a
     ".$filtre_geo."
";

$sql_territoire_poly = "
select st_astext(CAST(ST_buffer(CAST((select st_setsrid(st_makepoint(".$territoire_lon.", ".$territoire_lat."),4326)) as geography), ".$territoire_rad.") as geometry) )
";



// Extraction du nombre d'unités de méthanisation sur le territoire.
// $sql_nb_unites_metha = "SELECT COUNT(*) FROM geres.rom_unites_metha as a ".$filtre_geo.";";
$sql_nb_unites_metha = "
SELECT 
    site_nom, commune, typologie, tonnage_traite, type_valo, 
    CASE WHEN dimensionnement_nm3_h IS NOT NULL THEN dimensionnement_nm3_h::TEXT || ' NM3/h' ELSE dimensionnement_kwe || ' Kwe' END AS dimensionnement 
FROM geres.rom_unites_metha as a ".$filtre_geo."
".$where_geo." 
";

$sql_gisements = "
WITH donnees AS (
	SELECT 
		-- Bruts hors step
			sum(val_t_brut)::integer AS brut_t, --  tonnes
			NULL::integer AS brut_eq_mwh, -- Equivalent MWh / an
			NULL::integer AS brut_eq_nm3, -- Nm3 CH4/an, hypothèse valorisation injection
		-- Mobilisable hors step selon ratios à dire d'experts
			sum(val_t_net_calcule)::integer AS net_t, -- en tonnes par an,
			NULL::integer AS net_eq_mwh, -- Equivalent MWh / an
			NULL::integer AS net_eq_nm3 -- Nm3 CH4/an, hypothèse valorisation injection
	FROM geres.rom_bilan_comm 
    WHERE id_comm IN (
        SELECT DISTINCT id_comm 
        FROM commun.tpk_commune_2018 AS a
            ".$filtre_geo."
            ".$where_geo." 
    )
)
SELECT 'Bruts hors STEP'::TEXT AS \"Gisements\", brut_t AS \"En tonnes/an\", brut_eq_mwh AS \"Equivalent MWh/an\", brut_eq_nm3 AS \"Équivalent Nm3 CH4/an\"
FROM donnees 
UNION ALL 
SELECT 'Mobilisable hors STEP, selon ratios à dire d’expert'::TEXT AS \"Gisements\", net_t AS \"En tonnes/an\", net_eq_mwh AS \"Equivalent MWh/an\", net_eq_nm3 AS \"Équivalent Nm3 CH4/an\"
FROM donnees 

-- + STEP 
UNION ALL 
SELECT
	'Gisements des STEP'::TEXT, 
	NULL::integer,
	sum(prod_mwh_an)::integer,
	sum(prod_tot_nm3_ch4)::integer
FROM geres.rom_step as a
".$filtre_geo." 
".$where_geo."
AND methanisation is false  
";

$sql_gisements_graph = "
SELECT groupe_rom, sum(val_t_net_calcule) AS mob_t, sum(val_m3ch4_net_calcule) AS mob_mwh
FROM geres.rom_bilan_comm AS a 
LEFT JOIN geres.rom_tpk_param AS aa USING (id_param)
WHERE id_comm IN (
    SELECT DISTINCT id_comm 
    FROM commun.tpk_commune_2018 AS a
        ".$filtre_geo."
        ".$where_geo." 
)
GROUP BY groupe_rom
";



// $sql_reseau_gaz_5km = "
// SELECT round(((sum(st_area(a.geom)) / sum(srf_gaz))*100.)::numeric,1) AS pct
// FROM geres.dbg_grdf_reseau_5km_comm as a
// ".$filtre_geo."
// ".$where_geo." 
// ";
// $sql_reseau_gaz_5km = "
// select round((sum(srf_gaz_5km) / sum(srf_comm) * 100.)::numeric,1) as pct
// from geres.dbg_grdf_reseau_stats_comm as a 
    // ".$filtre_geo."
    // ".$where_geo." 
// ";
$sql_reseau_gaz_5km = "
SELECT round((
	(SELECT sum(a.srf_reseau) FROM geres.dbg_grdf_reseau_5km_comm as a".$filtre_geo_pos." ".$where_geo.")
	/
	(SELECT sum(st_area(a.geom)) AS srf_totale FROM referentiel.entites as a ".$filtre_geo_pos." ".$where_geo." and a.rang_entite = 4)	
	* 100.
)::NUMERIC, 1) pct
";
$sql_reseau_gaz_5_10km = "
SELECT round((
	(SELECT sum(a.srf_reseau) FROM geres.dbg_grdf_reseau_5_10km_comm as a ".$filtre_geo_pos." ".$where_geo.")
	/
	(SELECT sum(st_area(a.geom)) AS srf_totale FROM referentiel.entites as a ".$filtre_geo_pos." ".$where_geo." and a.rang_entite = 4)	
	* 100.
)::NUMERIC, 1) pct
";

// $sql_reseau_gaz_5_10km = "
// SELECT round(((sum(st_area(a.geom)) / sum(srf_gaz))*100.)::numeric,1) AS pct
// FROM geres.dbg_grdf_reseau_5_10km_comm as a
// ".$filtre_geo."
// ".$where_geo." 
// ";
// $sql_reseau_gaz_5_10km = "
// select round((sum(srf_gaz_5_10km) / sum(srf_comm) * 100.)::numeric,1) as pct
// from geres.dbg_grdf_reseau_stats_comm as a 
// ".$filtre_geo."
// ".$where_geo."
// ";

// echo(nl2br($sql_reseau_gaz_5_10km));

$sql_iaa = "
SELECT a.entreprise AS \"Entreprise\", a.nom_com AS \"Commune\", a.code_ape AS \"Activité\" 
FROM geres.dbg_iaa as a 
".$filtre_geo."
".$where_geo." 
";


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
    CASE WHEN span is not null then 'SPAN ' || span::text else null end as \"Agrément SPAN\"
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

// echo(nl2br($sql_alp));

$to_execute = array($sql_mob_t,$sql_mob_mwh,$sql_territoire_poly, $sql_nb_unites_metha, $sql_gisements, $sql_gisements_graph, $sql_reseau_gaz_5km, $sql_reseau_gaz_5_10km, $sql_iaa, $sql_compostage, $sql_alp);
execute_sql_multi($to_execute);
?>
