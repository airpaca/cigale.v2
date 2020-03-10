<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];

$sql = "
select an as x, detail_filiere_cigale as name, color_detail_filiere_cigale as color, round(sum(val / 1000.)::numeric, 1) as y
from total.bilan_comm_v" . $v_inv . "_prod as a
where 
	grande_filiere_cigale = 'ENR'
    and siren_epci_2018 = '" . $siren_epci . "' 
group by an, a.detail_filiere_cigale, color_detail_filiere_cigale  

union all 
select distinct 2008::integer as x, detail_filiere_cigale as name, color_detail_filiere_cigale as color, null::numeric as y from total.bilan_comm_v" . $v_inv . "_prod  where	grande_filiere_cigale = 'ENR' and siren_epci_2018 = '" . $siren_epci . "'  
union all 
select distinct 2009::integer as x, detail_filiere_cigale as name, color_detail_filiere_cigale as color, null::numeric as y from total.bilan_comm_v" . $v_inv . "_prod where	grande_filiere_cigale = 'ENR' and siren_epci_2018 = '" . $siren_epci . "'  
union all 
select distinct 2011::integer as x, detail_filiere_cigale as name, color_detail_filiere_cigale as color, null::numeric as y from total.bilan_comm_v" . $v_inv . "_prod where	grande_filiere_cigale = 'ENR' and siren_epci_2018 = '" . $siren_epci . "'  


order by name, x;
";

// echo nl2br($sql);

execute_sql($sql);
?>
