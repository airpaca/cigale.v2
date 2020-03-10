<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimal-ui, width=device-width height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="mobile-web-app-capable" content="yes">
		<meta name="description" content="CIGALE - Extraction">
        <meta name="author" content="AtmoSud">
        <title>CIGALE - Accueil</title>
        <link rel="icon" type="image/png" href="img/logoCigale/cicada.png">
        
        <!-- Libraries -->
        <?php include 'sources.html'; ?>
        <!-- App CSS  -->
        <link  type="text/css" href="style.css" rel="stylesheet" media="all">  
        
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>

    <body class="visualisation-body">
        
        <?php session_start(); $_SESSION["categorie"] = "Inventaires - Extraction"; ?>
        <?php include 'config.php'; ?>
        <?php include 'nav.php'; ?>
        
        <div class="container-fluid" id="visualisation-options">            
            <div class="row" id="visualisation-main-row">
            
                <div class="col-lg-4 extraction-col-left d-lg-block" id="extraction-col-left">

					<h4>Extraction détaillée</h4>
				
					<!-- Formulaire de sélection -->
					<div class="row extraction-formulaire-row">
						
						Année(s) d'inventaire *
						<select class="selectpicker" id="select_ans" title="Années d'inventaire" mobile multiple data-selected-text-format="count > 3" data-actions-box="true" data-width="100%"></select>
						
						Emprise géographique *
						<select class="selectpicker" id="select_entites" title="Emprise géograpique" mobile multiple data-max-options="1" data-live-search="true" data-width="100%"></select>
						
						Détail communal *
						<select class="selectpicker" id="select_detail_comm" title="Détail par commune" mobile data-max-options="1" data-width="100%">
							<option value="true">Oui</option>
							<option value="false">Non</option>
						</select>
						
						Consommations, Productions et Emissions *
						<select class="selectpicker" id="select_variable" title="Consommations, Productions et Emissions" mobile data-selected-text-format="count > 2" multiple data-actions-box="true" data-width="100%"></select>   
						
						<div id="label_activites">Secteurs d'activités</div>
						<select class="selectpicker" id="select_secteurs" title="Tous secteurs d'activités confondus" mobile data-selected-text-format="count > 1" multiple data-actions-box="true" data-width="100%"></select>             

						<div id="label_energies">Energies</div>
						<select class="selectpicker" id="select_cat_ener" title="Toutes énergies confondues" mobile data-selected-text-format="count > 2" multiple data-actions-box="true" data-width="100%"></select>    

						<button type="button" class="btn btn-outline-secondary" onClick="afficher_donnees();">Exporter les données</button>                
						
					</div> 

			
				
				</div> 
                <div class="col-lg-8 extraction-col-right d-lg-block" id="extraction-col-right">
					<div class="extraction-header"></div> 
					<table id="tableau" class="display extraction-tableau" width="100%" cellspacing="0"></table>
				</div> 

                <!-- Pour les petits écrans -->
                <div class="col-lg-3 visualisation-col-left-footer d-lg-none" id="visualisation-col-left-footer">
					<button type="button" class="btn btn-outline-info col-btn" onclick="second_screen_display(1)">Afficher la carte</button>
				</div> 
                 
                <div class="col-lg-3 visualisation-col-map-header d-none d-lg-none" id="visualisation-col-map-header">
					<button type="button" class="btn btn-outline-info col-btn" onclick="second_screen_display(0)">Modifier la sélection</button>
				</div> 
              
				<!-- Modal pour avertissement sur le nombre de lignes à afficher -->
				<div id="extraction-confirm" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-sm">
						<div class="modal-content extraction-confirm">
								
								<div class=texte_modal>
										<strong>Attention</strong></br>La sélection demandée comporte un grand nombre de lignes. Leur affichage pourrait faire ralentir votre navigateur.    
								</div>
							

								<div class="modal-footer extraction-confirm-footer">
									<button type="submit" class="btn btn-default" data-dismiss="modal" onClick="create_table(response_global)">Continuer</button>
									<button type="button" class="btn btn-primary" data-dismiss="modal">Revenir à la sélection</button>
								</div>                

						</div>
					</div>
				</div> 
	
            </div> 
        </div>       

        <!-- App scripts -->
        <script src="config.js"></script>        
        <script src="../lib/datablock.js"></script>
        <script src="../lib/select.js"></script>
        <script src="../lib/geoserver.js"></script>
        <script src="../lib/jenks.js"></script>
        <script src="../lib/charts.js"></script>

        <!-- Main App -->
        <script src="extraction.js"></script>


    </body>
</html>