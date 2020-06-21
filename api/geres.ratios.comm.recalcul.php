<?php 

include '../pg_functions.php';
include '../config.php';
 
// Récup des variables 
$ratios = $_GET['ratios'];


// Début de la requête SQL création de la "table" des ratios
$sql = "
WITH ratios_modifies AS (
";
// foreach($ratios as $item) {
for ($i = 0; $i < count($ratios); $i++) {	
	if (isset($ratios[$i]["id"])){
		// echo $ratios[$i]["id"] . ": " . $ratios[$i]["valeur"] . "</br>";
		$sql .= '
		SELECT '.$ratios[$i]["id"].' as id_param, '.$ratios[$i]["valeur"].' as ratio_mobilisation_pct
		';
		if ($i+1 < count($ratios)) {$sql .= ' UNION ALL ';} else {$sql .= ') ';};
	};
};

// Requête SQL suite, calcul des MOB avec les ratios modifiés
$sql .= "
, ratios as (
	select
	coalesce(b.id_param, a.id_param) as id_param,
	coalesce(b.ratio_mobilisation_pct, a.ratio_mobilisation_pct) as ratio_mobilisation_pct,
	a.ratio_pom_m3ch4_t as ratio_pom_m3ch4_t,
	a.memo,
	a.id_groupe_rom
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
	from (select * from geres.rom_donnees_commune where id_param not in (5,12,13,20)) as a
	left join ratios as b using (id_param)
),
a as (
	SELECT 
		id_comm, 
		id_groupe_rom, 
		sum(val_m3ch4_net_calcule) * 9.7 / 1000. AS val, -- m3ch4 en MWh
		sum(val_t_brut) AS val_brute, -- tonnes brutes
		sum(val_t_net_calcule) AS val_nette -- tonnes nettes
	fROM bilan_comm as a 
	left join ratios as b using (id_param)
	group by id_comm, id_groupe_rom
)


-- , the_data as (

select 
	a.*, 
	b.nom_com, b.geom
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
left join geres.alp_comm AS b ON a.id_comm = b.insee_com::integer 


-- )


";



// $sql .= "
// SELECT row_to_json(fc)
 // FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 // FROM (
	 // SELECT 
	 	// 'Feature' As \"type\" , ST_AsGeoJSON(st_transform(ST_Simplify(lg.geom,100) ,4326))::json As geometry, 
	 	// row_to_json(
	 		// (SELECT l FROM (
				// SELECT 
					
					// -- siren_epci_2018, 
					// -- nom_epci_2018, 
					// -- val_t_net_calcule as \"Total potentiel rom (MWh)\", 
					// --  val_m3ch4_net_calcule as \"Total potentiel rom (t brut)\"
					
// id_comm,
// nom_com,
					
// \"Déchets collectivités (MWh)\",
// \"Déchets distribution (MWh)\",
// \"Déchets sous-produits (MWh)\",
// \"Déchets agricoles (MWh)\",
// \"Total potentiel rom (MWh)\",

// \"Déchets collectivités (t brutes)\",
// \"Déchets distribution (t brutes)\",
// \"Déchets sous-produits (t brutes)\",
// \"Déchets agricoles (t brutes)\",
// \"Total potentiel rom (t brutes)\",

// \"Déchets collectivités (t nettes)\",
// \"Déchets distribution (t nettes)\",
// \"Déchets sous-produits (t nettes)\",
// \"Déchets agricoles (t nettes)\",
// \"Total potentiel rom (t nettes)\"					
					
					
			// ) As l)
		// ) As properties
	// -- FROM geres.rom_carte_epci_groupe_rom As lg
	// FROM the_data As lg  
// ) As f )  As fc;

// ";


// echo(nl2br($sql));

// execute_sql_raw($sql);
execute_sql($sql);
?>
