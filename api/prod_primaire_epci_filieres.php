<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];
$an = $_GET['an'];

$sql = "
select 
	a.detail_filiere_cigale as name, 
	color_detail_filiere_cigale as color, 
	round(sum(val / 1000.)::numeric, 1) as y
from total.bilan_comm_v" . $v_inv . "_prod as a
where 
	an = " . $an . "
    and grande_filiere_cigale = 'ENR'
    and siren_epci_2018 = '" . $siren_epci . "' 
group by a.detail_filiere_cigale, color_detail_filiere_cigale
order by detail_filiere_cigale  
;
";

execute_sql($sql);
?>
