<!-- Doctype HTML5 -->
<!DOCTYPE html>
<html lang="en">
<html dir="ltr">
    <head>
        <meta charset="utf-8">        
        <meta name="viewport" content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="description" content="CIGALE - Documentation">
        <meta name="author" content="AtmoSud">
        <title>CIGALE - Documentation</title>
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
		
		<!-- bootstrap-toc -->
		<link rel="stylesheet" href="libs/bootstrap-toc-gh-pages/dist/bootstrap-toc.min.css">
		<script src="libs/bootstrap-toc-gh-pages/dist/bootstrap-toc.min.js"></script>		
		
    </head>


    <body>
        
        <?php
		// Deals with session
        session_start();
        $_SESSION["categorie"] = "Documentation";
        ?>   
        
        <?php include 'config.php'; ?>
        <?php include 'nav.php'; ?>
        
        <div class="container-fluid">    
            <div class="row contact-row-header">
                <div class="col-md-12 contact-col-header">
                
                    <h3>Index</h3>
					<!-- TOC -->
					<div class="row">
						<nav id="toc" data-toggle="toc"></nav>            
					</div>
                    
                </div>
            </div>
			
			
            <div class="row contact-row">
                <div class="col-md-6 contact-col-left">
                
				
					<div class="h4-big-center">Données d'inventaires</div>
					
                    <h4>Définitions et équivalences énergétiques</h4>
                    <h5 data-toc-text="Consommation énergétique finale">Consommation énergétique finale</h5>
						<p>
						Les données présentées dans Cigale correspondent à la <b>consommation énergétique finale</b>. 
						Il s’agit de l’énergie livrée à des fins énergétiques, donc hors utilisation en tant que matière première, pour toutes les branches économiques 
						à l’exception des producteurs d’électricité et de chaleur (pour éviter les double-comptes). 
						Elle représente toute l’énergie consommée par les utilisateurs finaux sur le territoire y compris les consommations d’électricité et de chaleur 
						(qui sont des énergies secondaires). Les émissions de gaz à effet de serre résultantes intègrent donc les émissions indirectes de CO<sub>2</sub> liées 
						à la consommation d’électricité (SCOPE 1 et 2). 
						</p>	
						<p>	
						L’usage de matières premières correspond à la consommation non énergétique finale et n’est pas inclus dans les données de consommation dans Cigale, 
						bien que les émissions induites par les activités concernées soient prises en compte, sous la catégorie « aucune énergie ». 
						</p>                    
                    <h5 data-toc-text="Production d'énergie primaire">Production d'énergie</h5>                    
						<p>
						Dans CIGALE, les productions recensées sont les productions d’électricité et de chaleur en sortie de l’installation. </br>
						Ces productions peuvent correspondre à des productions primaires (ex : éolien, solaire, hydraulique, etc.) ou a des productions secondaires ( ex : thermique fossile).					
						</p>
						<p>
						Energie primaire: il s'agit des produits énergétiques « bruts » dans l’état dans lequel ils sont fournis par la nature, c’est-à-dire l’énergie potentielle contenue dans les produits après extraction mais
						avant transformation (exemple : bois). </br>
						Par convention, l’énergie électrique provenant des filières hydraulique, éolienne et photovoltaïque est considérée comme une production primaire.</br>
						</br>
						L’énergie secondaire (électricité ou chaleur) issue de la transformation des produits est généralement inférieure à la production primaire, en fonction des pertes et des rendements des unités de valorisation (UIOM, ISDND, centrale, etc.) 
						</p>										
					<h5 data-toc-text="Emissions de gaz à effet de serre : PRG">Emissions de gaz à effet de serre : PRG</h5>    
						<p>
						Le <b>Potentiel de Réchauffement Global (PRG)</b> est un indicateur défini pour comparer l’impact de chaque 
						gaz à effet de serre sur le réchauffement global, sur une période choisie (généralement 100 ans). 
						Il est calculé à partir des PRG de chaque substance et est exprimé en équivalent CO<sub>2</sub> (CO<sub>2</sub>e). 
						</p>	
						<p>	
						Par définition, le PRG du CO<sub>2</sub> est toujours égal à 1. Les coefficients utilisés dans l’inventaire d'AtmoSud
						sont ceux du 5<sup>e</sup> rapport du GIEC ( (CO2=<sub>2</sub>, CH<sub>4</sub>=28, N<sub>2</sub>O=265). 
						Les gaz fluorés ne sont actuellement pas calculés dans l’inventaire.
						</p>
					<h5 data-toc-text="Equivalences énergétiques">Tableau des équivalences énergétiques</h5>
						<p>
						<img src="doc/Tableau_eq_energetique.JPG" border="0" width="80%">
						</p>					
					
					
					<h4>Nomenclatures d'activités</h4>
					<h5 data-toc-text="Nomenclature SNAP">Nomenclature SNAP</h5>
						<p>
						Les inventaires d’émissions sont établis selon la nomenclature <b>SNAP</b> (Selected Nomenclature for Air Pollution, EMEP/CORINAIR 1997). 
						Cette nomenclature a évolué depuis 1997, pour permettre la prise en compte de nouvelles activités. Elle est décrite dans le rapport
						OMINEA (Organisation et méthodes des inventaires nationaux des émissions atmosphériques en France). Cf. CITEPA.
						</p>
					<h5 data-toc-text="Nomenclature PCAET">Nomenclature PCAET</h5>
						<p>
						Dans l’outil CIGALE, les données d’émission et de consommation sont déclinées en huit secteurs conformément aux prescriptions de <a href="https://www.legifrance.gouv.fr/jo_pdf.do?id=JORFTEXT000032974938">l’arrêté PCAET</a> :
						</p>
					
						<ul>
						<li>Résidentiel</li>
						<li>Tertiaire</li>
						<li>Transport routier</li>
						<li>Autres transports</li>
						<li>Agriculture</li>
						<li>Déchets</li>
						<li>Industrie hors branche énergie</li>
						<li>Branche énergie</li>
						</ul>             
					
						<p>
						Une neuvième catégorie <b>Emetteurs non inclus</b> regroupe les émissions non prises en compte dans les totaux sectoriels ainsi 
						que les sources non anthropiques, qui ne sont généralement pas rapportées dans les bilans d’émissions au format PCAET. 
						Il s’agit notamment de la remise en suspension des particules fines, des feux de forêt et des sources naturelles :
						(végétation, NOx et COVNM des champs et cultures, NOx des cheptels) :                    
						</p>
					
						<img src="doc/tableau_non_inclus.png" border="0" width="80%">
					
						<p> 
						Les émissions de GES des cycles LTO internationaux sont également rapportées dans cette catégorie. 
						Pour information, les émissions et consommations des phases croisières de l’aviation et du maritime ne sont pas rapportées dans Cigale. 
						</p>

						<p>
						Pour la <b>Branche énergie</b>, les données de consommation d’énergie et d’émissions de gaz à effet de serre liées à la production d’électricité, 
						de chaleur et de froid ne sont pas inclues dans ce secteur, mais elles sont comptabilisées au stade de la consommation finale par l’utilisateur. 
						Ainsi, l’inventaire des polluants atmosphériques (hors GES) comptabilise les émissions sur le lieu de rejet. L’inventaire des émissions de gaz à 
						effet de serre comptabilise les émissions directes liées à tous les secteurs d’activité hormis celui de la production d’électricité, de chaleur et 
						de froid, dont seule la part d’émissions indirectes liée à la consommation à l’intérieur du territoire est comptabilisée.
						</p>

						<img src="doc/schema_scope.png" border="0" width="80%">

                    </p>	
				<h5 data-toc-text="Secteur UTCATF">Secteur UTCATF</h5>
					<p> 
                    L'<b>Utilisation des Terres, Changement d’Affectation des Terres et Foresterie</b> est à la fois un puits et une source d'émission de 
					CO<sub>2</sub>, CH<sub>4</sub> et N<sub>2</sub>O. L'UTCATF couvre la récolte et l'accroissement forestier, la conversion des forêts (défrichement) 
					et des prairies ainsi que les sols dont la composition en carbone est sensible à la nature des activités 
					auxquelles ils sont dédiés (forêt, prairies, terres cultivées). Ce secteur n’est actuellement pas calculé 
					dans l’inventaire AtmoSud.                  
                    </p>	

			
						<h4>Nomenclatures de combustibles</h4>
							<h5 data-toc-text="Nomenclature NAPFUE">Nomenclature NAPFUE</h5>
								<p>
								Les activités de combustion sont distinguées dans l’inventaire par un niveau supplémentaire en intégrant 
								la nomenclature NAPFUE (Nomenclature for Air Pollution of FUEls). Cette nomenclature est décrite dans 
								le rapport OMINEA (Cf. CITEPA).
								</p>
							<h5 data-toc-text="Format de restitution">Format de restitution</h5>
								<p>
								Pour un rendu plus synthétique des données, l’ensemble de ces énergies est rassemblé selon une nomenclature simplifiée, selon 9 catégories :</br>
								<ul>
								<li>Aucune énergie : cette catégorie permet de distinguer toute émission de polluants atmosphériques ou de GES non énergétique ;</li>
								<li>Gaz naturel ;</li>
								<li>Produits pétroliers ;</li>
								<li>Combustibles minéraux solides ;</li>
								<li>Bois énergie ;</li>
								<li>Chaleur et froid : les émissions associées sont des émissions indirectes de CO<sub>2</sub> ;</li>
								<li>Electricité : les émissions associées sont des émissions indirectes de CO<sub>2</sub> ;</li>
								<li>Autres énergies renouvelables ;</li>
								<li>Autres non renouvelables.</li>
								</ul>
								</p>
							<h5 data-toc-text="Détails des autres combustibles">Détails des autres combustibles</h5>
								<p>
								Les catégories <b>Autres énergies renouvelables</b> et <b>autres énergies non renouvelables</b> sont constituées des énergies suivantes :</br>
								</p>
								<p>
								- Autre énergie renouvelable : Ordures ménagères (organiques), déchets agricoles, farines animales, boues d’épuration, biocarburant, 
								liqueur noire, bio-alcool, biogaz, gaz de décharge, chaleur issue du solaire thermique et de la géothermie.
								</p>
								<p>
								- Autre énergie non renouvelable : Ordures ménagères (non organiques), déchets industriels solides, pneumatiques, plastiques, 
								solvants usagés, gaz de cokerie, gaz de haut fourneau, mélange de gaz sidérurgiques, gaz industriel, gaz d’usine à gaz, gaz d’aciérie, hydrogène.
								</p>

					<h4>Mise à jour des données</h4>
					<p>
					AtmoSud met à jour les inventaires d'émissions, de consommations et productions énergétiques tous les ans. 
					</p>
					<p>
					Lors de cette mise à jour, une année supplémentaire est calculée. Les années antérieures sont également toutes recalculées pour 
					prendre en compte les éventuelles modifications méthodologiques et actualisation des données sources. 
					Les données de la dernière version annulent et remplacent donc les précédentes.
					</p>
					<p>
					Des mises à jour pour une même version d’inventaire peuvent également être réalisées. Les listes des versions et détails des mises à jour sont consultables ci-dessous.            
					</p>
					
					<b>Versions d'inventaire:</b>
					<?php include 'scripts/versions_inventaire_html.php';   ?>
				   
					<b>Mises à jour de l'interface:</b></br> 
					- 08/06/2020: Correction d'un bug d'extraction des données sur certains PNR. L'extraction ne renvoyait pas les bonnes communes.</br>
					- 17/12/2019: Changement du format de restitution pour les consommations et émissions de GES de la branche production d'énergie, pour n'exclure que les installations de production d'électricité et de chaleur. Les autres activités, comme les raffineries par exemple, sont maintenant bien comptabilisées dans cette branche d'activités.</br>
					- 16/10/2019: Changement de la classification SECTEN1 en classification PCAET pour différencier le secteur déchets de celui de l'industrie.</br>
					- 16/10/2019: Correction d'un bug lors de l'export des données sur les PNR.</br>
					- 16/10/2019: Ajout du champ code insee des communes dans la partie export si détail communal activé.</br>
					- 16/10/2019: Correction d'un bug d'affichage cartographique des communues de certains territoires.</br>
					- 16/10/2019: Ajout de la version d'inventaire et de la date dans les extractions.</br>
					
					<h4>Secret statistique</h4>
					<p>
					Certaines données sont soumises au secret statistique et ne peuvent être publiées. Une donnée est considérée 
					comme confidentielle lorsque moins de 3 établissements sont à l’origine de cette donnée ou qu’un seul établissement 
					contribue à 85 % ou plus de cette donnée (<a href="https://www.insee.fr/fr/information/1300624">définition INSEE du secret statistique</a>).
					</p>
					<p>
					Le secret statistique est calculé par commune, par secteur d’activité et par catégorie d’énergie pour les consommations. 
					</p>
					<p>
					Dans le souci de publier un maximum de données, plusieurs traitements sont effectués :</br>
					</p>
					<p>
					- Pas de donnée confidentielle pour les émissions (uniquement pour les consommations) </br>
					- A l’échelle de l’EPCI, lorsque les critères du secret statistique sont respectés et 
					que le secret statistique concerne plusieurs communes (pour un même secteur d’activité et 
					une même catégorie d’énergie), les données globales de l’EPCI peuvent être diffusées (impossibilité de reconstitution des données communales).
					</p>                    

				<h4 data-toc-text="Conditions d'utilisation">Conditions d'utilisation des données</h4>
						
						<p>
						Les données présentées dans le cadre de l'application CIGALE sont sous licence 
						<a href="http://opendatacommons.org/licenses/odbl/1.0/">ODbL</a>.
						</p>
						<p>
						Elles peuvent librement être diffusées, 
						publiées ou utilisées dans le cadre de travaux, d'études ou d'analyse avec les conditions suivantes:
						</p>
						<p>
						- Toute utilisation des données brutes issues de la base de données CIGALE devra faire référence à 
						l'Observatoire Régional de l'Energie, du Climat et de l'Air (ORECA) et à AtmoSud en ces termes :
						'Source: Base de donnes CIGALE - Observatoire Régional de l'Energie, du Climat et de l'Air (ORECA) 
						Provence-Alpes-Côte d'Azur / inventaire AtmoSud'. 
						Il est également important de préciser la version de l’inventaire et la date correspondant à l’extraction des données.
						</p>
						<p>
						- Toute utilisation de données retravaillées par l'utilisateur final à partir de données 
						brutes issues de l'application CIGALE devra faire référence à l'Observatoire Régional de l'Energie, 
						du Climat et de l'Air (ORECA) et à AtmoSud en ces termes :
						'Source: *Utilisateur final* d'après la base de données CIGALE - Observatoire Régional de l'Energie, 
						du Climat et de l'Air (ORECA) Provence-Alpes-Côte d'Azur / inventaire AtmoSud'
						</p>
						<p>
						- Sur demande, l'Observatoire Régional de l'Energie, du Climat et de l'Air (ORECA) Provence-Alpes-Côte d'Azur et AtmoSud 
						mettent à disposition les méthodes d'exploitation des données mises en œuvre.
						</p>
						<p>
						- Les données contenues dans ce document restent la propriété de l'Observatoire Régional de l'Energie, 
						du Climat et de l'Air (ORECA) Provence-Alpes-Côte dAzur et d'AtmoSud.
						</p>
						<p>
						- L'Observatoire Régional de l'Energie, du Climat et de l'Air (ORECA) Provence-Alpes-Côte dAzur et 
						AtmoSud peuvent rediffuser ce document à d'autres destinataires.        
						</p>    
				
						<h4>Liens utiles</h4>
						<p>
						<a href="doc/171030_Methodo_TDB_conso_prod_cigale.pdf">Note méthodologique d'élaboration de l'inventaire régional des consommations et productions d'énergies en Provence Alpes Côte d'Azur</a>
						</p>
						<p>
						<a href="doc/171016_NoteMethodoInventaire.pdf">Note méthodologique d'élaboration de l'inventaire des émissions de polluants en Provence Alpes Côte d'Azur</a>
						</p>
						
						<p>
						<a href="https://www.atmosud.org/sites/paca/files/atoms/files/190724_plaquette_inventaires_territoriaux_0.pdf">En savoir plus sur les inventaires : la plaquette AtmoSud</a>
						</p>            
						
						<p>
						<a href="https://www.lcsqa.org/system/files/rapport/MTES_Guide_methodo_elaboration_inventaires_PCIT_mars2019.pdf">Guide PCIT (Pôle de Coordination des Inventaires territoriaux)</a>
						</p>
						<p>
						<a href="https://www.citepa.org/fr/activites/inventaires-des-emissions/secten">CITEPA : inventaire SECTEN</a>
						</p>					
							
						

                                      
                </div> 
                <div class="col-md-6 contact-col-right">
				
					<div class="h4-big-center">Autres données</div>
				
                    <h4 data-toc-text="Méthanisation">Méthanisation</h4>

							<p>	
							La méthodologie et la documentation technique sont accessibles sur le <a href="doc/geres_methanisation_doc.pdf">lien suivant</a>.
							</p>
                </div>   
				
            </div> 
        </div>
        
        <!-- RGPD -->
        <script src="lib/rgpd.js"></script>   
        
    </body>
</html>