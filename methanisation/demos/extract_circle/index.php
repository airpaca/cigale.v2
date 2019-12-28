<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="MéthaPACA @ AtmoSud - GERES">
        <meta name="author" content="AtmoSud">

        <title>MéthaPACA</title>
        <link rel="icon" type="image/png" href="../../../img/icone.planetsearchg.png">
        
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->

        <!-- Leaflet 3.2.1 -->
        <script src="../../../libs/leaflet/leaflet_v1.0.3/leaflet.js"></script> 
        <link rel="stylesheet" href="../../../libs/leaflet/leaflet_v1.0.3/leaflet.css"/>

        <!-- Leaflet-Draw -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.js"></script>        
         
         
         
        <!-- Bootstrap 4 CSS ! Always load before other css -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
   
        <!-- Spin.js -->
        <script src="../../../libs/spin.js/spin.min.js"></script>
   
        <link href="style.css" rel="stylesheet">        
        
    </head>

    <body>
        
        <div class="container-fluid bg-color-blue map-container">
            <?php include 'nav.php'; ?>
            
            <div class="row bg-color-white" id="map-row">
            
                    <div class="col-lg-4 desc-col" id="left-viewport">
                    
                        <h2>Test d'envoie de requête au serveur selon rayon personnalisé</h2>
                        
                        <h3>Utiliser les bouton en haut à droite pour créer ou modifier la zone, les requêtes sont recalculées à la volée (si modif, penser à sauvegarder)</h3>
                        <h3>Requête: Combien d'IAA sont comprises dans le cercle? </h3>
                        <h4>Rappel - Démo uniquement, plein de bugs!</h4>
                        
                        <div id="result"></div>
                        <div id="result2"></div>
                    </div>

                    <div class="col-lg-8 map-col" id="map-viewport">
                       <div id="map"></div>
                    </div>                    
                    
            </div>
        
        </div>

        <!-- Bootstrap 4 (+ jquery, ...) -->
        <script src="../../../libs/jquery/jquery-3.2.1.min.js"></script>        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

        <!-- Other scripts -->
        <script src="functions.js"></script>

        <script type="text/javascript">
        var map = createMap();

        // --------------------------------
        // Tests temporaires
        // --------------------------------
        

        geoserver.lfCreateLayerWMS("cigale:dbg_grdf_reseau_5km", map, true);
        geoserver.lfCreateLayerWMS("cigale:dbg_grdf_reseau_5_10km", map, true);
        geoserver.lfCreateLayerWMS("cigale:ddg_classe_final", map, false);
        // geoserver.lfCreateLayerWMS("cigale:dbg_grdf_reseau", map, false); 
        // geoserver.lfCreateLayerWMS("cigale:rom_unites_metha", map, true);
        // geoserver.lfCreateLayerWFS("cigale:rom_unites_metha", map, true, "#2963AE", 8, 0.4);
        // geoserver.lfCreateLayerWFS("cigale:rom_step", map, false, "#f4f40d", 11, 0.8);
        geoserver.lfCreateLayerWFS("cigale:dbg_iaa", map, true, "#f49d0d", 8, 1);

        
        // --------------------------------
        // --------------------------------
        
        </script>
        
    </body>
</html>
