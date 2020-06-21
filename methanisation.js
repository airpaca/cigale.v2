/* 
CIGALE - Méthanisation - Main app
Romain Souweine - AtmoSud - 2019
*/


// delete window.Geoserver;
// delete window.Datablock;
// delete window.Select;
// delete window.Highcharts;
// delete window.app;
// delete window.geoserver;


// If new user create cookie and launch didacticiel
// To reset it: firstImpression('isNewUser', null);
// firstImpression('isNewUser', null); // DEBUG: Reset cookie 
if (firstImpression("isNewUser", 365)) {
    didacticiel();
};

function didacticiel(){
    // Creates and launch didacticiel 
    
    // Init instance
    var enjoyhint_instance = new EnjoyHint({});

    // Steps 
    var enjoyhint_script_steps = [
      {
        "next .breadcrumb" : "<div class=\"row\" style=\"overflow-y: auto;\"><div class=\"col-lg-12\" style=\"overflow-y: auto;\">Bienenue sur l'application méthanisation de CIGALE</br>réalisée en partenariat par le <text style='color: #00a6eb'>GERES</text> et <text style='color: #00a6eb'>AtmoSud</text>.</br></br><img src='../img/LogoAtmosud.small.png' alt='AtmoSud'></div></div>"
        ,showSkip: false
      },
      {
        "next #ButtonTheme1" : "Affichez les données à partir des cinq grands facteurs de réussite préalablement identifiés."
        ,showSkip: false
      },
      // {
        // "next #ButtonTheme1" : "<text style='font-size: 15px;line-height:15px;margin-bottom:0px;margin-top:0px;padding-bottom:0px;padding-top:0px'>Calculez le potentiel des territoires en terme de mobilisation de ressources organiques avec les unités de méthanisation en fonctionnement, les boues de STEP et les autre sources mobilisables.</br></br>" +
		// "Analyse des possibilités de raccordement au réseau gaz et autres valorisations potentielles pour les communes non raccordées.</br></br>"+
		// "Recensement des surfaces épandables et des unités de compostage en service.</br></br>"+
		// "Cartographie des territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTES.</br></br></text>"
		// ,showSkip: false
      // }, 	  
     
	  {
        "next #ButtonTheme1" : "<text style='color: #00a6eb'>Ressources organisques mobilisables</text></br>"+
        "Calculez le potentiel des territoires en terme de mobilisation de ressources organiques avec les unités de méthanisation en fonctionnement, les boues de STEP et les autre sources mobilisables.</br></br>"// +
        // "<img src='img/didacticiel/didact.rom1.png' height='150' style='margin-right:50px;'><img src='img/didacticiel/didact.rom2.png' height='150' style='margin-right:50px;'><img src='img/didacticiel/didact.rom3.png' height='150'>"
        ,showSkip: false
      },      
      {
        "next #ButtonTheme1" : "<text style='color: #00a6eb'>Débouchés pour le Biogaz</text></br>"+
        "Analyse des possibilités de raccordement au réseau gaz et autres valorisations potentielles pour les communes non raccordées.</br></br>"// +
        // "<img src='img/didacticiel/didact.dbg1.png' height='150' style='margin-right:50px;'><img src='img/didacticiel/didact.dbg2.png' height='150'>"
        ,showSkip: false
      },
      {
        "next #ButtonTheme1" : "<text style='color: #00a6eb'>Débouchés pour le digestat</text></br>"+
        "Recensement des surfaces épandables et des unités de compostage en service.</br></br>"// +
        // "<img src='img/didacticiel/didact.ddg1.png' height='150' style='margin-right:50px;'><img src='img/didacticiel/didact.ddg2.png' height='150' style='margin-right:50px;'><img src='img/didacticiel/didact.ddg3.png' height='150' >"
        ,showSkip: false
      }, 
      // {
        // "next #ButtonTheme1" : "<text style='color: #00a6eb'>Implantation possible d'unités</text></br>"+
        // "<text style='color: #FF7701'>Ces données sont en cours de construction et seront disponibles prochainement.</text>"
        // ,showSkip: false
      // },      
      {
        "next #ButtonTheme1" : "<text style='color: #00a6eb'>Acceptation locale et portage de projet</text></br>"+
        "Cartographie des territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTES.</br></br>"//+
        // "<img src='img/didacticiel/didact.alp1.png' height='150'>"
        ,showSkip: false
      },   
	  
      {
        "next .bootstrap-select" : "Sélectionnez un territoire administratif (Départements, EPCI, Communes, PNR) ..."
        ,showSkip: false
      },
      {
        "next #chk-stats-gen" : "... puis créez sa fiche de synthèse."
        ,showSkip: false
      },
      {
        "next .slider round" : "Vous pouvez également définir un territoire personnalisé."
        ,showSkip: false
      },      
      {
        "next .navbar-toggler" : "Pour aller plus loin:</br>"+
        "</br>- Dévérouillez les différentes couches pour les croiser entre-elles."+
        "</br>- Exportez la carte."
        ,showSkip: false
      },   
      {
        "next .function-spe" : "ou modifiez les ratios de mobilisation."
        ,showSkip: false
      },        
      {
        "next .navbar-toggler" : "Bonne navigation.</br>"+
		"<img src='img/didacticiel/geres.demoStats1.png' height='150'>"+
        "</br>Vous pouvez à tout moment réactiver ce didacticiel à partir du menu déroulant."
        ,showSkip: false
      }         
    ];

    // set script config
    enjoyhint_instance.set(enjoyhint_script_steps);

    // run Enjoyhint script
    enjoyhint_instance.run();        
};


zoom_territoire = function() {
	app.blocks.mapview.get_territoire(app.territoire, app.territoire_token);
};



geoserver = new Geoserver("https://geoservices.atmosud.org/geoserver/");

// App conf
app = {
    server: geoserver,
	get_territoire_app_function: 'zoom_territoire', // FIXME Fait  dans visualisation mais est tjs en variable du select en fait, bcp mieux ! Cf. Ci-desous
    active: {
        theme: 1
    },
    lock: 1, 
    blocks: {
        left: new Datablock("left-block", "#main-row", true, 4, null, {overflow: false, invert:"pull", new_row:"100"}), 
        left_select: new Datablock("left-select", "#left-block", true, 12), 
        select_zones: new Select("select-zones", "#left-select", "api/liste_territoires_tous.php", "Entrez les premières lettres d'un EPCI, commune, Parc Naturel, ...", "zoom_territoire", "Je recherche un territoire"),
        left_layers: new Datablock("left-layers", "#left-block", "manager", 12), 
        mapview: new Datablock("map-block", "#main-row", true, 8, "",{invert:"push"}),                  
        report: new Datablock("report-block", "#main-row", "hide", 12),                                    
    },
    baseLayers: {
        Esri_WorldTopoMap: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            args: {
                // attribution: 'Tiles &copy; Esri &mdash; Esri',
                attribution: '',
                minZoom: 0,
                maxZoom: 11, // 14,            
            }
        },       
        GeoportailFrance_orthos: {
            url: 'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',            
            args: {
                // attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
                attribution: '',
                bounds: [[-75, -180], [81, 180]],
                minZoom: 12, // 15,
                maxZoom: 20,
                apikey: 'choisirgeoportail',
                format: 'image/jpeg',
                style: 'normal'
            }
        },
        Esri_WorldTopoMap_fullzoom: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            args: {
                attribution: '',
                minZoom: 0,
                maxZoom: 20           
            }                       
        },        

    },
    manager: {
        "Ressources organiques mobilisables": {
            id: 1,
            // desc: '<div class="p-large-black">Ensemble des ressources organiques mobilisables sur le territoire.</div>',
            desc: 'Ensemble des ressources organiques mobilisables sur le territoire.',
            actif: true,
            methodo: "https://tmp.atmosud.org/doc/geres_methanisation_doc.pdf",
            img: "",
            layers: {},
            default_layers: [
                "Unités de méthanisation en fonctionnement</br>au 31/08/2019",
            ],
        },
        "Débouchés pour le biogaz": {
            id: 2,
            // desc: '<div class="p-large-black">Recensement des débouchés potentiels pour le biogaz produit par raccordement au réseau Gaz ou vente directe aux industries de l\'agro alimentaire potentiellement consommatrices de chaleur dans les communes éloignées du réseau de distribution de gaz.</div>',
            desc: 'Recensement des débouchés potentiels pour le biogaz produit par raccordement au réseau Gaz ou vente directe aux industries de l\'agro alimentaire potentiellement consommatrices de chaleur dans les communes éloignées du réseau de distribution de gaz.',
            img: "",
            actif: false,
            methodo: "https://tmp.atmosud.org/doc/geres_methanisation_doc.pdf",
            layers:{},
            default_layers: [
                "Réseau de distribution de gaz à moins de 5km", 
                "Réseau de distribution de gaz à moins de 10km",
                "Valorisation possible de chaleur dans les IAA"
            ],
        },
        "Débouchés pour le digestat": {
            id: 3,
            // desc: '<div class="p-large-black">Recensement des surfaces épandables à diverses échelles et des plateformes de compostage en fonction des déchets traités et de leur capacités règlementaires.</div>',
            desc: 'Recensement des surfaces épandables à diverses échelles et des plateformes de compostage en fonction des déchets traités et de leur capacités règlementaires.',
            img: "",
            actif: false,
            methodo: "https://tmp.atmosud.org/doc/geres_methanisation_doc.pdf",
            layers:{},
            default_layers: [
                "Parcelles agricoles épandables</br>selon contraintes environnementales et/ou géologiques",
                "Unités de compostage",
                "Surface agricole épandable</br>(ha/EPCI)"
            ],
        },
        "Implantation possible d'unités": {
            id: 4,
            desc: "", //'<div class="p-large-black">Territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTE.</div>',
            img: "",
            actif: false,
            methodo: "https://tmp.atmosud.org/doc/geres_methanisation_doc.pdf",
            layers:{},
            default_layers: [
            ],
        }, 
        "Acceptation locale et portage de projet": {
            id: 5,
            // desc: '<div class="p-large-black">Territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTES.</div>',
            desc: 'Territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTES.',
            img: "",
            actif: false,
            methodo: "https://tmp.atmosud.org/doc/geres_methanisation_doc.pdf",
            layers:{},
            default_layers: [
                "Territoires à Energie Positive (TEPOS)"
            ],
        },        
    }
};


// Create checkbox for zonal statistics
app.blocks.left_select.createcheck({id: "chk-stats", tolaunch: "app.blocks.mapview.map.manage_stats_button(\'chk-stats\')"});


// Create main map
app.blocks.mapview.createmap({
    base_layers: [app.baseLayers.Esri_WorldTopoMap, app.baseLayers.GeoportailFrance_orthos], 
    draw: true, legend: true, coords: [43.9, 6.0], zoom: 8, 
    scale:true
});


// Create layers for each theme
app.manager["Ressources organiques mobilisables"].layers = {

    // "dev": geoserver.lfCreateLayerWFS("dev", "cigale:rom_unites_metha", app.blocks.mapview, true, [0,20], 
    // "Ressources organiques mobilisables", {
        
        // tooltip:{content:"<b>*_site_nom*</b></br>Typologie: *_typologie*</br>Valorisation: *_type_valo*", params: {sticky: false, permanent: true, pane: "front", direction: 'top', className: 'tooltip-a'}},
         // }),

	"Unités de méthanisation en fonctionnement</br>au 01/06/2020": geoserver.lfCreateLayerWFS("Unités de méthanisation en fonctionnement</br>au 01/06/2020", "cigale:rom_unites_metha", app.blocks.mapview, true, [0,20], 
    "Ressources organiques mobilisables", {
        legend_carriage: false,	
        // tooltip:{content:"<b>*_site_nom*</b></br>Typologie: *_typologie*</br>Valorisation: *_type_valo*", params: {sticky: false, permanent: true, pane: "front", direction: 'top', className: 'tooltip-a'}},
        tooltip:{content:"*_site_nom*", params: {sticky: false, permanent: true, pane: "top", direction: 'top', className: 'tooltip-a'}},
        name_field: "site_nom",   
		attributes_dict : {"typologie":"Typologie", "code_postal": "Code postal", "commune": "Commune", "tonnage_traite": "Tonnage annuel (T MB/an ou T MS/an pour les STEP)", "dimensionnement_kwe": "Puissance installée (kWe)",
			"dimensionnement_nm3_h": "Débit biométhane (Nm3/h)", "type_valo":"Valorisation énergie"},
        style_dict: {
            pane: 'top',
            radius: 9, fillColor: "green", color: "white", weight: 1, opacity: 1, fillOpacity: 0.9, 
            categories: {
                field: "typologie", 
                values: {
                    "Agricole": "#106b0a",
                    "Industrie - IAA": "#ff7f00",
                    "STEP": "#682ce0",
                    "Ordures Ménagères": "#dd1c77",
                }
            }
        }}), 

    "Potentiel des STEP (Mwh/an)": geoserver.lfCreateLayerWFS("Potentiel des STEP (Mwh/an)", "cigale:rom_step", app.blocks.mapview, false, [0,20], "Ressources organiques mobilisables", 
        {
            legend_carriage: false, 
            name_field : "nom",
			attributes_dict : {"dep": "Département", "prod_tot_kg_ms": "Production de boues ( kg MS/an)", "typologies": "Procédé épuratoire", "prod_potentielle_nm3_ch4_tmvs": "Production potentielle (Nm3/T MS)",
				"prod_tot_nm3_ch4": "Production potentielle (Nm3/T MV)", "prod_tot_nm3_ch4_h":"Débit potentiel biométhane (Nm3/h)", "prod_mwh_an":"Energie potentielle produite (Mwh/an)"},			
            style_dict: {
                pane: 'top',
                radius: 7, fillColor: "red", color: "blue", weight: 0, opacity: 1, fillOpacity: 0.5,
                classes: {field: "prod_tot_nm3_ch4_h", param: "radius", unite: "(Nm3/h)", grades: [
                    // [10,"2"],
                    // [20,"6"],
                    // [45,"10"],
                    // [70,"16"],
                    // [200,"20"],
                    // [300,"25"],
                    // [10,"4"],
                    // [20,"6"],
                    // [45,"10"],
                    // [70,"16"],
                    // [200,"20"],
                    // [300,"25"],     
                    [10,"5"],
                    [20,"10"],
                    [45,"15"],
                    [70,"20"],
                    [200,"25"],
                    [300,"30"],                                         
                ],
                special: {field: "methanisation", val_field:true, param: "fillColor", val:"#1f83d2", legend:"STEP équipées d'un méthaniseur"}   
            }
        }        
    }),    
  
    "Ressources organiques mobilisables (hors STEP)": geoserver.lfCreateLayerWFS(
        // "Communes : Ressources organiques mobilisables (hors STEP)", "cigale:rom_carte_comm_groupe_rom", app.blocks.mapview, false, [10,20], 
        "Ressources organiques mobilisables (hors STEP)", "cigale:rom_carte_comm_groupe_rom_rs", app.blocks.mapview, false, [0,20], 
        "Ressources organiques mobilisables", {
            // fixed_url:"https://tmp.atmosud.org/api/geres.ratios.comm.php",
            multi_style:[
                {
                    name: "MWh net/an",
                    style:{ 
						jenks: {field: "Total potentiel rom (MWh)", njenks: 5, 
						colorscale: [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ]}, // ESRI Blue 6
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        // classes: {
                            // field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                                // [1000,"#f7fcf5"],
                                // [5000,"#d5efcf"],
                                // [10000,"#9ed898"],
                                // [20000,"#54b567"],
                                // [30000,"#1d8641"],
                                // [50000,"#00441b"]
                            // ]   
                        // },            
                    }                    
                }, 
                {name: "tonnes net/an",
                    style:{ 
						jenks: {field: "Total potentiel rom (t nettes)", njenks: 5, 
						colorscale: [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ]}, // ESRI Blue 6
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        // classes: {
                            // field: "Total potentiel rom (t nettes)", param: "fillColor", grades: [
                                // [1000,"#f7fcf5"],
                                // [5000,"#d5efcf"],
                                // [10000,"#9ed898"],
                                // [20000,"#54b567"],
                                // [30000,"#1d8641"],
                                // [50000,"#00441b"]
                            // ]   
                        // },            
                    }                   
                },                
                {name: "tonnes brutes/an",
                    style:{ 
						jenks: {
							field: "Total potentiel rom (t brutes)", njenks: 5, 
							colorscale: [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ]}, // ESRI Blue 6
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        // classes: {
                            // field: "Total potentiel rom (t brutes)", param: "fillColor", grades: [
                                // [1000,"#f7fcf5"],
                                // [5000,"#d5efcf"],
                                // [50000,"#9ed898"],
                                // [100000,"#54b567"],
                                // [150000,"#1d8641"],
                                // [220000,"#00441b"]
                            // ]   
                        // },            
                    }                   
                },
            ],            
            visible: true,
            legend_carriage: true, 
            // legend_title: "Ressources organiques mobilisables</br>par commune en MWh net/an hors STEP",
            legend_title: "Ressources organiques mobilisables (hors STEP)</br>(MWh net/an)",
            name_field : "nom_com",
			fonction: "modalRatios();",fonction_desc: "Modifier les ratios de mobilisation",
			
			attributes_dict : {
				"Total potentiel rom (MWh)": "Energie potentielle produite  nette (Mwh/an)",
				"Total potentiel rom (t brutes)": "Tonnage d'intrants mobilisables nets (t brut/an)",
				"Total potentiel rom (t nettes)": "Tonnage d'intrants mobilisables nets (t net/an)",
				"nom_com": "Commune",
			},			
			
            style_dict: {
				jenks: {
					field: "Total potentiel rom (MWh)", 
					// njenks: 6, 
					// colorscale: ["#f7fcf5","#d5efcf","#9ed898","#54b567","#1d8641","#00441b"]},
					njenks: 5,
					// colorscale: ["#00b5f0","#007fb8","#a3af9e","#404a3c","#147a04"]},
					// colorscale: [ "#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c" ]}, // ESRI Green 1
					// colorscale: [ "#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59" ]}, // ESRI Green 3
					// colorscale: [ "#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837" ]}, // ESRI Green 4
					// colorscale: [ "#e2ebd3", "#c8e09f", "#add46a", "#62afa7", "#2d8078" ]}, // ESRI Green 5
					// colorscale: [ "#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571" ]}, // ESRI Green & Brown 1
					// colorscale: [ "#dbf2e3", "#c5ead4", "#99b9c3", "#6f72b2", "#364187" ]}, // ESRI Green & Blue 2
					colorscale: [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ]}, // ESRI Blue 6
                pane: 'front',
                fillColor: "white", color: "black", weight: 0.5, 
                opacity: 0.8, fillOpacity: 0.5,
                // classes: {
                    // field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                        // [1000,"#f7fcf5"],
                        // [5000,"#d5efcf"],
                        // [10000,"#9ed898"],
                        // [20000,"#54b567"],
                        // [30000,"#1d8641"],
                        // [50000,"#00441b"]
                    // ]   
                // },            
            },            
            
        }
    ), 




  
};

app.manager["Débouchés pour le biogaz"].layers = {
    "Réseau de distribution de gaz à moins de 5km": geoserver.lfCreateLayerWMS("Réseau de distribution de gaz à moins de 5km", "cigale:dbg_grdf_reseau_5km", app.blocks.mapview, false, [0,20], "Débouchés pour le biogaz",{
        header: "Injection dans le réseau gaz",
        pane: "front", 
        legend: true,
    }),
    "Réseau de distribution de gaz à moins de 10km": geoserver.lfCreateLayerWMS("Réseau de distribution de gaz à moins de 10km", "cigale:dbg_grdf_reseau_5_10km", app.blocks.mapview, false, [0,20], "Débouchés pour le biogaz", {
        pane: "front"
    }), 
    
    "Cartographie indicative des zonages en fonction du ratio I/V": geoserver.CreatelayerLink("Cartographie indicative des zonages en fonction du ratio I/V", "Consultation sur un autre site", app.blocks.mapview, false, [0,0], "Débouchés pour le biogaz",{
        tooltip: "Cette donnée est consultable sur un autre site",
		link: "https://projet-methanisation.grdf.fr",
    }),  	
	
    "Réseau de transport à moins de 5km": geoserver.lfCreateLayerWMS("Réseau de transport à moins de 5km", "cigale_wms:dbg_grtgaz", app.blocks.mapview, false, [0,20], "Débouchés pour le biogaz",{
        pane: "top"
    }),
 
    "Réseau électrique RTE": geoserver.CreatelayerLink("Réseau électrique RTE", "Consultation sur un autre site", app.blocks.mapview, false, [0,0], "Débouchés pour le biogaz",{
        tooltip: "Cette donnée est consultable sur un autre site",
		link: "https://www.rte-france.com/fr/la-carte-du-reseau",
    }),  
	
    "Valorisation possible de chaleur dans les IAA": geoserver.lfCreateLayerWFS("Valorisation possible de chaleur dans les IAA", "cigale:dbg_iaa", app.blocks.mapview, false, [0,20], "Débouchés pour le biogaz", {
        legend_carriage: false, 
        name_field: "entreprise",
		attributes_dict : {"nom_com": "Commune", "code_ape": "Activité (code APE)", "conso_chaleur": "Consommation chaleur potentielle"},	
        style_dict: {
            radius: 9, fillColor: "red", color: "white", weight: 1, opacity: 1, fillOpacity: 1, 
            categories: {field: "conso_chaleur", values: {"Faible": "#fcdaac","Moyenne": "#ffb347","Forte": "#df8003"}}
        }
    }),
    "Autres valorisation de chaleur": geoserver.CreatelayerEnConstruction("Autres valorisation de chaleur", "En cours de construction", app.blocks.mapview, false, [0,0], "Débouchés pour le biogaz",{
        tooltip: "Cette couche sera disponible prochainement",
    }),

    "Points de collecte": geoserver.CreatelayerEnConstruction("Points de collecte", "En cours de construction", app.blocks.mapview, false, [0,0], "Débouchés pour le biogaz",{
        header: "Gaz porté",
        tooltip: "Cette couche sera disponible prochainement",
    }),   


   
};

app.manager["Débouchés pour le digestat"].layers = {
    
    "Unités de compostage": geoserver.lfCreateLayerWFS("Unités de compostage", "cigale:ddg_plateforme_compostage", app.blocks.mapview, false, [0,20], "Débouchés pour le digestat", 
        {
            legend_carriage: false, 
            name_field : "nom_site",
			attributes_dict : {"exploitant": "Exploitant", "dep": "Département", "commune": "Commune", "capacite_reglementaire": "Capacité réglementaire (t/an)", "cap_dechets_verts":"Capacité traitement déchets verts (t/an)", "cap_boues":"Capacité traitement boues (t/an)", 
				"cap_biodechets":"Capacité traitement biodéchets (t/an)", "cap_dechets_agri":"Capacité traitement déchets bois (t/an)", "cap_bois":"Capacité traitement déchets  agricoles(t/an)", 
				"procedes":"Procédé de compostage", "span":"Agrément SPAN"},
            style_dict: {
                pane: 'top',
                radius: 7, fillColor: "#e862ae", color: "#4e4e4e", weight: 1, opacity: 1, fillOpacity: 0.6,
                classes: {field: "capacite_reglementaire", unite: "(t/an)", param: "radius", grades: [
                    [5000,"10"],
                    [10000,"16"],
                    [20000,"20"],
                    [40000,"25"],
                    [120000,"35"],
                ]}
            }        
    }),

    "Surface agricole épandable</br>(ha/EPCI)": geoserver.lfCreateLayerWFS(
        "Surface agricole épandable</br>(ha/EPCI)", "cigale:ddg_carte_epci", app.blocks.mapview, false, [0,11], 
        "Débouchés pour le digestat", {
            legend_carriage: true, 
            name_field : "nom_epci_2018", // "nom_epci_2018", // "Valorisation possible - ha",
			attributes_dict : {
				"surface_parcelle_ha":"SAU (ha)",
				"Valorisation impossible - ha": "Valorisation du digestat impossible selon contraintes réglementaires ( ha)",
				"Valorisation avec contrainte environnementale - ha":"Valorisation du digestat possible avec contraintes environnementales préalablement identifiées (ha)",
				"Valorisation avec contrainte géologique - ha":"Valorisation du digestat possible avec contraintes  géologiques préalablement identifiées ( reliefs karstiques - ha)",
				"Valorisation possible - ha":"Valorisation du digestat possible sans contrainte préalablement identifiée (ha)",
			},
            style_dict: {
                pane: 'front',
                fillColor: "white", color: "black", weight: 0.5, 
                opacity: 0.8, fillOpacity: 0.5,
                classes: {
                    field: "Valorisation possible - ha", param: "fillColor", grades: [
                        [250,"#f7fbff"],
                        [500,"#c8ddf0"],
                        [1500,"#73b3d8"],
                        [5000,"#2879b9"],
                        [9000,"#08306b"],
                    ]   
                },            
            },            
            
        }
    ),
    
    "Parcelles agricoles épandables</br>selon contraintes environnementales et/ou géologiques": geoserver.lfCreateLayerWMS(
        "Parcelles agricoles épandables</br>selon contraintes environnementales et/ou géologiques", "cigale:ddg_classe_final", app.blocks.mapview, false, [12,20], "Débouchés pour le digestat", {
            pane: "front", legend_carriage: true
        }
    ), 
    
};

app.manager["Implantation possible d'unités"].layers = {
    "Foncier disponible sans contrainte</br>règlementaire connue": geoserver.CreatelayerEnConstruction("Foncier disponible sans contrainte</br>règlementaire connue", "En cours de construction", app.blocks.mapview, false, [0,0], "Implantation possible d'unités",{
        tooltip: "Cette couche sera disponible prochainement",
    }),     
};

app.manager["Acceptation locale et portage de projet"].layers = {

    "Territoires à Energie Positive (TEPOS)": geoserver.lfCreateLayerWFS("Territoires à Energie Positive (TEPOS)", "cigale:alp_carte_plans_tepos", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom_territoire",  
		attributes_dict : {},
        style_dict: {
            pane: "top", 
            fillColor: "#1f78b4", color: "#1f78b4", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }),   
        
    "Territoires à Energie Positive pour la croissance Verte (TEPCV)": geoserver.lfCreateLayerWFS("Territoires à Energie Positive pour la croissance Verte (TEPCV)", "cigale:alp_carte_plans_tepcv", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom_territoire",  
		attributes_dict : {},
        style_dict: {
            pane: "top", 
            fillColor: "#33a02c", color: "#33a02c", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }), 
    
    "Territoires Zéro Déchets Zéro Gaspillage  (TZDZG)": geoserver.lfCreateLayerWFS("Territoires Zéro Déchets Zéro Gaspillage  (TZDZG)", "cigale:alp_carte_plans_tzdzg", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom_territoire", 
		attributes_dict : {},		
        style_dict: {
            pane: "front", 
            fillColor: "#ea915e", color: "#ea915e", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }),  



    "Territoires Sous Contrat de Transition Écologique (CTEs)": geoserver.lfCreateLayerWFS("Territoires Sous Contrat de Transition Écologique (CTEs)", "cigale:alp_carte_plans_cte", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom_territoire",  
		attributes_dict : {},
        style_dict: {
            pane: "front", 
            fillColor: "#d7a500", color: "#d7a500", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }), 
    
};


// Create manager 
app.blocks.left_layers.createmanager(app.manager);

// Reset zonal stats checkbox to false
$("#chk-stats")[0].checked = false;

// Check for internet
function msieversion() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        console.log(parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))));
    };

    return false;
}
msieversion();


// Add listener to stats button
$('#chk-stats-gen').click(function(e) {
    e.preventDefault();
    app.blocks.report.activate_report_col();
});  
  

// Function to locked / unlocked layers
// FIXME: Pass it in datablock?
function gestion_lock(){
    if(app.lock == 0){
        app.lock=1;
        $('#btn-lock').html("Dévérouiller les couches");
		$('#btn-lock').html('<li class="nav-item ml-auto" id="btn-lock"><a href="#" onclick="gestion_lock()">Dévérouiller les couches</a></li>');
    }else{
        app.lock=0;
        // $('#btn-lock').html("Vérouiller les couches");
        $('#btn-lock').html('<li class="nav-item ml-auto" id="btn-lock"><a href="#" onclick="gestion_lock()">Vérouiller les couches</a></li>');
    };
};

// Modal contact
function contact_metha(){
    $("#urlModalContact").modal(); 
};

// Auto hide Bootstrap Nav Toggler on click on button
$('#navbarSupportedContent').on('click', function(){
    $('#navbarSupportedContent').removeClass('show');
    $('#navbarSupportedContent').addClass('hide');
});





function modal_url_generate(){
	
	// Referme le modal
	$('#urlModal').modal('toggle');	
	
	// Création d'un dictionnaire des ratios et appel de la fonction de recalcul
	$.ajax({
		type: "GET", 
		url: "api/geres.ratios_mob_defaut.php",
		dataType: 'json',             
		success: function(response,textStatus,jqXHR){
			app.ratios = {};
			for (i in response) { app.ratios[response[i].id_param] = {"id": response[i].id_param, "valeur":$('#mob-param-'+response[i].id_param)[0].value}; };
			// console.log(app.ratios);
			mob_recalcul();
		},
	});	
	
};


function mob_recalcul(){
	/*
	On appel un script avec les nnouveaux ratios en param
		- Script = https://tmp.atmosud.org/api/geres.ratios.comm.recalcul.php
		- Ratios = app.ratios
	On update la couche en place
	*/
	
	// TODO: Start a timer
	app.blocks.mapview.spinstart();
	
	$.ajax({
		type: "GET", 
		url: "api/geres.ratios.comm.recalcul.php",
		dataType: 'json',  
		data: {
			ratios: app.ratios,
		},
		success: function(response,textStatus,jqXHR){
			
			// console.log(response);
			// console.log(response[0].nom_com);
			// console.log("------------------");
			
			
			// DEBUG - Jenks calculés préalablement

			// Modification de la source du layer				
			app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].layer.eachLayer(function (feature) {
				
				for (i_obj in response){
					if (response[i_obj].id_comm == feature.feature.properties.id_comm) {
						feature.feature.properties = response[i_obj];
					};
				};
				
				// Recréation des popup 
				function traitement_valeur(valeur){
					if (isInteger(valeur)) {
						return valeur;
					} else if (isNaN(Math.round(valeur))) {
						return feature.feature.properties[ip];
					} else {
						if (Math.round(valeur) > 99) {
							return Math.round(valeur);
						} else {
							return Number(valeur).toFixed(1);
						};
					};                            
				}; 
		

				var name_field = feature.feature.properties.nom_com;
		
				// Création du popup 
				// if (jqXHR.popup == true) {
				
					var html = '<div class="popup-wfs">';
					html += '<div class="popup-wfs-title">'+name_field+'</div>';
					html += '<div class="row scroller no-gutters popup-data-row">';
					
					// Si on a un dictionnaire de mapping alors on l'utilise
					if (app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].attributes_dict != false){
						for (ip in app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].attributes_dict){
							var the_val = traitement_valeur(feature.feature.properties[ip]);
							html += '<div class="col-md-6 popup-wfs-field">'+ app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].attributes_dict[ip] + '</div>';  
							html += '<div class="col-md-6 popup-wfs-val" style="overflow:hiden;">'+ the_val + '</div>';                                      
						};
					// Sinon on boucle sur toutes les propriétés
					} else {  
						for (var ip in feature.feature.properties) {
							// On affiche pas par défaut certains champs
							if (["gid", "geom"].indexOf(ip) == -1){
								var the_val = traitement_valeur(feature.feature.properties[ip]);
								html += '<div class="col-md-6 popup-wfs-field">'+ ip + '</div>';  
								html += '<div class="col-md-6 popup-wfs-val" style="overflow:hiden;">'+ the_val + '</div>';                                 
							};
						};
					};
					html += '</div>';                                               
					html += '</div>';
					
					// if (typeof(dict_args.popup_extra) != "undefined"){
							
						// html += dict_args.popup_extra;
					// };
					
					// layer.bindPopup(html, {maxWidth: 200, maxHeight: 200});
					var popup = L.responsivePopup({
						offset: [10,10], 
						hasTip: true, 
						autoPanPadding: [10,10],
						// maxheight: "50px",
						// minWidth: "300px",
						// maxHeight: "350px",
						// minHeight: "350px",
					}).setContent(html); 

					feature.bindPopup(popup);
				// };				
				
				
			});
			

			// Recalculer les jenks 
			// D'abord on calcul les jenks pour tous les styles dispos à partir de la réponse
			// for (style_index in map_block.layers[jqXHR.name].multi_style) {
			for (style_index in app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style) {
				
				app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style[style_index].jenks_calcules = calc_jenks_json(
					response,
					app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style[style_index].style.jenks.field, 
					app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style[style_index].style.jenks.njenks,
					app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style[style_index].style.jenks.colorscale
				);
				app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style[style_index].style.jenks_calcules = app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].multi_style[style_index].jenks_calcules;
			};
			
			// Puis le style par défaut
			app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].style_orig.jenks_calcules = calc_jenks_json(
				response, 
				app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].style_orig.jenks.field,app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].style_orig.jenks.njenks,
				app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].style_orig.jenks.colorscale);
			// app.blocks.mapview.layers[the_layer].multi_style[status].style.classes
			// map_block.layers[jqXHR.name]							
			
			// Updates des styles (défaut uniquement, les autres sont updatés lorsque l'on fera le changement dans l'interface
			app.blocks.mapview.change_style(
				app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].name,
				app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].active_style
			);	

			app.blocks.mapview.spinstop();
			
		}, error : function(jqXHR, textStatus, errorThrown){
			console.log("ERROR LORS DU RECALCUL DES RATIOS DE MOB");
			console.log(textStatus);
		},
	});		

	
	

	
	
	

	
	
	
	
	
/* 	

	// Récupération de l'identifiant du layer
	old_layer_id = app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].id);

	// Suppression du layer original
    app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].remove(app.blocks.mapview.map);
	
	app.blocks.mapview.layers["Ressources organiques mobilisables (hors STEP)"].layer = geoserver.lfCreateLayerWFS(
        "Ressources organiques mobilisables (hors STEP)", "cigale:aa", app.blocks.mapview, false, [0,20], 
        "Ressources organiques mobilisables", {
        // "NoTheme", {
			fixed_url:"https://tmp.atmosud.org/api/geres.ratios.comm.recalcul.php",
			fixed_url_data: {
				ratios: app.ratios,
			},			
            multi_style:[
                {
                    name: "MWh net",
                    style:{ 
						jenks: {field: "Total potentiel rom (MWh)", njenks: 6, colorscale: ["#f7fcf5","#d5efcf","#9ed898","#54b567","#1d8641","#00441b"]}, // NOTE: On fait un calcul de jenks auto
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                    }                    
                }, 
                {name: "tonnes net",
                    style:{ 
						jenks: {field: "Total potentiel rom (t nettes)", njenks: 6, colorscale: ["#f7fcf5","#d5efcf","#9ed898","#54b567","#1d8641","#00441b"]}, // NOTE: On fait un calcul de jenks auto
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                    }                   
                },                
                {name: "tonnes brutes",
                    style:{ 
						jenks: {field: "Total potentiel rom (t brutes)", njenks: 6, colorscale: ["#f7fcf5","#d5efcf","#9ed898","#54b567","#1d8641","#00441b"]}, // NOTE: On fait un calcul de jenks auto
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                    }                   
                },
            ],            
            visible: true,
            legend_carriage: true, 
            legend_title: "Ressources organiques mobilisables</br>par commune en MWh net/an hors STEP",
            name_field : "nom_com",
			fonction: "modalRatios();",fonction_desc: "Modifier les ratios de mobilisation",
			
			attributes_dict : {
				"Total potentiel rom (MWh)": "Energie potentielle produite  nette (Mwh/an)",
				"Total potentiel rom (t brutes)": "Tonnage d'intrants mobilisables nets (t brut/an)",
				"Total potentiel rom (t nettes)": "Tonnage d'intrants mobilisables nets (t net/an)",
				"nom_com": "Commune",
			},			
			
            style_dict: {
				jenks: {field: "Total potentiel rom (MWh)", njenks: 6, colorscale: ["#f7fcf5","#d5efcf","#9ed898","#54b567","#1d8641","#00441b"]}, // NOTE: On fait un calcul de jenks auto
                pane: 'front',
                fillColor: "white", color: "black", weight: 0.5, 
                opacity: 0.8, fillOpacity: 0.5,
            },            
            
        }
    ); */
	
	

	
/* 
	// NOTE: FONCTIONNAIT MAIS AVEC LA METHODE  FIXED URL
	
	// app.blocks.mapview.layers["Ressources organiques mobilisables</br>(hors STEP)"].remove(app.blocks.mapview.map);
	app.blocks.mapview.layers["Ressources organiques mobilisables</br>(hors STEP)"].layer = geoserver.lfCreateLayerWFS("Ressources organiques mobilisables</br>(hors STEP)", "cigale:rom_carte_epci_groupe_rom",  app.blocks.mapview, true, [0,20], 
		"Ressources organiques mobilisables", {
			// cql_filter: filterIntersectNotTouches,
			fixed_url:"https://tmp.atmosud.org/api/geres.ratios.epci.recalcul.php",
			fixed_url_data: {
				ratios: app.ratios,
			},								
			// popup: true,
			// mouseover: true,
			in_legend: true,
			zoom: true,
			style_dict: {
				pane: "top", 
				fillColor: "#1f78b4", color: "#1f78b4", weight: 0.5, 
				opacity: 1, fillOpacity: 0.5
			}
		});

 */

	
	/*
	
	
                        // geoserver.lfCreateLayerWFS("Territoires à Energie Positive (TEPOS)", "cigale:alp_carte_plans_tepos"+typename_suffix, app.blocks.carte_alp_tepos, true, [0,20], "NoTheme", {
                        // geoserver.lfCreateLayerWFS("Territoires à Energie Positive (TEPOS)", "cigale:alp_carte_plans_tepos",  app.blocks.mapview, true, [0,20], "NoTheme", {
                        // geoserver.lfCreateLayerWFS("Ressources organiques mobilisables</br>(hors STEP)AA", "cigale:aaa",  app.blocks.mapview, true, [0,20], 
                        geoserver.lfCreateLayerWFS("AAAAAA", "cigale:aaa",  app.blocks.mapview, true, [0,20], 
						"Ressources organiques mobilisables", {
                            // cql_filter: filterIntersectNotTouches,
                            fixed_url:"https://tmp.atmosud.org/api/geres.ratios.epci.recalcul.php",
							fixed_url_data: {
								ratios: app.ratios,
							},								
							// popup: true,
                            // mouseover: true,
                            in_legend: true,
                            zoom: true,
                            style_dict: {
                                pane: "top", 
                                fillColor: "#1f78b4", color: "#1f78b4", weight: 0.5, 
                                opacity: 1, fillOpacity: 0.5
                            }
							// multi_style:[
								// {
									// name: "MWh net",
									// style:{ 
										// pane: 'front',
										// fillColor: "white", color: "black", weight: 0.5, 
										// opacity: 0.8, fillOpacity: 0.5,
										// classes: {
											// field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
												// [2800,"#f7fcf5"],
												// [5700,"#d5efcf"],
												// [9500,"#9ed898"],
												// [14200,"#54b567"],
												// [23600,"#1d8641"],
												// [150000000,"#00441b"]
											// ]   
										// },            
									// }                    
								// },
								// {name: "tonnes net",
									// style:{ 
										// pane: 'front',
										// fillColor: "white", color: "black", weight: 0.5, 
										// opacity: 0.8, fillOpacity: 0.5,
										// classes: {
											// field: "Total potentiel rom (t brut)", param: "fillColor", grades: [
												// [10000,"#fffee4"],
												// [20000,"#ebfeb3"],
												// [35000,"#cdf68e"],
												// [50000,"#9fd374"],
												// [10000,"#7aa64a"],
												// [6300000000,"#557128"]
											// ]   
										// },            
									// }                   
								// },                
								// {name: "autre",
									// style:{ 
										// pane: 'front',
										// fillColor: "white", color: "black", weight: 0.5, 
										// opacity: 0.8, fillOpacity: 0.5,
										// classes: {
											// field: "Total potentiel rom (t brut)", param: "fillColor", grades: [
												// [10000,"red"],
												// [20000,"red"],
												// [35000,"red"],
												// [50000,"red"],
												// [10000,"red"],
												// [6300000000,"red"]
											// ]   
										// },            
									// }                   
								// },
							// ],							
                        }); 

*/




			/*
			// app.blocks.mapview.layers["Ressources organiques mobilisables</br>(hors STEP)"] = geoserver.lfCreateLayerWFS(
			geoserver.lfCreateLayerWFS(
					// "Ressources organiques mobilisables</br>(hors STEP)", "cigale:rom_carte_epci_groupe_rom", app.blocks.mapview, false, [0,9], 
					"Ressources organiques mobilisables</br>(hors STEP)", "cigale:AAAA", app.blocks.mapview, false, [0,9], 
					// "Ressources organiques mobilisables", {
					"NoTheme", {
						fixed_url:"https://tmp.atmosud.org/api/geres.ratios.epci.recalcul.php",
						fixed_url_data: {
							ratios: app.ratios,
						},						
 						// multi_style:[
							// {
								// name: "MWh net",
								// style:{ 
									// pane: 'front',
									// fillColor: "white", color: "black", weight: 0.5, 
									// opacity: 0.8, fillOpacity: 0.5,
									// classes: {
										// field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
											// [2800,"#f7fcf5"],
											// [5700,"#d5efcf"],
											// [9500,"#9ed898"],
											// [14200,"#54b567"],
											// [23600,"#1d8641"],
											// [150000000,"#00441b"]
										// ]   
									// },            
								// }                    
							// },
							// {name: "tonnes net",
								// style:{ 
									// pane: 'front',
									// fillColor: "white", color: "black", weight: 0.5, 
									// opacity: 0.8, fillOpacity: 0.5,
									// classes: {
										// field: "Total potentiel rom (t brut)", param: "fillColor", grades: [
											// [10000,"#fffee4"],
											// [20000,"#ebfeb3"],
											// [35000,"#cdf68e"],
											// [50000,"#9fd374"],
											// [10000,"#7aa64a"],
											// [6300000000,"#557128"]
										// ]   
									// },            
								// }                   
							// },                
							// {name: "autre",
								// style:{ 
									// pane: 'front',
									// fillColor: "white", color: "black", weight: 0.5, 
									// opacity: 0.8, fillOpacity: 0.5,
									// classes: {
										// field: "Total potentiel rom (t brut)", param: "fillColor", grades: [
											// [10000,"red"],
											// [20000,"red"],
											// [35000,"red"],
											// [50000,"red"],
											// [10000,"red"],
											// [6300000000,"red"]
										// ]   
									// },            
								// }                   
							// },
						// ],
						// dual: { 
							// name: "Communes : Ressources organiques mobilisables (hors STEP)",
						// }, 
						// fonction: "modalRatios();",fonction_desc: "Modifier les ratios de mobilisation",
						// legend_carriage: true, 
						// legend_title: "Ressources organiques mobilisables</br>par EPCI en MWh net/an hors STEP",
						// name_field : "nom_epci_2018",
						// style_dict: {
							// pane: 'front',
							// fillColor: "white", color: "black", weight: 0.5, 
							// opacity: 0.8, fillOpacity: 0.5,
							// classes: {
								// field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
									// [2800,"#f7fcf5"],
									// [5700,"#d5efcf"],
									// [9500,"#9ed898"],
									// [14200,"#54b567"],
									// [23600,"#1d8641"],
									// [1500000000,"#00441b"]
								// ]   
							// },            
						// },            
						
					}
				);	
*/
	
	/*
 	// Création d'un dictionnaire des ratios et appel de la fonction de recalcul
	$.ajax({
		type: "GET", 
		url: "api/geres.ratios.epci.recalcul.php",
		dataType: 'json',  
		data: {
			ratios: app.ratios,
		},
		success: function(response,textStatus,jqXHR){
					
			console.log("////////////////////////////////////////////////////////////////////////////////////////////////");
			console.log(response);		
			
		}, error : function(jqXHR, textStatus, errorThrown){
			console.log("ERROR LORS DU RECALCUL DES RATIOS DE MOB");
			console.log(textStatus);
		},
	});	
	*/
};





// DEBUG
// console.log(window);
// console.log("METHANISATION");
