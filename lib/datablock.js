/* 
DataBlocks
Display html maps and dashboards easily
Romain Souweine - AtmoSud - 2019

FIXME: A chaque nouveau block faudrait en fait diretement créer un row avec l'id sinon on peut pas mettre des cols cote à cote
*/


function second_screen_display(id){
    // FIXME: Il faudrait l'enlever d'ici, et faire une fonction spécifique par app. 
    
	// Afficher la carte
	if (id == 1){
		$("#visualisation-col-left").addClass("d-none");
		$("#visualisation-col-left-footer").addClass("d-none");
		
		$("#visualisation-col-map").removeClass("d-none");
		$("#visualisation-col-map-header").removeClass("d-none");	
	
		// Refresh map
		app.blocks.mapview.map.invalidateSize();
		// app.blocks.mapview.map._onResize();		
	};
	// Revenir à la sélection
	if (id == 0){
		$("#visualisation-col-map").addClass("d-none");
		$("#visualisation-col-map-header").addClass("d-none");
		
		$("#visualisation-col-left").removeClass("d-none");
		$("#visualisation-col-left-footer").removeClass("d-none");
	}; 
};


function Datablock(name, element, activated, bs_col_size, function_to_launch, dict_args) {
    /*
    Ex. 
    db = new Datablock("plot_f", ".data-row", true, 4, 200, "test_dict");
    db.run({name: "toto"}, {overflow: true});
    */

    // FIXME: Which of these doesn't need to be global vars and can be safely passed in local scope?
    this.name = name;
    this.element = element;
    this.activated = activated;
    this.bs_col_size = bs_col_size;
    
    
    if (bs_col_size == "hide"){
        this.self_hide = true; 
    } else {
        this.self_hide = false;    
    };
    
	// FIXME passer layer manager en variable tempo?
    if ( (dict_args != null) && (dict_args.layers_manager == false) ) {this.layers_manager = false;} else {this.layers_manager = true;};
    if ( (dict_args != null) && (typeof dict_args.hidden_regex != "undefined") ) {var hidden_regex_class = dict_args.hidden_regex;} else {var hidden_regex_class = "";};
    
    // Creates object spinner and it's methods    
    this.spinner = new Spinner({opacity: 0.25, width: 2, color: "#6E6E6E", speed: 1.5, scale: 3, });
    
    this.spinstart = function(){
        this.spinner.spin(document.getElementById(this.name));
    };
    
    this.spinstop = function(){
        this.spinner.stop(document.getElementById(this.name));
    };
    
    this.show_hide = function(){
       
        if (this.self_hide == false) {
            console.log("HIDING " + this.name);
            $("#"+this.name).addClass("d-none"); 
            // $("#"+this.name).removeClass("d-lg-block");  
            this.self_hide = true;
        } else {
            console.log("SHOWING " + this.name);
            $("#"+this.name).removeClass("d-none");   
            // $("#"+this.name).addClass("d-lg-block");   
            this.self_hide = false;
        };        
        
        // if($('#chk-stats-gen').hasClass('active') == true){
            // $('#chk-stats-gen').removeClass('active');

            // $("#map-block").removeClass("d-none");
            // $("#left-block").removeClass("d-none");
            // $("#report-block").addClass("d-none");
        // }else{
            // $('#chk-stats-gen').addClass('active');

            // $("#left-block").addClass("d-none");
            // $("#map-block").addClass("d-none");
            // $("#report-block").removeClass("d-none");
            
            // rapport_geres();                
        // };        
        
        
        
        // Ancienne version ne semble pas fonctionner 
        
        /*
        if (this.self_hide == false) {
            $("#"+this.name).addClass("d-none"); 
            this.self_hide = true;
        } else {
           $("#"+this.name).removeClass("d-none");   
           this.self_hide = false;
        };
        */
    };
    
    this.create = function() { 
        // NOTE: btn_close = Si on veut une croix pour fermer l'élément et la fonction à lancer onClick. Ex: btn_close: "app.fonction_close_div"
        // FIXME: regrouper create et create_hidden en une seule fonction 
        // FIXME: Faut indiquer la fonction à lancer
        
        var html = '<div class="col-lg-'+bs_col_size+' bg-color-white datablock '+this.name+' '+hidden_regex_class+'" id="'+this.name+'"></div>';        
        $(html).appendTo(this.element); 
        if ( (dict_args != null) && (typeof dict_args.btn_close != "undefined") ){ 
            // $("#"+this.name).append('<button type="button" onclick="event.stopPropagation(); app.blocks.mapview.hide_show_legend();" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            $("#"+this.name).append('<button type="button" onclick="event.stopPropagation(); '+dict_args.btn_close+'(true);" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        };        

/* 		// Si bouton
		if ( (dict_args != null) && (typeof dict_args.btn != "undefined") ){ 
			// var html = '<button type="button" class="btn btn-outline-primary" onclick="'+dict_args.btn.action+'">'+dict_args.btn.name+'</button>';
			var html = '<button type="button" class="btn btn-outline-primary">'+dict_args.btn.name+'</button>';
			$('#'+this.name).append(html);
		}; */
    };
    
    this.create_hidden = function() {
        $('<div class="col-lg-'+bs_col_size+' bg-color-white datablock ' +this.name+ ' d-none" id="'+this.name+'"></div>').appendTo(this.element);    
        if ( (dict_args != null) && (typeof dict_args.btn_close != "undefined") ){ 
            // $("#"+this.name).append('<button type="button" onclick="event.stopPropagation(); dict_args.btn_close();" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            $("#"+this.name).append('<button type="button" onclick="event.stopPropagation(); '+dict_args.btn_close+'(true);" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        };
    };
        
    this.createmanager = function(manager) {
        
        // On enregistre le thème actif défini dans la config comme thème précédemment actif, pour la gestion des thèmes
        app.active.theme_before = app.active.theme;

        // var html = '<div class="row bg-color-white w-100" style="max-height:65vh; overflow:auto;margin:0%;padding:0%;">';
        
        // html += '<div class="col-lg-' + bs_col_size + ' bg-color-white datablock" id="' + this.name + '">';
        html = '<div class="col-lg-' + bs_col_size + ' bg-color-white datablock" id="' + this.name + '">';
        html += '<div class="list-group">';
        
        for (var theme in manager){
        
            if (manager[theme].actif == true){
                var actif = 'active'; 
                var collapsed='';
                var badge_class="badge-info";
            } else {
                var actif = '';
                var collapsed='collapse';
                var  badge_class="badge-info-collapsed";
            };
            
            // Header plus badge info (si demandé)
            // html += '<button type="button" id="ButtonTheme'+manager[theme].id+'" class="list-group-item list-group-item-action rounded-0 dropdown-toggle ' + actif + '" onclick="app.blocks.left_layers.managethemes('+manager[theme].id+');">'+theme+'<a href="'+manager[theme].methodo+'" class="badge badge-pill ' + badge_class + '" id="ThemeMethodo'+manager[theme].id+'">i</a></button>';
            if ( (typeof manager[theme].info == "undefined") || (manager[theme].info != false) ){
                html += '<button type="button" id="ButtonTheme'+manager[theme].id+'" class="list-group-item list-group-item-action rounded-0 dropdown-toggle ' + actif + '" onclick="app.blocks.left_layers.managethemes('+manager[theme].id+');">'+theme+'<a href="'+manager[theme].methodo+'" class="badge badge-pill ' + badge_class + '" id="ThemeMethodo'+manager[theme].id+'">i</a></button>';
            } else {
                html += '<button type="button" id="ButtonTheme'+manager[theme].id+'" class="list-group-item list-group-item-action rounded-0 dropdown-toggle ' + actif + '" onclick="app.blocks.left_layers.managethemes('+manager[theme].id+');">'+theme+'</button>';    
            };
        
            html += '<div class="'+collapsed+'" id="theme'+manager[theme].id+'"><div class="card card-body">';
            
            if (manager[theme].img != "") {
                html += '<img src="'+manager[theme].img+'" class="rounded-circle mx-auto d-block theme-img" alt="">';
            };
            
            html += manager[theme].desc;
            
            // Si fonction de recherche spécifique au thème - ETAPE 1
            if (typeof manager[theme].select != "undefined"){        
                html += '<div id="select-zone-theme-'+manager[theme].id+'"></div>';            
            };
            
            for (var layer in manager[theme].layers){

                // Si on souhaite un header avant le layer
                if (app.blocks.mapview.layers[layer].header != false) {
                    html += '<div class="layer-sous-onglet">'+app.blocks.mapview.layers[layer].header+'</div>';
                };
                      
                if ( (app.blocks.mapview.layers[layer].actif == true) && (manager[theme].actif == true) (app.blocks.mapview.layers[layer].typename != "En cours de construction")){
                    var status =  " checked";
                }else {
                    var status =  "";
                }; 
                
                
                if (this.layers_manager == true){
                    
                    if (app.blocks.mapview.layers[layer].visible == true) {var hide="";} else {var hide="invisible invisible-size d-none";};
                    html += '<li class="list-group-item layer '+hide+'" id="lyr-'+app.blocks.mapview.layers[layer].id+'" data-toggle="tooltip" title="">'+layer;
                    
                    // DUAL LAYERS
                    if (app.blocks.mapview.layers[layer].multi_style != false){
                        
                        // Création des différentes unités dispo pour le layer et renvoie vers la fonction de style
                        html += '    </br>';
                        html += '    <div class="btn-group btn-group-toggle" data-toggle="buttons">';
                        for (var is in app.blocks.mapview.layers[layer].multi_style){
                            if (is == 0){
                                var checked = "checked";
                                var active = "active"
                            }else{
                                var checked = "";
                                var active = "";
                            };

                            html += '      <label class="btn btn-secondary '+active+' btn-outline-secondary btn-xs" onclick=\'app.blocks.mapview.change_style("'+layer+'", "'+is+'")\'>';
                            html += '        <input type="radio" name="options" autocomplete="off" '+checked+' >'+app.blocks.mapview.layers[layer].multi_style[is].name+'';
                            html += '      </label>';
                        };
                        html += '    </div>';                                                                        
                    };   
                    
                    // Checkbox d'affichage de la couche
                    html += '    <label class="switch ">';
                    html += '        <input type="checkbox" id="chk-'+app.blocks.mapview.layers[layer].id+'" class="info " '+status+' onclick=\'app.blocks.mapview.managelayer("'+layer+'")\'>';
                    html += '        <span class="slider round" id="sld-'+app.blocks.mapview.layers[layer].id+'"></span>';
                    html += '    </label>';
                    
                    // Bouton pour lancer une fonction spécifique liée à la couche
                    if (app.blocks.mapview.layers[layer].fonction_desc != false){
                        html += '       <div><a href="#" class="badge badge-secondary" onclick="'+app.blocks.mapview.layers[layer].fonction+'">'+app.blocks.mapview.layers[layer].fonction_desc+'</a></div>';
                    };   

                    html += '</li>';
                    
                };
            };
            
            html += '</div></div>';             
                       
        };
        
        html += '</div>';    
        html += '</div>'; 
        
        // html += '</div>';    

        $(html).appendTo(this.element); 

        
        // Si fonction de recherche spécifique au thème - ETAPE 2
        for (var theme in manager){
            if (typeof manager[theme].select != "undefined"){
                var select_zone_id = new Date(Date.now()).getTime();
                app.blocks["left-select-"+select_zone_id] = new Datablock("left-select-"+select_zone_id, "#select-zone-theme-"+manager[theme].id, true, 12); 
                app.blocks.select_zones = new Select("select-"+manager[theme].id, "#left-select-"+select_zone_id, manager[theme].select.script, "Rechercher un site", "recherche_site", "Rechercher un site", {show_token:true,});                                     
            };        
        };
        
        layersVisibility(app.blocks.mapview.map.getZoom());
        
    };
    
    this.createcheck = function(dict_args){
        
        var html = '<div class="select-header">Ou je défini ma zone</div>';
        html += '<label class="switch-center">';
            html += '<input type="checkbox" id="'+dict_args.id+'" class="info " onclick="'+dict_args.tolaunch+'">';
            html += '<span class="slider round"></span>';
        html += '</label>';
       
        $(html).appendTo(this.element);         
    };
    
    this.set_text = function(html){
        $(html).appendTo(this.element); 
    };

    this.append_text = function(html){
        $('#'+this.name).append(html);
    };
    
    this.change_style = function(main_layer, status){ 
        
        function change_each_layer(the_layer){
            app.blocks.mapview.layers[the_layer].layer.eachLayer(function (layer) { 
            
                layer.setStyle({  
                    fillColor: app.blocks.mapview.layers[the_layer].getClasse(layer.feature.properties[app.blocks.mapview.layers[the_layer].multi_style[status].style.classes.field], 
                    app.blocks.mapview.layers[the_layer].multi_style[status].style.classes.grades)[1]   
                }); 
                
                app.blocks.mapview.removeToLegend(app.blocks.mapview.layers[the_layer].typename.split(":")[1]+app.blocks.mapview.layers[the_layer].id_prefix); 
                app.blocks.mapview.layers[the_layer]["legend"]["html"] = app.server.getLegendWFS(
                    app.blocks.mapview.layers[the_layer].typename, 
                    app.blocks.mapview.layers[the_layer].typename.split(":")[1]+app.blocks.mapview.layers[the_layer].id_prefix, 
                    app.blocks.mapview.layers[the_layer].name, 
                    app.blocks.mapview.layers[the_layer].legend_carriage, 
                    app.blocks.mapview.layers[the_layer].multi_style[status].style
                ); 

                if (app.blocks.mapview.layers[the_layer].layer.options.minZoom > app.blocks.mapview.map.getZoom() || app.blocks.mapview.map.getZoom() > app.blocks.mapview.layers[the_layer].layer.options.maxZoom) {
                } else {
                    if (app.blocks.mapview.layers[the_layer].actif == true){
                        app.blocks.mapview.addToLegend(app.blocks.mapview.layers[the_layer]["legend"].html);
                    };
                };
            });             
        };
        
        change_each_layer(main_layer);
        app.blocks.mapview.layers[main_layer].active_style = status;
        
        if (app.blocks.mapview.layers[main_layer].dual != false){
            change_each_layer(app.blocks.mapview.layers[main_layer].dual.name);
            app.blocks.mapview.layers[app.blocks.mapview.layers[main_layer].dual.name].active_style = status;
        };
        
    };
    
    this.set_style = function(the_layer, style_dict) { 
		
        // Change le style d'un layer en indiquant un dictionnaire de styles
        app.blocks.mapview.layers[the_layer].layer.eachLayer(function (layer) { 
					
			if (typeof style_dict.jenks != "undefined"){
				style_dict[style_dict.jenks.param] = find_jenks_color(app.blocks.mapview.layers[the_layer].style_orig.jenks_calcules, layer.feature.properties[style_dict.jenks.field]);
			};		
		
            layer.setStyle(style_dict);  
        });
    };
    
    this.managethemes = function(id){
        console.log("MANAGE THEMES");
        
        // Pour chaque thème déclaré dans l'app 
        for (var theme in app.manager){
            // Si theme sur lequel on a cliqué
            if (app.manager[theme].id == id){

                // On déclare le thème actif dans l'app et dans l'objet lui-même
                app.manager[theme].actif = true;
                app.active.theme = theme;
                
                if ( $("#theme"+app.manager[theme].id).hasClass("collapse") == true ) {
                    // Si thème fermé on l'ouvre
                    $("#theme"+app.manager[theme].id).removeClass("collapse");
                    $("#ButtonTheme"+app.manager[theme].id).addClass("active");
                    
                    $("#ThemeMethodo"+app.manager[theme].id).removeClass("badge-info-collapsed");
                    $("#ThemeMethodo"+app.manager[theme].id).addClass("badge-info");                     
                } else {
                    // Si thème ouvert on le ferme
                    $("#theme"+app.manager[theme].id).addClass("collapse");
                    $("#ButtonTheme"+app.manager[theme].id).addClass("active");
                    
                    $("#ThemeMethodo"+app.manager[theme].id).addClass("badge-info-collapsed");
                    $("#ThemeMethodo"+app.manager[theme].id).removeClass("badge-info");                      
                };
               

                // Si le thème n'est pas le thème actif alors on check les layers
                if (app.lock == 1) {
                    if (app.active.theme_before != app.manager[theme].id) {

                        // Pour chaque layer déclaré dans la carte
                        for (layer in app.blocks.mapview.layers){

                            if (typeof app.manager[app.blocks.mapview.layers[layer].theme] !== 'undefined') {
                            
                                // Si la layer appartient au thème et doit être actif par défaut on l'active
                                if ((app.manager[app.blocks.mapview.layers[layer].theme].id == id) && (app.blocks.mapview.layers[layer].actif == false) && (app.manager[app.blocks.mapview.layers[layer].theme].default_layers.indexOf(app.blocks.mapview.layers[layer].name) > -1) ){
                                    this.addLayer(layer);
                                } else {
                                        // On enlève tous les autres layers de la carte
                                        this.removeLayer(layer);
                                        if (    (this.layers_manager == true) && (app.blocks.mapview.layers[layer].typename != "En cours de construction")   ) {
											$("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked = false;
                                        };
                                };

                            };
                        };

                    };
                };
                
                // Si c'est la première fois que l'on clique sur ce thème alors on pointe
                if (app.active.theme_before != app.manager[theme].id) {
                    app.active.theme_before = app.manager[theme].id;
                };

            // Si un autre thème, alors on le ferme.
            } else {
                app.manager[theme].actif = false;
                $("#theme"+app.manager[theme].id).addClass("collapse");
                $("#ButtonTheme"+app.manager[theme].id).removeClass("active");  

                $("#ThemeMethodo"+app.manager[theme].id).removeClass("badge-info");
                $("#ThemeMethodo"+app.manager[theme].id).addClass("badge-info-collapsed");                
            };
        };				
        
        layersVisibility(app.blocks.mapview.map.getZoom());
		
		// Si l'app indique une fonction spécifique pour le manager de thèmes, on l'active
		if (typeof app.theme_manager_special_func != "undefined") {
			// FIXME: Meilleure méthode pour call un fonction !!
            console.log("THEME MANAGER SPECIFIC FUNCTION");
			app.theme_manager_special_func.call();			
		};	
    };

    this.managelayer = function(layer){
        console.log("MANAGE LAYER");
        
        // Gestion des "'" dans le nom du layer
        var layer = layer.replace("'","&#039;");
        
        if ($("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked == true){
            this.addLayer(layer);
            if (app.blocks.mapview.layers[layer].dual != false){  
                this.addLayer(app.blocks.mapview.layers[layer].dual.name); 
                $("#chk-"+app.blocks.mapview.layers[app.blocks.mapview.layers[layer].dual.name].id)[0].checked = true;
            };    

            // Si layer unique alors on enlève tous les autres et on l'enregistre dans l'application
            if (app.blocks.mapview.layers[layer].unique == true){
                for (var alayer in app.blocks.mapview.layers) {
                    if ( (alayer != layer) & (app.blocks.mapview.layers[layer].dual.name != alayer) & (alayer != "Territoire")) {

                        this.removeLayer(alayer);

                        // Uncheck the layers only if it has a checkbox
                        if ($("#chk-"+app.blocks.mapview.layers[alayer].id).length > 0) {
                            $("#chk-"+app.blocks.mapview.layers[alayer].id)[0].checked = false;
                        };

                    };
                };
				
                // On enregistre le layer précédent et le layer actif
                app.active.layer_precedent = app.active.layer;
				app.active.layer = layer;
            };
    
        } else {
            this.removeLayer(layer);
            if (app.blocks.mapview.layers[layer].dual != false){  
                this.removeLayer(app.blocks.mapview.layers[layer].dual.name);                
                $("#chk-"+app.blocks.mapview.layers[app.blocks.mapview.layers[layer].dual.name].id)[0].checked = false;
            };
        };
        
        // Si le layer est actif et que l'application demande une fonction spécifique on la lance
        if (typeof app.theme_manager_special_func != "undefined") {
            app.theme_manager_special_func.call();
        };
    
    };
    
    this.addLayer = function(layer){      

        if (app.blocks.mapview.layers[layer].typename == "En cours de construction") {
            return;
        };
        
        if (app.blocks.mapview.layers[layer].theme == app.active.theme) {        
            if (this.layers_manager == true) {
                if ($("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked == false){
                    $("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked = true;
                };       
            };
            
            // On ajoute le layer à la carte uniquemment si il est visible
            if (app.blocks.mapview.layers[layer].layer.options.minZoom > app.blocks.mapview.map.getZoom() || app.blocks.mapview.map.getZoom() > app.blocks.mapview.layers[layer].layer.options.maxZoom) {
            } else {
                app.blocks.mapview.layers[layer].layer.addTo(app.blocks.mapview.map);
                app.blocks.mapview.layers[layer].actif = true;
                
				if (app.blocks.mapview.layers[layer]["legend"] != null){
                    app.blocks.mapview.addToLegend(app.blocks.mapview.layers[layer]["legend"].html); 
                };
				
				// Si le layer est unique on l'enregistre dans l'app 					
				if (app.blocks.mapview.layers[layer].unique != false){
					app.active.layer_precedent = app.active.layer;
                    app.active.layer = layer; 
				};				
            };
      
        };
    };

    this.removeLayer = function(layer, invisible){
        if (app.blocks.mapview.layers[layer].typename != "En cours de construction") {
            app.blocks.mapview.map.removeLayer(app.blocks.mapview.layers[layer].layer);
            app.blocks.mapview.removeToLegend(app.blocks.mapview.layers[layer].id);
            app.blocks.mapview.layers[layer].actif = false;
        };
    };
    
    this.run = function(args_dict){
        if (function_to_launch != undefined) {
            window[function_to_launch](args_dict);
        };
    };
   
    this.hide_show_legend = function(){ 
    
        console.log("HIDE SHOW LEGEND");
        // L.DomEvent.stop(e);
    
        if (app.legend_hidden == false) {
            app.legend_hidden = true;            
            $(".legend").addClass("d-none");
            $(".legend-hidden").removeClass("d-none");
            console.log("LEGEND HIDDEN");
        } else {    
            app.legend_hidden = false; 
            $(".legend-hidden").addClass("d-none");
            $(".legend").removeClass("d-none");            
            console.log("LEGEND DISPLAY");
        };
    };

    this.createmap = function(dict_args){
    
        var map = L.map(this.name, {
            zoomControl:false, 
            layers: [],
            minZoom: 0,
            maxZoom: 19,
            // crs: L.CRS.CustomZoom,
        });

        // Gestion de la loc et du zoom de départ
        if (typeof dict_args["coords"] != "undefined") {
            var coords = dict_args["coords"];
        } else {
            var coords = [43.9, 6.0]
        };

        if (typeof dict_args["zoom"] != "undefined") {
            var zoom = dict_args["zoom"];
        } else {
            var zoom = 8
        };
        
        map.setView(coords, zoom);
        
        // Si l'on souhaite directement zoomer sur une couche (doit exister)
        if (typeof dict_args["zoom_to_layer"] != "undefined") {
            map.fitBounds(app.blocks.mapview.layers[dict_args["zoom_to_layer"]].layer.getBounds());
        };       
        
        if ( (typeof dict_args["attributions"] != "undefined") && (dict_args["attributions"] == false) ) {
            map.attributionControl.setPrefix("");
        } else {
            map.attributionControl.setPrefix('AtmoSud <a target="_blank" href="https://leafletjs.com/">Leaflet</a>, fonds de carte <a target="_blank" href="https://www.esri.com/">&copy; Esri</a> & <a target="_blank" href="https://www.geoportail.gouv.fr/">&copy; Geoportail France</a>');
        };
        
        for (var alayer in dict_args["base_layers"]){
            var info = dict_args["base_layers"][alayer]
            new L.tileLayer(info.url, info.args).addTo(map);
        };        
        
        // Reference map object and map layers in datablock objects
        this.map = map; 
        this.legend = dict_args.legend;
        app.legend_hidden = false;
        this.layers = {};

        // Creates legend if asked
        if ( (typeof dict_args.legend != "undefined") && (dict_args.legend == true) ){
        
            // Légende
            this.map.legend = L.control({position: 'bottomright'});
            this.map.legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'legend');
                div.innerHTML = '<button type="button" onclick="event.stopPropagation(); app.blocks.mapview.hide_show_legend();" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                return div;
            };
            this.map.legend.addTo(this.map); 
           
            // Légende cachée            
            this.map.legend_hidden = L.control({position: 'bottomright'});
            this.map.legend_hidden.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'legend-hidden');
                div.innerHTML = '<button type="button" onclick="event.stopPropagation(); app.blocks.mapview.hide_show_legend();" class="close" aria-label="Close"><span aria-hidden="true"><div style="font-size:12px;">Légende&nbsp;&nbsp;&loz;</div></span></button>';               
                return div;
            };
            this.map.legend_hidden.addTo(this.map);            
            $(".legend-hidden").addClass("d-none");
        };
          
        // Si titre
        if ( (typeof dict_args.title != "undefined") && (dict_args.title != false) ){
            this.map.title = L.control({position: 'topleft'});
            this.map.title.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'legendes');
                div.innerHTML = dict_args.title;
                return div;
            };
            this.map.title.addTo(this.map);         
        };

        // Listen zoom
        this.map.on('zoomend', function() {
            layersVisibility(map.getZoom());
        }); 
    
        // Si on demande une action on click
        if (typeof dict_args.mapclick != "undefined"){
            this.map.on('click', function(){
				window[dict_args.mapclick]();
            });
        };
 
        // Objet géographique du territoire sélectionné et fonction d'affichage
        this.get_territoire = function(val, token){   
		
			console.log("--> GET TERRITOIRE <--")
			
            // Si aucun territoire sélectioné alors on exit
            // if (typeof app.territoire == "undefined") {
                // console.log("NO TERRITOIRE EXITING");
                // return;
            // };
                    
			console.log("GET TERRITOIRE");	
			console.log(val, token);
						
            // Gestion du filtre pour ne sélectionner que l'entité géographique demandé
            // var val = val.replace("'", "''");
            // FIXME: Si on boucle plusieurs fois sur un territoire avec "'" on va finir par en avoir des centaines "''''''''''''...."
            // var val = val.replace(/'/g, "''");
            if (val.indexOf("''") == -1){
				var val = val.replace("'", "''");
			};
            var cql_filter = "lib_entite like '"+val+"'"; 
			
            // Sauvegarde du territoire dans les paramètres de l'appli pour réutilisation
            app.territoire = val;
            app.territoire_token = token;
            app.territoire_cql_filter = cql_filter;
			
            // Nettoyage du layer
            if (typeof app.blocks.mapview.layers["territoire"] !== 'undefined'){
                // if ( (app.blocks.mapview.layers["Territoire"].name != "territoire utilisateur") && (app.blocks.mapview.layers["Territoire"].name != "Territoire") ) {
                if (app.blocks.mapview.layers["territoire"].name != "territoire utilisateur")  {
                    console.log("CLEARING TERRITOIRE LAYER");
					app.blocks.mapview.layers["territoire"].layer.clearLayers();
                }else{
                    drawnItems.clearLayers();
                };
            };            

            geoserver.lfCreateLayerWFS("territoire", "cigale:entites", app.blocks.mapview, true, [0,20], "NoTheme", {
                fixed_id: "the_territoire",
				cql_filter: cql_filter,
                popup: false,
                mouseover: false,
                in_legend: true,
                zoom: true,
				zoomonclick: true,
                style_dict: {
                    pane: 'defaut',
                    fillColor: "#ffffff", 
                    color: "#25a4f2", 
                    weight: 5, opacity: 1, fillOpacity: 0.0,
                },               
            }); 
           
            // Selon l'application, on lance une fonction spécifique définie dans les paramètres de l'appli
            // if (typeof app.get_territoire_app_function != "undefined"){
                // window[app.get_territoire_app_function]();
            // };  
        };

        // Draw tools if needed
        if ( (dict_args != null) && (dict_args.draw == true) ) {
       
            var drawnItems = new L.FeatureGroup();
            drawnItems = L.featureGroup().addTo(this.map);
            this.map.addLayer(drawnItems);

            // Creates button
            L.drawLocal.draw.toolbar.buttons.circle = 'Définir une zone personnalisée';
            L.drawLocal.draw.handlers.circle.tooltip.start = 'Cliquer puis laisser appuyé pour définir une zone';
            
            var drawControl = new L.Control.Draw({
                position: 'topleft',
                // draw: false,
                draw: {
                    polyline: false,
                    polygon: false,
                    rectangle: false,
                    marker: false,        
                    circlemarker: false,        
                    circle: {shapeOptions: {pane:"defaut",color: '#25a4f2',fillColor: "red",weight: 5, opacity: 1, fillOpacity: 0.0,}}, //FIXME: Ne fonctionne que si on clique sur le cercle 
                },    
                edit: {
                    featureGroup: drawnItems,
                    // remove: false,                    
                }
            });
            
            this.drawControl = drawControl;

            this.map.on(L.Draw.Event.CREATED, function (e) {
                
                // Clear everything
                drawnItems.clearLayers();
                if (typeof app.blocks.mapview.layers["territoire"] !== 'undefined'){
                    app.blocks.mapview.map.removeLayer(app.blocks.mapview.layers["territoire"].layer);
                };                
                    
                var layer_drawn = e.layer;
                layer_drawn.setStyle({pane:"defaut",color: '#25a4f2',fillColor: "red",weight: 5, opacity: 1, fillOpacity: 0.0,});
                
                drawnItems.addLayer(layer_drawn);
                
                app.blocks.mapview.layers["territoire"] = {
                    name: "territoire utilisateur", 
                    type:"wfs",
                    block: app.blocks.mapview,
                    layer: layer_drawn, 
                    actif: true, 
                    theme: "NoTheme",  
                };                

                app.blocks.mapview.map.fitBounds(app.blocks.mapview.layers["territoire"].layer.getBounds());
                
                // Sauvegarde du territoire dans les paramètres de l'appli pour réutilisation
                app.territoire = "radius";
                app.territoire_token = "radius";
                app.territoire_cql_filter = "";
                var theCenterPt = layer_drawn.getLatLng();                
                app.territoire_center = [theCenterPt.lng,theCenterPt.lat];    
                app.territoire_radius = layer_drawn.getRadius();                 
            });

            this.map.on('draw:edited', function (e) {
                
                var layers = e.layers; 
                
                layers.eachLayer(function(layer) { 
                    var layer_drawn = layer;
                    
                    app.blocks.mapview.layers["territoire"] = {
                        name: "territoire utilisateur", 
                        type:"wfs",
                        block: app.blocks.mapview,
                        layer: layer_drawn, 
                        actif: true, 
                        theme: "NoTheme",  
                    };  
                });                
                
             });            
            
            this.map.on(L.Draw.Event.EDITSTOP, function (e) {
                
                // Sauvegarde du territoire dans les paramètres de l'appli pour réutilisation
                app.territoire = "radius";
                app.territoire_token = "radius";
                app.territoire_cql_filter = "";
                var theCenterPt = layer_drawn.getLatLng();                
                app.territoire_center = [theCenterPt.lng,theCenterPt.lat];    
                app.territoire_radius = layer_drawn.getRadius();    
                
                app.blocks.mapview.map.fitBounds(app.blocks.mapview.layers["territoire"].layer.getBounds());
                
            });
         
            // Creates function to manage buttons
            this.map.manage_stats_button = function(div_id){
                 
                if ($("#"+div_id)[0].checked == true){
                    app.blocks.mapview.map.addControl(app.blocks.mapview.drawControl);
                    new L.Draw.Circle(app.blocks.mapview.map, app.blocks.mapview.drawControl.options.circle).enable();
                } else {
                   app.blocks.mapview.map.removeControl(app.blocks.mapview.drawControl);
                   // drawnItems.clearLayers();
                };                
                
            };

            // Button default state
            // FIXME: Spécific à l'application GERES, n'a rien à faire ici
            if (typeof $("#chk-stats")[0] != "undefined"){
                $("#chk-stats")[0].checked = false;
            };
            
            // DOC!: To activate draw control: new L.Draw.Circle(this.map, drawControl.options.circle).enable();
			
			// TODO: Mettre l'entité dans la  liste si on demande une liste synchro en définissant l'objet lliste et en filant  le token ou ma val
			
        };

       // Map printer 
       this.printer = L.easyPrint({
            title: 'Enregistrer la carte',
            tileLayer: dict_args["base_layers"]["Esri_WorldTopoMap_fullzoom"],
            tileWait: 5000000,
            position: 'topleft',
            sizeModes: ['Current'], // FIXME: Custom size objetc?
            filename: 'cigale.metha.map',
            exportOnly: true,
            hideControlContainer: false,
            hidden:true,
            hideClasses: [], // FIXME: On peut peut-être l'utiliser pour cacher block gauche
        }).addTo(this.map);
        
        this.print_map = function(){
            
            // NOTE: TEST 1
            // this.printer.printMap('CurrentSize', 'cigale.map');
            
            // NOTE: TEST 2
            // $("#left-block").addClass("d-none"); 
            // $("#map-block").removeClass("col-lg-8");
            // $("#map-block").addClass("col-lg-12"); 
            // app.blocks.mapview.map.invalidateSize();
            
            // this.printer.printMap('CurrentSize', 'cigale.map');
            
            // $("#map-block").removeClass("col-lg-12");
            // $("#map-block").addClass("col-lg-8");  
            // $("#left-block").removeClass("d-none"); 
            // app.blocks.mapview.map.invalidateSize(); 
            
            
            // NOTE: TEST 3
            function map_full_size(_callback){
                $("#map-block").removeClass("col-lg-8");
                $("#map-block").addClass("col-lg-12"); 
                app.blocks.mapview.map.invalidateSize();                

                _callback();    
            };

            function print_map(){
                map_full_size(function() {
                    
                    app.blocks.mapview.printer.printMap('CurrentSize', 'cigale.map');
                    $("#map-block").removeClass("col-lg-12");
                    $("#map-block").addClass("col-lg-8");  
                    $("#left-block").removeClass("d-none"); 
                    app.blocks.mapview.map.invalidateSize();                     
                });    
            };
            
            print_map();
        };

        // Si l'utilisateur veur récup les coordonnées au click
        if (typeof dict_args["coords_click"] != "undefined") {
            this.map.on('click', function(e) {
                console.log("MAP CLICL");
                popup_coords = new L.Popup();
                var popupContent = "Lat : " + e.latlng.lat + ", Lon : " + e.latlng.lng;
                popup_coords.setLatLng([e.latlng.lat, e.latlng.lng]);
                popup_coords.setContent(popupContent);
                map.openPopup(popup_coords);                
                
            });
        };

        // Map panes
        this.map.createPane('front');
        map.getPane('front').style.zIndex = 650;
        map.getPane('front').style.pointerEvents = 'none';
        
        this.map.createPane('defaut');
        map.getPane('defaut').style.zIndex = 400;
        map.getPane('defaut').style.pointerEvents = 'none';            
        
        this.map.createPane('top');
        map.getPane('top').style.zIndex = 660;
        map.getPane('top').style.pointerEvents = 'none';                  
        
        // Disable drag / zoom if needed
        if (    (typeof dict_args["no_drag"] != "undefined") && (dict_args["no_drag"] == true)  ){
            this.map.dragging.disable();
        };               
        
        if (    (typeof dict_args["no_zoom"] != "undefined") && (dict_args["no_zoom"] == true)  ){
            this.map.touchZoom.disable();
            this.map.doubleClickZoom.disable();
            this.map.scrollWheelZoom.disable();
        };   
        
        // Add Scalebar
        if (    (typeof dict_args["scale"] != "undefined") && (dict_args["scale"] == true)  ){
            L.control.scale({imperial:false}).addTo(this.map);         
        };
		
		// FIXME: Pour le geres
		app.blocks.mapview.layers["territoire"]
       
    };
    
    layersVisibility = function(zoom_level){
        
        // Uniquement pour le theme
        for (var theme in app.manager){
            
            if (app.manager[theme].actif == true){
                
                app.active.theme = theme;
                
                for (var layer in app.manager[theme].layers){ // Uniquement pour les layers du theme actif
                        
                    if (app.blocks.mapview.layers[layer].typename == "En cours de construction") {
                        $("#lyr-"+app.blocks.mapview.layers[layer].id).addClass("layer-invisible");
                        $("#lyr-"+app.blocks.mapview.layers[layer].id).prop('title', app.blocks.mapview.layers[layer].tooltip);
                        $("#chk-"+app.blocks.mapview.layers[layer].id).prop("disabled", true);
                        continue; 
                    };
                    
                    // Si le layer n'est pas visible à ce niveau de zoom, on l'enlève mais laisse la check cochée.
                    if (app.blocks.mapview.layers[layer].layer.options.minZoom > zoom_level || zoom_level > app.blocks.mapview.layers[layer].layer.options.maxZoom) {
                                               
                        // Disable seulement si pas dual (deux layers en un avec différents niveaux de zoom)
                        if (app.blocks.mapview.layers[layer].dual == false){
                            $("#lyr-"+app.blocks.mapview.layers[layer].id).addClass("layer-invisible");
                            $("#lyr-"+app.blocks.mapview.layers[layer].id).prop('title', 'Non visible à cette échelle');
                            // $("#sld-"+app.blocks.mapview.layers[layer].id).css("background-color", "#CCCCCC");
                            $("#chk-"+app.blocks.mapview.layers[layer].id).prop("disabled", true);
                        };
                        
                        app.blocks.mapview.layers[layer].block.removeLayer(app.blocks.mapview.layers[layer].name, true);
                    } else {
                        // Si layer visible                       
                        $("#lyr-"+app.blocks.mapview.layers[layer].id).removeClass("layer-invisible");
                        $("#lyr-"+app.blocks.mapview.layers[layer].id).prop('title', '');
                        
                        $("#chk-"+app.blocks.mapview.layers[layer].id).prop("disabled", false);

                        // Si layer caché mais checkbox checked on l'affiche 
                        if ( ($("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked == true) && (app.blocks.mapview.layers[layer].actif == false) ){
                           app.blocks.mapview.layers[layer].block.addLayer(app.blocks.mapview.layers[layer].name);
                        };
                        
                        if ( (app.blocks.mapview.layers[layer].actif == true) && ($("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked == false) ){
                           $("#chk-"+app.blocks.mapview.layers[layer].id)[0].checked = true;
                        };                        
                        
                    };
          
                }; 
        
            };
        };
    };
    
    this.addToLegend = function(div){
        if (this.legend == true){
            this.map.legend.getContainer().innerHTML += div;
        };
    };
    
    this.removeToLegend = function(div_id){   
        if (this.legend == true){
            $("#" + div_id).remove();           
        };
    };
 
    this.activate_report_col = function(){

        // Gestion de l'affichage du rapport
        if($('#chk-stats-gen').hasClass('active') == true){
            $('#chk-stats-gen').removeClass('active');

            $("#map-block").removeClass("d-none");
            $("#left-block").removeClass("d-none");
            $("#report-block").addClass("d-none");
        }else{
            $('#chk-stats-gen').addClass('active');

            $("#left-block").addClass("d-none");
            $("#map-block").addClass("d-none");
            $("#report-block").removeClass("d-none");
            
            rapport_geres();                
        };

        /*
        solution = 1;

        if (solution == 1){
        
            // NOTE: On remplace la carte par le rapport
            if ($("#chk-stats-gen")[0].checked == true){
                $("#left-block").addClass("d-none");
                $("#map-block").addClass("d-none");
                $("#report-block").removeClass("d-none");
                rapport_geres();
            } else {
                $("#map-block").removeClass("d-none");
                $("#left-block").removeClass("d-none");
                $("#report-block").addClass("d-none");  
            };
            
        } else {
            
            // NOTE: Solution 2 avoir la carte à côté du rapport. 
            // FIXME: Soucis de scroll!
            if ($("#chk-stats-gen")[0].checked == true){
                $("#left-block").addClass("d-none"); 
                
                $("#map-block").removeClass("col-lg-8");
                $("#map-block").addClass("col-lg-6");
                
                $("#report-block").removeClass("d-none");
                
                rapport_geres();
                
                app.blocks.mapview.map.invalidateSize();
                app.blocks.mapview.map.fitBounds(app.blocks.mapview.layers["territoire"].layer.getBounds());
            } else {
                $("#report-block").addClass("d-none");  
                
                $("#left-block").removeClass("d-none"); 
                
                $("#map-block").removeClass("col-lg-6");
                $("#map-block").addClass("col-lg-8"); 
                
                app.blocks.mapview.map.invalidateSize();
                app.blocks.mapview.map.fitBounds(app.blocks.mapview.layers["territoire"].layer.getBounds());
            };  

        };
        */
    };
   
    modalRatios = function(){
        
        
		$.ajax({
			type: "GET", 
			url: "api/geres.ratios_mob_defaut.php",
			dataType: 'json',  
            beforeSend:function(jqXHR, settings){
                // jqXHR.obj = this;    
            },            
			success: function(response,textStatus,jqXHR){

                // FIXME: Devrait être spécifique à GERES dans un autre script
                $('#urlModalTitle').html('Modification des ratios MOB<a href="../methodo.php" class="badge badge-pill badge-info-collapsed">i</a>');
                
                // Corps
                var html = '';

                for (i in response) {        
                    html += '<div class="input-group input-group-sm mb-3">';
                    html += '<div class="input-group-prepend" style="width:350px;">';
                    html += '<span class="input-group-text" id="inputGroup-sizing-sm" style="width:350px;">'+response[i].nom_param+'</span>';
                    html += '</div>';
                    html += '<input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value="'+response[i].ratio_mobilisation_pct+'">';
                    html += '<div class="input-group-prepend">';
                    html += '<span class="input-group-text" id="inputGroup-sizing-sm">%</span>';
                    html += '</div>';
                    html += '</div>';
                };
                
                $('#urlModalContent').html(html);
                
                // Appel
                $("#urlModal").modal();            
            },
        
        });
    };
 
    // Activation if asked
    if (this.activated == true) {
        this.create();
    }; 
    
    // Si on est sur un block graphique alors on lance la fonction graphiques 
    // NOTE: Faut que chaque graphique soit indépendant et dans un bloc.
    // NOTE: Donc on fait bien une forme de graph header qui permet d'afficher des stats et un texte dans un block.
    if ( (typeof dict_args != "undefined") && (typeof dict_args.graphique != "undefined") ) {
        
        switch(dict_args.graphique.type) {
            case "header":
                $("#"+this.name).append("HEADER</br>CHART");
                break;
            case "bar":
                create_bar_chart(dict_args.graphique);
                break;
            case "pie":
                create_pie_chart(dict_args.graphique);
                break;
            case "line":
                create_line_chart(dict_args.graphique);             
                break;
            default:
                console.log("ERROR: Type de graphique non pris en compte");
                break;
        };
        
    };
    
    if (this.activated == "hide") {
        this.create_hidden();
    };   

/*     zoom_territoire = function(val, token){
		// app.blocks.mapview.map.invalidateSize();
        // FIXME: Arriver à appeler directement la fonction sans passer par celle-ci.        
        app.blocks.mapview.get_territoire(val, token);
    }; */
 
    create_html_table = function(objects, headers, headers_name){

        
        if (objects.length == 0){
            return("");
        };
        
        var table = '<table class="table table-sm">';
        
        table += '<thead class="thead-light">';
        table += "<tr>";
        for (var ifield in headers_name){
            table += "<th>"+headers_name[ifield]+"</th>";
        };
        table += "</tr>";
        table += '</thead">';
        
        for (var i = 0; i < objects.length; i++) {
            table += "<tr>";
            for (var ifield in headers){                
                if (objects[i][headers[ifield]] == null) {
                    objects[i][headers[ifield]] = "";
                };
                if (objects[i][headers[ifield]] == "t") {
                    objects[i][headers[ifield]] = "Oui";
                };      
                if (objects[i][headers[ifield]] == "f") {
                    objects[i][headers[ifield]] = "Non";
                };                  
                table += "<td>"+objects[i][headers[ifield]]+"</td>";
            };
            table += "</tr>";   
        };
        table += "</table>";
        return table;        
    };
 
    rapport_geres = function(){
		// FIXME: A déplacer dans methanisation.js 
		
		
		// console.log("Rapport GERES " + app.blocks.mapview.layers["territoire"]);
		// console.log("Rapport GERES " + app.blocks.mapview.layers["territoire"].layer);
		
        // FIXME: Devrait être dans un fichier séparé, que l'on charge comme ce module
       
        if (typeof app.blocks.mapview.layers["territoire"] == "undefined"){
            $("#report-block").html('<div class="alert alert-warning alert-center" role="alert">Sélectionnez un territoire pour créer sa fiche synthétique.</div>'); 
            return;
        };
       
        // Destroy everything
        $("#report-block").empty();       
       
        app.blocks.report.spinstart();

        // Récupération de la géométrie en geojson pour pouvoir l'utiliser dans les requêtes PostGIS
        // La rquête est différente selon le type alors on crée directement la requête
        var territoire_json = app.blocks.mapview.layers["territoire"].layer.toGeoJSON();
        
        // Si choix de la méthode sélection par geom geojson, création du SQL
        if (app.territoire != "radius") {      
            var territoire_json_text = JSON.stringify(territoire_json.features[0].geometry);
            // territoire_sql = 'SELECT st_transform(st_setsrid(ST_GeomFromGeoJSON(\''+territoire_json_text+'\'), 4326), 2154) AS geom' ;
            var territoire_sql = '' ;
            
            // Retour PostGIS fictif du polygone du territoire
            var territoire_lon = 0;
            var territoire_lat = 0;
            var territoire_rad = 0;            
        } else {
            var territoire_json_text = JSON.stringify(territoire_json.geometry);
            var territoire_json_text_radius = app.blocks.mapview.layers["territoire"].layer.getRadius();
            var territoire_sql = 'SELECT st_buffer(st_transform(st_setsrid(ST_GeomFromGeoJSON(\''+territoire_json_text+'\'), 4326),2154),'+territoire_json_text_radius+') AS geom';
            
            // Le filtre CQL WITHIN doit recevoir un polygone en 4326 donc retourné par Postgis
            var territoire_lon = app.territoire_center[0];
            var territoire_lat = app.territoire_center[1];
            var territoire_rad = app.territoire_radius;
        };
        
        // Destruction des blocks précédemment crées 
        if (typeof app.blocks.carte_rom != "undefined"){
            app.blocks.carte_rom.map.remove();
            app.blocks.carte_rom.map = null;
        };

        if (typeof app.blocks.carte_step != "undefined"){
            app.blocks.carte_step.map.remove();
            app.blocks.carte_step.map = null;
        };        

        if (typeof app.blocks.carte_dbg != "undefined"){
            app.blocks.carte_dbg.map.remove();
            app.blocks.carte_dbg.map = null;
        };  

        if (typeof app.blocks.carte_ddg != "undefined"){
            app.blocks.carte_ddg.map.remove();
            app.blocks.carte_ddg.map = null;
        };  
        
        if (typeof app.blocks.carte_imp != "undefined"){
            app.blocks.carte_imp.map.remove();
            app.blocks.carte_imp.map = null;
        };      
        
        if (typeof app.blocks.carte_alp_tepos != "undefined"){
            app.blocks.carte_alp_tepos.map.remove();
            app.blocks.carte_alp_tepos.map = null;
        };   

        if (typeof app.blocks.carte_alp_tepcv != "undefined"){
            app.blocks.carte_alp_tepcv.map.remove();
            app.blocks.carte_alp_tepcv.map = null;
        };      
        
        if (typeof app.blocks.carte_alp_tzdzg != "undefined"){
            app.blocks.carte_alp_tzdzg.map.remove();
            app.blocks.carte_alp_tzdzg.map = null;
        }; 

        if (typeof app.blocks.carte_alp_cte != "undefined"){
            app.blocks.carte_alp_cte.map.remove();
            app.blocks.carte_alp_cte.map = null;
        };          


        
        
        // Récupération de toutes les données nécessaires
        $.ajax({
            type: "GET", 
            url: "api/geres.rapport_geres.php",
            dataType: 'json',  
            data: { 
                territoire: app.territoire,
                territoire_token: app.territoire_token,
                territoire_sql: territoire_sql,
                
                territoire_lon: territoire_lon,
                territoire_lat: territoire_lat,
                territoire_rad: territoire_rad,
            },             
            beforeSend:function(jqXHR, settings){
                // jqXHR.obj = this;    
            },            
            success: function(response,textStatus,jqXHR){               

                // Traitement des variables 
                var rom_val_t_net_calcule = response[0][0].val_t_net_calcule;
                var rom_tot_mwh = response[1][0].tot_mwh;
                var cql_polygon_filter = response[2][0].st_astext;
                var nb_unites_metha = response[3];
                var gisements_table = response[4];
                var gisements_graphs = response[5];
                var pct_gaz_5km = response[6];
                var pct_gaz_5_10km = response[7];
                var iaa = response[8];
                var compostage = response[9];
                var alp = response[10];
               
                
                // Title
                if (app.territoire == "radius"){
                    var nom_territoire = "";
                    var titre_territoire = "Territoire personnalisé";
                    var soustitre_territoire = "lon: "+(app.territoire_center[0]).toFixed(2)+" lat: "+(app.territoire_center[1]).toFixed(2)+" radius: "+(app.territoire_radius / 1000.).toFixed(2)+" km";
                }else{
                    var nom_territoire = app.territoire;
                    var titre_territoire = app.territoire;
                    var soustitre_territoire = "";
                };
                
                $("#report-block").append('<div class="rapport-geres-titre">'+titre_territoire+'</div>');      
                $("#report-block").append('<div class="p-dark-centered">'+soustitre_territoire+'</div>');      
                
                // Theme ROM
                $("#report-block").append('<div class="rapport-geres-theme" id="rapport-rom">Ressource organique mobilisable</div>'); 

                // // Infos ROM
                // $("#report-block").append("<p><b>xxx</b> projets de méthanisation sont présents sur les communes du territoire <b>"+nom_territoire+"</b></p>");
                // $("#report-block").append("<p>Le territoire <b>"+nom_territoire+"</b> a un gisement organique mobilisable, hors STEP, de <b>"+rom_val_t_net_calcule+"</b> tonnes net, correspondant à une production d’énergie renouvelable de <b>"+rom_tot_mwh+"</b> Mwh/an. En faisant l’hypothèse d’une valorisation possible par injection, le débit de biométhane injecté pourrait être de <b>xxx</b> Nm3/h.</p>");
                // $("#report-block").append("<p>Le gisement organique mobilisable se répartit de la manière suivante :</p>");        


                // Définition du filtre ECQL
                if (app.territoire != "radius") {      
                    // filter = "WITHIN(geom, collectGeometries(queryCollection('cigale:liste_entites_admin', 'geom', 'texte = ''"+app.territoire.replace("''","''''")+"''')))";
                    var filter = "WITHIN(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                    // filter2 = "INTERSECTS(geom, collectGeometries(queryCollection('cigale:liste_entites_admin', 'geom', 'texte = ''"+app.territoire.replace("''","''''")+"''')))";
                    // filter2 = "INTERSECTS(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                    var filter2 = "INTERSECTS(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                    var filterOverlaps = "OVERLAPS(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                    var filterRelate = "RELATE(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                    var filterIntersectNotTouches = "INTERSECTS(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"'''))) AND NOT TOUCHES(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                    // filterTouches = "TOUCHES(geom, collectGeometries(queryCollection('cigale:entites', 'geom', 'lib_entite = ''"+app.territoire.replace("''","''''")+"''')))";
                } else { 
                    var filter = "INTERSECTS(geom,"+cql_polygon_filter+" )";   
                    var filter2 = "INTERSECTS(geom,"+cql_polygon_filter+" )";   
                    var filterOverlaps = "INTERSECTS(geom,"+cql_polygon_filter+" )";   
                    var filterRelate = "INTERSECTS(geom,"+cql_polygon_filter+" )";   
                    var filterIntersectNotTouches = "INTERSECTS(geom,"+cql_polygon_filter+" )";   
                    // filterTouches = "INTERSECTS(geom,"+cql_polygon_filter+" )";   
                };
                
                if (app.territoire != "radius") {var typename_suffix = ""}else{var typename_suffix = "_4326"};      
                
                // Data ROM
                $("#report-block").append('<div class="row" id="row-plot-rom">');         
                        
                  

                        // Carte théma ROM
                        // FIXME: Avec les bons ratios mob et la bonne plage de couleurs 
                        app.blocks.carte_rom = new Datablock("carte-rom", "#row-plot-rom", true, 6);  
                        app.blocks.carte_rom.createmap({
                            base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                            draw: false, legend:true, zoom_to_layer:"territoire",
                            no_drag: true, no_zoom: true, attributions: false, title:"Ressource organique mobilisable par commune", 
                            scale:true
                        });   
                        
                        // Ajout des couches nécessaires Carte ROM
                        geoserver.lfCreateLayerWFS("Ressources Organiques Mobilisables", "cigale:rom_carte_comm_groupe_rom"+typename_suffix, app.blocks.carte_rom, true, [0,20], "NoTheme", {
                            cql_filter: filter,
                            popup: false,
                            mouseover: false,
                            in_legend: true,
                            zoom: true,            
                            // FIXME: Pour afficher les bonnes données à différentes échelles soit choix en fonction du zoom (en créant deux couches avec des niveaux différents) soit faut faire plus de code ...          
                            style_dict: app.blocks.mapview.layers["Communes : Ressources organiques mobilisables (hors STEP)"].multi_style[app.blocks.mapview.layers["Communes : Ressources organiques mobilisables (hors STEP)"].active_style].style, 
                        });  

                        if (typename_suffix == ""){
                            geoserver.lfCreateLayerWFS("RapportTerritoire", "cigale:entites", app.blocks.carte_rom, true, [0,20], "NoTheme", {
                                cql_filter: app.territoire_cql_filter,
                                json_object: false,
                                popup: false,
                                mouseover: false,
                                in_legend: false,
                                zoom: false,
                                style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                            });                 
                        } else {
                            L.circle([app.territoire_center[1], app.territoire_center[0]], 
                                app.blocks.mapview.layers["territoire"].layer.options
                            ).addTo(app.blocks.carte_rom.map);                             

                        };



                        // Création carte STEP et unités de méthanisation
                        app.blocks.carte_step = new Datablock("carte-step", "#row-plot-rom", true, 6);  
                        app.blocks.carte_step.createmap({
                            base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                            draw: false, legend:true, zoom_to_layer:"territoire",
                            no_drag: true, no_zoom: true, attributions: false, 
                            title:"Potentiels de production des STEP",
                            scale:true
                        });   
                        
                        // Ajout des couches nécessaires Carte STEP
                        geoserver.lfCreateLayerWFS("Potentiel des STEP (Mwh/an)", "cigale:rom_step"+typename_suffix, app.blocks.carte_step, true, [0,20], "NoTheme", {
                            cql_filter: filter,
                            popup: false,
                            mouseover: false,
                            in_legend: true,
                            zoom: true,
                            style_dict: 
                                {
                                    pane: 'top',
                                    radius: 7, fillColor: "red", color: "blue", weight: 0, opacity: 1, fillOpacity: 0.5,
                                    classes: {field: "prod_tot_nm3_ch4_h", param: "radius", grades: [
                                        // [10,"2"],
                                        // [20,"6"],
                                        // [45,"10"],
                                        // [70,"16"],
                                        // [200,"20"],
                                        // [300,"25"],
                                        [10,"4"],
                                        [20,"6"],
                                        [45,"10"],
                                        [70,"16"],
                                        [200,"20"],
                                        [300,"25"],                                      
                                    ],
                                    special: {field: "methanisation", val_field:true, param: "fillColor", val:"#1f83d2", legend:"STEP équipées de méthaniseur"}   
                                }
                            }  
                        });                  

                        if (typename_suffix == ""){
                            geoserver.lfCreateLayerWFS("RapportTerritoireStep", "cigale:entites", app.blocks.carte_step, true, [0,20], "NoTheme", {
                                cql_filter: app.territoire_cql_filter,
                                json_object: false,
                                popup: false,
                                mouseover: false,
                                in_legend: false,
                                zoom: false,
                                style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                            });                 
                        } else {
                            L.circle([app.territoire_center[1], app.territoire_center[0]], 
                                app.blocks.mapview.layers["territoire"].layer.options
                            ).addTo(app.blocks.carte_step.map);                             

                        };


                // Fin des cartes
                $("#report-block").append('</div>');   
                
                // Affichage des infos sur les unités de métanisations
                $("#report-block").append("<p><b>Unités de méthanisation sur le territoire</b></p>\
                <p>"+nb_unites_metha.length+" unité(s) de méthanisation présentes sur le territoire.</p>\
                "+create_html_table(nb_unites_metha, ["site_nom", "commune", "typologie", "tonnage_traite", "type_valo", "dimensionnement"], ["Nom", "Commune", "Typologie", "Tonnage traité", "Valorisation d'énergie", "Dimensionnement"])+"\
                <p><b>Gisements sur le territoire</b></p>\
                "+create_html_table(gisements_table, ['Gisements', 'En tonnes/an', 'Equivalent MWh/an', 'Équivalent Nm3 CH4/an'], ['Gisements', 'En tonnes/an', 'Equivalent MWh/an', 'Équivalent Nm3 CH4/an'])+"\
                <p><b>Le gisement mobilisable à dire d’experts, hors STEP se répartit de la manière suivante</b></p></br>");
				

				
				
				$("#report-block").append('<div class="row" id="row-pies">');
				
				console.log(gisements_graphs);
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				
				new Datablock("visualisation-graph-block-A", "#row-pies", true, 6, "", {
					graphique:{
						type:'pie',
						// data: "api/conso_repartiton_epci_energie.php", 
						data: "api/geres.pies_t.php", 
						params: {
							territoire: app.territoire,
							territoire_token: app.territoire_token,
							territoire_sql: territoire_sql,

							territoire_lon: territoire_lon,
							territoire_lat: territoire_lat,
							territoire_rad: territoire_rad,
						},
						container_id: "visualisation-graph-block-A",
						title: "Gisement mobilisable (t)",
						tooltip:'{series.name} {point.percentage:.0f}% ({point.y}) t',
						option: {}
					}
				});	


				new Datablock("visualisation-graph-block-B", "#row-pies", true, 6, "", {
					graphique:{
						type:'pie',
						data: "api/geres.pies_mwh.php",  
						params: {
							territoire: app.territoire,
							territoire_token: app.territoire_token,
							territoire_sql: territoire_sql,

							territoire_lon: territoire_lon,
							territoire_lat: territoire_lat,
							territoire_rad: territoire_rad,
						},
						container_id: "visualisation-graph-block-B",
						title: "Gisement mobilisable (Mwh)",
						tooltip:'{series.name} {point.percentage:.0f}% ({point.y}) Mwh',
						option: {}
					}
				});							

				// $("#report-block").append(create_html_table(gisements_graphs, ['groupe_rom','mob_t','mob_mwh'], ['groupe_rom','mob_t','mob_mwh']));
				$("#report-block").append(create_html_table(gisements_graphs, ['Type','Tonnes','Mwh'], ['Type','Tonnes','Mwh']));

                
                // TODO: Faire les graphics
                // app.blocks.gisements_mob_t = new Datablock("plot-gisement-mob-t", "#row-plot-mob", true, 6);                  
                // app.blocks.gisements_mob_mwh = new Datablock("plot-gisement-mob-mwh", "#row-plot-mob", true, 6); 
                // $("#plot-gisement-mob-t").append("toto</br>toto</br>toto</br>toto</br>toto</br>toto</br>");

                
                // Theme DBG
                $("#report-block").append('<div class="rapport-geres-theme">Débouchés pour le biogaz</div>');
                
                // Carte réseau Grdf + Conso IAA
                $("#report-block").append('<div class="row" id="row-plot-dbg">');
                    
                    app.blocks.carte_dbg = new Datablock("carte-dbg", "#row-plot-dbg", true, 6);  
                    app.blocks.carte_dbg.createmap({
                        base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                        draw: false, legend:true, zoom_to_layer:"territoire",
                        no_drag: true, no_zoom: true, attributions: false, title:"Débouchés pour le biogaz",
                        scale:true
                    }); 

                    geoserver.lfCreateLayerWFS("IAA", "cigale:dbg_iaa"+typename_suffix, app.blocks.carte_dbg, true, [0,20], "NoTheme", {
                        cql_filter: filter,
                        popup: false,
                        mouseover: false,
                        in_legend: true,
                        zoom: true,
                        style_dict: app.blocks.mapview.layers["Valorisation possible de chaleur dans les IAA"].style_orig,               
                    });                     

                    geoserver.lfCreateLayerWFS("Réseau de distribution de gaz à moins de 5km", "cigale:dbg_grdf_reseau_5km_comm"+typename_suffix, app.blocks.carte_dbg, true, [0,20], "NoTheme", {
                        cql_filter: filter2, 
                        popup: false,
                        mouseover: false,
                        in_legend: true,
                        zoom: true,
                        style_dict: {fillColor: "#f6ec2e", color: "#f6ec2e", weight: 0, opacity: 0.5, fillOpacity: 0.5,},               
                    }); 

                    geoserver.lfCreateLayerWFS("Réseau de distribution de gaz à moins de 5 à 10 km", "cigale:dbg_grdf_reseau_5_10km_comm"+typename_suffix, app.blocks.carte_dbg, true, [0,20], "NoTheme", {
                        cql_filter: filter2,
                        popup: false,
                        mouseover: false,
                        in_legend: true,
                        zoom: true,
                        style_dict: {fillColor: "#dec30d", color: "#dec30d", weight: 0, opacity: 0.5, fillOpacity: 0.5,},               
                    });                    
                    
                    if (typename_suffix == ""){
                        geoserver.lfCreateLayerWFS("RapportTerritoireDbg", "cigale:entites", app.blocks.carte_dbg, true, [0,20], "NoTheme", {
                            cql_filter: app.territoire_cql_filter,
                            json_object: false,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: false,
                            style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                        });                 
                    } else {
                        L.circle([app.territoire_center[1], app.territoire_center[0]], 
                            app.blocks.mapview.layers["territoire"].layer.options
                        ).addTo(app.blocks.carte_dbg.map);                             

                    };                    

                
                $("#report-block").append('</div>');

                if ( (pct_gaz_5km[0]["pct"] == null) && (pct_gaz_5_10km[0]["pct"] == null) ){
                    var presence_gn = "absent";
                } else {
                    var presence_gn = "présent";
                }; 
                var html = "<p>Le réseau de distribution de gaz est "+presence_gn+" sur le territoire.</br>";
                
                if ( (pct_gaz_5km[0]["pct"] != null) || (pct_gaz_5_10km[0]["pct"] != null) ){

                    if (pct_gaz_5km[0]["pct"] == null){pct_gaz_5km[0]["pct"] = '0'};
                    if (pct_gaz_5_10km[0]["pct"] == null){pct_gaz_5_10km[0]["pct"] = '0'};

                    html += "" + pct_gaz_5km[0]["pct"] + "% du territoire possède un réseau de distribution du gaz à moins de 5 kms permettant un raccordement favorable.</br>";
                    html += "" + pct_gaz_5_10km[0]["pct"] + "% du territoire possède un réseau de distribution du gaz entre 5 et 10 kms permettant un raccordement possible en fonction de la taille du projet.</p>";
                };
                
                if (   ( (pct_gaz_5km[0]["pct"] == null) && (pct_gaz_5_10km[0]["pct"] == null) ) || (parseFloat(pct_gaz_5km[0]["pct"]) + parseFloat(pct_gaz_5_10km[0]["pct"]) < 100)    ) {
                    
                    if ((pct_gaz_5km[0]["pct"] == null) && (pct_gaz_5_10km[0]["pct"] == null)) {
                        html += "<p>Votre territoire est non couvert par le réseau de distribution de gaz. ";
                    } else {
                        html += "<p>Votre territoire est en partie non couvert par le réseau de distribution de gaz. "; 
                    };

                };

                if (iaa.length > 0){
                    html += "Sur les communes non couvertes par le réseau, il existe une valorisation potentielle de la chaleur auprès des IAA sur le  territoire.</p>";
                    html += ""+create_html_table(iaa, ["Entreprise","Commune","Activité"], ["Entreprise","Commune","Activité"]);
                } else {
                    html += "</p>";
                };                

                $("#report-block").append(html);

                 
                

                // Theme DDG
                $("#report-block").append('<div class="rapport-geres-theme">Débouchés pour le digestat</div>');
                
                $("#report-block").append("<p>Le digestat, dans la grande majorité des cas, est considéré comme un déchet et donc doit être soumis à un plan d’épandage. Le digestat représente environ 90 % du tonnage entrant. En règle générale, pour un projet avec 5000 t de gisements, il faudra trouver 250 ha de terres agricoles épandables, chiffre variant selon la nature du digestat et le post traitement effectué (séparation de phase, etc.)</p>");

                // Carte DDG
                $("#report-block").append('<div class="row" id="row-plot-ddg">');
                    
                    app.blocks.carte_ddg = new Datablock("carte-ddg", "#row-plot-ddg", true, 6);  
                    app.blocks.carte_ddg.createmap({
                        base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                        draw: false, legend:true, zoom_to_layer:"territoire",
                        no_drag: true, no_zoom: true, attributions: false, title:"Débouchés pour le digestat",
                        scale:true
                    }); 
                    
                    
                    // geoserver.lfCreateLayerWFS("Surface agricole épandable</br>(ha/EPCI)", "cigale:ddg_carte_epci"+typename_suffix, app.blocks.carte_ddg, true, [0,3], "NoTheme", {
                        // cql_filter: filter,
                        // popup: false,
                        // mouseover: false,
                        // in_legend: true,
                        // zoom: true,
                        // style_dict: app.blocks.mapview.layers["Surface agricole épandable</br>(ha/EPCI)"].style_orig,               
                    // });  
                    geoserver.lfCreateLayerWFS("Surface agricole épandable</br>(ha/commune)", "cigale:ddg_carte_comm"+typename_suffix, app.blocks.carte_ddg, true, [0,10], "NoTheme", {
                        cql_filter: filter,
                        popup: false,
                        mouseover: false,
                        in_legend: true,
                        zoom: true,
                        style_dict: app.blocks.mapview.layers["Surface agricole épandable</br>(ha/EPCI)"].style_orig,               
                    });                      
                    geoserver.lfCreateLayerWMS(
                        "Parcelles agricoles épandables</br>selon contraintes environnementales et/ou géologiques", "cigale:ddg_classe_final", app.blocks.carte_ddg, true, [11,20], "NoTheme", {
                            cql_filter: filter, // 'classe_text=5', // filter2,
                            pane: "front", legend_carriage: true
                        }
                    );                     
                    
                    geoserver.lfCreateLayerWFS("Unités de compostage", "cigale:ddg_plateforme_compostage"+typename_suffix, app.blocks.carte_ddg, true, [0,20], "NoTheme", {
                        cql_filter: filter,
                        popup: false,
                        mouseover: false,
                        in_legend: true,
                        zoom: true,
                        
                        // style_dict: app.blocks.mapview.layers["Unités de compostage"].style_orig,   
                        style_dict: {pane: "top",radius: 9, fillColor: "#256DA9", color: "white", weight: 1, opacity: 1, fillOpacity: 0.7},             
                    });   


                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    

                    
                    
                    if (typename_suffix == ""){
                        geoserver.lfCreateLayerWFS("RapportTerritoireDdg", "cigale:entites", app.blocks.carte_ddg, true, [0,20], "NoTheme", {
                            cql_filter: app.territoire_cql_filter,
                            json_object: false,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: false,
                            style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                        });                 
                    } else {
                        L.circle([app.territoire_center[1], app.territoire_center[0]], 
                            app.blocks.mapview.layers["territoire"].layer.options
                        ).addTo(app.blocks.carte_ddg.map);                             

                    };                    

                
                // $("#report-block").append('</div>');

                // $("#report-block").append('<div class="rapport-map-legend" style="color:red;">');
                $("#report-block").append('<div class="rapport-map-legend">\
                Les surfaces avec contraintes réglementaires tiennent compte de critères comme la pente, distance à des zones de captage d’eau, cours d’eau etc. ainsi qu’aux risques d’inondations des parcelles.</br>\
                Les surfaces avec contraintes environnementales et/ou pédologiques tiennent compte des zonages environnementaux (coeur de parc, arrêté Biotope, Réserves Naturelles (nationales et Régionales), ZNIEFF 1 , etc.), des zones vulnérables à la pollution aux nitrates et des zones karstiques.</br>\
                *Si une zone est à la fois concernée par des contraintes réglementaires et environnementales, elle est identifiée dans la catégorie contrainte réglementaire.</br>\
                </div></br></br>\
                <p>La Surface Agricole Utile (SAU) du territoire choisi est de  [X] ha, soit [X]% de la surface totale du territoire.</p>\
                <p>Il existe '+compostage.length+' plateformes de compostage sur le territoire pouvant permettre au digestat de sortir de la logique déchets, en respectant les normes de compostage NFU 44 051 ou 44 095 (avec boues de STEP)</p>\
                '+create_html_table(compostage, ['Nom de la plateforme','Commune','Capacité règlementaire (t/an)','Déchets traités','Agrément SPAN'], ['Nom de la plateforme','Commune','Capacité règlementaire (t/an)','Déchets traités','Agrément SPAN']) + '\
                ');








                // Theme Implantation possible d’unités
                $("#report-block").append('<div class="rapport-geres-theme">Implantation possible d’unités</div>');
              
                // Carte Implantation
                $("#report-block").append('<div class="row" id="row-plot-imp">');
                    
                    app.blocks.carte_imp = new Datablock("carte-imp", "#row-plot-imp", true, 6);  
                    app.blocks.carte_imp.createmap({
                        base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                        draw: false, legend:true, zoom_to_layer:"territoire",
                        no_drag: true, no_zoom: true, attributions: false, title:"????????",
                        scale:true
                    }); 
                    
                    
                    if (typename_suffix == ""){
                        geoserver.lfCreateLayerWFS("RapportTerritoireImp", "cigale:entites", app.blocks.carte_imp, true, [0,20], "NoTheme", {
                            cql_filter: app.territoire_cql_filter,
                            json_object: false,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: false,
                            style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                        });                 
                    } else {
                        L.circle([app.territoire_center[1], app.territoire_center[0]], 
                            app.blocks.mapview.layers["territoire"].layer.options
                        ).addTo(app.blocks.carte_imp.map);                             

                    };                    

                
                $("#report-block").append('</div>');

                $("#report-block").append("<p>[X]% du territoire ne permet pas une implantation, d’un point de vue réglementaire.</p>\
                <p>Les contraintes réglementaires concernent des distance aux habitations habitées par un tiers (50 m) et au captage d’eau (35 m).</p>\
                <p>[X]% du territoire permettrait une implantation avec contrainte  non rédhibitoire identifiée (zonages environnementaux, distance aux monuments historiques et sites inscrits).</p>\
                <p>D’autres contraintes urbanistiques peuvent s’ajouter, qui ne sont pas prises en compte ici : zonages PLUs ou carte communale, Plan de Prévention des Risques. </p>\
                <p>[X]ha de plus de 1 ha de surface contiguë ne présente pas de contrainte au préalable identifiée. </p>\
                <p>[X]ha de plus de 2 ha de surface contiguë ne présente pas de contrainte au préalable identifiée. </p>\
                <p>La surface nécessaire varie en fonction de la typologie du projet et de sa puissance : entre 0,5 ha et 3 ha.</p>\
                ");












                // FIXME: NE METTRE LES CARTES ALP QUE SI DATA POUR TEL OU TEL PLAN

                // Theme ALP
                $("#report-block").append('<div class="rapport-geres-theme">Acceptation locale et portage du projet</div>');
                
                // Création des dictionnaires 
                var dict_alp = {
                    'TEPOS': [],
                    'TEPCV': [],
                    'TZDZG': [],                
                    'CTE': [],                
                };
                
                for (var i in alp){
                    dict_alp[alp[i]["nom_label"]].push("- "+alp[i]["territoire"] + " " + alp[i]["nom"] + "</br>");
                };                
                
                // Cartes ALP
                $("#report-block").append('<div class="row" id="row-plot-alp">');
                     
                    if (dict_alp["TEPOS"].length > 0) {
                        app.blocks.carte_alp_tepos = new Datablock("carte-alp-tepos", "#row-plot-alp", true, 3);  
                        app.blocks.carte_alp_tepos.createmap({
                            base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                            draw: false, legend:false, zoom_to_layer:"territoire",
                            no_drag: true, no_zoom: true, attributions: false, title:"Territoires à Energie Positive (TEPOS)",
                            scale:true
                        });     

                        geoserver.lfCreateLayerWFS("Territoires à Energie Positive (TEPOS)", "cigale:alp_carte_plans_tepos"+typename_suffix, app.blocks.carte_alp_tepos, true, [0,20], "NoTheme", {
                            cql_filter: filterIntersectNotTouches,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: true,
                            style_dict: {
                                pane: "top", 
                                fillColor: "#1f78b4", color: "#1f78b4", weight: 3, 
                                opacity: 1, fillOpacity: 0.5
                            }  
                        }); 
                        
                        if (typename_suffix == ""){
                            geoserver.lfCreateLayerWFS("RapportTerritoireAlp", "cigale:entites", app.blocks.carte_alp_tepos, true, [0,20], "NoTheme", {
                                cql_filter: app.territoire_cql_filter,
                                json_object: false,
                                popup: false,
                                mouseover: false,
                                in_legend: false,
                                zoom: false,
                                style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                            });                 
                        } else {
                            L.circle([app.territoire_center[1], app.territoire_center[0]], 
                                app.blocks.mapview.layers["territoire"].layer.options
                            ).addTo(app.blocks.carte_alp_tepos.map);                             

                        };                         
                        
                    };
                    
                    if (dict_alp["TEPCV"].length > 0) {
                        app.blocks.carte_alp_tepcv = new Datablock("carte-alp-tepcv", "#row-plot-alp", true, 3);  
                        app.blocks.carte_alp_tepcv.createmap({
                            base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                            draw: false, legend:false, zoom_to_layer:"territoire",
                            no_drag: true, no_zoom: true, attributions: false, title:"Territoires à Energie Positive pour la croissance Verte (TEPCV)",
                            scale:true
                        }); 

                        geoserver.lfCreateLayerWFS("Territoires à Energie Positive pour la croissance Verte (TEPCV)", "cigale:alp_carte_plans_tepcv"+typename_suffix, app.blocks.carte_alp_tepcv, true, [0,20], "NoTheme", {
                            cql_filter: filterIntersectNotTouches,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: true,
                            style_dict: {
                                pane: "top", 
                                fillColor: "#33a02c", color: "#33a02c", weight: 3, 
                                opacity: 1, fillOpacity: 0.5
                            }  
                        }); 

                        if (typename_suffix == ""){
                            geoserver.lfCreateLayerWFS("RapportTerritoireAlpTEPCV", "cigale:entites", app.blocks.carte_alp_tepcv, true, [0,20], "NoTheme", {
                                cql_filter: app.territoire_cql_filter,
                                json_object: false,
                                popup: false,
                                mouseover: false,
                                in_legend: false,
                                zoom: false,
                                style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                            });                 
                        } else {
                            L.circle([app.territoire_center[1], app.territoire_center[0]], 
                                app.blocks.mapview.layers["territoire"].layer.options
                            ).addTo(app.blocks.carte_alp_tepcv.map);                             

                        };                           
                        
                    };                    

                    if (dict_alp["TZDZG"].length > 0) {
                        app.blocks.carte_alp_tzdzg = new Datablock("carte-alp-tzdzg", "#row-plot-alp", true, 3);  
                        app.blocks.carte_alp_tzdzg.createmap({
                            base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                            draw: false, legend:false, zoom_to_layer:"territoire",
                            no_drag: true, no_zoom: true, attributions: false, title:"Territoires Zéro Déchets Zéro Gaspillage (TZDZG)",
                            scale:true
                        }); 

                        geoserver.lfCreateLayerWFS("Territoires Zéro Déchets Zéro Gaspillage (TZDZG)", "cigale:alp_carte_plans_tzdzg"+typename_suffix, app.blocks.carte_alp_tzdzg, true, [0,20], "NoTheme", {
                            cql_filter: filterIntersectNotTouches,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: true,
                            style_dict: {
                                pane: "top", 
                                fillColor: "#ea915e", color: "#ea915e", weight: 3, 
                                opacity: 1, fillOpacity: 0.5
                            }  
                        }); 

                        if (typename_suffix == ""){
                            geoserver.lfCreateLayerWFS("RapportTerritoireAlpTZDZG", "cigale:entites", app.blocks.carte_alp_tzdzg, true, [0,20], "NoTheme", {
                                cql_filter: app.territoire_cql_filter,
                                json_object: false,
                                popup: false,
                                mouseover: false,
                                in_legend: false,
                                zoom: false,
                                style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                            });                 
                        } else {
                            L.circle([app.territoire_center[1], app.territoire_center[0]], 
                                app.blocks.mapview.layers["territoire"].layer.options
                            ).addTo(app.blocks.carte_alp_tzdzg.map);                             

                        }; 
                        
                    };

                    if (dict_alp["CTE"].length > 0) {
                        app.blocks.carte_alp_cte = new Datablock("carte-alp-cte", "#row-plot-alp", true, 3);  
                        app.blocks.carte_alp_cte.createmap({
                            base_layers: [app.baseLayers.Esri_WorldTopoMap_fullzoom], 
                            draw: false, legend:false, zoom_to_layer:"territoire",
                            no_drag: true, no_zoom: true, attributions: false, title:"Territoires Sous Contrat de Transition Écologique (CTEs)",
                            scale:true
                        }); 

                        geoserver.lfCreateLayerWFS("Territoires Sous Contrat de Transition Écologique (CTEs)", "cigale:alp_carte_plans_cte"+typename_suffix, app.blocks.carte_alp_cte, true, [0,20], "NoTheme", {
                            cql_filter: filterIntersectNotTouches,
                            popup: false,
                            mouseover: false,
                            in_legend: false,
                            zoom: true,
                            style_dict: {
                                pane: "top", 
                                fillColor: "#d7a500", color: "#d7a500", weight: 3, 
                                opacity: 1, fillOpacity: 0.5
                            }  
                        });    

                        if (typename_suffix == ""){
                            geoserver.lfCreateLayerWFS("RapportTerritoireAlpCTE", "cigale:entites", app.blocks.carte_alp_cte, true, [0,20], "NoTheme", {
                                cql_filter: app.territoire_cql_filter,
                                json_object: false,
                                popup: false,
                                mouseover: false,
                                in_legend: false,
                                zoom: false,
                                style_dict: app.blocks.mapview.layers["territoire"].style_orig,             
                            });                 
                        } else {
                            L.circle([app.territoire_center[1], app.territoire_center[0]], 
                                app.blocks.mapview.layers["territoire"].layer.options
                            ).addTo(app.blocks.carte_alp_cte.map);                             

                        };                         
                        
                    };
                    
                                
                $("#report-block").append('</div>');


                
                
                var html = "";
                if (dict_alp["TEPOS"].length > 0) { html += "Territoires à Energie Positive (TEPOS):</br>"+dict_alp["TEPOS"].join('')+"</br>"; } else {html += "Aucun Territoire à Energie Positive (TEPOS).</br></br>";};
                if (dict_alp["TEPCV"].length > 0) { html += "Territoires à Energie Positive pour la croissance Verte (TEPCV):</br>"+dict_alp["TEPCV"].join('')+"</br>"; } else {html += "Aucun Territoire à Energie Positive pour la croissance Verte (TEPCV).</br></br>";};
                if (dict_alp["TZDZG"].length > 0) { html += "Territoires Zéro Déchets Zéro Gaspillage  (TZDZG), démarche de  prévention, de réutilisation et de recyclage de leurs déchets:</br>"+dict_alp["TZDZG"].join('')+"</br>"; } else {html += "Aucun Territoire Zéro Déchets Zéro Gaspillage  (TZDZG).</br></br>";};                
                if (dict_alp["CTE"].length > 0) { html += "Territoires Sous Contrat de Transition Écologique (CTE):</br>"+dict_alp["CTE"].join('')+"</br>"; } else {html += "Aucun Territoire Sous Contrat de Transition Écologique (CTE).</br></br>";};                
                html += "</br>Ces territoires peuvent être moteur pour le développement de projets de méthanisation cohérents et exemplaires.</br></br></br></br>";
                $("#report-block").append(html);

 
                app.blocks.report.spinstop();                
                
                
            },
            error: function (request, error) {
                console.log("Ajax error: " + error);
                app.blocks.report.spinstop();  
            },        
        });        
        

    };
         
};


