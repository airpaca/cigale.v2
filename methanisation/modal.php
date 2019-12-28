<!-- Modal -->
<div class="modal fade" id="urlModal" tabindex="-1" role="dialog" aria-labelledby="urlModal" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <!-- <div class="modal-title" id="urlModalTitle"></div> -->
        <div class="modal-title" id="urlModalTitle"></div>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="urlModalContent">
      
      <?php 
        /*
        // Ouverture des menus
        $html_modal = '<div class="dropdown">';
        
        // Choix du standard
        $html_modal .= '<div class="row modal-list-row">';
        $html_modal .= '<button class="btn btn-info dropdown-toggle btn-sm float-left" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        $html_modal .= 'Standard';
        $html_modal .= '</button>';
        $html_modal .= '<div class="dropdown-menu">';
        foreach ($_SESSION['available_formats']["Standard"] as $key => $value) {
            $html_modal .= '<a class="dropdown-item" href="#">'.$value.'</a>';
        };    
        $html_modal .= '</div><div class="dropdown-display float-right">WFS</div>';
        $html_modal .= '</div>';
        
        // Choix de la projection
        $html_modal .= '<div class="row">';    
        $html_modal .= '<button class="btn btn-info dropdown-toggle btn-sm float-left" type="button"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        $html_modal .= 'Projections';
        $html_modal .= '</button>';
        $html_modal .= '<div class="dropdown-menu">';
        foreach ($_SESSION['available_formats']["Projections"] as $key => $value) {
            $html_modal .= '<a class="dropdown-item" href="#">'.$value.'</a>';
        };    
        $html_modal .= '</div><div class="dropdown-display float-right">Lambert 93 - EPSG:2154</div>';
        $html_modal .= '</div>';
        
        // Fermerture des menus
        $html_modal .= '</div>';  
        
        echo $html_modal;
        */
      ?>    
      
     
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
        <button type="button" class="btn btn-primary" onClick="modal_url_generate();">Appliquer</button>
      </div>
    </div>
  </div>
</div>