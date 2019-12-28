<?php 

/* Récupération des paramètres de connexion */
include '../../../config.php';

/* Récupération des variables */
$center = $_GET['center'];
$radius = $_GET['radius'];

/* Connexion à PostgreSQL */
$conn = pg_connect("dbname='" . $pg_bdd . "' user='" . $pg_lgn . "' password='" . $pg_pwd . "' host='" . $pg_host . "'");
if (!$conn) {
    echo "Not connected";
    exit;
}

$sql = "
-- lat,lng,rad
SELECT count(a.*) AS nb 
FROM 
	geres.dbg_iaa AS a, 
	(SELECT ST_Buffer(st_transform(st_setsrid(ST_MakePoint(" . $center . "),4326),2154), " . $radius . ") AS geom) AS b 
WHERE st_intersects(a.geom, b.geom)
";

$res = pg_query($conn, $sql);
if (!$res) {
    // echo "An SQL error occured.\n";
    echo($sql);
    exit;
}

$array_result = array();
while ($row = pg_fetch_assoc( $res )) {
  $array_result[] = $row;
} 

/* Export en JSON */
header('Content-Type: application/json');
echo json_encode($array_result);

?>
