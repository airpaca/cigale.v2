<?php 

include '../pg_functions.php';
include '../config.php';

// $siren_epci = $_GET['siren_epci'];
// $polluant = $_GET['polluant'];


$query_ans = $_GET['query_ans'];
$query_entite = $_GET['query_entite'];
$query_entite_nom = $_GET['query_entite_nom'];
$query_sect = $_GET['query_sect'];
$query_ener = $_GET['query_ener'];
$query_var = $_GET['query_var'];
$query_detail_comm = $_GET['query_detail_comm'];



/* Ecriture du code SQL de la requête */

// SI CO2 tot alors on recherche polluants 121 et 122
$polls = explode(",", $query_var);
$polls = array_replace($polls,
    array_fill_keys(
        array_keys($polls, "15"),
        "121,122"
    )
);
$query_var = implode(",", $polls);  

// Si export des consommations ou émissions
if ($query_var != "999") { 

    // Group by 
    // $group_by = " GROUP BY an, lib_unite, nom_abrege_polluant";
    $group_by = " GROUP BY an, lib_unite, case when nom_abrege_polluant in ('co2.bio', 'co2.nbio') then 'co2' else nom_abrege_polluant end";
    if ($query_detail_comm == "true") {
        // $group_by =  $group_by . ", \"Entité administrative\"";
        $group_by =  $group_by . ", \"Entité administrative\", \"Id Entité\"";
        // $group_by =  $group_by . ", nom_comm_2018 || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')', id_comm_2018";
        // $nom_entite = " nom_comm_2018 || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')' as \"Entité administrative\", id_comm_2018 as \"Id Entité\"";
        $nom_entite = " nom_comm || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')' as \"Entité administrative\", id_comm as \"Id Entité\"";
    } else {
        $query_entite_nom = str_replace("\\'", "''", $query_entite_nom);
        $query_entite_nom = str_replace("'", "''", $query_entite_nom);
        $nom_entite = " '" . $query_entite_nom . "' as \"Entité administrative\"";
    };
    if ($query_sect != "") {
        $group_by =  $group_by . ", nom_secteur_pcaet";
        $nom_secteur_pcaet = "nom_secteur_pcaet";
    } else {
        $nom_secteur_pcaet = "'Tous secteurs'";
    };
    if ($query_ener != "") {
        $group_by =  $group_by . ", cat_energie";
        $cat_energie = "cat_energie";
    } else {
        $cat_energie = "'Toutes énergies'";
    };
    // echo $group_by;

    // Where    
    $where = "WHERE ";
    $where =  $where . " an in (" . $query_ans . ")";
    $where =  $where . " and id_polluant in (" . $query_var . ")";
    $where =  $where . " and id_snap3 not in (80408)"; // Sans croisière pour maritime
    if ($query_sect != "") {
        $where =  $where . " and id_secteur_pcaet in (" . str_replace("\\", "", $query_sect) . ")";
    };
    if ($query_ener != "") {
        $where =  $where . " and code_cat_energie in (" . $query_ener . ")";
    };
    
    if ($query_entite == "93") {
        $where =  $where;
    // } elseif (
        // $query_entite == "4" || 
        // $query_entite == "5" || 
        // $query_entite == "6" || 
        // $query_entite == "13" || 
        // $query_entite == "83" || 
        // $query_entite == "84" 
    // ) {
    } elseif (
        (
        $query_entite == "4" || 
        $query_entite == "5" || 
        $query_entite == "6" || 
        $query_entite == "13" || 
        $query_entite == "83" || 
        $query_entite == "84" 
        )
        && 
        strpos($query_entite_nom, "Parc Naturel ") === false
    ) {        
        $where =  $where . " and id_comm / 1000 in (" . $query_entite . ")";
    } elseif (strlen ($query_entite) == 9) {
        $where =  $where . " and id_comm in (select distinct id_comm from commun.tpk_commune_2015_2016 where siren_epci_2017 = " . $query_entite . ")";
    } elseif (strpos($query_entite_nom, "Parc Naturel ") !== false) {
        // echo "PNR</br>";
		$where =  $where . " and " . $query_entite . " = any(id_pnr)";		     
	} else {
        $where =  $where . " and id_comm in (" . $query_entite . ")";
    };
    // echo $where;
    
    // SS
    if ($query_detail_comm == "false" and $query_entite == "93") { // --  and $query_sect == "") {
        $ss = "FALSE";
    } elseif (
        $query_detail_comm == "false" and 
        (
            $query_entite == "4" || 
            $query_entite == "5" || 
            $query_entite == "6" || 
            $query_entite == "13" || 
            $query_entite == "83" || 
            $query_entite == "84" 
        )    
    
    ) {
        $ss = "FALSE";
    } else {
        $ss = "TRUE";
    };

    // Choix de la colonne SS à interroger
    if (strlen ($query_entite) == 9 and $query_detail_comm == "false") {
        $ss_field = "ss_epci";
    } else {
        $ss_field = "ss";
    };

    $sql = "
    select 
        an as \"Année\", 
        -- " . $nom_entite . "  as \"Entité administrative\",  
        " . $nom_entite . ",  
        " . $nom_secteur_pcaet . " as \"Activité\",  
        " . $cat_energie . " as \"Energie\", 
        case when nom_abrege_polluant in ('co2.bio', 'co2.nbio') then 'co2' else nom_abrege_polluant end as \"Variable\", 
        round(sum(val)::numeric, 1) as \"Valeur\", 
        coalesce(lib_unite, 'Secret Stat') as \"Unite\"
    from (
        select an, id_comm, id_secteur_pcaet, code_cat_energie, id_polluant, 
        sum(case when " . $ss . " is TRUE and " . $ss_field . " is TRUE then null else val end) as val, 
        case when " . $ss . " is TRUE and " . $ss_field . " is TRUE then NULL else id_unite end as id_unite
        from total.bilan_comm_v" . $v_inv . "_diffusion 
        " . $where . "     
        -- and (id_secteur_pcaet, id_polluant) not in (('1', 131),('1', 15),('1', 128))    
        -- and (id_secteur_pcaet, id_polluant) not in (('1', 131),('1', 15),('1', 128),('1', 123),('1', 124))    
		and ext_pcaet is true -- and (id_secteur_pcaet, id_polluant) not in (('1', 131),('1', 121),('1', 122),('1', 128),('1', 123),('1', 124))
        and hors_bilan is false 
        and id_comm not in (99138)
        group by 
            an, 
            case when " . $ss . " is TRUE and " . $ss_field . " is TRUE then NULL else id_unite end, 
            id_polluant, id_comm, id_secteur_pcaet, code_cat_energie
    )  as a
    left join commun.tpk_communes as b using (id_comm)
    -- left join (select distinct id_comm_2018, nom_comm_2018, siren_epci_2018, nom_epci_2018 FROM commun.tpk_commune_2015_2016) as b on  a.id_comm = b.id_comm_2018
    left join transversal.tpk_secteur_pcaet as c on a.id_secteur_pcaet = c.id_secteur_pcaet::integer
    left join (select distinct code_cat_energie, cat_energie from transversal.tpk_energie) as d using (code_cat_energie)
    left join commun.tpk_polluants as e using (id_polluant)
    left join commun.tpk_unite as f using (id_unite)
    " . $group_by . "
    -- order by an, nom_entite, nom_secteur_pcaet, cat_energie, nom_abrege_polluant, lib_unite
    order by \"Année\", \"Entité administrative\", \"Activité\", \"Energie\", \"Variable\", \"Unite\"
    ;
    ";

    // Si extraction des consos d'énergie du secteur prod énergie résultat null ce qui est normal.
    // On renvoie un texte d'avertissement
    //if (str_replace("\\", "", $query_sect) == "'1'" and $query_var == "131") { 
        // echo "Warning msg";
       // $sql = "SELECT '<font color=\"#ff6600\">Les consommations du secteur ''Extraction, transformation et distribution d''énergie'' sont considérées comme de l''énergie primaire et ne figurent pas dans le bilan des consommations finales. <a href=\"methodo.php\">[Plus d''informations]</a></font>' as Warning";
    //};

// Si export des productions
} else {
    
    /* Entité administrative de regroupement */

    // Si région
    if ($query_entite == "93") {
        $champ_geo = "'Région PACA'::text";
        $where_entite = " ";
    // Si département
    } elseif (
        (
        $query_entite == "4" || 
        $query_entite == "5" || 
        $query_entite == "6" || 
        $query_entite == "13" || 
        $query_entite == "83" || 
        $query_entite == "84" 
        )
        && 
        strpos($query_entite_nom, "Parc Naturel ") === false
    ) {
        $query_entite_nom = str_replace("\\'", "''", $query_entite_nom);
        $champ_geo = " '" . $query_entite_nom . "'::text ";
        $where_entite = " and id_comm / 1000 = " . $query_entite . " ";
    // Si EPCI
    } elseif (strlen ($query_entite) == 9) {
        // $champ_geo = "a.nom_epci";
        $champ_geo = "a.nom_epci_2018 as nom_epci";
        $where_entite = " and a.siren_epci_2018 = " . $query_entite . " ";
        $champ_geo_grpby = " , a.nom_epci_2018";
	// PNR
    } elseif (strpos($query_entite_nom, "Parc Naturel ") !== false) {
		$champ_geo = " (select nom from geres.alp_pnr where id = " . $query_entite . ") ";
		$where_entite =  " and id_comm in (SELECT DISTINCT id_comm FROM total.bilan_comm_v6_diffusion WHERE " . $query_entite . " = any(id_pnr)) ";	
	// Si on est à la commune
    } else {
        // $champ_geo = "nom_comm";
        $champ_geo = " nom_comm || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')' ";
        $where_entite = " and id_comm = " . $query_entite . " ";
        $champ_geo_grpby = ", nom_comm || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')', id_comm";
    };        
   
    /* Si détail à la commune demandé alors on regroupera à la commune */
    if ($query_detail_comm == "true") {
       // $champ_geo = "nom_comm";
       $champ_geo = " nom_comm || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')' as \"Entité administrative\", id_comm as \"Id Entité\"";
       $champ_geo_grpby = ", nom_comm || ' (' || lpad((id_comm / 1000)::text,2,'0') || ')', id_comm";
    // } ELSE {
       // $champ_geo_grpby = "";
    }; 


    /* Gestion du regroupement par filiere */ 
    if ($query_sect != "") {
        $champ_grande_filiere = " grande_filiere_cigale as \"Filière de production\", ";
        $where_grande_filiere = " and id_grande_filiere_cigale in (" . str_replace("\\", "", $query_sect) . ") "; 
        $group_grande_filiere = ", grande_filiere_cigale ";
    } else {
        $champ_grande_filiere = " 'Filières EnR et autres' as \"Filière de production\", ";
    };

    /* Gestion du regroupement par petite filiere enr ou autre */ 
    if ($query_ener != "") {
        $champ_filiere = " detail_filiere_cigale as \"Filière détaillée\", ";
        $where_filiere = " and id_detail_filiere_cigale in (" . str_replace("\\", "", $query_ener) . ") ";   
        $group_filiere = ", detail_filiere_cigale ";        
    } else {
        $champ_filiere = " 'Toutes' as \"Filière détaillée\", ";
    };

    $sql = "
    SELECT 
        an as \"Année\",
        " . $champ_geo . " ,
        lib_type_prod as \"Type de production\",
        " . $champ_grande_filiere . " 
        " . $champ_filiere . " 
        round(sum(val)::numeric, 1) as \"Valeur\",
        'MWh PCI' as \"Unite\"
    FROM total.bilan_comm_v" . $v_inv . "_prod as a
    -- left join (select distinct id_comm_2018, nom_comm_2018, siren_epci_2018, nom_epci_2018 FROM commun.tpk_commune_2015_2016) as b on  a.id_comm = b.id_comm_2018 -- LEFT JOIN commun.tpk_communes as b using (id_comm)
    left join (select distinct id_comm_2018 as id_comm, nom_comm_2018 as nom_comm, siren_epci_2018 as siren_epci, nom_epci_2018 as nom_epci FROM commun.tpk_commune_2015_2016) as b using(id_comm)
    WHERE  
        an in (" . $query_ans . ") 
        " . $where_entite . " 
        " . $where_grande_filiere . " 
        " . $where_filiere . " 
    GROUP BY
        an -- ,
        " . $champ_geo_grpby . " ,
        lib_type_prod 
        " . $group_grande_filiere . " 
        " . $group_filiere . "
    ORDER BY    
        an -- , 
        " . $champ_geo_grpby . " ,
        lib_type_prod 
        " . $group_grande_filiere . " 
        " . $group_filiere . "        
    ;    
    ";
};
   

/* Execution de la requête SQL et retour du résultat */
   

// echo nl2br($sql);

execute_sql($sql);
?>
