/*
Graphiques avec HighCharts.
R. Souweine, AtmoSud, 2020
*/

// Options générales
Highcharts.setOptions({
    credits: {
        enabled: false
    },
    title: {
        margin: 0,
        style: {fontSize: '12px',},
    },    
    chart: {
        // margin: [0,0,30,0],
        // plotBackgroundColor: null,
        // plotBorderWidth: null,
        plotShadow: false,        
    },
});   


function create_line_chart(args){

    $.ajax({
        type: "GET", 
        url: args.data,
        dataType: 'json',  
        data: args.params,        
        beforeSend:function(jqXHR, settings){
            jqXHR.args = args;    
        },            
        success: function(response,textStatus,jqXHR){ 
            
			console.log("LINE CHART !!!!!!!!!!!!!!!!!!");
			
			
			series_names = [];
			series_colors = [];
			
			for (arr in response){
				if (series_names.indexOf(response[arr].name) == -1){
					series_names.push(response[arr].name);
					series_colors.push(response[arr].color);
				};
			};
			
			series = [];
			for (iname in series_names) {
				series.push({name: series_names[iname], data:[], color: series_colors[iname]});
				
				for (arr in response){
					if (response[arr].name == series_names[iname] ) {
						series[iname]["data"].push(response[arr]);
					};
				};	

				
			};
			
	
            // Container css 
            $("."+args.container_id).css("height", "25vh");

            // Chart         
            Highcharts.chart(args.container_id, {
                chart: {
                    type: 'spline',
                    // margin: [35,0,35,30],
                },
                title: {
                    text: args.title,
                    style: {
                        fontSize: '13px',
                    },                    
                },
                tooltip: {
                    pointFormat: args.tooltip,
					zIndex: 20,
                    // pointFormat: '{point.y:.1f}'
                },
                xAxis: {
					tickInterval: 1,
                    // type: 'category',
                    // categories: categories,
					plotBands: [
						{
						color: '#ffffff', 
						from: 2007.5, 
						to: 2009.5,
						zIndex: 5,
						},{
						color: '#ffffff', 
						from: 2010.5, 
						to: 2011.5,
						zIndex: 5,
						},
					],					
                    labels: {
                        enabled: true,
                        // rotation: -45,
                        autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                        style: {
                            fontSize: '9px',
                        },
						
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: null,
                    },
                    labels: {
                        style: {
                            fontSize: '9px',
                        },
                    },
                },         
				legend: {
					enabled: true,
					// floating: true,
					verticalAlign: "bottom",
					itemDistance: 1,
					itemStyle: {"fontSize":"9px", "fontWeight": "normal", "color": "#43494f"}
				},
				plotOptions: {
					series: {
						connectNulls: true,
						marker: {
							symbol: 'circle',
							// radius: 8,
						},
					},
					// line: {
						// marker: {
							// symbol: "circle"
						// },
					// },
				},
				// series: response,
				series: series,
				// series: [{data: response}],
				// series: response,
				// series: JSON.parse(response),
                // series: [
					// {
						// name: 'Installation',
						// data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
					// }
				// ],
                // dataLabels: {
                    // enabled: true,
                    // rotation: 0,
                    // color: '#FFFFFF',
                    // align: 'right',
                    // format: '{point.y:.1f}', // one decimal
                    // y: 10, // 10 pixels down from the top
                    // style: {
                        // fontSize: '13px',
                        // fontFamily: 'Verdana, sans-serif'
                    // }
                // },                
            });   
           
    
        },
        error: function (request, error) {
            console.log("ERROR: create_graphiques()");
        },        
    });

};


function create_bar_chart(args){

    $.ajax({
        type: "GET", 
        url: args.data,
        dataType: 'json',  
        data: args.params,        
        beforeSend:function(jqXHR, settings){
            jqXHR.args = args;    
        },            
        success: function(response,textStatus,jqXHR){ 

            console.log(response);
			
			if (args.option.stacked == true) {var stacked = true;} else {var stacked = false;};
            
			if (stacked == false) {
				response_formated = [];
				categories = [];
				for (arr in response){
					response_formated.push([response[arr].x, response[arr].y]);
					categories.push(response[arr].x);
				};
				
				var the_series = [{
					name: '',
					pointWidth: 19,
					// colorByPoint: true, 
					data: response_formated,
				}];	
			};
			if (stacked == true) {
				
				console.log(response);
				console.log("°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°");
	



				var series_names = [];
				var series_colors = [];	
				var categories = [];
			
				for (arr in response){
					if (series_names.indexOf(response[arr].name) == -1){
						series_names.push(response[arr].name);
						series_colors.push(response[arr].color);
						categories.push(response[arr].name);
					};
				};			
			
				the_series = [];
				for (iname in series_names) {
					the_series.push({name: series_names[iname], data:[], color: series_colors[iname]});
					
					for (arr in response){
						if (response[arr].name == series_names[iname] ) {
							the_series[iname]["data"].push(response[arr]);
						};
					};	
				};			
			
			};
			
			
			console.log(the_series);
			console.log("=====================================================");
			
            // FIXME: On a défini les options générales plus haut mais on peur proposer ici un dict option générales pour les modifier à convenance

            // Container css 
            $("."+args.container_id).css("height", "25vh");

            // Chart         
            Highcharts.chart(args.container_id, {
                chart: {
                    type: 'column',
                    margin: [35,0,35,30],
                },
                title: {
                    text: args.title,
                    style: {
                        fontSize: '13px',
                    },                    
                },
                tooltip: {
                    pointFormat: args.tooltip,
                    // pointFormat: '{point.y:.1f}'
                },
                xAxis: {
                    // type: 'category',
                    categories: categories,
                    labels: {
                        enabled: true,
                        // rotation: -45,
                        autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
                        style: {
                            fontSize: '9px',
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: null,
                    },
                    labels: {
                        style: {
                            fontSize: '9px',
                        },
                    },
                },                
                plotOptions: {
                    column: {
                        color:"#a8a8a8",
                        allowPointSelect: true,
                        // cursor: 'pointer',
                        // innerSize: '50%', // Pour Donut
                        // dataLabels: {
                            // enabled: false
                        // },
                        showInLegend: false
                    },
					series: {stacking: 'normal'},
                },
                series: the_series,
				// series: response_formated,
                // dataLabels: {
                    // enabled: true,
                    // rotation: 0,
                    // color: '#FFFFFF',
                    // align: 'right',
                    // format: '{point.y:.1f}', // one decimal
                    // y: 10, // 10 pixels down from the top
                    // style: {
                        // fontSize: '13px',
                        // fontFamily: 'Verdana, sans-serif'
                    // }
                // },                
            });   
           
    
        },
        error: function (request, error) {
            console.log("ERROR: create_graphiques()");
        },        
    });

};


function create_pie_chart(args){

	if (args.option.labels == true) {var labels = true;} else {var labels = false;};

    $.ajax({
        type: "GET", 
        url: args.data,
        dataType: 'json',  
        data: args.params,        
        beforeSend:function(jqXHR, settings){
            jqXHR.args = args;    
        },            
        success: function(response,textStatus,jqXHR){ 

            // FIXME: On a défini les options générales plus haut mais on peur proposer ici un dict option générales pour les modifier à convenance

            // Container css 
            $("."+args.container_id).css("height", "25vh");



			console.log("PIE  CHART");
			console.log(labels);
			console.log(response);



            // Chart         
            Highcharts.chart(args.container_id, {
                chart: {
                    type: 'pie',
                    margin: [20,0,0,0],
                },
                title: {
                    text: args.title,
                    style: {
                        fontSize: '13px',
                    },                      
                },
                tooltip: {
                    pointFormat: args.tooltip,
					// formatter: function() {
						// return this.series.name + ': ' + this.y;
					// },					
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        innerSize: '50%', // Pour Donut
                        dataLabels: {
                            enabled: labels,
							distance: -25,
							style: {
								// fontWeight: 'bold',
								color: '#43494f',
							},							
                        },
                        showInLegend: true,
                    },
                },
                series: [{
                    name: '',
                    colorByPoint: true, 
                    data: response,
                }],
				legend: {
					enabled: false,
					// floating: true,
					verticalAlign: "bottom",
					itemDistance: 1,
					itemStyle: {"fontSize":"9px", "fontWeight": "normal", "color": "#43494f"}
				},				
            });   
           
    
        },
        error: function (request, error) {
            console.log("ERROR: create_graphiques()");
        },        
    });

};