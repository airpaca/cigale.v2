function Select(id, element_html, script, title, function_to_launch, header, dict_args) {
    /* 
    Create Bootstrap-select element allowing to search val.
    Created to be used with datablocks.
    Romain Souweine - AtmoSud - 2019
    
    Dépendencies: Bootstrap-select
    
    @id = Id of the select element which will be created
    @element_html = Html element to attach the select to 
    @script = Script url to launch, returning data for the select.
              Response must be json and contain a field called val which will be use to search
    @title = Text when nothin is selected
    @function_to_launch = Function which will be call with the seleted value as argument
    
    Improvement: Add key words for better search. Ex: INSEE comm id when displaying name
    */ 
    this.id = id;
    
    if (typeof header == 'undefined'){
        var header = "";
    } else {
        var header = '<div class="select-header">' + header + '</div>';
    }

    $(header + '<select name="selectBlock" class="selectpicker show-tick" id="' + this.id + '" data-live-search="true" title="'+title+'" data-width="100%"></select>').appendTo(element_html);
    
    
    $('#' + this.id).on('change', function(e){  
        console.log("Liste has changed");
        window[function_to_launch](e.target.value, e.target[$("#" + this.id).prop('selectedIndex')].dataset.tokens);
    });    

    if ( (typeof dict_args != "undefined") && (dict_args.show_token == true) ){
        var show_token = true;
    } else {
        var show_token = false;
    };
    

    $.ajax({
        type: "GET",
        url: script,
        dataType: 'json',  
        beforeSend:function(jqXHR, settings){
            jqXHR.show_token = show_token;    
        },                 
        success: function(response,textStatus,jqXHR){
            
            for (var element in response) {
                // The object Id will be passed as data tokens
                if (jqXHR.show_token == false){
                    $('<option data-tokens="' + response[element].valeur + '">' + response[element].val + '</option>').appendTo('#' + id); 
                } else {
                    $('<option data-tokens="' + response[element].valeur + '">' + response[element].val + ' (' + response[element].valeur + ')</option>').appendTo('#' + id);                            
                };
            };
            $('#' + id).selectpicker('refresh');
        },
        error: function (request, error) {
            console.log(arguments);
            console.log("Ajax error: " + error);
        },        
    });

	this.set_val = function(token){

		$('#' + id).selectpicker('val', token);
		
	};
};
