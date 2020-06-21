<?php 

include '../pg_functions.php';
include '../config.php';
 
// Récup des variables 
$ratios = $_GET['ratios'];


// Début de la requête SQL création de ta "table" des ratios
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
	a.memo
	from geres.rom_tpk_param as a
left join ratios_modifies as b using (id_param)
), the_data as (
	-- Si besoin, on regroupe à l'EPCI 
	select
		siren_epci_2018, 
		nom_epci_2018,
		-- id_param, 
		sum(val_t_brut) as val_t_brut, 
		sum(ratio_mobilisation_pct) as ratio_mobilisation_pct, 
		sum(val_t_net_calcule) as val_t_net_calcule, 
		-- ratio_pol_m3ch4_t, 
		sum(val_m3ch4_net_calcule) as val_m3ch4_net_calcule, 
		-- memo, commentaire 
		c.geom 
	from (
	
	
		-- Requête à la commune
		select
		a.id_comm,
		a.id_param,
		coalesce(a.val_t_brut,0) as val_t_brut,
		b.ratio_mobilisation_pct,
		case
		when a.id_param in (22, 23, 24, 25, 27) then coalesce(a.val_t_net,0) -- 27=vin on a direct en t net 22=equins en t net également, pailles aussi
		else a.val_t_brut*b.ratio_mobilisation_pct/100
		end as val_t_net_calcule,
		b.ratio_pom_m3ch4_t,
		case
		when a.id_param in (16,21,27) then coalesce(a.val_m3ch4_net,0) -- pas de PoM fixe pour IAA scde trasnfo, elevages hors equin, vin car variable selon les communes/cantons
		Else case
		when a.id_param in (22, 23,24, 25) then coalesce(a.val_t_net,0)*b.ratio_pom_m3ch4_t -- on ne connait la valeur brute donc on prend directement la valeur nette (equins et pailles)
		Else case
		when a.id_param in (29) and a.val_t_brut<5 then null -- pour les grignos, si t<5 on n estime pas les m3Ch4
		Else coalesce(a.val_t_brut*b.ratio_mobilisation_pct/100,0)*b.ratio_pom_m3ch4_t -- tonnage brute * ratio mobilisation * PoM
		End
		End
		end as val_m3ch4_net_calcule,
		b.memo,
		case
		when a.id_param in (27) then 'vin: pas de ratios, on a direct les valeurs en t_net et m3_net pour tous les types deffluents mélangés' --REMPLACER GUILLEMENTS PAR APOSTROPHE
		else case
		when a.id_param in (16, 21) then 'pas de PoM fixe:variable selon les communes'--REMPLACER GUILLEMENTS PAR APOSTROPHE
		Else Case
		when a.id_param in (23, 24, 25) then 'pas de valeurs brutes pour les pailles riz/céreales/menues pailles, uniquement en net'--REMPLACER GUILLEMENTS PAR APOSTROPHE
		Else Case
		when a.id_param in (29) and a.val_t_brut<5 then 'quand la donnée est <5 t MB, on ne fait pas le calcul en m3ch4 '--REMPLACER GUILLEMENTS PAR APOSTROPHE
		Else NULL
		END
		END
		END
		ENd as commentaire
		from (
		select *
		from geres.rom_donnees_commune
		where id_param not in (5,12,13,20)
		) as a
		-- left join geres.rom_tpk_param as b using (id_param)
		left join ratios as b using (id_param)
		-- order by id_param, id_comm
	
		
		
	) as a 
	left join commun.tpk_commune_2015_2016 as b using (id_comm)
	left join referentiel.entites as c on (b.siren_epci_2018 = c.id_entite )
	where c.rang_entite = 3
	group by siren_epci_2018, nom_epci_2018, c.geom 

) 
";




// Requête SQL Fin création de la couche carto 
$sql .= "
SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 FROM (
	 SELECT 
	 	'Feature' As \"type\" , ST_AsGeoJSON(st_transform(ST_Simplify(lg.geom,100) ,4326))::json As geometry, 
	 	row_to_json(
	 		(SELECT l FROM (SELECT siren_epci_2018, nom_epci_2018, val_t_net_calcule as \"Total potentiel rom (MWh)\", val_m3ch4_net_calcule as \"Total potentiel rom (t brut)\") As l)
		) As properties
	-- FROM geres.rom_carte_epci_groupe_rom As lg
	FROM the_data As lg  
) As f )  As fc;

";

// echo(nl2br($sql));

execute_sql_raw($sql);
// execute_sql($sql);
?>
