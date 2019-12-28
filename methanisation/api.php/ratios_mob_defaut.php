<?php 

include '../pg_functions.php';

$ratios = "
select nom_param, ratio_mobilisation_pct
from geres.rom_tpk_param
where nom_param not like 'Total%'
order by nom_param;
";

execute_sql($ratios);
?>
