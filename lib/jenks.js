
function calc_jenks(data, field, njenks, colorscale){
    /*
    Calcul à partir d'une réponse geojson [data] les classes et couleurs de 
    jenks sur un champ [field] à partir d'une nombre de classes [njenks].
    Renvoie bornes [min, ..., max] et couleurs de ces bornes.

    Attention, si le nombre de classes jenks demandé est trop faible par rapport au nombre
    de valeurs, alors on réduit le nombre de classes
    
    @colorscale: Ex - ['#f9ebea', '#cd6155', '#cb4335']
    
    Ex:
    the_jenks = calc_jenks(data, "superficie", 3, ['#f9ebea', '#cd6155', '#cb4335']);
    console.log(the_jenks);
    */

    
    items = [];
    $.each(data.features, function (key, val) {
        $.each(val.properties, function(i,j){
            if (i == field) {
                if (!j){
                    // Si une valeur est null alors on la met à 0, pas de NaN trouvé pour la librairie geostats
                    items.push(0);
                } else {
                    items.push(j);                    
                };

            };
        }); 
    });    

    if (items.length < njenks + 1){
        console.log("Nombre d'objets insuffisant pour " + njenks + " classes passage à " + (parseInt(items.length) + -1) + " classes.");
        njenks = (parseInt(items.length) + -1);
    };   
    
    classifier = new geostats(items);
    var jenksResult = classifier.getJenks(njenks);
    // var color_x = chroma.scale(['#f9ebea', '#cd6155', '#cb4335']).colors(njenks);
    var color_x = chroma.scale(colorscale).colors(njenks);
    
    
    
    return {bornes: jenksResult, colors: color_x}; 
};

function find_jenks_color(jenks_obj, the_val){
    /*
    Retrouve la couleur correspondant à une bornes de classes
    en fonction d'une valeur.
    jenks_obj = object return by calc_jenks Object { bornes: Array[4], colors: Array[3] }
    the_val = value to test
    Returns html color
    */
    
    // console.log("FIND JENKS COLOR");
    // console.log(jenks_obj);
    // console.log(jenks_obj, the_val);
    
    // Si la valeur est dans une des bornes de classes <=
    for (ibornemin in jenks_obj.bornes.slice(0, -1)) {
        vbornemin = jenks_obj.bornes[ibornemin];
        vbornemax = jenks_obj.bornes[+ibornemin + 1];
        
        // console.log(ibornemin, vbornemin, vbornemax);
        // console.log(the_jenks.bornes[the_jenks.bornes.length - 1]);
        
        if (the_val >= vbornemin && the_val < vbornemax) {
            // console.log("->" + ibornemin, vbornemin, vbornemax, jenks_obj.colors[ibornemin]); 
            return jenks_obj.colors[ibornemin]; 
        };
    };
    
    // Si la valeur est = à la borne encadrante max
    if (the_val == jenks_obj.bornes[jenks_obj.bornes.length - 1]) {
            // console.log("->" + ibornemin, vbornemin, vbornemax, jenks_obj.colors[ibornemin]);
            return jenks_obj.colors[ibornemin];                 
    // Si non retourne une erreur
    } else {
        console.log("ERROR: Value " + the_val + " out of classes");
        return null;
    };
    console.log("FIND JENKS COLOR END");
    
};
