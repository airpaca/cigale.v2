<?php 

include '../pg_functions.php';


$sql = "
-- SELECT order_field, valeur, texte as val FROM cigale.liste_entites_admin ORDER BY order_field;
SELECT rang_entite as order_field, code_entite as valeur, lib_entite as val FROM referentiel.entites where rang_entite not in (0) ORDER BY order_field;
";

execute_sql($sql);
?>
