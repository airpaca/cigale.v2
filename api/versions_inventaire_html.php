<?php 

// Récupération des paramètres de connexion
// include 'config.php';
if (file_exists("config.php")) {
    include 'config.php';
} else {
    include '../config.php';
}

// Conn
$conn = pg_connect("dbname='" . $pg_bdd . "' user='" . $pg_lgn . "' password='" . $pg_pwd . "' host='" . $pg_host . "'");
if (!$conn) {
    echo "Not connected";
    exit;
}

// Execute sql 
$sql = "SELECT id_version || '.' || id_sous_version as nom_version, * FROM total.bilan_comm_versions WHERE maj is true and done is true order by id_version desc, id_sous_version desc;";

$res = pg_query($conn, $sql);
if (!$res) {
    echo "Erreur lors de la récupération des versions d'inventaire";
    exit;
}

// Execute sql for distinct sous version
$sql = "SELECT distinct id_version || '.' || id_sous_version as nom_version, date_maj, id_version, id_sous_version FROM total.bilan_comm_versions WHERE maj is true and done is true order by id_version desc, id_sous_version desc;";

$res_version = pg_query($conn, $sql);
if (!$res) {
    echo "Erreur lors de la récupération des versions d'inventaire";
    exit;
}

$versions_infos = array();
while ($row = pg_fetch_assoc( $res )) {
  $versions_infos[] = $row;
} 

// Creates html
$html = "<p>";
while ($row_version = pg_fetch_assoc( $res_version )) {
    // $html = $html . "<b>Inventaire v" . $row_version["nom_version"] . " publiée le " . $row_version["date_maj"] . "</b></br>";
    $html = $html . "Inventaire v" . $row_version["nom_version"] . " publié le " . $row_version["date_maj"] . "</br>";
    
    foreach($versions_infos as $item) {
        if ($item["nom_version"] == $row_version["nom_version"]){
            $html = $html . "- " . $item["modification"];
            $html = $html . "</br>";
        };
    }; 
   
};
$html = $html . "</p>";

// Return html
header('Content-Type: text/html; charset=utf-8');
echo $html;



