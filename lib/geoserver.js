/* 
Geoserver 
Use geoserver layers in webapps
Must be used with datablocks
Romain Souweine - AtmoSud - 2019
*/

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
};

function isInteger(num) {
  return (num ^ 0) === num;
};

function Geoserver(host_url){
    /*
    Works with DataBlocks
    Ex. var geoserver = new Geoserver("https://host/geoserver/");
    */
    
    this.host = host_url;
    
    this.getCapabilities_wfs = function() {
		$.ajax({
			type: "GET",
			url: this.host + "wfs?service=WFS&version=1.1.0&request=GetCapabilities", 
			dataType: 'xml',  
			success: function(response,textStatus,jqXHR){				
				return response;
			},       
		});
    };

    this.getLegendWMS = function(typename, name, text, legend_carriage){

        var html = '<div class="legend-title" id="'+name+'">';
        
        if(legend_carriage == true){
            html += text + "</br>";
            html += '<img src="' + this.host + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&HEIGHT=15&LAYER='+typename+'&legend_options=fontColor:0x95a5a6;dx:5.2;dy:0.2;mx:0.2;my:0.2;&TRANSPARENT=true" alt="lgd" />';
        } else {
            html += '<img src="' + this.host + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&HEIGHT=15&LAYER='+typename+'&legend_options=fontColor:0x95a5a6;dx:5.2;dy:0.2;mx:0.2;my:0.2;&TRANSPARENT=true" alt="lgd" />';
            html += text;
        };
        html += '</div>';

        return html;
    };

    this.getLegendWFS = function(typename, name, text, legend_carriage, style_dict){
       
        var html = '<div class="legend-title" id="'+name+'">';
        
		// Si on a un dictionnaire de style
        if (style_dict != false){
            
			// Si on a des catégories 
            if (typeof style_dict.categories != "undefined"){
				// Si on a des catégories 
                html += text + "</br>";
                for (var cat in style_dict.categories.values){
                    html += '<i class="colorcircle" style="background:' + style_dict.categories.values[cat] + '"></i>'+cat+'</br>';
                };

			// FIXME: Comment avoir la même proportionalité de sympols que sur le carte ?                				
            } else if (typeof style_dict.jenks != "undefined"){

					html += text + "</br>";
					// for (var cat in style_dict.jenks_calcules.bornes){
						// html += '<i class="colorcircle" style="background:' + style_dict.jenks_calcules.colors[cat] + '"></i>'+style_dict.jenks_calcules.bornes[cat]+'</br>';
					// };


				
					var from, to;
					var labels = [];					
					for (var i = 0; i < style_dict.jenks_calcules.bornes.slice(0,-1).length; i++) {
						
						if (i == 0) {
							from = 0;
						} else {
							from = style_dict.jenks_calcules.bornes[i];
						}
						to = style_dict.jenks_calcules.bornes[i + 1];            
						
						html += '<i style="background:' + style_dict.jenks_calcules.colors[i] + '"></i> ' + from + (to ? ' à ' + to : '+') ; 
						html += '</br>';						
					};
					
					
			









			
			// Si on a des classes par taille
			// FIXME: Solution de secours, on prend le min, max
			// FIXME: Comment avoir la même proportionalité de sympols que sur le carte ?                				
            } else if (typeof style_dict.classes != "undefined"){
                if (style_dict.classes.param == "radius" ){

                
                    if (typeof style_dict.classes.special != "undefined") {
                        
                        html += '<i class="colorcircle" style="background:' + base_color + '"></i>' + text; 
                        html += "</br>";
                        // html += '<i class="colorcircle" style="background:' + style_dict.fillColor + '"></i>' + style_dict.classes.special.legend;
                        html += '<i class="colorcircle" style="background:' + style_dict.classes.special.val + '"></i>' + style_dict.classes.special.legend;
                    } else {
                        html += '<i class="colorcircle" style="background:' + style_dict.fillColor + '"></i>' + text; 
                    };
                
                } else if (style_dict.classes.param == "fillColor" ) {
                    html += text + "</br>"; 
                    for (var classe in style_dict.classes.grades){                      
                        html += '<i class="colorcircle" style="background:'+style_dict.classes.grades[classe][1]+';"></i><'+style_dict.classes.grades[classe][0]+'</br>';                        
                    };
                };
            } else {
                // Si dictionnaire de style sans catégories ni classes
                // html += '<i class="colorcircle" style="background:' + style_dict.fillColor + '"></i>' + text;
                html += '<i class="colorcircle" style="background:' + style_dict.color + '"></i>' + text;
            };
        } else {
            // Si on a pas de dictionnaire de style
            if(legend_carriage == true){
                html += text + "</br>";
                html += '<img src="' + this.host + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&HEIGHT=15&LAYER='+typename+'&legend_options=fontColor:0x95a5a6;dx:5.2;dy:0.2;mx:0.2;my:0.2;&TRANSPARENT=true" alt="lgd" />';
            } else {
                html += '<img src="' + this.host + 'wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&HEIGHT=15&LAYER='+typename+'&legend_options=fontColor:0x95a5a6;dx:5.2;dy:0.2;mx:0.2;my:0.2;&TRANSPARENT=true" alt="lgd" />';
                html += text;
            };
        };

        
        html += '</div>';
        
        return html;
    };   
    
    this.lfCreateLayerWMS = function (name, typename, map_block, add2map, zoom_levels, theme, dict_args) {

        // console.log("Creating WMS layer " + typename)
    
        // Dealing with dict args
        if ( (dict_args != null) && (dict_args.legend_carriage == true) ) {var legend_carriage = true;} else {var legend_carriage = false}; 
        if ( (dict_args != null) && (dict_args.fonction_desc != null) ) {var fonction_desc = dict_args.fonction_desc;} else {var fonction_desc = false}; 
        if ( (dict_args != null) && (dict_args.fonction != null) ) {var fonction = dict_args.fonction;} else {var fonction = false}; 
        if ( (dict_args != null) && (dict_args.dual != null) ) {var dual = dict_args.dual;} else {var dual = false};       
        if ( (dict_args != null) && (dict_args.legend == false) ) {var legend = false;} else {var legend = true}; 
        if ( (dict_args != null) && (dict_args.visible != null) ) {var visible = dict_args.visible;} else {var visible = true}; 
        if ( (dict_args != null) && (dict_args.header != null) ) {var header = dict_args.header;} else {var header = false}; 
    
        map_block.spinstart();
        
        var wms_params = {
            name: name,
            layers: typename.split(":")[1],
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            dj: 0,
            subtitle: typename.split(":")[1],
            minZoom: zoom_levels[0],
            maxZoom: zoom_levels[1],         
        };
        
        if ( (dict_args != null) && (dict_args.cql_filter != null) ) {
            wms_params["CQL_FILTER"] = dict_args.cql_filter;
        };   
        
        if ( (dict_args != null) && (dict_args.pane != null) ) {
            wms_params["pane"] = dict_args.pane;
        };                
        
        var wms_layer = L.tileLayer.wms(           
            this.host + typename.split(":")[0] + "/wms?", 
            wms_params
        );

        // Reference the layer in the map DataBlock object
        map_block.layers[wms_layer.wmsParams.name] = {
            name: name, 
            type:"wms",
            block: map_block,
            layer: wms_layer, 
            actif: false, 
            invisible: false, 
            theme: theme, 
            id: typename.split(":")[1],
            fonction: fonction,
            fonction_desc: fonction_desc,
            dual: dual,
            visible: visible,
            header: header,
        };

        // Deals with legend (If needed to remove element: 
        if (legend == true) {
            map_block.layers[wms_layer.wmsParams.name]["legend"] = {div_id: typename.split(":")[1], html: this.getLegendWMS(typename, typename.split(":")[1], name, legend_carriage)};        
        };
        
        if (add2map == true) {
            map_block.layers[wms_layer.wmsParams.name].layer.addTo(map_block.map);   
            map_block.layers[wms_layer.wmsParams.name].actif = true;
           
            if (map_block.layers[wms_layer.wmsParams.name].layer.options.minZoom > app.blocks.mapview.map.getZoom() || app.blocks.mapview.map.getZoom() > map_block.layers[wms_layer.wmsParams.name].layer.options.maxZoom) {
            } else {
                if (legend == true) {
                    map_block.addToLegend(map_block.layers[wms_layer.wmsParams.name]["legend"].html); 
                };
            };
        };

        map_block.spinstop();
      
    }; 

    this.lfCreateLayerWMTSesri = function (name, url, map_block, add2map, zoom_levels, theme, dict_args) {

        // Dealing with dict args
        if ( (dict_args != null) && (dict_args.legend_carriage == true) ) {var legend_carriage = true;} else {var legend_carriage = false}; 
        if ( (dict_args != null) && (dict_args.fonction_desc != null) ) {var fonction_desc = dict_args.fonction_desc;} else {var fonction_desc = false}; 
        if ( (dict_args != null) && (dict_args.fonction != null) ) {var fonction = dict_args.fonction;} else {var fonction = false}; 
        if ( (dict_args != null) && (dict_args.dual != null) ) {var dual = dict_args.dual;} else {var dual = false};            
         
        map_block.spinstart();
        
        var wmts_layer = L.esri.tiledMapLayer({
            // url: 'https://tiles.arcgis.com/tiles/7Sr9Ek9c1QTKmbwr/arcgis/rest/services/mod_occitanie_2017_no2_moyan/MapServer'
            url: this.host + url,
            opacity: 0.5,
        });      
        
        // Reference the layer in the map DataBlock object
        map_block.layers[name] = {
            name: name, 
            type:"wms",
            block: map_block,
            layer: wmts_layer, 
            actif: false, 
            invisible: false, 
            theme: theme, 
            id: url.split("/")[url.split("/").length -2],
            fonction: fonction,
            fonction_desc: fonction_desc,
            dual: dual,          
        };

        // Deals with legend (If needed to remove element: 
        map_block.layers[name]["legend"] = {div_id: url.split("/")[url.split("/").length -2], html: this.getLegendWMS(url, url.split("/")[url.split("/").length -2], name, legend_carriage)};        

        if (add2map == true) {
            map_block.layers[name].layer.addTo(map_block.map);   
            map_block.layers[name].actif = true;
            map_block.addToLegend(map_block.layers[name]["legend"].html); // map_block.removeToLegend(wmts_layer.wmsParams.name);)
        };
            
        map_block.spinstop();
      
    }; 
    
    this.lfCreateLayerWFS = function (name, typename, map_block, add2map, zoom_levels, theme, dict_args) {
        
        var obj = this;
        
        map_block.spinstart();
        
        // console.log("CREATING WFS LAYER " + name);
		
        // Dealing with dict args
        if ( (dict_args != null) && (dict_args.legend_carriage == true) ) {var legend_carriage = true;} else {var legend_carriage = false}; 
        if ( (dict_args != null) && (dict_args.fonction_desc != null) ) {var fonction_desc = dict_args.fonction_desc;} else {var fonction_desc = false}; 
        if ( (dict_args != null) && (dict_args.fonction != null) ) {var fonction = dict_args.fonction;} else {var fonction = false}; 
        if ( (dict_args != null) && (dict_args.dual != null) ) {var dual = dict_args.dual;} else {var dual = false}; 
        if ( (dict_args != null) && (dict_args.multi_style != null) ) {var multi_style = dict_args.multi_style;} else {var multi_style = false}; 
        if ( (dict_args != null) && (dict_args.visible != null) ) {var visible = dict_args.visible;} else {var visible = true};         
        if ( (dict_args != null) && (dict_args.style_dict != null) && (dict_args.style_dict.pane != null) ) {var pane = dict_args.style_dict.pane;} else {var pane = 'defaut'}; 
        if ( (dict_args != null) && (dict_args.style_dict != null) ) {var style_dict = dict_args.style_dict;} else {var style_dict = false;}; 
        if ( (dict_args != null) && (dict_args.name_field != null) ) {var name_field = dict_args.name_field;} else {var name_field = false;}; 
        if ( (dict_args != null) && (dict_args.legend_title != null) ) {var legend_title = dict_args.legend_title;} else {var legend_title = false;}; 
        if ( (dict_args != null) && (dict_args.tooltip != null) ) {var tooltip = dict_args.tooltip;} else {var tooltip = false;}; 
        if ( (dict_args != null) && (dict_args.cql_filter != null) ) {var cql_filter = "&cql_filter="+dict_args.cql_filter;} else {var cql_filter = "";}; 
        if ( (dict_args != null) && (dict_args.zoom != null) ) {var zoom = dict_args.zoom;} else {var zoom = false;}; 
        if ( (dict_args != null) && (dict_args.in_legend != null) ) {var in_legend = dict_args.in_legend;} else {var in_legend = true;}; 
        if ( (dict_args != null) && (dict_args.popup != null) ) {var popup = dict_args.popup;} else {var popup = true;}; 
        if ( (dict_args != null) && (dict_args.mouseover != null) ) {var mouseover = dict_args.mouseover;} else {var mouseover = true;}; 
        if ( (dict_args != null) && (dict_args.zoomonclick != null) ) {var zoomonclick = dict_args.zoomonclick;} else {var zoomonclick = false;}; 
        if ( (dict_args != null) && (dict_args.territoireonclick != null) ) {var territoireonclick = dict_args.territoireonclick;} else {var territoireonclick = false;}; 
        if ( (dict_args != null) && (dict_args.header != null) ) {var header = dict_args.header;} else {var header = false}; 
        if ( (dict_args != null) && (dict_args.fixed_id != null) ) {var id_prefix = dict_args.fixed_id;} else {var id_prefix =  new Date(Date.now()).getTime();}; 
        if ( (dict_args != null) && (dict_args.unique != null) ) {var unique = dict_args.unique;} else {var unique =  false;}; 
        if ( (dict_args != null) && (dict_args.attributes_dict != null) ) {var attributes_dict = dict_args.attributes_dict;} else {var attributes_dict =  false;}; 
      
        // ceates url
        var url = this.host + typename.split(":")[0] + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typename + "&outputFormat=application/json&srsName=EPSG:4326"+cql_filter;

		// Si on fait des styles complexes sur les layers alors style_orig doit être  accompagné de la fonction
		// Ou alors on relance la fonction point to layer
		// Si le layer est dynamique, alors il se rechargera facilement !!!! et tt seul !!

        // Reference the layer before ajax creation for manager
        map_block.layers[name] = {
            name: name, 
            type:"wfs",
            block: map_block,
            layer: "", 
            actif: false, 
            theme: theme, 
            id_prefix: id_prefix,
            typename:typename,
            legend_carriage:legend_carriage,
            id: typename.split(":")[1]+id_prefix,
            fonction: fonction,
            fonction_desc: fonction_desc,
            style_orig: style_dict,
            multi_style: multi_style, // Second style
            dual: dual, // Second style
            visible: visible,
            legend_title: legend_title,
            tooltip: tooltip, 
            cql_filter: cql_filter, 
            in_legend: in_legend, 
            popup: popup, 
            mouseover: mouseover, 
            zoomonclick: zoomonclick, 
            territoireonclick: territoireonclick, 
            header: header, 
            active_style: 0, 
            unique: unique, 
            attributes_dict: attributes_dict, 
            // zoom: zoom, 
        };  

        map_block.layers[name].getClasse = function(val, grades){
            for (var igrade in grades){
                if (val <= grades[igrade][0]){
                    return grades[igrade];
                };
            };
            console.log("Error getClasse() val out of grades range");
            console.log(val);
            console.log(grades[igrade][0]);
            return;
        };            
        
        // Reference the layer options before ajax creation for manager
        
        map_block.layers[name]["layer"] = {
            id: typename.split(":")[1]+id_prefix, 
            options: {minZoom: zoom_levels[0], maxZoom: zoom_levels[1]},
        };
		
		// load = true;
		// if (load == false) {
			// console.log("NOT LOADING LAYER");
			// map_block.spinstop();
			// return;
		// };

		$.ajax({
			type: "GET", 
			url: url,
			dataType: 'json',  
            beforeSend:function(jqXHR, settings){
                jqXHR.obj = this;    
                jqXHR.style_dict = style_dict;
                jqXHR.id_prefix = id_prefix;
                jqXHR.name = name;
                jqXHR.name_field = name_field;
                jqXHR.pane = pane;
                jqXHR.zoom = zoom;
                jqXHR.popup = popup;
                jqXHR.mouseover = mouseover;
                jqXHR.zoomonclick = zoomonclick;
                jqXHR.territoireonclick = territoireonclick;
                jqXHR.attributes_dict = attributes_dict;
            },            
			success: function(response,textStatus,jqXHR){
                
                
                // Si on demande un calcul auto des jenks alors on le fait avec tous les éléments de la réponse.
				// On sauvegarde les jenks calculés sur le layer
                if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.jenks != "undefined") ) {
                    map_block.layers[jqXHR.name].style_orig.jenks_calcules =  calc_jenks(response, jqXHR.style_dict.jenks.field, jqXHR.style_dict.jenks.njenks, jqXHR.style_dict.jenks.colorscale);
				};
                
                
                base_color = jqXHR.style_dict.fillColor; // FIXME: Can be passed in local SCOPE ?  Bug when creating legend
                
                map_block.spinstart();
                  
                var wfs_layer = L.geoJson(response, {
                    id: typename.split(":")[1]+jqXHR.id_prefix,
                    minZoom: zoom_levels[0],
                    maxZoom: zoom_levels[1],  
                    style: function (feature) {
                        
                        if ( (jqXHR.style_dict == false) && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1)) {
                            // Si pas de dictionnaire de style
                            return {
                                pane: jqXHR.pane,
                                stroke: true,
                                weight: 2,
                                color: "#3498DB",
                                fillColor: '#3498DB',
                                fillOpacity: .2
                            };
                         
                            
                            
                        } else if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.classes != "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) )  { 
                            // Si dictionnaire et geom polygon avec catégories
                            // console.log("GEOM POLY CATEGORY");
                            jqXHR.style_dict[jqXHR.style_dict.classes.param] = map_block.layers[jqXHR.name].getClasse(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades)[1];                      
                            return jqXHR.style_dict;

                

                        } else if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.jenks != "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) )  {    
                            // Si on a des jenks calculés automatiquement
                            // console.log("JENKS");
                            
                            // jqXHR.style_dict[jqXHR.style_dict.jenks.param] = find_jenks_color(jqXHR.style_dict.jenks_calcules, feature.properties[jqXHR.style_dict.jenks.field]);
                            jqXHR.style_dict[jqXHR.style_dict.jenks.param] = find_jenks_color(map_block.layers[name].style_orig.jenks_calcules, feature.properties[jqXHR.style_dict.jenks.field]);
                            return jqXHR.style_dict;
                            
                        } else if (("Point","MultiPoint").indexOf(response.features[0].geometry.type) > -1) {
                            // console.log("GEOM MULTIPOINT");
                            return; // Gêré avec pointToLayer
                        // } else if ( (jqXHR.style_dict != false) && (jqXHR.style_dict.categories == "undefined") && (("LineString","MultiLineString").indexOf(response.features[0].geometry.type) > -1) )  {                            
                        } else if ( (jqXHR.style_dict != false) && (("LineString","MultiLineString").indexOf(response.features[0].geometry.type) > -1) )  {                            
                            // console.log("GEOM MULTILINESTRING");
                            return jqXHR.style_dict;
                        } else {                           
                            return jqXHR.style_dict;
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        
                        function traitement_valeur(valeur){
                            if (isInteger(valeur)) {
                                return valeur;
                            } else if (isNaN(Math.round(valeur))) {
                                return feature.properties[ip];
                            } else {
                                if (Math.round(valeur) > 99) {
                                    return Math.round(valeur);
                                } else {
                                    return Number(valeur).toFixed(1);
                                };
                            };                            
                        }; 
                        
                        // Récupération du nom de l'objet
                        if (jqXHR.name_field == false) {var name_field = jqXHR.name;} else {var name_field = feature.properties[jqXHR.name_field]}; 
                        
                        // Création du popup 
                        if (jqXHR.popup == true) {
						
							var html = '<div class="popup-wfs">';
							html += '<div class="popup-wfs-title">'+name_field+'</div>';
							html += '<div class="row scroller no-gutters popup-data-row">';
							
							// Si on a un dictionnaire de mapping alors on l'utilise
							if (jqXHR.attributes_dict != false){
								for (ip in jqXHR.attributes_dict){
									var the_val = traitement_valeur(feature.properties[ip]);
									html += '<div class="col-md-6 popup-wfs-field">'+ jqXHR.attributes_dict[ip] + '</div>';  
									html += '<div class="col-md-6 popup-wfs-val" style="overflow:hiden;">'+ the_val + '</div>';                                      
								};
							// Sinon on boucle sur toutes les propriétés
							} else {  
								for (var ip in feature.properties) {
									// On affiche pas par défaut certains champs
									if (["gid", "geom"].indexOf(ip) == -1){
										var the_val = traitement_valeur(feature.properties[ip]);
										html += '<div class="col-md-6 popup-wfs-field">'+ ip + '</div>';  
										html += '<div class="col-md-6 popup-wfs-val" style="overflow:hiden;">'+ the_val + '</div>';                                 
									};
								};
							};
							html += '</div>';                                               
							html += '</div>';
							
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
							
                        // if (jqXHR.popup == true) {
                            layer.bindPopup(popup);
                        };
                        
                        
                        
                        // Création d'un tooltip si demandé
                        if (map_block.layers[name].tooltip != false) {
                           
                            // Récupération des valeurs pour les champs indiqués
                            var splited_content = map_block.layers[name].tooltip.content.split('*');
                            var final_content = "";
                            for (var iv in splited_content){
                                if (splited_content[iv].charAt(0) != "_") {
                                    final_content += splited_content[iv];
                                } else {
                                    final_content += feature.properties[splited_content[iv].slice(1)];
                                };
                            };
                            
                            // On attache le tooltip à l'objet
                            layer.bindTooltip(final_content, map_block.layers[name].tooltip.params);
                        };
                        
                        
                        if (jqXHR.mouseover == true) {
                            layer.on({
                                mouseover: function highlightFeature(e) {
                                    var highlightLayer = e.target;
                                    if (e.target.feature.geometry.type === 'Point') {
                                        if ( (typeof jqXHR.style_dict.classes != "undefined") && (jqXHR.style_dict.classes.param == "radius") ) {
                                            highlightLayer.setStyle({
                                                color: "yellow",
                                                weight:2,
                                            });                                    
                                        } else {
                                            highlightLayer.setStyle({
                                                radius: e.sourceTarget._radius * 1.5,
                                            });
                                        };
                                    } else if ( (e.target.feature.geometry.type === 'MultiPolygon') || (e.target.feature.geometry.type === 'Polygon') ){
                                        // if ( (typeof jqXHR.style_dict.classes != "undefined") && (jqXHR.style_dict.classes.param == "radius") ) {
                                            // highlightLayer.setStyle({
                                                // color: "yellow",
                                                // weight:2,
                                            // });                                    
                                        // } else {
                                            highlightLayer.setStyle({
                                                weight: jqXHR.style_dict.weight * 6,
                                                color: "#3DE0F5",
                                            });
                                        // };                                
                                    };
                                },
                                mouseout: function highlightFeature(e) {
                                    var highlightLayer = e.target;
                                    if (e.target.feature.geometry.type === 'Point') {
                                        if ( (typeof jqXHR.style_dict.classes != "undefined") && (jqXHR.style_dict.classes.param == "radius") ) {
                                            highlightLayer.setStyle({
                                                color: jqXHR.style_dict.color,
                                                weight: jqXHR.style_dict.weight,
                                            });                                    
                                        } else {
                                            highlightLayer.setStyle({
                                                radius: e.sourceTarget._radius / 1.5,
                                            });
                                        };                                
                                    } else if ( (e.target.feature.geometry.type === 'MultiPolygon') || (e.target.feature.geometry.type === 'Polygon') ){
                                        highlightLayer.setStyle({
                                            weight: jqXHR.style_dict.weight,
                                            color: jqXHR.style_dict.color,
                                        });                                    
                                    };
                                },  
								click: function zoomToFeature(e){
                                    console.log("FEATURE CLICK");
									L.DomEvent.stop(e);
									// app.blocks.mapview.map.fitBounds(e.target.getBounds());
								},
                            });
                        };
 
                        if (jqXHR.zoomonclick == true) {
                            layer.on({
								click: function zoomToFeature(e){
                                    cnsole.log("ZOOM CLICK FEATURE");
									
									// On stoppe ilmmédiatement la propagation du click aux autres layers 
									L.DomEvent.stop(e);
									
									app.blocks.mapview.map.fitBounds(e.target.getBounds());

									app.blocks.mapview.get_territoire(
										e.target.feature.properties.nom_epci, e.target.feature.properties.siren_epci
									);
			
								},
                            });
                        };

                        if (jqXHR.territoireonclick == true) {
                            layer.on({
								click: function territoireFeature(e){

									app.blocks.select_zones.set_val(e.target.feature.properties.nom_epci);

									// app.blocks.mapview.get_territoire(
										// e.target.feature.properties.nom_epci, e.target.feature.properties.siren_epci
									// );			
									
									app.blocks.select_zones.change();
									// app.territoire = e.target.feature.properties.nom_epci;
									// app.territoire_token = e.target.feature.properties.siren_epci;									
									// cigale_infos_epci(); // FIXME: Faire un window.launch avec app.territoire fuunction
			
								},
                            });
                        };
 
                        return jqXHR.style_dict;
                        
                    },
                    pointToLayer: function(feature, latlng) {

                        // FIXME: On charge plein de point to layer en même temps?
                        if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.categories != "undefined") ) {
                            // Si ponctuel et symbologie par catégories
                            var markerStyle = {
                                pane: jqXHR.pane,
                                radius: jqXHR.style_dict.radius,
                                fillColor: jqXHR.style_dict.categories.values[feature.properties[jqXHR.style_dict.categories.field]],
                                color: jqXHR.style_dict.color,
                                weight: jqXHR.style_dict.weight,
                                opacity: jqXHR.style_dict.opacity,
                                fillOpacity: jqXHR.style_dict.fillOpacity, 
                            }; 
                        } else if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.classes != "undefined") ) {
                            // Si ponctuel et symbologie par classes 
                            var markerStyle = jqXHR.style_dict; 
                            markerStyle[jqXHR.style_dict.classes.param] = map_block.layers[jqXHR.name].getClasse(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades)[1]; 
    
                            // On pourrait également avoir un param restrictif pour changer uniquement fill_color
                            if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.classes.special != "undefined") ) {

                                if (feature.properties[jqXHR.style_dict.classes.special.field] === jqXHR.style_dict.classes.special.val_field) {
                                    markerStyle[jqXHR.style_dict.classes.special.param] = jqXHR.style_dict.classes.special.val;
                                } else {
                                    markerStyle["fillColor"] = base_color;
                                };   
                            };

                        } else if (jqXHR.style_dict != false) {
                            var markerStyle = jqXHR.style_dict;                            
                        } else {
                            var markerStyle = {
                                pane: jqXHR.pane,
                                radius: 8,
                                fillColor: "#bd15c0",
                                color: "#bd15c0",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.5 
                            };                          
                        };
                        
                        return new L.CircleMarker(latlng, markerStyle);
                    },
                });
                                
                // Update layers reference
                map_block.layers[name]["layer"] = wfs_layer;               
                
				// Fonction de suppression
				map_block.layers[name].remove = function (the_map){
					the_map.removeLayer(map_block.layers[name].layer);
				};
				
                // console.log(wfs_layer);

                // Deals with legend 
                // this.getLegendWFS = function(typename, name, text, legend_carriage, style_dict){
                if (map_block.layers[name].legend_title == false) {
                    var text=name;                  
                }else{
                    var text=map_block.layers[name].legend_title;                      
                };   
  
                    
                // map_block.layers[name]["legend"] = {div_id: typename.split(":")[1]+jqXHR.id_prefix, html: obj.getLegendWFS(typename, typename.split(":")[1]+jqXHR.id_prefix, name, legend_carriage, jqXHR.style_dict)};        
                map_block.layers[name]["legend"] = {div_id: typename.split(":")[1]+jqXHR.id_prefix, html: obj.getLegendWFS(typename, typename.split(":")[1]+jqXHR.id_prefix, text, legend_carriage, jqXHR.style_dict)};        
     
                if (add2map == true) {
 
                    // On coche la checkbox uniquement si la couche est managée (a une checkbox)
                    if (typeof $("#chk-"+map_block.layers[name].id)[0] !== 'undefined'){
                        $("#chk-"+map_block.layers[name].id)[0].checked = true;
                    };

                    if (map_block.layers[name].layer.options.minZoom > app.blocks.mapview.map.getZoom() || app.blocks.mapview.map.getZoom() > map_block.layers[name].layer.options.maxZoom) {
                    } else {
                        map_block.layers[name].layer.addTo(map_block.map);   
                        map_block.layers[name].actif = true;
                        // On ajoute le layer à la légende si demandé et uniquement si il y a des objets dans la couche
                        if (    (map_block.layers[name].in_legend == true) && (Object.keys(map_block.layers[name].layer._layers).length > 0)   ){
                        // if (map_block.layers[name].in_legend == true){
                            // map_block.removeToLegend(map_block.layers[name]["legend"].html);    
							map_block.removeToLegend(map_block.layers[name].id);
                            map_block.addToLegend(map_block.layers[name]["legend"].html);                  
                        };
                    };
                    
					// Si le layer est unique on l'enregistre dans l'app 					
					if (map_block.layers[name].unique != false){
						app.active.layer = name; 
                    };
                };                
                
                // Zoom to layer if asked
                if (jqXHR.zoom == true) {
                    // console.log("DEBUG - Zooming to "+name);
                    // Uniquement si la couche contiens des objets
                    if ( jQuery.isEmptyObject(map_block.layers[name].layer._layers) != true){
                        app.blocks.mapview.map.fitBounds(map_block.layers[name].layer.getBounds());

						// Refresh map
						// app.blocks.mapview.map.invalidateSize();
						// app.blocks.mapview.map._onResize();							
                    };
                };
                                
                layersVisibility(app.blocks.mapview.map.getZoom());
                
                map_block.spinstop();
			},       
		});
    };     
    
    this.CreatelayerEnConstruction = function (name, typename, map_block, add2map, zoom_levels, theme, dict_args) {
        // Un layer vide avec les même propriétés que les autres
        
        if ( (dict_args != null) && (dict_args.header != null) ) {var header = dict_args.header;} else {var header = false}; 
        if ( (dict_args != null) && (dict_args.tooltip != null) ) {var tooltip = dict_args.tooltip;} else {var tooltip = false;}; 
        
        var id_prefix = Number(new Date());
        
        map_block.layers[name] = {
            name: name, 
            type:"",
            block: map_block,
            layer: "", 
            actif: false, 
            theme: theme, 
            id_prefix: id_prefix,
            typename:typename,
            id: "LayerUnderConstruction"+id_prefix,
            tooltip: tooltip, 
            header: header, 
            dual: false,
            visible: true,
            fonction_desc: false,
        };

        // Wait one millisecond for id prefixes to be updated correctly      
        sleep(1);
    };
    
};



