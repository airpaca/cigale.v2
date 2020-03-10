<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimal-ui, width=device-width height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="mobile-web-app-capable" content="yes">
		<meta name="description" content="CIGALE - Visualisation">
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
        
        <?php session_start(); $_SESSION["categorie"] = "Inventaires - Visualisation"; ?>
        <?php include 'config.php'; ?>
        <?php include 'nav.php'; ?>
        
        <div class="container-fluid" id="visualisation-options">            
            <div class="row" id="visualisation-main-row">
            
                <div class="col-lg-3 visualisation-col-left d-lg-block" id="visualisation-col-left"></div> 

                <!-- Pour les petits écrans -->
                <div class="col-lg-3 visualisation-col-left-footer d-lg-none" id="visualisation-col-left-footer">
					<button type="button" class="btn btn-outline-info col-btn" onclick="second_screen_display(1)">Afficher la carte</button>
				</div> 
                 
                <div class="col-lg-3 visualisation-col-map-header d-none d-lg-none" id="visualisation-col-map-header">
					<button type="button" class="btn btn-outline-info col-btn" onclick="second_screen_display(0)">Modifier la sélection</button>
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
        <script src="visualisation.js"></script>


    </body>
</html>