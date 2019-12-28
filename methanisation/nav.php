<!-- 
Nav bar template
-->

<nav class="navbar navbar-lg navbar-dark">
    
    <!--  
    <nav aria-label="Plan">
      <ol class="breadcrumb quote">
        <li class="breadcrumb-item active" aria-current="page">MéthaPACA / <span id="header_territoire">Région PACA</span></li>
      </ol>
    </nav>
    -->

    <nav aria-label="Plan">
        <!-- <a style="color:white;" href="../index.php">CIGALE</a>&nbsp;-&nbsp;Méthanisation -->
        <ol class="breadcrumb quote">
        <li class="breadcrumb-item"><a href="../index.php">CIGALE</a></li>
        <li class="breadcrumb-item active" aria-current="page">Méthanisation</li>
        </ol>        
    </nav>  
    <!--
    <span style="text-align:center;margin-left:auto;margin-right:auto;">
        <p style="float:left;line-height:15px;margin-top:0px;margin-bottom:0px;margin-right:10px;color:white;">Fiche synthétique du territoire</p>
        <label class="switch " style="display: inline;">
        <input type="checkbox" id="chk-stats-gen" class="success " onclick='app.blocks.report.activate_report_col()'>
        <span class="slider round"></span>
        </label>
    </span>
    -->
 

     <span class="btn-group-toggle ml-auto" data-toggle="buttons" id="chk-stats-gen">
      <label class="btn btn-outline-light btn-rapport" >
        <input type="checkbox">Fiche synthétique du territoire
      </label>
    </span>

 
    <!-- <span style="text-align:center;margin-left:auto;margin-right:auto;"> -->
        <!--
    <span >
        <label class="switch " style="display: inline;">
        <a href="#" style="float:right;font-size:12px;" class="badge badge-pill badge-info" onclick="app.blocks.mapview.print_map();">Enregistrer la carte</a>
        </label>
    </span>
        -->
 
        <!--
    <span style="text-align:center;margin-left:auto;margin-right:auto;">   
        <label class="switch " style="display: inline;">
        <a href="#" style="float:left" class="badge badge-pill badge-info" onclick="app.blocks.mapview.print_map();">Enregistrer la carte</a>
        </label>        
    </span>
        -->

    <!--
    <span style="">
        <p style="float:left;line-height:15px;margin-top:0px;margin-bottom:0px;margin-right:10px;color:white;">Statistiques personnalisées</p>
        <label class="switch " style="display: inline;">
        <input type="checkbox" id="chk-stats" class="success " onclick='app.blocks.mapview.map.manage_stats_button("chk-stats")'>
        <span class="slider round"></span>
        </label>
    </span>
    --> 
    
    <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Navigation">

        <span id="stats-txt">Plus d'options</span>
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="navbar-collapse collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
        
            <li class="nav-item ml-auto btn-transparent-core">
                <button type="button" id="btn-lock" class="btn btn-outline-light btn-transparent" onclick="gestion_lock()">Dévérouiller les couches  </button>
            </li>            

            <li class="nav-item ml-auto btn-transparent-core">
                <button type="button" class="btn btn-outline-light btn-transparent" onclick="app.blocks.mapview.print_map();">Enregistrer la carte</button>
            </li> 
            
            <li class="nav-item ml-auto btn-transparent-core">
                <button type="button" class="btn btn-outline-light btn-transparent" >Documentation</button>
            </li> 
            
            <li class="nav-item ml-auto btn-transparent-core">
                <button type="button" class="btn btn-outline-light btn-transparent" onclick="didacticiel()">Didacticiel</button>
            </li> 

            <li class="nav-item ml-auto btn-transparent-core">
                <button type="button" class="btn btn-outline-light btn-transparent" onclick="contact_metha()">Contacts</button>
            </li>             
        </ul>
    </div>
    
    
</nav>