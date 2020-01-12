/*
Gestion du RGPD par affichage d'un modal Bootstrap puis enregistrement d'un Cookie d'un an (RGPD 13 mois)

NOTE: Le modal ne peut pas se fermer avec la touche escape ni en cliquant à côté de clui-ci.
FIXME: Si on ferme l'onglet alors c'est comme si on avait accepté. Peut-être que firtimpression n'est pas bon pour du RGPD ?!
FIXME: Utiliser js.cookie?
*/

// If user did not accepted cookies (cookie not found on terminal)
if (typeof Cookies.get('hasAcceptedCookies') == "undefined"){
    
    // Création d'un modal de type bloquant renvoyant vers la fonction d'acceptation
    $('body').append('<div id="rgpd"></div>');
    
    var html_modal = ''+
    '<div class="modal" tabindex="-1" role="dialog" id="rgpd-modal" data-backdrop="static" data-keyboard="false">'+
      '<div class="modal-dialog modal-dialog-centered" role="document">'+
        '<div class="modal-content">'+
          '<div class="modal-body overflow-auto modal-rgpd-body">'+
            '<h4 class="modal-title">Gestion des données personnelles</h4>'+
            '<p>'+
            'Ce site utilise des cookies afin de vous offrir une expérience de navigation optimale et réaliser de statistiques de visites.'+
            '</p>'+
            '<p>'+
            'En utilisant nos services, vous nous donnez expressément votre accord pour exploiter ces cookies.'+
            '</p>'+
            '<p>'+
            'Aucune exploitation ne sera faite à des fins publicitaires et nous ne stockons sur votre navigateur aucun cookie ou traceur publicitaire.'+
            '</p>'+  
            '<p>'+
            'Pour plus d\'informations concernant la gestion de vos données personnelles, '+ 
            'rendez-vous sur <a href="https://www.atmosud.org/gestion-des-donnees-personnelles" target="_blank">le site internet d\'AtmoSud.</a>'+
            '</p>'+
          '</div>'+
          '<div class="modal-footer">'+
            '<button type="button" class="btn btn-outline-success" onClick="rgpd_modal_accept()">J\'ai compris</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
    
    $('#rgpd').html(html_modal);
    
    $('#rgpd-modal').modal('show');    
};

function rgpd_modal_accept(){ 
    Cookies.set('hasAcceptedCookies', 'true', {expires: 365});
    $('#rgpd-modal').modal('hide');
    $('.modal-backdrop').remove();
};
