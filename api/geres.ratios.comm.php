<?php 

include '../pg_functions.php';
include '../config.php';
 
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

if ($territoire == "") {
    $filtre_geo = "";
    $where_geo = "";
}



$sql = "
SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 FROM (
	 SELECT 
	 	'Feature' As \"type\" , ST_AsGeoJSON(st_transform(lg.geom,4326))::json As geometry, 
	 	row_to_json(
	 		(SELECT l FROM (SELECT id_comm, nom_com, \"Total potentiel rom (MWh)\", \"Total potentiel rom (MWh)\" as \"Total potentiel rom (t brut)\") As l)
		) As properties
	FROM geres.rom_carte_comm_groupe_rom As lg 
    WHERE id_comm IN (
        SELECT DISTINCT id_comm 
        FROM commun.tpk_commune_2018 AS a
            ".$filtre_geo."
            ".$where_geo." 
    )    
) As f )  As fc;
";

// echo(nl2br($sql));

execute_sql_raw($sql);
?>
