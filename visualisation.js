/* 
CIGALE - Visualisation - Main app
Romain Souweine - AtmoSud - 2019
*/


console.log("CIGALE - Visualisation");


geoserver = new Geoserver("https://geoservices.atmosud.org/geoserver/");



cigale_theme_manager = function (){
	// FIXLE: doit être crée dans ou avans l'app !?
	console.log("CIGALE THEME MANAGER FNUCTION");
    
	// Si layer actif et layer emi_comm alors on l'update 
	if ( (typeof app.blocks.mapview.layers["emi_comm"] != "undefined") && ($("#chk-"+app.blocks.mapview.layers[app.active.layer].id)[0].checked == true) ) {
        console.log("UPDATING EMICOMM");
		cigale_infos_epci();
	};
    
    // Si la couche n'est pas affichée alors on affiche pas les émissions communales
    if ($("#chk-"+app.blocks.mapview.layers[app.active.layer].id)[0].checked == false) {
        console.log("ON SUPPRIME LES EMI COMM");
		app.blocks.mapview.layers["emi_comm"].remove(app.blocks.mapview.map);
		app.blocks.mapview.removeToLegend(app.blocks.mapview.layers["emi_comm"].id);	        
    };
    
};





// App conf
app = {
	theme_manager_special_func: cigale_theme_manager,
    get_territoire_app_function: 'cigale_infos_epci',
    server: geoserver,
    active: {
        theme: 1
    },
    lock: 1, 
    blocks: {
        // left: new Datablock("left-block", "#main-row", true, 4, null, {overflow: false, invert:"pull", new_row:"100"}), 
        // left_select: new Datablock("visualisation-select-territoires", "#visualisation-options", true, 4), 
        // select_zones: new Select("visualisation-select-territoires", "#visualisation-col-left", "api/liste_territoires.php", "Statistiques par EPCI", "zoom_territoire", "Mon territoire"),
        select_zones: new Select("visualisation-select-territoires", "#visualisation-col-left", "api/liste_territoires.php", "Statistiques par EPCI", "", "Mon territoire"),
        // choose_map: new Datablock("visulaisation-btn-map", "#visualisation-col-left", true, 8, "",{btn: {name: "Afficher la carte", action: "show_hide_blocks()"}, hidden_regex:"d-lg-none"}),
		left_layers: new Datablock("left-layers", "#visualisation-col-left", "manager", 12), 
        mapview: new Datablock("visualisation-col-map", "#visualisation-main-row", true, 8, "",{invert:"push", hidden_regex:"d-lg-block"}),                  
        // FIXME: Si on fait comme btn mais avec un create map on peut directement déclencher la création de la carte lors de la creation du block
		// report: new Datablock("report-block", "#main-row", "hide", 12),                                    
    },
    baseLayers: {
        Esri_WorldTopoMap: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            args: {
                // attribution: 'Tiles &copy; Esri &mdash; Esri',
                attribution: '',
                minZoom: 0,
                // maxZoom: 11,          
                maxZoom: 20,            
            }
        },       
        // GeoportailFrance_orthos: {
            // url: 'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',            
            // args: {
                attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
                // attribution: '',
                // bounds: [[-75, -180], [81, 180]],
                // minZoom: 12, // 15,
                // maxZoom: 20,
                // apikey: 'choisirgeoportail',
                // format: 'image/jpeg',
                // style: 'normal'
            // }
        // },
        // Esri_WorldTopoMap_fullzoom: {
            // url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            // args: {
                // attribution: '',
                // minZoom: 0,
                // maxZoom: 20           
            // }                       
        // },        

    },
    manager: {
        "Polluants atmosphériques": {
            id: 1,
            // desc: '<div class="p-large-black">Emissions de polluants atmosphériques tels que les oxydes d\'azote ou les particules fines.</div>',
            desc: '',
            actif: true,
            methodo: "../methodo.php",
            img: "",
            layers: {},
            default_layers: [
                "Emissions de NOx",
				"Emissions de NOx commune",
            ],
            info: false,
        },
        "Bilans énergétiques": {
            id: 2,
            // desc: '<div class="p-large-black">Consommations d\'énergie finale et production d\'énergie sur les territoires.</div>',
            desc: '',
            img: "",
            actif: false,
            methodo: "../methodo.php",
            layers:{},
            default_layers: [
                "Consommations d&#039;énergie finale",
                "Consommations d&#039;énergie finale commune",
            ],
            info: false,
        },
        "Gaz à effet de serre": {
            id: 3,
            // desc: '<div class="p-large-black">Recensement des surfaces épandables à diverses échelles et des plateformes de compostage en fonction des déchets traités et de leur capacités règlementaires.</div>',
            // desc: '<p></p>',
            desc: '',
            img: "",
            actif: false,
            methodo: "../methodo.php",
            layers:{},
            default_layers: [
                "Emissions de CO<sub>2</sub>",
                "Emissions de CO<sub>2</sub> commune",
            ],
            info: false,
        },      
    }
};


// Create checkbox for zonal statistics
// app.blocks.left_select.createcheck({id: "chk-stats", tolaunch: "app.blocks.mapview.map.manage_stats_button(\'chk-stats\')"});

// Create main map
app.blocks.mapview.createmap({
    // base_layers: [app.baseLayers.Esri_WorldTopoMap, app.baseLayers.GeoportailFrance_orthos], 
    base_layers: [app.baseLayers.Esri_WorldTopoMap], 
    draw: true, legend: true, coords: [43.9, 6.0], zoom: 8, 
    scale:true, mapclick:"reset_epci",
});
 

layers2create = {
    "nox": {manager: "Polluants atmosphériques", title: "Emissions de NOx", add_map: true, colorscale: ['#ffeda0', '#feb24c', '#f03b20']}, 
    "pm10": {manager: "Polluants atmosphériques", title: "Emissions de PM10", add_map: false, colorscale: ['#ffeda0', '#feb24c', '#f03b20']}, 
    // "pm2.5": {manager: "Polluants atmosphériques", title: "Emissions de PM2.5", add_map: false, colorscale: ['#ffeda0', '#feb24c', '#f03b20']}, 
    // "covnm": {manager: "Polluants atmosphériques", title: "Emissions de COVNM", add_map: false, colorscale: ['#ffeda0', '#feb24c', '#f03b20']},  
    // "so2": {manager: "Polluants atmosphériques", title: "Emissions de SO<sub>2</sub>", add_map: false, colorscale: ['#ffeda0', '#feb24c', '#f03b20']},  
    // "nh3": {manager: "Polluants atmosphériques", title: "Emissions de NH<sub>3</sub>", add_map: false, colorscale: ['#ffeda0', '#feb24c', '#f03b20']},  
    // "co": {manager: "Polluants atmosphériques", title: "Emissions de CO", add_map: false, colorscale: ['#ffeda0', '#feb24c', '#f03b20']}, 
    
    "conso": {manager: "Bilans énergétiques", title: "Consommations d&#039;énergie finale", add_map: false, colorscale: ['#fde0dd', '#fa9fb5', '#c51b8a']}, 
    // "prod": {manager: "Bilans énergétiques", title: "Production d&#039;énergie", add_map: false, colorscale: ['#fde0dd', '#fa9fb5', '#c51b8a']},     
    
    "co2": {manager: "Gaz à effet de serre", title: "Emissions de CO<sub>2</sub>", add_map: false, colorscale: ['#f9ebea', '#cd6155', '#cb4335']},     
    // "ch4.co2e": {manager: "Gaz à effet de serre", title: "Emissions de CH<sub>4</sub> eq.CO<sub>2</sub>", add_map: false, colorscale: ['#f9ebea', '#cd6155', '#cb4335']},        
    // "n2o.co2e": {manager: "Gaz à effet de serre", title: "Emissions de C<sub>2</sub>O eq.CO<sub>2</sub>", add_map: false, colorscale: ['#f9ebea', '#cd6155', '#cb4335']},        
    // "prg100.3ges": {manager: "Gaz à effet de serre", title: "PRG 100", add_map: false, colorscale: ['#f9ebea', '#cd6155', '#cb4335']},     
};




for (var alyr in layers2create) {
    
    app.manager[layers2create[alyr].manager].layers[layers2create[alyr].title] = 
        geoserver.lfCreateLayerWFS(
            layers2create[alyr].title, "cigale:epci_poll", app.blocks.mapview, layers2create[alyr].add_map, [0,20], 
            layers2create[alyr].manager, {
                cql_filter: "nom_abrege_polluant='"+alyr+"'",
                // dual: { 
                    // name: layers2create[alyr].title + " commune",
                // },
				zoomonclick: false, 
				territoireonclick: true, 
				popup: false,
                unique: true,
                // fonction: "modalRatios();",fonction_desc: "Modifier les ratios de mobilisation",
                legend_carriage: true, 
                legend_title: layers2create[alyr].title+"</br>2017 en kg/km<sup>2</sup>",
                name_field : "nom_epci",
                attributes_dict : {"nom_epci": "Nom EPCI", "siren_epci": "Code EPCI", "nom_abrege_polluant": "Polluant", "val": "Emissions"},
                style_dict: {
                    pane: 'front',
                    fillColor: "white", color: "black", weight: 0.5, 
                    opacity: 0.8, fillOpacity: 0.5,
                    jenks: {field: "val", njenks: 6, colorscale: layers2create[alyr].colorscale, param: "fillColor"},
                },            
                
            }
        );
   
};
 
// Create manager 
app.blocks.left_layers.createmanager(app.manager);

// Hide  map for starting on small sccreens but after init 
$("#visualisation-col-map").addClass("d-none");








// Function spécifique à l'application lancée quand on a sélectionné un territoire
function cigale_infos_epci(){
	console.log("CIGALE INFO EPCI")
    
    
	app.info_epci = true;

	app.blocks.mapview.get_territoire(app.territoire, app.territoire_token);
	
    
	// Changer le style du layer EPCI 
    // app.blocks.mapview.set_style(app.active_layer, {fillColor: "#ededed", color: "black", weight: 0.5, opacity: 0.8, fillOpacity: 0.8,});
    app.blocks.mapview.set_style(app.active.layer, {fillColor: "#ededed", color: "black", weight: 0.5, opacity: 0.8, fillOpacity: 0.8,});
    
	// Remove epci layers from legend 
	// FIXME: Mieux Maj legend;
	app.blocks.mapview.removeToLegend(app.blocks.mapview.layers[app.active.layer].id);
	
    // Ajouter une couche dynamique des émissions communales avec l'id_epci et polluants définis dans les params de l'appli 
	if (typeof app.blocks.mapview.layers["emi_comm"] != "undefined") {
		app.blocks.mapview.layers["emi_comm"].remove(app.blocks.mapview.map);
		app.blocks.mapview.removeToLegend(app.blocks.mapview.layers["emi_comm"].id);
	};
	
	geoserver.lfCreateLayerWFS(
		"emi_comm", "cigale:comm_poll", app.blocks.mapview, true, [0,20], 
		"NoTheme", {
			cql_filter: "siren_epci	= '"+ app.territoire_token + "' and " + app.blocks.mapview.layers[app.active.layer].cql_filter.replace("&cql_filter=",""), 
			zoomonclick: false, 
			territoireonclick: false, 
			popup: true,
			unique: false,
			// fonction: "modalRatios();",fonction_desc: "Modifier les ratios de mobilisation",
			legend_carriage: true, 
			legend_title: app.blocks.mapview.layers[app.active.layer].legend_title,
			name_field : "nom_comm",
			attributes_dict : {"nom_comm": "Nom Commune", "id_comm": "Code Commune", "nom_abrege_polluant": "Polluant", "val": "Emissions kg/km<sup>2</sup>"},
			style_dict: {
				pane: 'front',
				fillColor: "white", color: "black", weight: 0.5, 
				opacity: 0.8, fillOpacity: 0.5,
				jenks: {field: "val", njenks: 6, colorscale: app.blocks.mapview.layers[app.active.layer].style_orig.jenks.colorscale, param: "fillColor"},
			},            
			
		}
	);
	
	
}


function reset_epci(){
    
    
	if (app.info_epci == true) {
		console.log("RESET EPCI");
       

		// Remove layer emi_comm
		app.blocks.mapview.layers["emi_comm"].remove(app.blocks.mapview.map);
		app.blocks.mapview.removeToLegend(app.blocks.mapview.layers["emi_comm"].id);
        delete app.blocks.mapview.layers["emi_comm"];
	
		// Change EPCI layer style (and precedent if needed)
		app.blocks.mapview.set_style(app.active.layer, app.blocks.mapview.layers[app.active.layer].style_orig);

        // Si le layer est affiché alors on met à jour la légende.
        if ($("#chk-"+app.blocks.mapview.layers[app.active.layer].id)[0].checked == true) {
            app.blocks.mapview.addToLegend(app.blocks.mapview.layers[app.active.layer]["legend"].html);
        }

        if (typeof app.active.layer_precedent != "undefined") {

            // FIXME: Reset EPCI colors, Est-ce qu'on peut pas le faire directement pour tous les layers par défaut?
            app.blocks.mapview.set_style(app.active.layer_precedent, app.blocks.mapview.layers[app.active.layer_precedent].style_orig);		
            
            // Faut aussi faire les epci par défaut du thème
            for (var theme in app.manager){
                app.blocks.mapview.set_style(app.manager[theme].default_layers[0], app.blocks.mapview.layers[app.manager[theme].default_layers[0]].style_orig);	
            };
            
		};
        
        
        
		// Zoom to all EPCI layers
		app.blocks.mapview.map.fitBounds(app.blocks.mapview.layers[app.active.layer].layer.getBounds());
		
		// Remove layer territoire 
		app.blocks.mapview.layers["Territoire"].remove(app.blocks.mapview.map); 
		app.blocks.mapview.removeToLegend(app.blocks.mapview.layers["Territoire"].id);
		delete app["territoire"];
        
		// Reset select list 
		app.blocks.select_zones.reset();
		
		app.info_epci = false;
	};
}


