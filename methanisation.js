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
    // FIXME: Les titres des blocks (5 facteurs de réussite) pourraient être directement récupérés dans la config, les layers également
    
    // Init instance
    var enjoyhint_instance = new EnjoyHint({});

    // Steps 
    var enjoyhint_script_steps = [
      {
        "next .breadcrumb" : "Bienenue sur l'application méthanisation de CIGALE</br>réalisée en partenariat par le <text style='color: #00a6eb'>GERES</text> et <text style='color: #00a6eb'>AtmoSud</text>.</br></br><img src='../img/LogoAtmosud.small.png' alt='AtmoSud'>"
        ,showSkip: false
      },
      {
        "next #ButtonTheme1" : "Affichez les données à partir des cinque grands facteurs de réussite préalablement identifiés."
        ,showSkip: false
      },
      {
        "next #ButtonTheme1" : "<text style='color: #00a6eb'>Ressources organisques mobilisables</text></br>"+
        "Calculez le potentiel des territoires en terme de mobilisation de ressources organiques avec les unités de méthanisation en fonctionnement, les boues de STEP et les autre sources mobilisables.</br></br>"+
        "<img src='didacticiel/didact.rom1.png' height='300' style='margin-right:50px;'><img src='didacticiel/didact.rom2.png' height='300' style='margin-right:50px;'><img src='didacticiel/didact.rom3.png' height='300'>"
        ,showSkip: false
      },      
      {
        "next #ButtonTheme2" : "<text style='color: #00a6eb'>Débouchés pour le Biogaz</text></br>"+
        "Analyse des possibilités de raccordement au réseau gaz et autres valorisations potentielles pour les communes non raccordées.</br></br>"+
        "<img src='didacticiel/didact.dbg1.png' height='300' style='margin-right:50px;'><img src='didacticiel/didact.dbg2.png' height='300'>"
        ,showSkip: false
      },
      {
        "next #ButtonTheme3" : "<text style='color: #00a6eb'>Débouchés pour le digestat</text></br>"+
        "Recensement des surfaces épandables et des unités de compostage en service.</br></br>"+
        "<img src='didacticiel/didact.ddg1.png' height='300' style='margin-right:50px;'><img src='didacticiel/didact.ddg2.png' height='300' style='margin-right:50px;'><img src='didacticiel/didact.ddg3.png' height='300' >"
        ,showSkip: false
      }, 
      {
        "next #ButtonTheme4" : "<text style='color: #00a6eb'>Implantation possible d'unités</text></br>"+
        "<text style='color: #FF7701'>Ces données sont en cours de construction et seront disponibles prochainement.</text>"
        ,showSkip: false
      },      
      {
        "next #ButtonTheme5" : "<text style='color: #00a6eb'>Acceptation locale et portage de projet</text></br>"+
        "Cartographie des territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTES.</br></br>"+
        "<img src='didacticiel/didact.alp1.png' height='300'>"
        ,showSkip: false
      },      
      {
        "next .bootstrap-select" : "Sélectionnes un territoire administratif (Départements, EPCI, Communes, PNR) ..."
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
        "next .badge-secondary" : "ou modifiez les ratios de mobilisation."
        ,showSkip: false
      },        
      {
        "next .navbar-toggler" : "Bonne navigation.</br>Vous pouvez à tout moment réactiver ce didacticiel à partir du menu déroulant."
        ,showSkip: false
      }         
    ];

    // set script config
    enjoyhint_instance.set(enjoyhint_script_steps);

    // run Enjoyhint script
    enjoyhint_instance.run();        
};


zoom_territoire = function() {
	console.log("ZOOM_TERRITOIRE");
	console.log(app.blocks.mapview.layers);
	console.log(app.blocks.mapview.layers["Territoire"]);
	console.log("_____________________________________");
	// app.blocks.mapview.layers["territoire"] = app.territoire;
	// console.log(app.blocks.mapview.layers["territoire"]);
	// app.blocks.mapview.get_territoire(app.territoire, app.token);
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
        select_zones: new Select("select-zones", "#left-select", "api/liste_territoires.php", "Entrez les premières lettres d'un EPCI, commune, Parc Naturel, ...", "zoom_territoire", "Je recherche un territoire"),
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
            desc: '<div class="p-large-black">Ensemble des ressources organiques mobilisables sur le territoire.</div>',
            actif: true,
            methodo: "../methodo.php",
            img: "",
            layers: {},
            default_layers: [
                "Unités de méthanisation en fonctionnement</br>au 31/08/2019",
            ],
        },
        "Débouchés pour le biogaz": {
            id: 2,
            desc: '<div class="p-large-black">Recensement des débouchés potentiels pour le biogaz produit par raccordement au réseau Gaz ou vente directe aux industries de l\'agro alimentaire potentiellement consommatrices de chaleur dans les communes éloignées du réseau de distribution de gaz.</div>',
            img: "",
            actif: false,
            methodo: "../methodo.php",
            layers:{},
            default_layers: [
                "Réseau de distribution de gaz à moins de 5km", 
                "Réseau de distribution de gaz à moins de 10km",
                "Valorisation possible de chaleur dans les IAA"
            ],
        },
        "Débouchés pour le digestat": {
            id: 3,
            desc: '<div class="p-large-black">Recensement des surfaces épandables à diverses échelles et des plateformes de compostage en fonction des déchets traités et de leur capacités règlementaires.</div>',
            img: "",
            actif: false,
            methodo: "../methodo.php",
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
            methodo: "../methodo.php",
            layers:{},
            default_layers: [
            ],
        }, 
        "Acceptation locale et portage de projet": {
            id: 5,
            desc: '<div class="p-large-black">Territoires engagés dans des démarches TEPOS, TEPCV, TZDZG et CTES.</div>',
            img: "",
            actif: false,
            methodo: "../methodo.php",
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

    "Unités de méthanisation en fonctionnement</br>au 31/08/2019": geoserver.lfCreateLayerWFS("Unités de méthanisation en fonctionnement</br>au 31/08/2019", "cigale:rom_unites_metha", app.blocks.mapview, true, [0,20], 
    "Ressources organiques mobilisables", {
        legend_carriage: false,
        // tooltip:{content:"<b>*_site_nom*</b></br>Typologie: *_typologie*</br>Valorisation: *_type_valo*", params: {sticky: false, permanent: true, pane: "front", direction: 'top', className: 'tooltip-a'}},
        tooltip:{content:"*_site_nom*", params: {sticky: false, permanent: true, pane: "top", direction: 'top', className: 'tooltip-a'}},
        name_field: "site_nom",   
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
            style_dict: {
                pane: 'top',
                radius: 7, fillColor: "red", color: "blue", weight: 0, opacity: 1, fillOpacity: 0.5,
                classes: {field: "prod_tot_nm3_ch4_h", param: "radius", grades: [
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
       
    "Ressources organiques mobilisables</br>(hors STEP)": geoserver.lfCreateLayerWFS(
        "Ressources organiques mobilisables</br>(hors STEP)", "cigale:rom_carte_epci_groupe_rom", app.blocks.mapview, false, [0,9], 
        "Ressources organiques mobilisables", {
            multi_style:[
                {
                    name: "MWh net",
                    style:{ 
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        classes: {
                            field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                                [2800,"#f7fcf5"],
                                [5700,"#d5efcf"],
                                [9500,"#9ed898"],
                                [14200,"#54b567"],
                                [23600,"#1d8641"],
                                [150000,"#00441b"]
                            ]   
                        },            
                    }                    
                },
                {name: "tonnes net",
                    style:{ 
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        classes: {
                            field: "Total potentiel rom (t brut)", param: "fillColor", grades: [
                                [10000,"#fffee4"],
                                [20000,"#ebfeb3"],
                                [35000,"#cdf68e"],
                                [50000,"#9fd374"],
                                [10000,"#7aa64a"],
                                [630000,"#557128"]
                            ]   
                        },            
                    }                   
                },                
                {name: "autre",
                    style:{ 
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        classes: {
                            field: "Total potentiel rom (t brut)", param: "fillColor", grades: [
                                [10000,"red"],
                                [20000,"red"],
                                [35000,"red"],
                                [50000,"red"],
                                [10000,"red"],
                                [630000,"red"]
                            ]   
                        },            
                    }                   
                },
            ],
            dual: { 
                name: "Communes : Ressources organiques mobilisables (hors STEP)",
            },
            fonction: "modalRatios();",fonction_desc: "Modifier les ratios de mobilisation",
            legend_carriage: true, 
            legend_title: "Ressources organiques mobilisables</br>par EPCI en MWh net/an hors STEP",
            name_field : "nom_epci_2018",
            style_dict: {
                pane: 'front',
                fillColor: "white", color: "black", weight: 0.5, 
                opacity: 0.8, fillOpacity: 0.5,
                classes: {
                    field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                        [2800,"#f7fcf5"],
                        [5700,"#d5efcf"],
                        [9500,"#9ed898"],
                        [14200,"#54b567"],
                        [23600,"#1d8641"],
                        [150000,"#00441b"]
                    ]   
                },            
            },            
            
        }
    ),
 
    "Communes : Ressources organiques mobilisables (hors STEP)": geoserver.lfCreateLayerWFS(
        "Communes : Ressources organiques mobilisables (hors STEP)", "cigale:rom_carte_comm_groupe_rom", app.blocks.mapview, false, [10,20], 
        "Ressources organiques mobilisables", {
            multi_style:[
                {
                    name: "MWh net",
                    style:{ 
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        classes: {
                            field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                                [1000,"#f7fcf5"],
                                [5000,"#d5efcf"],
                                [10000,"#9ed898"],
                                [20000,"#54b567"],
                                [30000,"#1d8641"],
                                [50000,"#00441b"]
                            ]   
                        },            
                    }                    
                }, 
                {name: "tonnes net",
                    style:{ 
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        classes: {
                            field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                                [1000,"blue"],
                                [5000,"blue"],
                                [10000,"blue"],
                                [20000,"blue"],
                                [30000,"blue"],
                                [50000,"blue"]
                            ]   
                        },            
                    }                   
                },                
                {name: "autre",
                    style:{ 
                        pane: 'front',
                        fillColor: "white", color: "black", weight: 0.5, 
                        opacity: 0.8, fillOpacity: 0.5,
                        classes: {
                            field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                                [1000,"red"],
                                [5000,"red"],
                                [10000,"red"],
                                [20000,"red"],
                                [30000,"red"],
                                [50000,"red"]
                            ]   
                        },            
                    }                   
                },
            ],            
            visible: false,
            legend_carriage: true, 
            legend_title: "Ressources organiques mobilisables</br>par commune en MWh net/an hors STEP",
            name_field : "nom_com",
            style_dict: {
                pane: 'front',
                fillColor: "white", color: "black", weight: 0.5, 
                opacity: 0.8, fillOpacity: 0.5,
                classes: {
                    field: "Total potentiel rom (MWh)", param: "fillColor", grades: [
                        [1000,"#f7fcf5"],
                        [5000,"#d5efcf"],
                        [10000,"#9ed898"],
                        [20000,"#54b567"],
                        [30000,"#1d8641"],
                        [50000,"#00441b"]
                    ]   
                },            
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
    "Réseau de transport à moins de 5km": geoserver.CreatelayerEnConstruction("Réseau de transport à moins de 5km", "En cours de construction", app.blocks.mapview, false, [0,0], "Débouchés pour le biogaz",{
        tooltip: "Cette couche sera disponible prochainement",
    }),

    "Réseau électrique RTE": geoserver.CreatelayerEnConstruction("Réseau électrique RTE", "En cours de construction", app.blocks.mapview, false, [0,0], "Débouchés pour le biogaz",{
        header: "Cogénération",
        tooltip: "Cette couche sera disponible prochainement",
    }),    
    "Valorisation possible de chaleur dans les IAA": geoserver.lfCreateLayerWFS("Valorisation possible de chaleur dans les IAA", "cigale:dbg_iaa", app.blocks.mapview, false, [0,20], "Débouchés pour le biogaz", {
        legend_carriage: false, 
        name_field: "entreprise",
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
            style_dict: {
                pane: 'top',
                radius: 7, fillColor: "#e862ae", color: "#4e4e4e", weight: 1, opacity: 1, fillOpacity: 0.6,
                classes: {field: "capacite_reglementaire", param: "radius", grades: [
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
            name_field : "Valorisation possible - ha",
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
        name_field: "nom_pays",  
        style_dict: {
            pane: "top", 
            fillColor: "#1f78b4", color: "#1f78b4", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }),   
        
    "Territoires à Energie Positive pour la croissance Verte (TEPCV)": geoserver.lfCreateLayerWFS("Territoires à Energie Positive pour la croissance Verte (TEPCV)", "cigale:alp_carte_plans_tepcv", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom",  
        style_dict: {
            pane: "top", 
            fillColor: "#33a02c", color: "#33a02c", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }), 
    
    "Territoires Zéro Déchets Zéro Gaspillage  (TZDZG)": geoserver.lfCreateLayerWFS("Territoires Zéro Déchets Zéro Gaspillage  (TZDZG)", "cigale:alp_carte_plans_tzdzg", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom_epci",  
        style_dict: {
            pane: "front", 
            fillColor: "#ea915e", color: "#ea915e", weight: 1, 
            opacity: 1, fillOpacity: 0.5,
        }        
    }),  



    "Territoires Sous Contrat de Transition Écologique (CTEs)": geoserver.lfCreateLayerWFS("Territoires Sous Contrat de Transition Écologique (CTEs)", "cigale:alp_carte_plans_cte", app.blocks.mapview, false, [0,20], 
    "Acceptation locale et portage de projet", {
        legend_carriage: false,
        name_field: "nom_epci",  
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
	console.log("Gestion Lock");
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


// DEBUG
// console.log(window);
console.log("METHANISATION");
