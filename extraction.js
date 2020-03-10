/* 
CIGALE - Visualisation - Main app
Romain Souweine - AtmoSud - 2019
*/


console.log("CIGALE - Extraction");






// App conf
app = {
	cgu: 'Conditions Générales d\'utilisation: \n\n \
	Diffusion libre pour une réutilisation ultérieure des données dans les conditions ci-dessous : \n \
	– Toute utilisation partielle ou totale de ces données doit faire référence à AtmoSud en terme de "AtmoSud - Inventaire énergétique et d\'émissions de polluants et gaz à effet de serre". \n \
	– Données non rediffusées en cas de modification ultérieure des données. \n \
	\n \
	Les données contenues dans ce document restent la propriété d\'AtmoSud.\n \
	AtmoSud peut rediffuser ce document à d\'autres destinataires. \
	',
    // get_territoire_app_function: 'cigale_infos_epci',
    // server: geoserver,
    // active: {
        // theme: 1
    // },
    // lock: 1, 
    // blocks: {
        // left: new Datablock("left-block", "#main-row", true, 4, null, {overflow: false, invert:"pull", new_row:"100"}), 
        // left_select: new Datablock("visualisation-select-territoires", "#visualisation-options", true, 4), 
        // select_zones: new Select("visualisation-select-territoires", "#visualisation-col-left", "api/liste_territoires.php", "Statistiques par EPCI", "zoom_territoire", "Mon territoire"),
        // select_zones: new Select("visualisation-select-territoires", "#visualisation-col-left", "api/liste_territoires.php", "Statistiques par EPCI", "", "Mon territoire"),
        // choose_map: new Datablock("visulaisation-btn-map", "#visualisation-col-left", true, 8, "",{btn: {name: "Afficher la carte", action: "show_hide_blocks()"}, hidden_regex:"d-lg-none"}),
		// left_layers: new Datablock("left-layers", "#visualisation-col-left", "manager", 12), 
        // mapview: new Datablock("visualisation-col-map", "#visualisation-main-row", true, 9, "",{invert:"push", hidden_regex:"d-lg-block"}),                                                      
		// report: new Datablock("visualisation-report-block", "#visualisation-main-row", true, 4, "", {start_hidden:true,}),                                    
		// report: new Datablock("visualisation-report-block", "#visualisation-main-row", "hide", 6, "", {btn_close: "cigale_close_plots"}),      // FIXME: Faut choisir entre hide et start hidden                              
    // },
};



function fill_listes(){
    /*
    Une seule requête Ajax qui retourne dans une array toutes les valeurs 
    nécessaires pour remplir les listes de sélection.
    
    Maj des listes avec les réponses.
    */
    
    // Déclanchement du sablier (spinner)
    // spinner_left.spin(spinner_left_element);
     

            
    
    $.ajax({
        type: "GET",
        url: "api/extraction_fill_listes.php",
        dataType: 'json',   
        // beforeSend:function(jqXHR, settings){
            // jqXHR.spinner_left = spinner_left;
        // },          
        success: function(response,textStatus,jqXHR){
            
			console.log(response);
			console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");


			
            // Remplissage de la liste des années
            for (ian in response[0]) {             
                $("#select_ans").append($('<option>', {value: response[0][ian].an, text: response[0][ian].an}, '</option>'));                               
            };
            $("#select_ans").selectpicker('refresh');

            // Remplissage de la liste des entités géographiques
            for (ient in response[1]) {             
                $("#select_entites").append($('<option>', {value: response[1][ient].valeur, text: response[1][ient].texte}, '</option>'));                               
            };
            $("#select_entites").selectpicker('refresh');            

            // Remplissage des secteurs d'activités
            for (isect in response[2]) {             
                $("#select_secteurs").append($('<option>', {value: response[2][isect].id_secteur_pcaet, text: response[2][isect].nom_secteur_pcaet}, '</option>'));                               
            };
            $("#select_secteurs").selectpicker('refresh');  
            
            // Remplissage des catégories d'énergie
            for (isect in response[3]) {             
                $("#select_cat_ener").append($('<option>', {value: response[3][isect].code_cat_energie, text: response[3][isect].cat_energie}, '</option>'));                               
            };
            $("#select_cat_ener").selectpicker('refresh');            

            // Enregistrement de certaines listes dans des variables globales pour les ré-utiliser
            listes["activites"] = response[2];
            listes["grandes_filieres"] = response[4]; 
            listes["energies"] = response[3]; 
            listes["filieres"] = response[5];            

            // Remplissage des variables (fixe)
            variables_ener = [
                {val: 131, text: "Consommations finales d'énergies"},   
            ];

            variables_prod = [
                {val: 999, text: "Productions d'énergie"},       
            ];            
            
            variables_emi = [
                {val: 65, text: "PM10"},
                {val: 108, text: "PM2.5"},
                {val: 38, text: "NOx"},
                {val: 16, text: "COVNM"},
                {val: 48, text: "SO2"},
                {val: 36, text: "NH3"},
                {val: 11, text: "CO"},
                {val: 15, text: "CO2 total"},  
                {val: 123, text: "CH4 eq.CO2"}, 
                {val: 124, text: "N2O eq.CO2"}, 
                {val: 128, text: "PRG 100"},                 
            ];            

            $("#select_variable").append($('<optgroup label="Energie">'));
            for (ivar in variables_ener) {                                          
                $("#select_variable").append($('<option>', {value: variables_ener[ivar].val, text: variables_ener[ivar].text}, '</option>'));                               
            };
            $("#select_variable").append($('</optgroup>'));
            
            $("#select_variable").append($('<optgroup label="Prod">'));
            for (ivar in variables_prod) {                                          
                $("#select_variable").append($('<option>', {value: variables_prod[ivar].val, text: variables_prod[ivar].text}, '</option>'));                               
            };
            $("#select_variable").append($('</optgroup>'));    
            
            $("#select_variable").append($('<optgroup label="Emissions">'));
            for (ivar in variables_emi) {                                           
                $("#select_variable").append($('<option>', {value: variables_emi[ivar].val, text: variables_emi[ivar].text}, '</option>'));
            };
            $("#select_variable").append($('</optgroup>'));            
            
            $("#select_variable").selectpicker('refresh');  
            
            // FIXME: Les labels ne s'affichent pas! Tester d'ajouter d'abord les groupes 
            // Puis de mettre à jour ces groups?
            $("#selectpicker").selectpicker();
            $("#select_variable").selectpicker();    // FIXME: Les labels ne s'affichent pas!
            
            // Sélection des valeurs par défaut
            $('#select_ans').selectpicker('val', cfg_anmax);
            $("#select_entites").selectpicker('val', '93');   
            $("#select_entites").selectpicker('val', '93'); 
            $("#select_detail_comm").selectpicker('val', 'false'); 
            $("#select_variable").selectpicker('val', '131');
 
            // Arrêt du sablier (spinner)
            // jqXHR.spinner_left.stop();
            
            // Affichage du formulaire de sélection
            $("#formulaire").removeClass("hide"); 

            // Si on arrive sur cette page à partir de la visualisation d'une commune on remplit le formulaire
            // avec les bonnes infos et on lance l'extraction           
            if (sessionStorage.id_comm != null) {  

				console.log("!!! USING SESSION STORAGE");
			
                $("#select_entites").selectpicker('val', sessionStorage.id_comm);
                $("#select_variable").selectpicker('val', sessionStorage.id_polluant);
                $("#select_secteurs").selectpicker('selectAll');
                $("#select_cat_ener").selectpicker('selectAll');
                
                // Si on est sur les productions, alors on change les listes activités et énergies
                if (sessionStorage.id_polluant == 999) {
                    changer_listes_prod(true);
                };
                                
                afficher_donnees(); 
                
                sessionStorage.clear(); // Suppression des éventuelles variables de session
            } else {
				
				// Chargement par défaut
				$("#select_entites").selectpicker('val', 93);
				$("#select_variable").selectpicker('val', 38);
				$("#select_secteurs").selectpicker('selectAll');
				$("#select_cat_ener").selectpicker('selectAll');
				afficher_donnees(); 
            };
        },
        
        error: function (request, error) {
            console.log("ERROR");
        },        
    });
};


function changer_listes_prod(is_prod){
    /*
    Change les listes avec les variables prod si prod is true
    avec les variables conso / emi si prod is false.
    */
    
    if (is_prod == true){
		
        // On ne laisse que la prod dans la liste des variables 
        $("#select_variable").selectpicker('deselectAll');
        $("#select_variable").selectpicker('val', '999');
        
        // Les secteurs d'activités deviennent les grandes filières
        $("#label_activites")[0].innerHTML = "Grandes filières";           
        $("#select_secteurs").selectpicker({title: "Toutes les grandes filières"}).selectpicker('render');            

        $("#select_secteurs option").remove();
    
        for (isect in listes["grandes_filieres"]) {             
            $("#select_secteurs").append($('<option>', {value: listes["grandes_filieres"][isect].id_grande_filiere_cigale, text: listes["grandes_filieres"][isect].grande_filiere_cigale}, '</option>'));                               
        };
        $("#select_secteurs").selectpicker('refresh');          
    
        // Les énergies deviennent les petites filières ENR ou autres regroupées
        $("#label_energies")[0].innerHTML = "Filières détaillées";
        $("#select_cat_ener").selectpicker({title: "Toutes les filières détaillées"}).selectpicker('render'); 

        $("#select_cat_ener option").remove();
    
        for (isect in listes["filieres"]) {             
            $("#select_cat_ener").append($('<option>', {value: listes["filieres"][isect].id_detail_filiere_cigale, text: listes["filieres"][isect].detail_filiere_cigale}, '</option>'));                               
        };
        $("#select_cat_ener").selectpicker('refresh');          
    } else {
		
        // On supprime la prod de la liste des variables 
        $("#select_variable")[0][1].selected = false;
        $("#select_variable").selectpicker('render');
        
        // Les grandes filières deviennent les secteurs d'activités
        $("#label_activites")[0].innerHTML = "Secteurs d'activités";
        $("#select_secteurs").selectpicker({title: "Tous secteurs d'activités confondus"}).selectpicker('render');  

        $("#select_secteurs option").remove();
    
        for (isect in listes["activites"]) {             
            $("#select_secteurs").append($('<option>', {value: listes["activites"][isect].id_secteur_pcaet, text: listes["activites"][isect].nom_secteur_pcaet}, '</option>'));                               
        };
        $("#select_secteurs").selectpicker('refresh');               
        
        // Les petites filières ENR ou autres regroupées deviennent les énergies
        $("#label_energies")[0].innerHTML = "Energies";
        $("#select_cat_ener").selectpicker({title: "Toutes énergies confondues"}).selectpicker('render'); 
        
        $("#select_cat_ener option").remove();
    
        for (isect in listes["energies"]) {             
            $("#select_cat_ener").append($('<option>', {value: listes["energies"][isect].code_cat_energie, text: listes["energies"][isect].cat_energie}, '</option>'));                               
        };
        $("#select_cat_ener").selectpicker('refresh');         
    };
};

// Gestion de la liste des variables pour faire des productions un groupe à part   
$(function () { 
    $("#select_variable").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
    // $("#select_variable").on("show.bs.select", function(e, clickedIndex, newValue, oldValue) {
    // $("#select_variable").on("click", function() {
		
        var selectedD = $(this).find('option').eq(clickedIndex).text();
		
	

        
		// Si on a choisi les productions
        if ((selectedD == "Productions d'énergie") && (newValue == true)) {              
			console.log("Set prod -----------");
			changer_listes_prod(true);
        // Si on a pas choisi les productions
        } else if (newValue != null) {
			console.log("Unset prod -----------");
            changer_listes_prod(false); 
        };

    });
});














function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    };
    return i;
};

function datehour() {
    var d = new Date();
    
    var year = d.getFullYear() ;
    var month = addZero(d.getMonth() + 1);
    var day =addZero(d.getDate());
    var hour = addZero(d.getHours());
    var minutes = addZero(d.getMinutes());
    var seconds = addZero(d.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
};



function afficher_donnees(){ 

	console.log("*** EXTRACTION DES DONNEES ***");
   
    // Si aucune année sélectionnée alors on ne peut pas envoyer
    if ($('#select_ans').val().length == 0) {
        console.log("TODO: Highlight lists not working");
        // $('#select_ans').selectpicker('setStyle', 'btn-warning');
        // $('.btn #select_ans').css('color', 'red');
        // $('#select_ans').selectpicker('setStyle', 'color:red');
        // $('#select_ans').selectpicker.css({'color': 'red'});
        return null;
    } else {
        query_ans = $('#select_ans').val().join();
    };
    
    // Emprise géographique
    if ($('#select_entites').val().length == 0) {
        query_entite = "";
    } else {
        query_entite = $('#select_entites').val().join();
        query_entite_nom = $('#select_entites').find("option:selected").text();
    };        

    // Détail communal
    if ($('#select_detail_comm').val().length == 0) {
        $('#select_detail_comm').selectpicker('setStyle', 'btn-warning');
        return null;        
    } else {
        query_detail_comm = $('#select_detail_comm').val();
    };    
 
    // Secteurs
    if ($('#select_secteurs').val().length == 0) {
        query_sect = "";
    } else {
        query_sect = $('#select_secteurs').val().join();
    };
    
    // Cétégories d'énergie
    if ($('#select_cat_ener').val().length == 0) {
        query_ener = "";
    } else {
        query_ener = $('#select_cat_ener').val().join();
    };
    
    // Polluant
    if ($('#select_variable').val().length == 0) {
        $('#select_variable').selectpicker('setStyle', 'btn-warning');
        return null; 
    } else {
        query_var = $('#select_variable').val().join();
    };    
    
    // Si un tableau existe déjà on le détruit avant de le recréer
    if (typeof the_table !== 'undefined') {
        the_table.destroy(false);
        $('#tableau').empty();
    };
    
    // TODO: Si tout est ok, il faut remettre les styles par défauts aux listes
    // $('#select_ans').selectpicker('setStyle', 'btn');
    // $('#select_ans').selectpicker('setStyle', 'btn-danger');
    // $('#select_ans').selectpicker('setStyle', 'btn-success');
    // $('#select_ans').selectpicker('setStyle', 'btn-primary');
    // $('#select_ans').selectpicker('setStyle', 'btn-waning', 'remove');
    // $('#select_ans').selectpicker('refresh');
    // $('#select_ans').selectpicker('setStyle', 'btn-success', 'remove');
    // $('#select_ans').selectpicker('setStyle', 'btn-success')
    // $('#select_ans').selectpicker('refresh');
    
    // $('#select_ans').selectpicker();
    // $('#select_ans').selectpicker('setStyle', 'btn-primary', 'add'); // add class    
    
    
    
    // console.log("TODO: Lists styles reset");
   
   
    // Déclanchement du sablier (spinner)
    // spinner_right.spin(spinner_right_element);
   
    // Suppression de l'image d'aide 
    // $( ".img-aide-export" ).hide();
   
    // Création du tableau
    $.ajax({
        type: "GET",
        url: "api/extraction_get_data.php",
        dataType: 'json',   
        data: {
            "query_ans": query_ans,
            "query_entite": query_entite,
            "query_entite_nom": query_entite_nom,
            "query_sect": query_sect,
            "query_ener": query_ener,
            "query_var": query_var,
            "query_detail_comm": query_detail_comm, 
        },
        beforeSend:function(jqXHR, settings){
            // jqXHR.spinner_right = spinner_right;
        },           
        success: function(response,textStatus,jqXHR){
               
			   
			console.log(response);   
			console.log("_______________________________");   
			   
            // Si la réponse est vide alors on affiche une table vide et on quitte
            if (response.length == 0) {
                
                the_table = $('#tableau').DataTable({
                    scrollY: '70vh',
                    scrollCollapse: true,        
                    paging: false,
                    searching: true,
                    responsive: true,
                    dom: 'lpftiBr',
                    buttons: ['copy', 'csv', 'pdf'], 
                    processing: true,
                    serverSide: false,
                    language: {
                        "lengthMenu": "Display _MENU_ records per page",
                        "zeroRecords": "Aucune donnée à afficher",
                        "info": "Showing page _PAGE_ of _PAGES_",
                        "infoEmpty": "No records available",
                        "infoFiltered": "(filtered from _MAX_ total records)",
                    },    
                    data: response,        
                    columns:[{}],
                });                
                
                // Arrêt du sablier (spinner)
                // jqXHR.spinner_right.stop();

                return null;
            };
            
            
            // Si la réponse contient trop de lignes alors on averti l'utilisateur
            if (response.length > 1000) {
                                
                // Arrêt du sablier (spinner)
                // jqXHR.spinner_right.stop(); 

                // Passage de la réponse dans une variable globale et appel du modal
                response_global = response;
                $('#extraction-confirm').modal('show'); //  $('#myModal').modal('hide')
  
            } else {
                
                // Arrêt du sablier (spinner)
                // jqXHR.spinner_right.stop();                  
               
                // Affichage des données
                create_table(response);
                            
            };
            
        },
        
        error: function (request, error) {
            console.log("ERROR");
            
            // Arrêt du sablier (spinner)
            // jqXHR.spinner_right.stop();
        },        
    });    
   
    // Mise à jour de la date et de l'heure de l'extraction
    var extraction_time = datehour();
    $(".extraction-header").html('<img id="extraction-logo" src="img/LogoAtmosud.small.png"><text id="extraction-cgu">AtmoSud - Inventaire v' + cfg_vinv + '.' + cfg_sous_vinv + ' - Extraction du ' + extraction_time + '</br><a target="_blank" href="methodo.php#conditions-d-utilisation-des-donn-es">Consulter les conditions d\'utilisation et de diffusion</a></text>');
};





function create_table(response, display){
    
    $('#extraction-confirm').modal('hide');
    
    // Déclanchement du sablier (spinner)
    // spinner_right.spin(spinner_right_element);    
    
    // Création de la liste de définition des colonnes
    columns = [];
    for (i in Object.keys(response[0])) {
        field = Object.keys(response[0])[i];
        columns.push( { title: field, name: field, data: field });
    };
    
    // Création de la table
    the_table = $('#tableau').DataTable({
        scrollY: '70vh',
        scrollCollapse: true,        
        paging: false,
        searching: true,
        responsive: true,
        dom: 'lftBr', // 'lpftiBr' = Avec nb lignes en plus
        buttons: [
            // 'copy', 
            {
                extend: 'copyHtml5',
                title: 'AtmoSud - Export CIGALE du ' + datehour(),
                // charset: 'iso-8859-1', // 'ANSI', // 'utf-8', 
                customize: function ( csv ) {
                    // return "AtmoSud\n\n" + cgu + "\n\n" + csv;
                    return "AtmoSud inventaire v"+cfg_vinv+ '.' + cfg_sous_vinv +" - Export CIGALE du " + datehour() + "\n\n" + app.cgu + "\n\n" + csv;
                }                
            },  
            {
                extend: 'csvHtml5',
                title: 'AtmoSud - Export CIGALE du ' + datehour(),
                charset:  'utf-8', // 'windows-1252', // 'iso-8859-1', // 'ANSI', // 'utf-8', 
                bom: true,
                customize: function ( csv ) {
                    return "AtmoSud inventaire v"+cfg_vinv+ '.' + cfg_sous_vinv +" - Export CIGALE du " + datehour() + "\n\n" + app.cgu + "\n\n" + csv;
                }                
            },        
/*             {
                extend: 'pdfHtml5',
                title: "AtmoSud inventaire v"+cfg_vinv+ '.' + cfg_sous_vinv +" - Export CIGALE du " + datehour(),
                message: app.cgu, 
                customize: function ( doc ) {
                    
                    var img = new Image();
                    // img.src = "img/logo-Air-PACA.png"; 
                    img.src = "img/LogoAtmosud.small.png"; 
                    var dataURI = getBase64Image(img);
                    
                    doc.content.splice( 1, 0, {
                        margin: [ 0, 0, 0, 12 ],
                        alignment: 'center',
                        image: dataURI, 
                    } );
                }                
            } */
        ], 
        processing: true,
        serverSide: false,
        language: {
            "lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "Aucune donnée à afficher",
            "info": "Showing page _PAGE_ of _PAGES_",
            "infoEmpty": "No records available",
            "infoFiltered": "(filtered from _MAX_ total records)",
        },    
        data: response,        
        columns:columns,
    }); 

    // Arrêt du sablier (spinner)
    // spinner_right.stop();       
    
};







var listes = {
	activites: "",
	grandes_filieres: "",
	energies: "",
	filieres: "",    
};
fill_listes();

