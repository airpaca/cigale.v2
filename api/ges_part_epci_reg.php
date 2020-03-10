<?php 

include '../pg_functions.php';
include '../config.php';

$siren_epci = $_GET['siren_epci'];
$polluant = $_GET['polluant'];
$an = $_GET['an'];

if ($polluant == 'co2') {
    $polluant = "co2.bio', 'co2.nbio";
};

$sql = "
with the_data as (
	select 
		epci::integer,  
		reg::integer, 
		round((epci / reg * 100.)::numeric, 1) as pct_reg 
	from (
		select 
			-- Emissions de l'EPCI
			(select (sum(val) / 1000.) as val
			from total.bilan_comm_v" . $v_inv . "_diffusion -- " . str_replace(".", "", $polluant) . "
			where 
				id_polluant in (select id_polluant from commun.tpk_polluants where nom_abrege_polluant in ('" . $polluant . "'))
				-- and id_comm in (select distinct id_comm_2018 from commun.tpk_commune_2015_2016 where siren_epci_2018 = " . $siren_epci . ")
				and id_epci = " . $siren_epci . " 
				-- and id_secteur_pcaet <> '1' -- Finale Pas de prod énergétique mais élec et chaleur
				and ext_pcaet is true 
				and an = " . $an . "
				-- and ss is false -- Aucune donnée en Secret Stat
				and ss_epci is false -- Aucune donnée en Secret Stat
			) as epci,
			-- Emissions de la région
			(select (sum(val) / 1000.) as val
			from total.bilan_comm_v" . $v_inv . "_diffusion -- " . str_replace(".", "", $polluant) . "
			where 
				id_polluant in (select id_polluant from commun.tpk_polluants where nom_abrege_polluant in ('" . $polluant . "'))
				and code_cat_energie not in (6, 8) -- emissions directes hors chaleur et froid
				and an = " . $an . "
				and ss is false -- Aucune donnée en Secret Stat
			) as reg
	) as a
)
select 'EPCI' as name, '#a8a8a8' as color, pct_reg as y from the_data
union all 
select 'Région' as name, '#d6d6d6' as color, 100.0 - pct_reg as y from the_data
";

// echo nl2br($sql);

execute_sql($sql);
?>
