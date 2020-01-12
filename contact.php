<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>
        <meta charset="utf-8">        
        <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="description" content="CIGALE - Contact">
        <meta name="author" content="AtmoSud">
        <title>CIGALE - Contact</title>
        <link rel="icon" type="image/png" href="img/logoCigale/cicada.png">
        
        <!-- Libraries -->
        <?php include 'sources.html'; ?>
        <!-- App CSS  -->
        <link href="style.css" rel="stylesheet">  
        <!-- App scripts 
        <script src="lib/faireTournerLesImages?.js"></script>-->
        
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>


    <body>
        
        <?php
		// Deals with session
        session_start();
        $_SESSION["categorie"] = "Contact";
        ?>   
        
        <?php include 'config.php'; ?>
        <?php include 'nav.php'; ?>
        
        <div class="container-fluid">    
            <div class="row contact-row-header">
                <div class="col-md-12 contact-col-header">
                
                    <h4>Contact</h4>
                    <p>
                    Pour nous faire remonter une erreur, incohérence ou pour plus d'information sur les données 
                    présentées, vous pouvez envoyer un mail à <a href="mailto:contact.air@atmosud.org">contact.air@atmosud.org</a>
                    </p>
                    
                </div>
            </div>
            <div class="row contact-row">
                <div class="col-md-6 contact-col-left">
                
                    <h4>Licence d'utilisation des données</h4>
                    <h5>L'utilisation des données est soumise à la licence ODBL.</h5>
                    <p>
                    Vous êtes libres :</br>
                    </p>
                    <p>
                    <b>De partager :</b> copier, distribuer et utiliser la base de données.</br>
                    <b>De créer :</b> produire des créations à partir de cette base de données.</br>
                    <b>D’adapter :</b> modifier, transformer et construire à partir de cette base de données.
                    </p>
                    <p>
                    Aussi longtemps que :</br>
                    </p>
                    <p>
                    <b>Vous mentionnez la paternité :</b> vous devez mentionner la source de la base de données pour toute utilisation publique de la base de données, ou pour toute création produite à partir de la base de données, de la manière indiquée dans l’ODbL. Pour toute utilisation ou redistribution de la base de données, ou création produite à partir de cette base de données, vous devez clairement mentionner aux tiers la licence de la base de données et garder intacte toute mention légale sur la base de données originaire.</br>
                    <b>Vous partagez aux conditions identiques :</b> si vous utilisez publiquement une version adaptée de cette base de données, ou que vous produisiez une création à partir d’une base de données adaptée, vous devez aussi offrir cette base de données adaptée selon les termes de la licence ODbL.</br>
                    <b>Vous gardez ouvert :</b> si vous redistribuez la base de données, ou une version modifiée de celle-ci, alors vous ne pouvez utiliser de mesure technique restreignant la création que si vous distribuez aussi une version sans ces restrictions.
                    </p>                     
                    
                    <h4>Conditions d'utilisation</h4>
                    <h5>Responsabilités d'AtmoSud</h5>
                    <p>
                    Les utilisateurs ne pourront tenir AtmoSud responsable en cas de dysfonctionnement technique du site ou des API,
                    entrainant une impossibilité d'accéder aux données. AtmoSud n’assumera en aucun cas les pertes dues à de tels dysfonctionnements inattendus, 
                    de quelque nature que ce soit (par ex financière).</br> 
                    En outre AtmoSud consent à faire les efforts nécessaires pour fournir aux utilisateurs un service efficace et de les informer en cas de modification, néanmoins les responsabilités précitées.
                    </p>
                    <h5>Droits d'utilisation et de reproduction</h5>
                    <p>
                    En application de la loi du 11 mars 1957 (art. 41) et du code de la propriété intellectuelle du 1er juillet 1992 : 
                    L’ensemble des textes, illustrations, données, photographies, plans, dessins, animations, sons et vidéos inclus dans ce site Internet 
                    sauf mention contraire explicite, est protégé par le droit d’auteur quelle qu’en soit la source.
                    </p>
                    <p>
                    Les données et services proposés sont en accès libre pour une utilisation individuelle. 
                    Ils peuvent être reproduits en tout ou partie à des fins pédagogiques ou professionnelles. 
                    Ils ne peuvent en aucun cas faire l’objet de publications commerciales.
                    </p>
                    <p>
                    Les données disponibles sur ce site en consultation et téléchargement ne doivent en aucun cas être modifiées.
                    </p>
                    <p>
                    Toute utilisation totale ou partielle de ce site web doit faire référence à AtmoSud et au titre complet du site 
                    AtmoSud ne peut en aucune façon être tenu responsable des interprétations, travaux intellectuels, 
                    publications diverses faits sur la base des contenus de ce site web pour lesquels l'observatoire n'aura pas donné d'accord préalable.                    
                    </p>
                                      
                </div> 
                <div class="col-md-6 contact-col-right">
                
                    <h4>AtmoSud</h4>
                    <p>
                    Siège social</br>
                    146 rue Paradis</br>
                    Bât. "Le Noilly Paradis"</br>
                    13294 Marseille</br>
                    Cedex 06
                    </p>
                    
                    <h4>Responsable de publication</h4>
                    <p>AtmoSud - Association à but non lucratif (loi 1901), agréée par le MEDDE pour la Surveillance de la Qualité de l’Air en Région SUD Provence ‐ Alpes ‐ Côte d’Azur.</p>
                    <p>Référents inventaires: Benjamin Rocher, Damien Bouchard, Romain Souweine.</p>
                    
                    <h4>Cookies et données personnelles</h4>
                    <p>
                    Nous utilisons des cookies persistants afin d'améliorer l'expérience utilisateur. 
                    Ces cookies sont conservés sur votre ordinateur même après fermeture de votre navigateur et réutilisés 
                    lors des prochaines visites sur notre site. 
                    Nous utilisons aussi des cookies afin de mieux comprendre comment vous interagissez avec notre site 
                    et nos services et afin d'améliorer ces mêmes site et services.
                    <p>
                    <p>
                    Une information concernant ces cookies apparaît lors de votre première connexion au site.                     
                    </p>    
                    <p>
                    Pour plus d'informations concernant la gestion de vos données personnelles, 
                    rendez-vous sur <a href="https://www.atmosud.org/gestion-des-donnees-personnelles">le site internet d'AtmoSud.</a>
                    </p>
                    <div style="margin-top:20%;"><text style="font-size:14px; color:lightgrey;">Logo @ Mathilde Leygnac</text></div>                 
                </div>                 
            </div> 
        </div>
        
        <!-- RGPD -->
        <script src="lib/rgpd.js"></script>   
        
    </body>
</html>