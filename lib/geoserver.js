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
        
        if (style_dict != false){
            // Si on a un dictionnaire de style
            if (typeof style_dict.categories != "undefined"){
                // Si on a des catégories 
                html += text + "</br>";
                for (var cat in style_dict.categories.values){
                    html += '<i class="colorcircle" style="background:' + style_dict.categories.values[cat] + '"></i>'+cat+'</br>';
                };
            } else if (typeof style_dict.classes != "undefined"){
                if (style_dict.classes.param == "radius" ){
                    // Si on a des classes par taille
                    // FIXME: Solution de secours, on prend le min, max
                    // FIXME: Comment avoir la même proportionalité de sympols que sur le carte ?                
                
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
        if ( (dict_args != null) && (dict_args.header != null) ) {var header = dict_args.header;} else {var header = false}; 
        if ( (dict_args != null) && (dict_args.fixed_id != null) ) {var id_prefix = dict_args.fixed_id;} else {var id_prefix =  new Date(Date.now()).getTime();}; 
      
        // ceates url
        var url = this.host + typename.split(":")[0] + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typename + "&outputFormat=application/json&srsName=EPSG:4326"+cql_filter;

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
            header: header, 
            active_style: 0, 
            // zoom: zoom, 
        };  

        map_block.layers[name].getClasse = function(val, grades){
            // console.log("DEBUG getClasse("+val+" | "+grades+")");
            for (var igrade in grades){
                if (val <= grades[igrade][0]){
                    // console.log("... " + grades[igrade]);
                    return grades[igrade];
                };
            };
            console.log("Error getClasse() val out of grades range");
            return;
        };            
        
        // Reference the layer options before ajax creation for manager
        
        map_block.layers[name]["layer"] = {
            id: typename.split(":")[1]+id_prefix, 
            options: {minZoom: zoom_levels[0], maxZoom: zoom_levels[1]},
        };

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
            },            
			success: function(response,textStatus,jqXHR){
                
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
                        // } else if ( (jqXHR.style_dict != false)  && (jqXHR.style_dict.categories == "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) ) {
                            // return jqXHR.style_dict;
                        } else if ( (jqXHR.style_dict != false) && (jqXHR.style_dict.categories == "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) )  {
                            // Si dictionnaire et geom polygon 
                            // console.log("GEOM POLY");
                            return jqXHR.style_dict;
                        } else if ( (jqXHR.style_dict != false) && (jqXHR.style_dict.categories != "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) )  {
                            // Si dictionnaire et geom polygon avec catégories
                            // return jqXHR.style_dict;
                            // jqXHR.style_dict[jqXHR.style_dict.classes.param] = getClasse(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades)[1];
                            // console.log(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades);
                            // jqXHR.style_dict[jqXHR.style_dict.classes.param] = getClasse(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades)[1];
                            
                            // jqXHR.style_dict[jqXHR.style_dict.classes.param] = "#DA430E";
							
                            if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.classes != "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) )  { 
                                jqXHR.style_dict[jqXHR.style_dict.classes.param] = map_block.layers[jqXHR.name].getClasse(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades)[1];                        
								// console.log(jqXHR.style_dict);
							};
                            // console.log(jqXHR.style_dict);
                            // console.log("GEOM POLY CATEGORY");
                            return jqXHR.style_dict;
                        } else if (("Point","MultiPoint").indexOf(response.features[0].geometry.type) > -1) {
                            // console.log("GEOM MULTIPOINT");
                            return; // Gêré avec pointToLayer
                        // } else if ( (jqXHR.style_dict != false) && (jqXHR.style_dict.categories == "undefined") && (("LineString","MultiLineString").indexOf(response.features[0].geometry.type) > -1) )  {                            
                        } else if ( (jqXHR.style_dict != false) && (("LineString","MultiLineString").indexOf(response.features[0].geometry.type) > -1) )  {                            
                            // console.log("GEOM MULTILINESTRING");
                            return jqXHR.style_dict;
                        } else {                           
                            console.log("WARNING - Style case note taken into account");
                            // console.log(response.features[0].geometry.type);
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        /*
                        // Si polygones par classes on traite le style ici pour chaque objet
                        if ( (jqXHR.style_dict != false) && (typeof jqXHR.style_dict.classes != "undefined") && (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) )  {   
                            jqXHR.style_dict[jqXHR.style_dict.classes.param] = map_block.layers[jqXHR.name].getClasse(feature.properties[jqXHR.style_dict.classes.field], jqXHR.style_dict.classes.grades)[1];                        
                            
                            // jqXHR.style_dict[jqXHR.style_dict.classes.param] = "#DA430E";
                            // console.log("Result "+feature.properties["nom_epci_2018"]+" = " + jqXHR.style_dict[jqXHR.style_dict.classes.param]);
                        };
                         */
                        if (jqXHR.name_field == false) {var name_field = jqXHR.name;} else {var name_field = feature.properties[jqXHR.name_field]}; 
                        
                        var html = '<div class="popup-wfs">';
                        
                        html += '<div class="popup-wfs-title">'+name_field+'</div>';
                        
                        // for (ip in feature.properties) {
                            // html += '<div class="popup-wfs-field">'+ ip + ' <div class="popup-wfs-val">' + feature.properties[ip] + "</div>";
                        // };  
                        html += '<div class="row scroller no-gutters popup-data-row">';
                        for (var ip in feature.properties) {
                            html += '<div class="col-md-6 popup-wfs-field">'+ ip + '</div>';         

                            // Gestion de l'affichage selon le format de variable
                            // if (Number.isInteger(feature.properties[ip])) { // Ne fonctionne pas sous IE
                            if (isInteger(feature.properties[ip])) {
                                var the_val = feature.properties[ip];
                            } else if (isNaN(Math.round(feature.properties[ip]))) {
                                var the_val = feature.properties[ip];
                            } else {
                                if (Math.round(feature.properties[ip]) > 99) {
                                    var the_val = Math.round(feature.properties[ip]);
                                } else {
                                    var the_val = Number(feature.properties[ip]).toFixed(1);
                                };
                            };
                            
                            html += '<div class="col-md-6 popup-wfs-val" style="overflow:hiden;">'+ the_val + '</div>'; 
                            
                        };
                        html += '</div>';                        
                        
                        // html += '<div>Get Data</div>';
                        
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
                        
                        if (jqXHR.popup == true) {
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
                                    } else if (e.target.feature.geometry.type === 'MultiPolygon'){
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
                                    } else if (e.target.feature.geometry.type === 'MultiPolygon'){
                                        highlightLayer.setStyle({
                                            weight: jqXHR.style_dict.weight,
                                            color: jqXHR.style_dict.color,
                                        });                                    
                                    };
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
                            // console.log();
                            // console.log("****");
                            // map_block.removeToLegend(map_block.layers[name]["legend"].html);    
							map_block.removeToLegend(map_block.layers[name].id);
                            map_block.addToLegend(map_block.layers[name]["legend"].html);                  
                        };
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



