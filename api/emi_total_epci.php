<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];

$sql = "
select an as x, (sum(val) / 1000.)::integer as y
-- from total.bilan_comm_v" . $v_inv . "_secten1_" . str_replace(".", "", $polluant) ." 
from total.bilan_comm_v" . $v_inv . "_diffusion -- " . str_replace(".", "", $polluant) ." 
where 
	id_polluant in (select id_polluant from commun.tpk_polluants where nom_abrege_polluant = '" . $polluant . "')
	-- and id_comm in (select distinct id_comm_2018 from commun.tpk_commune_2015_2016 where siren_epci_2018 = " . $siren_epci . ")
    and id_epci = " . $siren_epci . " 
    and code_cat_energie not in ('8', '6') -- Approche cadasrale pas d'élec ni conso de chaleur
    -- and ss is false -- Aucune donnée en Secret Stat 
    and ss_epci is false -- Aucune donnée en Secret Stat
    and an not in (2008,2009,2011)
group by an

-- Ajout des années non disponibles
union all 
select 2008::integer as an, null::integer as val
union all
select 2009::integer as an, null::integer as val
union all
select 2011::integer as an, null::integer as val

order by x
";

execute_sql($sql);
?>
