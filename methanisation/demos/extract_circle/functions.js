var app = {
    layers: {},
    baseLayer: "", 
};

function spinner_start(div_id) {
    var the_spinner = new Spinner({opacity: 0.25, width: 3, color: "#3498DB", speed: 1.5, scale: 3, }); // top:"50%", left:"60%",
    // var the_spinner_element = document.getElementById('map');
    var the_spinner_element = document.getElementById(div_id);

    the_spinner.spin(the_spinner_element);
    return the_spinner;
};

function createMap(){

    app.legend = L.control({position: 'bottomright'});

    var map = L.map('map', {zoomControl:false, layers: []}).setView([43.9, 6.0], 8);    
    map.attributionControl.addAttribution('<a href="https://www.geres.eu/fr/">GERES</a>&copy; | <a href="https://www.atmosud.org/">AtmoSud</a>&copy; | <a href="http://www.openstreetmap.org/copyright">OSM</a>&copy;');    
    
    /*
    BASEMAP
    */

    // ESRI World Map
    var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri'
    });    
    // Esri_WorldTopoMap.addTo(map);
    app.baseLayer = Esri_WorldTopoMap;
    app.baseLayer.addTo(map);
    
    // Geoportail Ortho 
    var GeoportailFrance_orthos = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
        attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        bounds: [[-75, -180], [81, 180]],
        minZoom: 2,
        maxZoom: 19,
        apikey: 'choisirgeoportail',
        format: 'image/jpeg',
        style: 'normal'
    });    
    // GeoportailFrance_orthos.addTo(map);
    

   
    
    map.on('zoomend', function () {
        /*
        Manage layers according to zoom levels
        Can be usefull: && map.hasLayer(wms_layer) == false/true
        */
        zoom_to_level = 12;
        if (map.getZoom() < zoom_to_level) {
            console.log("zoom < " + zoom_to_level);
            map.removeLayer(GeoportailFrance_orthos);
            app.baseLayer.addTo(map);
            map.removeLayer(app.layers["cigale:ddg_classe_final"].layer_object);
            // map.removeLayer(app.layers["cigale:rom_step"].layer_object);
            map.addLayer(app.layers["cigale:dbg_grdf_reseau_5km"].layer_object);
            map.addLayer(app.layers["cigale:dbg_grdf_reseau_5_10km"].layer_object); 
        };
        if (map.getZoom() >  zoom_to_level) {
            console.log("zoom > " + zoom_to_level);                     
            map.removeLayer(app.baseLayer);
            GeoportailFrance_orthos.addTo(map);
            map.removeLayer(app.layers["cigale:dbg_grdf_reseau_5km"].layer_object);
            map.removeLayer(app.layers["cigale:dbg_grdf_reseau_5_10km"].layer_object);            
            map.addLayer(app.layers["cigale:ddg_classe_final"].layer_object);    
            // map.addLayer(app.layers["cigale:rom_step"].layer_object);              
        };   
    });      

 

 
// #################################################################################################
// Leaflet Draw 
// #################################################################################################

L.drawLocal.draw.toolbar.buttons.circle = 'Statistiques personnalisée';
L.drawLocal.draw.handlers.circle.tooltip.start = 'Cliquer puis laisser appuyé pour définir une zone';
 

var drawnItems = new L.FeatureGroup();
drawnItems = L.featureGroup().addTo(map);
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: false,
    draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        marker: false,        
        circle: {}, // shapeOptions: {color: '#ffffff'}
    },    
    edit: {
        featureGroup: drawnItems,
        // remove: false,
    }
});
map.addControl(drawControl); // On devrait pouvoir ajouter ou supprimer le controle en appuyant sur un bouton 


map.on(L.Draw.Event.CREATED, function (e) {
    
    drawnItems.clearLayers();
    $('#result').html("");
        
    // var type = e.layerType,
    layer = e.layer;
    

    // TODO: En faire une fonction car on l'utilise aussi si utilisateur édite le layer (en dessous)
    var theCenterPt = layer.getLatLng();
    var center = [theCenterPt.lng,theCenterPt.lat]; 
    var radius = layer.getRadius();
    console.log(center, radius);

    // Call PostGIS function to extract data according to circle from center and radius
    $('#result').html("Extraction des données pour center: " + center + " et radius : " + radius);
        
    // if (type === 'marker') {
        // layer.bindPopup('A popup!');
    // }

    drawnItems.addLayer(layer);
    
    // Appel de la fonction qui fait la recherche
    rechercher(center, radius);    
    
});

 // map.on('draw:edited', function (e) {
map.on(L.Draw.Event.EDITSTOP, function (e) {
    // layer = e.layer;
        
    var theCenterPt = layer.getLatLng();
    var center = [theCenterPt.lng,theCenterPt.lat]; 
    var radius = layer.getRadius();
    console.log(center, radius);
    
    $('#result').html("Extraction des données pour center: " + center + " et radius : " + radius);
    
    // Appel de la fonction qui fait la recherche
    rechercher(center, radius);
    
 });




 
 
 
 
 
 
 
// ********
// Création manuelle sans module
// ********

/*
var theMarker = {};
var circle = {};

map.on('click',function(e){
    lat = e.latlng.lat;
    lon = e.latlng.lng;

    console.log("You clicked the map at LAT: "+ lat+" and LONG: "+lon );
    //Clear existing marker, 

    if (theMarker != undefined) {
        map.removeLayer(theMarker);
    };
    if (circle != undefined) {
        map.removeLayer(circle);
    };        

    //Add a marker to show where you clicked.
    theMarker = L.marker([lat,lon]).addTo(map); 

    // Add circle
    circle_radius = 2000.0;
    circle = L.circle([lat,lon], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: circle_radius
    }).addTo(map); 
    
});

*/

// ********
// ********



    return map;
};


// Fonction ajax qui extrait des données sur le serveur à partir des coordonnés
function rechercher(center, radius) {
    
    $.ajax({
        type: "GET",
        url: "recherche.php",
        dataType: 'json',   
        data: {
            "center": center[0] + ", " + center[1],
            "radius": radius,
        },        
        success: function(response,textStatus,jqXHR){
            $('#result2').html("<h1>Il y a " + response[0].nb + " IAA dans la zone</h1>");
        },
        error: function (request, error) {
            $('#result2').html("");
            console.log(arguments);
            console.log("Ajax error: " + error);
        },        
    });	    
};
 


var geoserver = {
    /*
    Geoserver object
	@url: http[s]://yourHost/geoserver/
    */
    host: "https://geoservices.atmosud.org/geoserver/", 
    
    getCapabilities_wfs : function() {
        /*
        Rerturn capabilities doc
        */
		$.ajax({
			type: "GET",
			url: this.host + "wfs?service=WFS&version=1.1.0&request=GetCapabilities", 
			dataType: 'xml',  
			success: function(response,textStatus,jqXHR){				
				return response;
			},       
		});
    },

    lfCreateLayerWMS: function (typename, map, add2map) {

        // Starts spinner
        var the_spinner = spinner_start('map');
        
        url = this.host + typename.split(":")[0] + "/wms?";
                
        wms_params = {
            name: typename.split(":")[1],
            layers: typename.split(":")[1],
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            dj: 0,
            subtitle: typename.split(":")[1],
        }; 
        
        wms_layer = L.tileLayer.wms(url, wms_params);
       
        app.layers[typename] = {layer_object: wms_layer, "actif": true, "type": "wms"};
       
        if (add2map == true) {
            app.layers[typename].layer_object.addTo(map);   
        };

        // Creates and add legend
        // generate_legend(typename);
        
        // Starts spinner
        the_spinner.stop();        
    },      

    lfCreateLayerWFS: function (typename, map, add2map, fillColor, radius, fillOpacity) {
        
        // Starts spinner
        var the_spinner = spinner_start('map');
               
        // ceates url
        url = this.host + typename.split(":")[0] + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typename + "&outputFormat=application/json&srsName=EPSG:4326";
        // console.log(url);
        
		$.ajax({
			type: "GET", 
			// url: this.host + "emi_sudpaca_epci/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=emi_sudpaca_epci:emi_sudpaca_epci_2016&outputFormat=application/json&srsName=EPSG:4326",
			url: url,
			dataType: 'json',  
            beforeSend:function(jqXHR, settings){
                jqXHR.the_spinner = the_spinner;    
            },            
			success: function(response,textStatus,jqXHR){
                WFSLayer = L.geoJson(response, {
                    style: function (feature) {
                        if (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) {
                            return {
                                stroke: true,
                                weight: 1,
                                color: "#3498DB",
                                fillColor: '#3498DB',
                                fillOpacity: .2
                            };
                        } else if (("Point","MultiPoint").indexOf(response.features[0].geometry.type) > -1) {
                            return; // Gêré avec pointToLayer
                        } else {
                            console.log("ERROR - Geometry type unknown");
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        html = "";
                        for (ip in feature. properties) {
                            html += ip + ": " + feature.properties[ip] + "</br>";
                        };
                        
                        layer.bindPopup(html, {maxWidth: 200, maxHeight: 200});
                            
                    },
                    pointToLayer: function(feature, latlng) {
                        markerStyle = {
                            radius: radius, // 8,
                            fillColor: fillColor, // "#3498DB",
                            color: "#2963AE",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: fillOpacity 
                        };                          
                        
                        return new L.CircleMarker(latlng, markerStyle);
                    },
                });
               
                // app.active_layer = WFSLayer;
                app.layers[typename] = {layer_object: WFSLayer, "actif": true, "type": "wfs"};
                
                // dfdf
                if (add2map == true) {
                    // console.log("** " + typename);
                    app.layers[typename].layer_object.addTo(map);   
                };
               
                // Starts spinner
                jqXHR.the_spinner.stop();
			},       
		});
    },  

    
};





/*

var app = {
    active_layer: "",
};

function extract_year_text(text){    
    for (var ian = 1990; ian < 2050; ian++) {
        var re = new RegExp(ian.toString(), 'g');
        found = text.match(re);
        if (found !== null) {
            return found[0]; 
        };
    };    
    return null;
};

function find_yesterday() {
    today = new Date();
    today.setDate(today.getDate() - 1);    
    dd = today.getDate();
    mm = today.getMonth()+1; //January is 0!
    yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = mm + '/' + dd + '/' + yyyy;
    return today;
};

function createMap(){

    app.legend = L.control({position: 'bottomright'});

    var map = L.map('map', {zoomControl:false, layers: []}).setView([43.9, 6.0], 8);    
    map.attributionControl.addAttribution('<a href="https://www.atmosud.org/">AtmoSud</a>&copy; | <a href="http://www.openstreetmap.org/copyright">OSM</a>&copy;');    
    var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        maxZoom: 18,
        opacity: 0.5,
    });
    Hydda_Full.addTo(map);
    return map;
};

function generate_legend_classes(typename){
    
    app.legend.onAdd = function (map) {

        // Création de l'objet légende
        var div = L.DomUtil.create('div', 'legend');
        
        // Légende en fonction de la couche et du template recherché
        // Pour chaque objet légende de la catégorie
        if (typeof app.cfg["categories"][app.categorie]["legend-grades"] !== 'undefined') {
            Object.keys(app.cfg["categories"][app.categorie]["legend-grades"]).forEach(function(key) {
                
                var re = new RegExp(key, 'g');
                found = typename.match(re);
                if (found !== null) {

                    console.log(app.cfg["categories"][app.categorie]["legend-grades"][key]["grades"]);
                
                    // Extract year from typename if exists
                    legend_year = extract_year_text(typename);        
                    
                    var grades = app.cfg["categories"][app.categorie]["legend-grades"][key]["grades"];
                    var labels = [];
                    var title = app.cfg["categories"][app.categorie]["legend-grades"][key]["title"];
                    var subtitle = app.cfg["categories"][app.categorie]["legend-grades"][key]["subtitle"];
                    
                    for (var i = 0; i < grades.length - 1; i++) {
                        from = grades[i][0];
                        to = grades[i+1][0];            
                        labels.push('<i class="colorcircle" style="background:' + grades[i][1] + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
                    };
                    
                    div.innerHTML = title+" "+legend_year+ "</br>" + subtitle +"</br>" + labels.join('<br>');
                };  
            });        
        };
        
        // Si pas de légende trouvée
        if (div.innerHTML == "") {
            div.innerHTML = "Aucune légende disponible"; 
        };
        
        return div;
    };
    app.legend.addTo(map);    
};

function generate_legend(typename){
    
    app.legend.onAdd = function (map) {

        // Création de l'objet légende
        var div = L.DomUtil.create('div', 'legend');
        if (typeof app.cfg["categories"][app.categorie]["legend-grades"] !== 'undefined') {
            Object.keys(app.cfg["categories"][app.categorie]["legend-grades"]).forEach(function(key) {
                
                var re = new RegExp(key, 'g');
                found = typename.match(re);
                if (found !== null) {            
                
                    var title = app.cfg["categories"][app.categorie]["legend-grades"][key]["title"];
                    var subtitle = app.cfg["categories"][app.categorie]["legend-grades"][key]["subtitle"];
                    legend_year = extract_year_text(typename); 
                    
                    div.innerHTML = title+" "+legend_year+ "</br>" + subtitle +"</br>" + '<img src="https://geoservices.atmosud.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&HEIGHT=10&LAYER='+typename+'&legend_options=fontColor:0x95a5a6;dx:5.2;dy:0.2;mx:0.2;my:0.2;&TRANSPARENT=true" alt="lgd" />';
                };
            });
        }; 
        
        // Si pas de légende trouvée
        if (div.innerHTML == "") {
            div.innerHTML = "Aucune légende disponible"; 
        };        
        
        return div;
    };
    app.legend.addTo(map);    
};


function zone_attributs(logical) {
    if (logical == 'false') {
        // console.log(logical);
        $("#map-viewport").attr('class', 'col-lg-8 map-col');
        $("#left-viewport").attr('class', 'col-lg-4 desc-col');
    } else {
        // console.log(logical);
        $("#map-viewport").attr('class', 'col-lg-4 map-col');
        $("#left-viewport").attr('class', 'col-lg-8 desc-col');
    };
};

function modal_url(standard, typename){   
    
    // Set standard in app params
    app.url_standard = standard;
    app.url_typename = typename;
    
    // General
    html_modal = '<div class="p-3 mb-2 text-white bg-color-blue text-split">Dans votre SIG Desktop:</br>'+geoserver.host + app.url_typename.split(":")[0] + '/ows/?service='+app.url_standard+'&request=GetCapabilities</div>';    
    
    // Ouverture des menus
    html_modal += '<div class="dropdown modal-list">';
 
    // Choix de la projection
    html_modal += '<div class="row">Projection';    
    html_modal += '<button id="id_projections" class="w-100 btn btn-light dropdown-toggle btn-sm" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    html_modal += app.cfg['projections']["2154"];
    html_modal += '</button>';
    html_modal += '<div class="dropdown-menu">';       
    for (proj in app.cfg['projections']) {
        // html_modal += '<a class="dropdown-item" href="#" onclick="$(\'#id_projection\').html(\''+app.cfg['projections'][proj]+'\');">'+app.cfg['projections'][proj]+'</a>';
        html_modal += '<a class="dropdown-item" href="#" onclick="$(\'#id_projections\').html(\''+app.cfg['projections'][proj]+'\');">'+app.cfg['projections'][proj]+'</a>';
    };    
    html_modal += '</div>';
    html_modal += '</div>';

    // Création des listes en fonction du standard
    params = {};
    for (param in app.cfg["standards-params"][standard]) {
        html_modal += '<div class="row">' + param;    
        html_modal += '<button id="id_'+param+'" class="w-100 btn btn-light dropdown-toggle btn-sm" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        html_modal += app.cfg["standards-params"][standard][param][0];
        html_modal += '</button>';
        html_modal += '<div class="dropdown-menu">';          
        for (ival in app.cfg["standards-params"][standard][param]) {
            html_modal += '<a class="dropdown-item" href="#" onclick="$(\'#id_'+param+'\').html(\''+app.cfg["standards-params"][standard][param][ival]+'\');">'+app.cfg["standards-params"][standard][param][ival]+'</a>';
        };
        html_modal += '</div>';
        html_modal += '</div>'; 

        $("#id_"+param).html(app.cfg["standards-params"][standard][param][ival]);
    };
    
    // Fermerture des menus
    html_modal += '</div>';     
    
    // Affichage de l'url 
    html_modal += '<div class="url_display"></div>';       
    
    // Création    
    // $('#urlModalTitle').html("Flus " + app.cfg["standards"][standard]);
    // $('#urlModalTitle').html(app.cfg["standards"][standard]+"</br>"+typename.split(":")[0]+"</br>"+typename.split(":")[1]);
    $('#urlModalTitle').html(typename.split(":")[0]+"</br>"+typename.split(":")[1]);
    $('#urlModalContent').html(html_modal);

};

function modal_url_generate(){
    
    // Aures variables à récupérer du modal
    format = $('#id_formats').text();
    srs = $('#id_projections').text().split(" ")[$('#id_projections').text().split(" ").length - 1];
    version = $('#id_versions').text();
    max_features='-1';
    
    // BBOX according to SRS for WMS
    if (srs == 'EPSG:2154') {
        bbox = "799602.0,6214473.0,1077706.0,6453458.0";
    } else {
        // bbox = "4.220932,43.022657,7.8028167,45.0769708";
        bbox = "4.220932,42.902657,7.8028167,45.1769708";
    };
    
    // Prétraitement de certaines variables
    if (max_features == "-1") {
        max_features_string = "";
    } else {
        max_features_string = "&maxFeatures="+max_features;    
    };

    // Création de l'url
    if (app.url_standard == "wfs") {
        url_link = geoserver.host + app.url_typename.split(":")[0] + "/ows?service=WFS&version="+version+"&request=GetFeature&typeName=" + app.url_typename + "&outputFormat="+format+max_features_string+"&srsName="+srs; 
        url = '<a target="_blank" rel="noopener noreferrer" href="'+ url_link +'">'+ url_link +'</a>';
        $('.url_display').html(url);
        window.open(url_link);
    } else if (app.url_standard == "wms") {
        if (format == "kml") {
            format_prefix = "";
        } else {
            format_prefix = "image/";
        };
        url_link = geoserver.host + app.url_typename.split(":")[0] + "/ows?service=WMS&version="+version+"&request=GetMap&layers=" + app.url_typename + "&styles=&bbox="+bbox+"&width=768&height=659&srs="+srs+"&format="+format_prefix+format+max_features_string;
        console.log(url_link);
        url = '<a target="_blank" rel="noopener noreferrer" href="'+ url_link +'">'+ url_link +'</a>';
        $('.url_display').html(url);
        window.open(url_link);        
    } else {
        $('.url_display').html("Erreur - Veuillez contacter un administrateur.");
    };
    
};

function set_max_features() {
    if (app.cfg["categories"][app.categorie]["limit-features"]){
        if (parseInt(app.cfg["categories"][app.categorie]["limit-features"]) > 0 ){
            max_features = "&maxFeatures=" + app.cfg["categories"][app.categorie]["limit-features"];
        };
    } else {
        max_features = "";
    };    
    return max_features;
};

function set_filter(typename) {
    if (app.cfg["categories"][app.categorie]["filters"]){
        for (filter in app.cfg["categories"][app.categorie]["filters"]) {
            if (typename.includes(app.cfg["categories"][app.categorie]["filters"][filter]["path"])) {
                filter = "&CQL_FILTER="+app.cfg["categories"][app.categorie]["filters"][filter]["filter"];
                // "&CQL_FILTER=date_debut like '01/12/2017%25'"
                return filter;
            };
        };
    } else {
        filter = "";
    };    
    return filter;
};

function viewer_start(){
    
    // Import des données en fonction du standard à servir
    standards_list = app.cfg["categories"][app.categorie]["standards"];

    if (standards_list[0] == "wms") {
        // Si uniquement du WMS
        // console.log("serving wms");
        app.viewer_standard = "wms";
        geoserver.getLayersMatchingFillList(app.cfg["categories"][app.categorie]["prefix"], "couches", "wms");  
        geoserver.loadLastCategorieLayer(app.cfg["categories"][app.categorie]["prefix"], "wms");        
    } else {
        // Si on a le choix on fait du wfs
        // console.log("serving wfs");
        app.viewer_standard = "wfs";
        geoserver.getLayersMatchingFillList(app.cfg["categories"][app.categorie]["prefix"], "couches", "wfs");      
        geoserver.loadLastCategorieLayer(app.cfg["categories"][app.categorie]["prefix"], "wfs");
    };

};

function spinner_start(div_id) {
    var the_spinner = new Spinner({opacity: 0.25, width: 3, color: "#3498DB", speed: 1.5, scale: 3, }); // top:"50%", left:"60%",
    // var the_spinner_element = document.getElementById('map');
    var the_spinner_element = document.getElementById(div_id);

    the_spinner.spin(the_spinner_element);
    return the_spinner;
};

function json2csv(json_data, div, text){

    // Création du CSV
    const items = json_data;
    const replacer = (key, value) => value === null ? '' : value; 
    const header = Object.keys(items[0]);
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    // Création du lien hyper texte
    window.URL = window.webkitURL || window.URL;
    var csvFile = new Blob([csv], {type: "text/csv;charset=utf-8"});

    var newLink = $("<a />", {
        id : "a",
        class : "liens_csv",
        name : "AAA",
        href : window.URL.createObjectURL(csvFile), 
        text : text
    });    

    $(div).append(newLink);    
    
    // Debug
    // console.log(csv);
    

};

var geoserver = {
    // Geoserver object
	// @url: http[s]://yourHost/geoserver/
    host: "https://geoservices.atmosud.org/geoserver/", 
    getCapabilities_wfs : function() {
		$.ajax({
			type: "GET",
			url: this.host + "wfs?service=WFS&version=1.1.0&request=GetCapabilities", 
			dataType: 'xml',  
			success: function(response,textStatus,jqXHR){
				// console.log(response);				
				return response;
			},       
		});
    },
	getLayersMatchingWfs: function (match){		
		$.ajax({
			type: "GET",
			url: this.host + "wfs?service=WFS&version=1.1.0&request=GetCapabilities", 
			dataType: 'xml',  
			beforeSend:function(jqXHR, settings){
				jqXHR.match = match;       
			},		
			success: function(response,textStatus,jqXHR){
				var layers = response.getElementsByTagName("Name");
				for (var i = 0; i < layers.length; i++) {   
					if ( layers[i].firstChild.nodeValue.includes(jqXHR.match) ) {
						var layer = layers[i].firstChild.nodeValue;				
						console.log(layer);
					};   
				};   
			},       
		});    
	},
	getLayersMatchingWfs: function (match){		
		$.ajax({
			type: "GET",
			url: this.host + "wfs?service=WFS&version=1.1.0&request=GetCapabilities", 
			dataType: 'xml',  
			beforeSend:function(jqXHR, settings){
				jqXHR.match = match;       
			},		
			success: function(response,textStatus,jqXHR){
				var layers = response.getElementsByTagName("Name");
				for (var i = 0; i < layers.length; i++) {   
					if ( layers[i].firstChild.nodeValue.includes(jqXHR.match) ) {
						var layer = layers[i].firstChild.nodeValue;				
						console.log(layer);
					};   
				};   
			},       
		});    
	},     
	getLayersMatchingFillList: function (match, div, standard){		
        
        $.ajax({
			type: "GET",
			// url: this.host + "wfs?service=WFS&version=1.1.0&request=GetCapabilities", 
			url: this.host + standard + "?service="+app.cfg["standards"][standard]+"&version=1.1.1&request=GetCapabilities", 
			dataType: 'xml',  
			beforeSend:function(jqXHR, settings){
				jqXHR.match = match;       
				jqXHR.app = app;       
			},		
			success: function(response,textStatus,jqXHR){
                
                listes = {};
                app.layers = [];
                
				var layers = response.getElementsByTagName("Name");
				for (var i = 0; i < layers.length; i++) {   
					// if ( layers[i].firstChild.nodeValue.includes(jqXHR.match) ) {
					if ( layers[i].firstChild.nodeValue.includes(jqXHR.match) && (layers[i].parentNode.nodeName == "Layer" || layers[i].parentNode.nodeName == "FeatureType") ) {
						var layer = layers[i].firstChild.nodeValue;	                      

                        // Création d'un dictionnaire flux / couche
                        if ( !(layer.split(":")[0] in listes) && (listes[layer.split(":")[0]] = {}) ) {
                            listes[layer.split(":")[0]] = [layer.split(":")[1]];
                        } else {
                            listes[layer.split(":")[0]].push(layer.split(":")[1]);
                        };
                        
					};                      
				};
                
                for (ws in listes) { 
                    $('#'+ div).append('<h6>'+ws+'</h6>');
                    for (lyr in listes[ws]) {
                        html_layer = '<div><a class="btn btn-outline-info btn-layer" id="'+ws+listes[ws][lyr]+'" href="#" role="button" onClick="geoserver.replaceLayer(\''+ws+':'+listes[ws][lyr]+'\')">'+listes[ws][lyr]+'</a>';  
                        for (standard in app.cfg["categories"][app.categorie]["standards"]) {
                            // html_layer += '<a href="#" class="badge badge-info float-right badge-layer-'+app.cfg["categories"][app.categorie]["standards"][standard]+'"  data-toggle="modal" data-target="#urlModal">'+app.cfg["standards"][app.cfg["categories"][app.categorie]["standards"][standard]]+'</a>';  
                            html_layer += '<a href="#" class="badge badge-info float-right badge-layer-'+app.cfg["categories"][app.categorie]["standards"][standard]+'" data-toggle="modal" data-target="#urlModal" onclick="modal_url(\''+app.cfg["categories"][app.categorie]["standards"][standard]+'\', \''+ws+':'+listes[ws][lyr]+'\');">'+app.cfg["standards"][app.cfg["categories"][app.categorie]["standards"][standard]]+'</a>';  
                        };                        
                        html_layer += '</div>';  
                        $('#'+ div).append(html_layer);
                        
                        app.layers.push(ws+listes[ws][lyr]);
                    };  
                }; 

			},       
		});    
	}, 	    
	olCreateLayerWFS: function (typename) {

		host = this.host;
		var vectorSource = new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: function(extent) {	
			return host + "wfs?service=WFS&" +
				"version=1.1.0&request=GetFeature&typename=" +
				typename + 
				"&outputFormat=application/json&srsname=EPSG:3857&";
			},
			strategy: ol.bbox
		});		
		
		var vector = new ol.layer.Vector({
			source: vectorSource,
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'rgba(0, 0, 255, 1.0)',
					width: 2
				})
			})
		});
		
		return vector;
	},
    attributeTable : function(typename, div) {
        
        // Si défini dans la config, limitation du nb max d'objets
        max_features = set_max_features();
        filter = set_filter(typename);

        // console.log(this.host + typename.split(":")[0] + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typename + max_features + filter + "&outputFormat=application%2Fjson", );
        
		$.ajax({
			type: "GET",
			// url: this.host + "emi_sudpaca_epci/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=emi_sudpaca_epci:emi_sudpaca_epci_2016&maxFeatures=50&outputFormat=application%2Fjson", 
			// NOTE - On cree cette url plusieurs fois, avoir un objet url?
            url: this.host + typename.split(":")[0] + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typename + max_features + filter + "&outputFormat=application%2Fjson", 
			dataType: 'json',  
			success: function(response,textStatus,jqXHR){
                
                // Remplacement du div
                html = '<div id="attributs2">';
 
                // Ouverture de la table
                html += '<table class="table table-sm table-striped table-hover">';
                html += '<thead><tr><th scope="col">#</th>';

                // Creation de la liste des champs
                Object.keys(response.features[0].properties).forEach(function(key) {
                     html += '<th scope="col">'+key+'</th>';
                });                   

                // Corps de la table
                html += '</tr></thead><tbody>';

                // Insertion des objets
                for (i = 0; i < response.features.length; i++) {
                    html += '<tr>';
                    html += '<th scope="row">'+i+'</th>';                     
                    
                    Object.keys(response.features[i].properties).forEach(function(key) {
                        html += '<td>'+response.features[i].properties[key]+'</td>'; 
                    });   
                        
                    html += '</tr>'; 
                };

                // Fermeture de la table
                html += '</tr></tbody>';                    
                html += '</table>';                    
                 
                // Fermeture du div 
                html += '</div>';                
                 
                // Insertion dans le html
                $(div).replaceWith(html); 
                // $(div).append(html); 
			},       
		});
    },
    lfCreateLayerWFS: function (typename, map) {
        
        // Starts spinner
        var the_spinner = spinner_start('map');
        
        // Si défini dans la config, limitation du nb max d'objets
        max_features = set_max_features();
        filter = set_filter(typename);
        
        // ceates url
        url = this.host + typename.split(":")[0] + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + typename + max_features + filter + "&outputFormat=application/json&srsName=EPSG:4326";
        // console.log(url);
        
		$.ajax({
			type: "GET", 
			// url: this.host + "emi_sudpaca_epci/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=emi_sudpaca_epci:emi_sudpaca_epci_2016&outputFormat=application/json&srsName=EPSG:4326",
			url: url,
			dataType: 'json',  
            beforeSend:function(jqXHR, settings){
                jqXHR.the_spinner = the_spinner;    
            },            
			success: function(response,textStatus,jqXHR){
                WFSLayer = L.geoJson(response, {
                    style: function (feature) {
                        if (("Polygon","MultiPolygon").indexOf(response.features[0].geometry.type) > -1) {
                            return {
                                stroke: true,
                                weight: 1,
                                color: "#3498DB",
                                fillColor: '#3498DB',
                                fillOpacity: .2
                            };
                        } else if (("Point","MultiPoint").indexOf(response.features[0].geometry.type) > -1) {
                            return; // Gêré avec pointToLayer
                        } else {
                            console.log("ERROR - Geometry type unknown");
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        html = "";
                        for (ip in feature. properties) {
                            html += ip + ": " + feature.properties[ip] + "</br>";
                        };
                        
                        layer.bindPopup(html, {maxWidth: 200, maxHeight: 200});
                            
                    },
                    pointToLayer: function(feature, latlng) {
                        markerStyle = {
                            radius: 8,
                            fillColor: "#3498DB",
                            color: "#2963AE",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.2 
                        };                          
                        
                        return new L.CircleMarker(latlng, markerStyle);
                    },
                }).addTo(map);
                
                app.active_layer = WFSLayer;
                
                // Starts spinner
                jqXHR.the_spinner.stop();
			},       
		});
    },  
    lfCreateLayerWMS: function (typename, map) {
        
        // Si défini dans la config, limitation du nb max d'objets
        // max_features = set_max_features();

        // Starts spinner
        var the_spinner = spinner_start('map');
        
        url = this.host + typename.split(":")[0] + "/wms?";
                
        wms_params = {
            name: typename.split(":")[1],
            layers: typename.split(":")[1],
            format: 'image/png',
            transparent: true,
            opacity: 0.5,
            dj: 0,
            subtitle: typename.split(":")[1],
        }; 
        
        // Si un filtre est configuré, alors on le récupère
        filter = set_filter(typename).replace(/&CQL_FILTER=/g,'');
        if (filter != "") {
            wms_params["CQL_FILTER"] = filter;
        };       
        
        wms_layer = L.tileLayer.wms(url, wms_params);
       
        wms_layer.addTo(map);   
        
        app.active_layer = wms_layer;

        // Creates and add legend
        generate_legend(typename);
        
        // Starts spinner
        the_spinner.stop();        
    },      
    loadLastCategorieLayer: function (match, standard){		
        // Retrouve la dernière couche d'une catégorie et l'affiche sur la carte
        // et récupère la table
		$.ajax({
			type: "GET",
			url: this.host + standard + "?service="+app.cfg["standards"][standard]+"&version=1.1.1&request=GetCapabilities", 
			dataType: 'xml',  
			beforeSend:function(jqXHR, settings){
				jqXHR.match = match;       
			},		
			success: function(response,textStatus,jqXHR){

                // Get last layer if no default one sepcified
                if (typeof app.cfg["categories"][app.categorie]["default-typename"] !== 'undefined') {
                    couches = [app.cfg["categories"][app.categorie]["default-typename"]];
                } else {
                    couches = [];
                    var layers = response.getElementsByTagName("Name");
                    for (var i = 0; i < layers.length; i++) {   
                        if ( layers[i].firstChild.nodeValue.includes(jqXHR.match) && (layers[i].parentNode.nodeName == "Layer" || layers[i].parentNode.nodeName == "FeatureType") ) {
                            couches.push(layers[i].firstChild.nodeValue);
                        };                      
                    };                    
                };
                
                // Load layer and table
                if (standard == "wms") {
                    geoserver.lfCreateLayerWMS(couches[couches.length - 1],map);
                } else if (standard == "wfs") {
                    geoserver.lfCreateLayerWFS(couches[couches.length - 1],map);
                    geoserver.attributeTable(couches[couches.length - 1], "#attributs2");
                };
                
                
                
                
			},       
		});    
	},
    replaceLayer: function (typename){		
        // Remove active layer from map and add new one
        
        map.removeLayer(app.active_layer);
        
        // Load layer Get table
        if (app.viewer_standard == "wms") {
            geoserver.lfCreateLayerWMS(typename, map);
        } else if (app.viewer_standard == "wfs") {
            geoserver.lfCreateLayerWFS(typename, map);
            geoserver.attributeTable(typename, "#attributs2"); 
        };
        
        // Set active layer         
        for (ilayer in app.layers) {
            if (typename.replace(":", "") == app.layers[ilayer]) {
                $("#"+app.layers[ilayer]).addClass("active");
            } else {
                $("#"+app.layers[ilayer]).removeClass("active");
            };
        };
          
	},  
    url_generator_DELETE(ogc_type, typename){
        console.log(ogc_type, typename);
        
        // Aures variables à récupérer du modal
        format = 'shape-zip'; //'application/json', csv, GML2, GML3, shape-zip, [jsonp: text/javascript]
        srs = '4326';
        version = '1.0.0';
        max_features='-1';
        bbox = "";
               
        // Prétraitement de certaines variables
        if (max_features == "-1") {
            max_features_string = "";
        } else {
            max_features_string = "&maxFeatures="+max_features;    
        };

        // Création de l'url
        url = this.host + typename.split(":")[0] + "/ows?service=WFS&version="+version+"&request=GetFeature&typeName=" + typename + "&outputFormat="+format+max_features_string+"&srsName=EPSG:"+srs;
        console.log(url);
         
    },
};


*/
