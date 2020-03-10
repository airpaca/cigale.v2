<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];
$an = $_GET['an'];

$sql = "
select 
    b.nom_secteur_pcaet as name, 
    b.secteur_pcaet_color as color, 
    sum(val) as y
from (
	select id_comm, id_secteur_pcaet, (sum(val) / 1000.)::integer as val 
	from total.bilan_comm_v" . $v_inv . "_diffusion
	where 
        an = " . $an . " 
        and id_epci = " . $siren_epci . " 
        and id_polluant in (select id_polluant from commun.tpk_polluants where nom_abrege_polluant = '" . $polluant . "')
        -- and id_secteur_pcaet <> '1' -- Finale Pas de prod énergétique mais élec et chaleur
        and ext_pcaet is true 
        -- and ss is false -- Aucune donnée en Secret Stat
        and ss_epci is false -- Aucune donnée en Secret Stat
	group by id_comm, id_secteur_pcaet
) as a
left join total.tpk_secteur_pcaet_color as b on a.id_secteur_pcaet = b.id_secteur_pcaet::integer
-- left join commun.tpk_commune_2015_2016 as c using (id_comm)
-- left join (select distinct id_comm_2018, nom_comm_2018, siren_epci_2018, nom_epci_2018 FROM commun.tpk_commune_2015_2016) as c on a.id_comm = c.id_comm_2018
-- left join cigale.epci as d on c.siren_epci_2018 = d.siren_epci
-- where siren_epci_2018 = " . $siren_epci . " 
group by b.nom_secteur_pcaet, b.secteur_pcaet_color   
";

execute_sql($sql);
?>
