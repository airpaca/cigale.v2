<?php 

include '../pg_functions.php';
include '../config.php';


$ratios = "
select 
	id_param, 
	nom_param, 
	-- case 
	-- 	when id_param = 22 then (nom_param || ' (non Modifiable)')::text
	-- 	else nom_param::text 
	-- end	as nom_param,	
	ratio_mobilisation_pct
	/* 
	case 
		when id_param = 22 then ''::text
		else ratio_mobilisation_pct::text 
	end as ratio_mobilisation_pct
	*/
from geres.rom_tpk_param
where nom_param not like 'Total%' and display_order is not null 
order by display_order;
";

execute_sql($ratios);
?>