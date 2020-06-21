<?php 

// Récupération des paramètres de connexion
include '../pg_functions.php';
include '../config.php';


$sql = "SELECT * FROM total.bilan_comm_versions WHERE maj is true and done is true;";
execute_sql($sql);


/* 
// Conn
$conn = pg_connect("dbname='" . $pg_bdd . "' user='" . $pg_lgn . "' password='" . $pg_pwd . "' host='" . $pg_host . "'");
if (!$conn) {
    echo "Not connected";
    exit;
}

// Execute sql 
$sql = "SELECT * FROM total.bilan_comm_versions WHERE maj is true and done is true;";

$res = pg_query($conn, $sql);
if (!$res) {
    echo "Erreur lors de la récupération des versions d'inventaire";
    exit;
}

$array_result = array();
while ($row = pg_fetch_assoc( $res )) {
  $array_result[] = $row;
} 


// Export as JSON
header('Content-Type: application/json');
echo json_encode($array_result); */
