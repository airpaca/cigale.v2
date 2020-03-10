<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];

$sql1 = "select * from commun.tpk_ans order by an;";
$sql2 = "select case when rang_entite = 0 then 100  else rang_entite end as order_field, code_entite as valeur, lib_entite as texte from referentiel.entites order by order_field, nom_entite";
$sql3 = "
select '''' || id_secteur_pcaet || '''' as id_secteur_pcaet, nom_secteur_pcaet
from transversal.tpk_secteur_pcaet 
order by id_secteur_pcaet
";
$sql4 = "
select distinct code_cat_energie, cat_energie
from transversal.tpk_energie 
where code_cat_energie is not null
order by code_cat_energie
";
$sql5 = "
select id_grande_filiere_cigale, grande_filiere_cigale
from src_prod_energie.tpk_grande_filiere_cigale
order by id_grande_filiere_cigale
";
$sql6 = "
select id_detail_filiere_cigale, detail_filiere_cigale
from src_prod_energie.tpk_detail_filiere_cigale
order by id_detail_filiere_cigale
";

// echo nl2br($sql);

execute_sql_multi(array($sql1, $sql2, $sql3, $sql4, $sql5, $sql6));
// execute_sql($sql6);
?>
