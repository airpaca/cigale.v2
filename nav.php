<nav class="navbar navbar-dark fixed-top navbar-cigale">
    <nav aria-label="Plan">
        <ol class="breadcrumb quote">
            
            <?php 
            if ($_SESSION["categorie"] == "Accueil") {
                echo '
                <li class="breadcrumb-item navbar-cigale-breadcrumbitem">
                    <a href="index.php"><img class="navbar-cigale-logo" src="img/logoCigale/logo-cigale-blanc-small.png"></a>
                </li> 
                ';
            } else {
                // echo '<li class="breadcrumb-item navbar-cigale-breadcrumbitem"><a href="index.php">Accueil</a></li>';
                echo '
                <li class="breadcrumb-item navbar-cigale-breadcrumbitem">
                    <a href="index.php"><img class="navbar-cigale-logo" src="img/logoCigale/logo-cigale-blanc-small.png"></a>
                </li> 
                ';                
                echo '<li class="breadcrumb-item navbar-cigale-breadcrumbitem d-none d-sm-block">'.$_SESSION["categorie"].'</li>';
            };
            ?>
            <!-- 
            <li class="breadcrumb-item navbar-cigale-breadcrumbitem">
                <a href="index.php"><img class="navbar-cigale-logo" src="img/logoCigale/logo-cigale-blanc-small.png"></a>
            </li>
            
            <li class="breadcrumb-item navbar-cigale-breadcrumbitem"><?php echo $_SESSION["categorie"] ?></li>
            -->
        </ol>        
    </nav> 

	<?php if ($_SESSION["categorie"] == "Méthanisation"){ echo '
		<span class="btn-group-toggle ml-auto" data-toggle="buttons" id="chk-stats-gen">
		<label class="btn btn-outline-light btn-rapport" >
		<input type="checkbox">Fiche synthétique du territoire
		</label>
		</span>
	';}	?>

    <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Navigation">
        <?php if ($_SESSION["categorie"] == "Méthanisation"){ echo '
			<span id="stats-txt">Plus d\'options</span>
		';} ?>
		<span class="navbar-toggler-icon"></span>
    </button>

    <div class="navbar-collapse collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
			<?php if ($_SESSION["categorie"] == "Méthanisation"){ echo '		           
				<li class="nav-item ml-auto" id="btn-lock"><a href="#" onclick="gestion_lock()">Dévérouiller les couches</a></li>
				<li class="nav-item ml-auto"><a href="#" onclick="app.blocks.mapview.print_map();">Enregistrer la carte</a></li>
				<li class="nav-item ml-auto"><a href="#" onclick="didacticiel()">Didacticiel</a></li>
			';}	?>            
			<li class="nav-item ml-auto"><a href="index.php">Accueil</a></li>			
			<li class="nav-item ml-auto"><a href="documentation.php">Documentation</a></li>			
            <li class="nav-item ml-auto"><a href="user.php">Mon espace</a></li>
            <li class="nav-item ml-auto"><a href="contact.php">Contact</a></li>
        </ul>
    </div>

	<!-- RGPD -->
	<script src="lib/rgpd.js"></script>
    
</nav>