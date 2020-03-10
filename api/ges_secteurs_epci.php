<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];

if ($polluant == 'co2') {
    $polluant = "co2.bio', 'co2.nbio";
};

// $sql = "

// select an as x, nom_secteur_pcaet as name, secteur_pcaet_color as color, (sum(val) / 1000.)::integer as y
// from total.bilan_comm_v" . $v_inv . "_diffusion as a 
// left join total.tpk_secteur_pcaet_color as b on a.id_secteur_pcaet = b.id_secteur_pcaet::integer
// where 
	// id_polluant in (select id_polluant from commun.tpk_polluants where nom_abrege_polluant in ('" . $polluant . "'))
    // -- and a.id_secteur_pcaet <> '1' -- Finale Pas de prod énergétique mais élec et chaleur
	// and ext_pcaet is true 
    // -- and id_comm in (select distinct id_comm_2018 from commun.tpk_commune_2015_2016 where siren_epci_2018 = " . $siren_epci . ")
    // and id_epci = " . $siren_epci . " 
    // -- and ss is false -- Aucune donnée en Secret Stat
    // and ss_epci is false -- Aucune donnée en Secret Stat
// group by an, nom_secteur_pcaet, secteur_pcaet_color

// union all 
// select 2008::integer as x, nom_secteur_pcaet, secteur_pcaet_color, null::integer as y from total.tpk_secteur_pcaet_color
// union all 
// select 2009::integer as x, nom_secteur_pcaet, secteur_pcaet_color, null::integer as y from total.tpk_secteur_pcaet_color
// union all 
// select 2011::integer as x, nom_secteur_pcaet, secteur_pcaet_color, null::integer as y from total.tpk_secteur_pcaet_color


// order by name, x;
// ";


$sql = "
select x, nom_secteur_pcaet as name, secteur_pcaet_color as color, y
from (
	select an as x, id_secteur_pcaet, (sum(val) / 1000.)::integer as y
	from total.bilan_comm_v" . $v_inv . "_diffusion as a 
	where 
		id_polluant in (select id_polluant from commun.tpk_polluants where nom_abrege_polluant in ('" . $polluant . "'))
		-- and a.id_secteur_pcaet <> '1' -- Finale Pas de prod énergétique mais élec et chaleur
		and ext_pcaet is true 
		-- and id_comm in (select distinct id_comm_2018 from commun.tpk_commune_2015_2016 where siren_epci_2018 = " . $siren_epci . ")
		and id_epci = " . $siren_epci . " 
		-- and ss is false -- Aucune donnée en Secret Stat
		and ss_epci is false -- Aucune donnée en Secret Stat
	group by an, id_secteur_pcaet
) as a
left join total.tpk_secteur_pcaet_color as b on a.id_secteur_pcaet = b.id_secteur_pcaet::integer

union all 
select 2008::integer as x, nom_secteur_pcaet, secteur_pcaet_color, null::integer as y from total.tpk_secteur_pcaet_color
union all 
select 2009::integer as x, nom_secteur_pcaet, secteur_pcaet_color, null::integer as y from total.tpk_secteur_pcaet_color
union all 
select 2011::integer as x, nom_secteur_pcaet, secteur_pcaet_color, null::integer as y from total.tpk_secteur_pcaet_color


order by name, x;
";

// echo nl2br(	$sql);

execute_sql($sql);
?>
