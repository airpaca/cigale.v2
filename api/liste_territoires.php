<?php 

include '../pg_functions.php';


$sql = "
SELECT rang_entite as order_field, code_entite as valeur, lib_entite as val 
FROM referentiel.entites 
WHERE 
	rang_entite not in (0) 
	AND rang_entite = 3
ORDER BY order_field, code_entite;
";

execute_sql($sql);
?>
