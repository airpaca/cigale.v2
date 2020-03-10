<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];

$sql = "
select 
    an as x, 
	case when grande_filiere_cigale = 'ENR' then 'Primaire' else 'Secondaire' end as name, 
	case when grande_filiere_cigale = 'ENR' then '#d12a76' else '#ff3390' end as color, 
	round(sum(val / 1000.)::numeric, 1) as y
from total.bilan_comm_v" . $v_inv . "_prod as a
where 
    siren_epci_2018 = '" . $siren_epci . "' 
group by 
	an, 
	case when grande_filiere_cigale = 'ENR' then 'Primaire' else 'Secondaire' end, 
	case when grande_filiere_cigale = 'ENR' then '#d12a76' else '#ff3390' end

union all
select 2008::integer as an, 'Primaire'::text as name, '#d12a76'::text as color, null as val
union all
select 2008::integer as an, 'Secondaire'::text as name, '#ff3390'::text as color, null as val
union all
select 2009::integer as an, 'Primaire'::text as name, '#d12a76'::text as color, null as val
union all
select 2009::integer as an, 'Secondaire'::text as name, '#ff3390'::text as color, null as val
union all
select 2011::integer as an, 'Primaire'::text as name, '#d12a76'::text as color, null as val
union all
select 2011::integer as an, 'Secondaire'::text as name, '#ff3390'::text as color, null as val    

order by x, name;
";

execute_sql($sql);
?>
