<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="description" content="Consultation d'Inventaires Géolocalisés Air CLimat Energie">
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


    <body>
        
        <?php session_start(); $_SESSION["categorie"] = "Accueil"; ?>
        <?php include 'config.php'; ?>
        <?php include 'nav.php'; ?>
        
        <div class="container-fluid">            
            
            <div class="row index-head-row">
                <div class="col-lg-6 index-head-col-left">
                    <h1>Consultation d'Inventaires Géolocalisés</br>Air CLimat Energie</h1>
                    <h2>
                    L'application CIGALE est réalisée par <a href="http://www.atmosud.org/">AtmoSud</a>, dans le cadre de ses missions au sein de 
                    l’Observatoire Régional de l’Energie, du Climat et de l’Air. Elle fournit, de la région à la commune, 
                    des données annuelles de consommations et de productions d’énergie, d’émissions de polluants 
                    atmosphériques et de gaz à effet de serre.
                    </h2>
                    <div class="text-right"><a href="visualisation.php" class="btn btn-warning index-head-button" role="button"><h2>C'est parti!</h2></a></div>
                </div> 
                <div class="col-lg-6 index-head-col-right">
                    <img class="index-contributors-img" src="img/index.contributors.png">
                </div>                 
            </div> 
            
            <div class="row">
                <div class="col index-body-news">
                    <h3>Dernières actualités</h3>
                    <p>2019-12-17 - Changement du format de restitution pour les consommations et émissions de GES de la branche production d'énergie.</p>
                    <p>2019-12-17 - Publication de l'inventaire v6.2, qui remplace la version précédente.</p>
                    <a href="methodo.php#mise-jour-des-donn-es">Plus d'informations sur les mises à jour</a>
                </div> 
            </div>  
            
            <div class="row index-body-pages">
                    <div class="col-lg-6 index-body-pages-cols">
                        <a href='visualisation.php'><img src="img/icones/feather/92px.2px.blue/map.svg" 
                            onmouseover="this.src='img/icones/feather/92px.2px.clearblue/map.svg';" 
                            onmouseout="this.src='img/icones/feather/92px.2px.blue/map.svg';"></a>                    
                        <h4>Visualisation</h4>
                        <p>Visualiser les cartes et bilans par territoire des inventaires.</p>
                    </div>            
                    <div class="col-lg-6 index-body-pages-cols">
                        <a href='visualisation.php'><img src="img/icones/feather/92px.2px.blue/sliders.svg" 
                            onmouseover="this.src='img/icones/feather/92px.2px.clearblue/sliders.svg';" 
                            onmouseout="this.src='img/icones/feather/92px.2px.blue/sliders.svg';"></a>                    
                        <h4>Extraction</h4>
                        <p>Extraire et exporter les données d'inventaires.</p>
                    </div> 
                    <div class="col-lg-6 index-body-pages-cols">
                        <a href='visualisation.php'><img src="img/icones/feather/92px.2px.blue/layers.svg" 
                            onmouseover="this.src='img/icones/feather/92px.2px.clearblue/layers.svg';" 
                            onmouseout="this.src='img/icones/feather/92px.2px.blue/layers.svg';"></a>                    
                        <h4>Méthanisation</h4>
                        <p>Application CIGALE développée en partenariat avec le GERES pour le développement de la méthanisation.</p>
                    </div>                          
                    <div class="col-lg-6 index-body-pages-cols">
                        <a href='visualisation.php'><img src="img/icones/feather/92px.2px.blue/info.svg" 
                            onmouseover="this.src='img/icones/feather/92px.2px.clearblue/info.svg';" 
                            onmouseout="this.src='img/icones/feather/92px.2px.blue/info.svg';"></a>                    
                        <h4>Documentation</h4>
                        <p>Notes méthodologiques et informations pour les utilisateurs.</p>
                    </div>    
                    <div class="col-lg-6 index-body-pages-cols">
                        <a href='apis.php'><img src="img/icones/feather/92px.2px.blue/cloud.svg" 
                            onmouseover="this.src='img/icones/feather/92px.2px.clearblue/cloud.svg';" 
                            onmouseout="this.src='img/icones/feather/92px.2px.blue/cloud.svg';"></a>                    
                        <h4>API(s)</h4>
                        <p>Accédez aux données présentées dans CIGALE à travers des API cartographiques.</p>
                    </div>                     
            </div> 
            
            <div class="row">
                <div class="col index-footer">
                <a href="https://www.atmosud.org/">AtmoSud©</a> | <a href="contact.php">Contact et mentions légales</a>
                </div> 
            </div>
            
        </div>       

        
    </body>
</html>