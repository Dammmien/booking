/* global screenReaderText */
/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

//( function( jQuery ) {
//jQuery(document).ready(function( jQuery ) {
    var global = {
        ajaxUrl                 :   'wp-admin/admin-ajax.php',

        centreId                :   centreId,
        slideAnimationOptions   :   {
                                        duration: 600,
                                        easing: "easeInOutQuint"
                                    },

        changeCentre            :   jQuery("#changer-centre"),
        selectCentreHeader      :   jQuery("#select-centre"),
        myUrbanButton           :   jQuery("#my-urban"),
        menuMyUrban             :   jQuery("#menu-mon-compte"),
        blocLayout              :   jQuery(".bloc-layout"),
        isReservationActive     :   false,

        reservationStep         :   0,
        reservationAvailable    :   false,

        videosPerPage           :   6,
        videosPageL             :   jQuery('.video-pagination-item').length - 1,
        videosPageCurrent       :   0,

        idSearchProduct         :   0,
        productPerPage          :   12,
        productCurrent          :   0,

        actusPerPage            :   12,
        actusPageL              :   jQuery('.actus-pagination-item').length - 1,
        actusPageCurrent        :   0,

        pressePerPage           :   4,
        presseL                 :   jQuery('.presse-item').length - 1,

        bookableCenters         :   null
    };

    function get_json(name){
        return jQuery.ajax({
            url: templateDir+'/json/'+name+'.json',
            dataType: 'json'
        });
    }

    function _bookableCenters(data){
        global.bookableCenters = data;

        if(global.centreId){
            jQuery("#bloc-where ul#bloc-where-centres li[data-target='"+global.centreId+"'] a").trigger('click');
            jQuery(".reservation-centre li[data-id='"+global.centreId+"']").trigger('click');
        }
    }

    get_json('bookableCenters').done(_bookableCenters);

    function isInt(n) {
        return n % 1 === 0;
    }

    function parseDate(varDate){
        var str = varDate.split("T");
        var date = str[0].split("-");
        var time = str[1].split(":");
        var start = new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2], 0);
        return start;
    }

    if(siteUrl == 'http://localhost'){
       global.ajaxUrl = siteUrl+'/abstrakt/urbansoccer/urban/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/abstrakt/urbansoccer/urban/';
    }else if(siteUrl == 'http://yj.local'){
        global.ajaxUrl = siteUrl+'/subskill/2015/site/abstrakt/urbansoccer/urban/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/subskill/2015/site/abstrakt/urbansoccer/urban/';
    }else if(siteUrl == 'http://urbansoccer.alwaysdata.net'){
        global.ajaxUrl = siteUrl+'/urban/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/urban/';
    }else if(siteUrl == 'http://www.urbansoccer.fr'){
        global.ajaxUrl = siteUrl+'/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/';
    }else if(siteUrl == 'http://urbansoccer.fr'){
        global.ajaxUrl = siteUrl+'/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/';
    }else if(siteUrl == 'http://www.urbanfootball.fr'){
        global.ajaxUrl = siteUrl+'/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/';
    }else if(siteUrl == 'http://urbanfootball.fr'){
        global.ajaxUrl = siteUrl+'/wp-admin/admin-ajax.php';
        global.siteUrl = siteUrl + '/';
    }else if(siteUrl == 'http://sd-90802.dedibox.fr:37036'){
      global.ajaxUrl = siteUrl+'/wp-admin/admin-ajax.php';
      global.siteUrl = siteUrl + '/';
    } else if(siteUrl == 'http://frontal-prod.fr'){
      global.ajaxUrl = siteUrl+'/wp-admin/admin-ajax.php';
      global.siteUrl = siteUrl + '/';
    }

    global.changeCentre.on("click",function(){
        if(jQuery(this).hasClass("active")){
            jQuery(this).removeClass("active");
            global.selectCentreHeader.slideUp(global.slideAnimationOptions);
        }else{
            jQuery(this).addClass("active");
            global.selectCentreHeader.slideDown(global.slideAnimationOptions);
        }
    });

    jQuery("#leagues-manage a").bind("click",function(){
        if(jQuery(this).hasClass("disable")){
            global.myUrbanButton.trigger('click');
        }
    });

    global.myUrbanButton.on("click",function(){
        if(jQuery(this).hasClass("no-log")){
            jQuery('html').addClass('overflow');
            if(jQuery(this).hasClass("active")){
                jQuery(this).removeClass("active");
                jQuery(".bloc-layout").fadeOut(400);
                jQuery("#login").fadeOut(400);
                jQuery("#register").fadeOut(400);
                jQuery("#register-facebook").fadeOut(400);
                jQuery('#register-confirm').fadeOut(400);
                jQuery('#password-forgot-form')[0].reset();
                jQuery('#form-login')[0].reset();
            }else{
                jQuery(this).addClass("active");
                jQuery(".bloc-layout").fadeIn(400);
                jQuery("#login").fadeIn(400)
            }
        }else{
            if(jQuery(this).hasClass("active")){
                jQuery(this).removeClass("active");
                global.menuMyUrban.slideUp(global.slideAnimationOptions);
            }else{
                jQuery(this).addClass("active");
                global.menuMyUrban.slideDown(global.slideAnimationOptions);
            }
        }
    });

    jQuery("#bandeau-cookies button").bind("click",function(){
        jQuery.post(
            global.ajaxUrl,
            {
                'action'            :   'cookieAccept'
            },
            function (response) {
                jQuery("#bandeau-cookies").remove();
                jQuery("#page").removeClass("cookie-open");
            }
        )
    });

    jQuery('.menu-mon-compte-close').on('click', function(){
        jQuery(this).removeClass("active");
        global.menuMyUrban.css("display","none");
    });

    jQuery('#layout, #close-layout').on('click', function(){
        jQuery('.layout-popup').fadeOut(400);
        jQuery('.message-pop-in').fadeOut(400);
        global.myUrbanButton.removeClass('active');
        jQuery("#mon-compte-date-picker").fadeOut(400);
        jQuery(".videoLightBox").fadeOut(400);
        jQuery(".videoLightBox").find('iframe').attr('src', '');
        jQuery("#centre_slider_photo").fadeOut(400);
        jQuery('html').removeClass('overflow');
        jQuery('#password-forgot-form')[0].reset();
        jQuery('#form-login')[0].reset();
    });

    jQuery('#close-select-centre').on('click', function(){
        if(global.changeCentre.hasClass('active')){
            global.changeCentre.removeClass('active');
            global.selectCentreHeader.slideUp(global.slideAnimationOptions);
        }
    });

    jQuery('.register-confirm-login').click(function(){
        jQuery(".bloc-layout").fadeIn(400);
        jQuery('#login').fadeIn(400);
        jQuery('#form-login-login').focus();
    });

    jQuery('.register-confirm-close').click(function(){
        jQuery('#layout').trigger('click');
    });

    jQuery("#select-centre-localisation #select-centre-liste li").bind("click",function(e){
        var link = jQuery(this).attr("data-link");
        var idCentre = jQuery(this).attr("data-target");
        if(idCentre != ''){
            jQuery.post(
                global.ajaxUrl,
                {
                    'action'            :   'add_favoris',
                    'idCentre'          :   idCentre
                },
                function (response) {
                    result = JSON.parse(response);

                    dataLayer.push({
                        "event": "selectCenter",
                        "selectCenterCity": result.centre.name
                    });

                    window.location.href = link;
                }
            )
        }else{
            //window.location.href = link;
        }
    });

    jQuery("#select-centre-liste ul li a").bind("click",function(e){
        var link = jQuery(this).attr("href");
        var idCentre = jQuery(this).parent().attr("data-target");
        if(idCentre != ''){
            jQuery.post(
                global.ajaxUrl,
                {
                    'action'            :   'add_favoris',
                    'idCentre'          :   idCentre
                },
                function (response) {
                    result = JSON.parse(response);
                    /*jQuery("#mon-centre").css("display","block");
                    jQuery("#mon-centre p a").text(result.centre.name);
                    jQuery("#mon-centre .telephone").text(result.centre.phoneNumber);*/

                    dataLayer.push({
                        "event": "selectCenter",
                        "selectCenterCity": result.centre.name
                    });

                    window.location.href = link;
                }
            )
        }else{
            //window.location.href = link;
        }
        e.preventDefault();
    });

    jQuery("#mon-centre p span").bind("click",function(){
        jQuery.post(
            global.ajaxUrl,
            {
                'action'            :   'remove_favoris'
            },
            function (response) {
                result = JSON.parse(response);
                jQuery("#mon-centre").css("display","none");
                jQuery("#mon-centre p a").text('');
                jQuery("#mon-centre .telephone").text('');
                jQuery("#page").removeClass("center-selected");

                window.location.reload();
            }
        )
    });

    var numberOwnVideo = jQuery("#mini-slider-own .mini-slider-item").length;
    if(numberOwnVideo <= 3){
        jQuery("#mini-slider-own").find(".mini-slider-arrow-next").css("display","none");
    }
    var numberVideoView = 3;
    if(numberOwnVideo > 0){
        jQuery("#mini-slider-own").find(".mini-slider-list").width(jQuery("#mini-slider-own .mini-slider-item").outerWidth(true) * numberOwnVideo);
    }

    jQuery("#mini-slider-own").find(".mini-slider-arrow-next").bind("click",function(){
        jQuery("#mini-slider-own").find(".mini-slider-arrow-prev").css("display","table");
        var numberVideoRemain = numberOwnVideo - numberVideoView;
        if(numberVideoRemain > 3){
            numberVideoRemain = 3;
        }

       /* jQuery("#mini-slider-own").find('.mini-slider-list').animate({
            left: "-="+jQuery("#mini-slider-own .mini-slider-item").outerWidth(true)*numberVideoRemain
        }, 500);*/

        TweenMax.to( jQuery("#mini-slider-own .mini-slider-list"), 0.8, {left: "-="+jQuery("#mini-slider-own .mini-slider-item").outerWidth(true)*numberVideoRemain, ease: Cubic.easeInOut});

        numberVideoView = numberVideoView + numberVideoRemain;

        if(numberVideoView == numberOwnVideo){
            jQuery(this).css("display","none");
        }
    });


    jQuery("#mini-slider-own").find(".mini-slider-arrow-prev").bind("click",function(){
        jQuery("#mini-slider-own").find(".mini-slider-arrow-next").css("display","table");

        var numberVideoRemain = numberVideoView - 3;
        if(numberVideoRemain <= 0){
            numberVideoRemain = 0;
        }

        TweenMax.to( jQuery("#mini-slider-own .mini-slider-list"), 0.8, {left: "+="+jQuery("#mini-slider-own .mini-slider-item").outerWidth(true)*numberVideoRemain, ease: Cubic.easeInOut});

        numberVideoView = numberVideoView - numberVideoRemain;

        if(numberVideoRemain <= 3){
            jQuery(this).css("display","none");
        }
    });

    jQuery('.team-see-goals').on('click', function(){
        var container = jQuery(this).parents('.league-stats-equipe-match-league');
        container.toggleClass('open');
    });



    jQuery(document).on("click",".mini-slider-item", function(){
        var idYoutube = jQuery(this).attr("data-id");

        var url = 'https://www.youtube.com/embed/' + idYoutube + '?autoplay=1&controls=1&rel=0&disablekb=1';

        jQuery(".videoLightBox").find('iframe').attr('src', url);

        jQuery(".bloc-layout").fadeIn(400);
        jQuery(".videoLightBox").fadeIn(400);
    });

    jQuery(".team-videos-filter li a").bind("click",function(){
        var target = jQuery(this).attr("data-target");
        jQuery(".team-videos-filter li").removeClass("active");
        jQuery(this).parents("li").addClass("active");
        if(target == 'own'){
            jQuery("#mini-slider-own").css("display","block");
            jQuery("#mini-slider-league").css("display","none");
        }else{
            jQuery("#mini-slider-own").css("display","none");
            jQuery("#mini-slider-league").css("display","block");
        }
    });

    jQuery("#regirster-form #link-to-register").bind("click",function(){
        jQuery("#login").fadeOut(400, function(){
            resetErrorsMessages();
            jQuery("#register").fadeIn(400);
        });
        btnLoaderOut(jQuery('#link-login'));
    });

    jQuery(".wpb_text_column .wpb_wrapper p a").each(function( index ){
        if(!jQuery(this).hasClass("classic-link")){
            jQuery(this).parents("p").addClass("link-bloc-text");
        }
    });

    /*RESERVATION COMMANDE*/
    jQuery("#reservation-commande-content ul li#where").bind("click",function(){
        jQuery('.telecommande-item').removeClass('active');
        jQuery('.bloc-reservation').fadeOut(200);

            jQuery("#bloc-where ul#bloc-where-centres li").fadeIn(200);
            jQuery("#reservation-commande-content ul li#where").addClass("active");
            jQuery("#bloc-where").fadeIn(200);
        checkReservationRapide();
    });

    jQuery("#reservation-commande-content ul li#when").bind("click",function(){
        jQuery('.telecommande-item').removeClass('active');
        jQuery('.bloc-reservation').fadeOut(200);

            jQuery("#reservation-commande-content ul li#when").addClass("active");
            jQuery("#bloc-when").fadeIn(200);
        checkReservationRapide();
    });

    jQuery("#reservation-commande-content ul li#how").bind("click",function(){
        jQuery('.telecommande-item').removeClass('active');
        jQuery('.bloc-reservation').fadeOut(200);

            jQuery("#reservation-commande-content ul li#how").addClass("active");
            jQuery("#bloc-how").fadeIn(200);
        checkReservationRapide();
    });

    jQuery(".bloc-reservation-close").bind("click",function(){
        jQuery('.telecommande-item').removeClass('active');
        jQuery('.bloc-reservation').fadeOut(200);

        checkReservationRapide();
    });

    function checkReservationRapide(){
        if(global.reservationHeure && global.reservationMinute && global.reservationDureeHeure && global.reservationDureeMinute && global.reservationDay && global.reservationMonth && global.reservationYear && global.reservationType && global.reservationCentre){
            jQuery('#go').addClass('done');
        }else{
            jQuery('#go').removeClass('done');
        }
    }

    jQuery("#bloc-where ul#bloc-where-centres li a").bind("click",function(){
        var idCentre    = jQuery(this).parent().attr('data-target');
        var nameCentre  =  jQuery(this).parent().attr('data-name');

        for(var i = 0 ; i < global.bookableCenters.length ; i++){
            if(global.bookableCenters[i].key == idCentre){
                    jQuery("#bloc-how ul li").each(function() {
                        var isTypeTerrain = false;
                        for(var j = 0; j < global.bookableCenters[i].resourceTypes.length; j++) {
                            if (jQuery(this).attr("data-id") == global.bookableCenters[i].resourceTypes[j].key) {
                                isTypeTerrain = true;
                            }
                        }
                        if(isTypeTerrain == false){
                            jQuery(this).addClass("hide");
                        }else{
                            jQuery(this).removeClass("hide");
                        }
                    });
                break;
            }
        }

        jQuery("#bloc-how ul li").each(function() {
           if(jQuery(this).hasClass("active")){
               if(jQuery(this).hasClass('hide')){
                   global.reservationType = null;
                   jQuery('#reservation-commande-content > ul > li#how').trigger('click');
               }
           }
        });

        global.reservationCentreName = nameCentre;
        global.reservationCentre = idCentre;

        jQuery("#reservation-commande-content > ul > li#where .active").css("display","block");
        jQuery("#reservation-commande-content > ul > li#where .active span").html(nameCentre);

        jQuery("#reservation-commande-content ul li#where").removeClass("active");
        jQuery("#bloc-where").fadeOut(200);
        checkReservationRapide();
    });

    function successCallback(position){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: map
        });
    }

    if(jQuery("#map-centre").length > 0){
        var lat     =   jQuery("#map-centre").attr("data-lat");
        var long    =   jQuery("#map-centre").attr("data-long");

        map = new google.maps.Map(document.getElementById("iframe-map-centre"), {
            zoom: 15,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var markerPosition = new google.maps.LatLng(lat, long);

        marker = new google.maps.Marker({
            position: markerPosition,
            map: map
        });
    }

    jQuery(".telecommande_select_heure li").bind("click",function(){
        var heure;
        heure = jQuery( this ).attr('data-id');

        global.reservationHeure = heure;

        checkAllDate();
        checkReservationRapide();
    });

    jQuery(".telecommande_select_minutes li").bind("click",function(){
        var heure;
        heure = jQuery( this ).attr('data-id');

        global.reservationMinute = heure;

        checkAllDate();
        checkReservationRapide();
    });

    jQuery(".telecommande_select_duree li").bind("click",function(){
        var duree;
        duree = jQuery( this ).attr('data-id');

        duree = duree.split(":");

        global.reservationDureeHeure    = duree[0];
        global.reservationDureeMinute   = duree[1];

        checkAllDate();
        checkReservationRapide();
    });

    jQuery(".leagues-search-input").each(function() {
        jQuery(this).prop('selectedIndex',0);
        jQuery(this).prop('selected', function() {
            return this.defaultSelected;
        });
    });

    jQuery(".leagues-search-input").change(function() {
        jQuery( this ).each(function() {
            jQuery(this).parents(".leagues-search-input-container").find("span").text(jQuery(this).find('option[value="' + jQuery( this ).attr('value') + '"]').text());
        });
    });

    jQuery("#test-paiement").bind("click",function(){
        jQuery.post(
            global.ajaxUrl,
            {
                'action'            :   'get_paiement_form',
                'centre_id'          :   5
            },
            function (response) {
                var result = JSON.parse(response);
                jQuery("#form-paiement").html(result.message);
            }
        )
    });

    jQuery("#reservation-commande-content > ul > li#go").bind("click",function(){
        if(global.reservationHeure && global.reservationMinute && global.reservationDureeHeure && global.reservationDureeMinute && global.reservationDay && global.reservationMonth && global.reservationYear && global.reservationType && global.reservationCentre){
            //DUREE EN MINUTE
            var duree = parseInt(global.reservationDureeHeure) * 60 + parseInt(global.reservationDureeMinute);

            jQuery.post(
                global.ajaxUrl,
                {
                    'action'            :   'set_prereservation',
                    'duration'          :   duree,
                    'type'              :   global.reservationType,
                    'centreId'          :   global.reservationCentre,
                    'hour'              :   global.reservationHeure,
                    'minute'            :   global.reservationMinute,
                    'day'               :   global.reservationDay,
                    'month'             :   global.reservationMonth,
                    'year'              :   global.reservationYear
                },
                function (response) {
                    //TODO GERER LES MESSAGES D'ERREUR
                    result = JSON.parse(response);

                    if(result.isLog == false){
                        global.isReservationActive = true;
                        jQuery(".bloc-layout").fadeIn(400);
                        jQuery("#login").fadeIn(400);
                    }else{
                        window.location.href = global.siteUrl + 'reserver-un-terrain';
                    }
                }
            )
        }
    });

    jQuery(".open_slide_photos").bind("click",function(){
        if(jQuery(this).hasClass("active")){
            jQuery(this).removeClass("active");
            jQuery("#centre_slider_photo").fadeOut(200);
            jQuery(".bloc-layout").fadeOut(200);
        }else{
            jQuery(this).addClass("active");
            jQuery(".bloc-layout").fadeIn(200);
            jQuery("#centre_slider_photo").fadeIn(200);
        }

    });

    jQuery("#bloc-how ul li").bind("click",function(){
        jQuery("#bloc-how ul li").removeClass("active");
       jQuery(this).addClass("active");
       global.reservationType = jQuery(this).attr('data-id');

        jQuery("#reservation-commande-content > ul > li#how .active").fadeIn(200);
        jQuery("#reservation-commande-content > ul > li#how .active span").html(jQuery(this).text());

        jQuery("#reservation-commande-content ul li#how").removeClass("active");
        jQuery("#bloc-how").fadeOut(200)
        checkReservationRapide();
    });

    var nowDate = new Date();
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

    jQuery(".date-reservation-compte").bind("click",function(){
        //jQuery(".bloc-layout").fadeIn(400)
        jQuery("#mon-compte-date-picker").fadeIn(400)
    });

    jQuery('#mon-compte-bloc-when-datepicker').datepicker({
        format: "dd/mm/yyyy",
        language: "fr",
        startDate: today,
        todayHighlight: true
    }).change(dateChangedMonCompte)
        .on('changeDate', dateChangedMonCompte);

    function dateChangedMonCompte(ev){
        jQuery(".bloc-layout").fadeOut(400);
        jQuery("#mon-compte-date-picker").fadeOut(400);

        var d = new Date(ev.date);

        global.monCompteReservationDay      =   ("0" + (d.getDate())).slice(-2);
        global.monCompteReservationMonth    =   ("0" + (d.getMonth() + 1)).slice(-2);
        global.monCompteReservationYear     =   d.getFullYear();

        jQuery(".modifier-reservation-container .reservation-date").text((("0" + (d.getDate())).slice(-2))+'/'+(("0" + (d.getMonth() + 1)).slice(-2))+'/'+d.getFullYear());
    }

    jQuery("#save-favoris").bind("click",function(){
        btnLoaderIn(jQuery("#save-favoris"));
        jQuery(".notifications-list-favoris li").each(function( index ) {
            var centreFavoris = new Array();
            if(jQuery(this).find("input").prop('checked') == true){
                centreFavoris.push(jQuery(this).find("input").attr("data-id"));
            }

            jQuery.post(
                global.ajaxUrl,
                {
                    'action'            :   'api_add_favoris',
                    'favoris'              :   centreFavoris
                },
                function (response) {
                    btnLoaderOut(jQuery("#save-favoris"));

                    jQuery('#mon-compte-favoris .mon-compte-register-success').addClass('visible');
                    errorsIn(jQuery('#mon-compte-favoris .error-message-container'), null, true);
                }
            )
        });
    });

    jQuery("#save-notification").bind("click",function(){

        btnLoaderIn(jQuery('#save-notification'));

        var indoor = false;
        if(jQuery('.notifications-list li input#indoor').prop('checked') == true){
            indoor = true;
        }

        var outdoor = false;
        if(jQuery('.notifications-list li input#outdoor').prop('checked') == true){
            outdoor = true;
        }

        var monday2Thursday1923 = false;
        if(jQuery('.notifications-list li input#monday2Thursday1923').prop('checked') == true){
            monday2Thursday1923 = true;
        }

        var monday2Thursday2022 = false;
        if(jQuery('.notifications-list li input#monday2Thursday2022').prop('checked') == true){
            monday2Thursday2022 = true;
        }

        var weekEnd1012 = false;
        if(jQuery('.notifications-list li input#weekEnd1012').prop('checked') == true){
            weekEnd1012 = true;
        }

        var notifiySameDay = false;
        if(jQuery('.notifications-list li input#notifiySameDay').prop('checked') == true){
            notifiySameDay = true;
        }

        var notifyTwoDaysBefore = false;
        if(jQuery('.notifications-list li input#notifyTwoDaysBefore').prop('checked') == true){
            notifyTwoDaysBefore = true;
        }

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'set_notification',
                'indoor'                :   indoor,
                'outdoor'               :   outdoor,
                'monday2Thursday1923'   :   monday2Thursday1923,
                'monday2Thursday2022'   :   monday2Thursday2022,
                'weekEnd1012'           :   weekEnd1012,
                'notifiySameDay'        :   notifiySameDay,
                'notifyTwoDaysBefore'   :   notifyTwoDaysBefore
            },
            function (response) {
                btnLoaderOut(jQuery('#save-notification'));

                jQuery('#mon-compte-notifications .mon-compte-register-success').addClass('visible');
                errorsIn(jQuery('#mon-compte-notifications .error-message-container'), null, true);
            }
        )
    });

    var clickResa = false;

    jQuery("#reservation-submit-step-1").bind("click",function(){
        var dates   =   jQuery(".reservation-terrain-date .select-style-text").text();
        dates       =   dates.split("/");
        var day     =   dates[0];
        var month   =   dates[1];
        var year    =   dates[2];

        var centre  = jQuery( ".reservation-terrain-center .select-style-text" ).attr('data-id');
        var centreName  = jQuery( ".reservation-terrain-center .select-style-text" ).text();

        var heure   = jQuery( ".reservation-terrain-heure li.active").attr("data-id");
        heure = ("0" + (heure)).slice(-2);
        var minute  = jQuery( ".reservation-terrain-minute li.active").attr("data-id");
        minute = ("0" + (minute)).slice(-2);

        var type = jQuery( ".reservation-terrain-type .select-style-text" ).attr('data-id');

        var duree = jQuery( ".reservation-terrain-duree li.active" ).text();
        duree = duree.split("h");
        duree = parseInt(duree[0]) * 60 + parseInt(duree[1]);

        btnLoaderIn(jQuery("#reservation-submit-step-1"));

        var error = false;

        if(!day || !month || !year){
            error = true;
            jQuery('.reservation-date-error').addClass('visible');
        }else{
            jQuery('.reservation-date-error').addClass('no-visible');
        }

        if(!centre){
            error = true;
            jQuery('.reservation-center-error').addClass('visible');
        }else{
            jQuery('.reservation-center-error').addClass('no-visible');
        }

        if(heure == 'ed' || minute == 'ed'){
            error = true;
            jQuery('.reservation-heure-error').addClass('visible');
        }else{
            jQuery('.reservation-heure-error').addClass('no-visible');
        }

        if(!type){
            error = true;
            jQuery('.reservation-type-error').addClass('visible');
        }else{
            jQuery('.reservation-type-error').addClass('no-visible');
        }

        if(!duree){
            error = true;
            jQuery('.reservation-duree-error').addClass('visible');
        }else{
            jQuery('.reservation-duree-error').addClass('no-visible');
        }

        errorsIn(jQuery('#modifier-reservation .error-message-container'));
        jQuery('.reserver-step-1 .reserver-title:nth-child(2)').fadeOut(0);

        if(error == false && clickResa == false){
            clickResa = true;

            dataLayer.push({
                "event":"search",
                "searchDate": day+"/"+month+"/"+year,
                "searchHour": heure+"h",
                "searchMinutes": minute+"m",
                "searchCenter": centreName.replace(/ /g,''),
                "searchType": type,
                "searchTime": ""+duree
            });

            jQuery.post(
                global.ajaxUrl,
                {
                    'action'            :   'check_availabilites',
                    'duration'          :   duree,
                    'type'              :   type,
                    'centreId'          :   centre,
                    'hour'              :   heure,
                    'minute'            :   minute,
                    'day'               :   day,
                    'month'             :   month,
                    'year'              :   year
                },
                function (response) {
                    result = JSON.parse(response);
                    btnLoaderOut(jQuery("#reservation-submit-step-1"));
                    if(result.available == true){
                        global.reservationAvailable = true;
                        //LA RESERVATION EST DISPONIBLE
                        var reservationValide = result.obj_reservation[0];
                        jQuery.post(
                            global.ajaxUrl,
                            {
                                'action'                :   'prebook_reservation',
                                'centreId'              :   reservationValide.centerId,
                                'resourceType'          :   reservationValide.resourceType,
                                'start'                 :   reservationValide.start,
                                'duration'              :   reservationValide.duration
                            },
                            function (response) {
                                result = JSON.parse(response);
                                global.reservationStep = 3;


                                jQuery(".reservation-payer-online").unbind("click");
                                jQuery(".reservation-payer-online").bind("click", reservationPayerOnline);
                                jQuery("#form-paiement").empty();

                                jQuery("#form-paiement-message").html('');

                                //SI LE USER NE PEUT PAS BOOK ON SUPPRIME LE BOUTON DE RESERVATION SANS PAYER
                                if(!result.canBook){
                                    jQuery(".reservation-sans-payer").remove();

                                    global.reservationFinal = reservationValide;
                                    global.reservationFinal.canBook = false;
                                    global.reservationFinal.id = null;
                                }else{
                                    global.reservationFinal = reservationValide;
                                    global.reservationFinal.canBook = true;
                                    global.reservationFinal.id = null;
                                }

                                jQuery(".reserver-step").removeClass("active");
                                jQuery("#reserver-telecommande ul li:nth-child(2), #reserver-telecommande ul li:nth-child(1)").addClass("complete").removeClass('active');
                                jQuery(".reserver-step-3").addClass("active");
                                jQuery("#reserver-telecommande ul li:nth-child(3)").addClass("active");

                                jQuery(".step-3-centre").text(global.reservationFinal.centerName);
                                jQuery(".step-3-type").text(global.reservationFinal.resourceTypeDisplay);

                                var start   = parseDate(global.reservationFinal.start);
                                var day     = ("0" + (start.getDate())).slice(-2);
                                var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                                var year    = start.getFullYear();

                                var heure   = ("0" + (start.getHours())).slice(-2);
                                var minute  = ("0" + (start.getMinutes())).slice(-2);

                                jQuery(".step-3-date").text(day+"/"+month+"/"+year);
                                jQuery(".step-3-heure").text(heure+":"+minute);
                                jQuery(".step-3-prix").text(global.reservationFinal.price+"€");

                                var hours = Math.floor( global.reservationFinal.duration / 60);
                                var minutes = global.reservationFinal.duration % 60;
                                hours = ("0" + (hours)).slice(-2);
                                minutes = ("0" + (minutes)).slice(-2);

                                jQuery(".step-3-duree").text(hours+"h"+minutes);
                                jQuery(".step-3-total").text(global.reservationFinal.price+"€");

                                dataLayer.push({
                                    "event": "step3",
                                    "resaRevenue": global.reservationFinal.price,
                                    "resaTax": 0,
                                    "resaDate": day+"/"+month+"/"+year,
                                    "resaHour": heure+":"+minute,
                                    "resaCenter": global.reservationFinal.centerName,
                                    "resaType": global.reservationFinal.resourceTypeDisplay,
                                    "resaTime": hours+"h"+minutes
                                });
                            }
                        )
                    }else{
                        //LA RESERVATION N'EST PAS DISPONIBLE
                        global.reservationAvailable = false;


                        var products = [];

                        global.listReservation = result.other;

                        if (result.other.Code === 60 && result.other.hasOwnProperty('MaxDayExceeded')) {
                            var message = 'Cher client, les réservations en ligne sont limitées à moins de ' + result.other.MaxDayExceeded + ' jours. Pour davantage d’informations, n’hésitez pas à contacter votre centre';
                            jQuery('.reserver-step-1 .reserver-title:nth-child(2)').html(message);
                            jQuery('.reserver-step-1 .reserver-title:nth-child(2)').fadeIn(0);
                        } else if(!result.other.otherCenter && !result.other.otherDay && !result.other.otherDuration && !result.other.otherResourceType && !result.other.otherStart){
                            if(result.other.Message){
                                jQuery('.reserver-step-1 .reserver-title:nth-child(2)').html(result.other.Message);
                            }
                            jQuery('.reserver-step-1 .reserver-title:nth-child(2)').fadeIn(0);
                        }else{
                            global.reservationStep = 2;
                            jQuery(".reserver-step-1").removeClass("active");
                            jQuery("#reserver-telecommande ul li:nth-child(1)").addClass("complete").removeClass('active');
                            jQuery(".reserver-step-2").addClass("active");
                            jQuery("#reserver-telecommande ul li:nth-child(2)").addClass("active");
                            jQuery(".reserver-step-2 .table-style-light tbody").empty();
                            jQuery(".reserver-step-2 .all-reservation").empty();

                            if(result.other.otherStart != null && result.other.otherStart.length != 0){
                                jQuery(".reserver-step-2 .all-reservation").append("<p>Même type de terrain, le même jour, à une heure différente.</p>");
                                var div = '<table class="table-style-light"><thead><tr><th class="cell-background-orange">Date</th><th class="cell-background-orange">Heure</th><th class="cell-background-orange">Durée</th><th class="cell-background-orange">Centre</th><th class="cell-background-orange">Type</th><th class="cell-background-orange">Prix</th><th></th></tr></thead><tbody>';
                                for(var i = 0; i < result.other.otherStart.length ; i++){

                                    var start = parseDate(result.other.otherStart[i].start);

                                    var day     = ("0" + (start.getDate())).slice(-2);
                                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                                    var year    = start.getFullYear();

                                    var heure   = ("0" + (start.getHours())).slice(-2);
                                    var minute  = ("0" + (start.getMinutes())).slice(-2);
                                    div += '<tr><td>'+day+'/'+month+'/'+year+'</td><td>'+heure+':'+minute+'</td><td>'+result.other.otherStart[i].durationDisplay+'</td><td>'+result.other.otherStart[i].centerName+'</td><td>'+result.other.otherStart[i].resourceTypeDisplay+'</td><td>'+result.other.otherStart[i].price+' €</td><td><a class="disable choose-reservation cell-link-underline" data-type="otherStart" data-target="'+i+'">Réserver ce terrain</a></td></tr>'

                                    var product = {
                                        "resaRevenue": result.other.otherStart[i].price,
                                        "resaTax": 0,
                                        "resaDate": day+'/'+month+'/'+year,
                                        "resaHour": heure+':'+minute,
                                        "resaCenter": result.other.otherStart[i].centerName,
                                        "resaType": result.other.otherStart[i].resourceTypeDisplay,
                                        "resaTime": result.other.otherStart[i].durationDisplay
                                    };
                                    products.push(product);

                                }
                                div += '</tbody></table>';
                                jQuery(".reserver-step-2 .all-reservation").append(div);
                            }

                            if(result.other.otherResourceType != null && result.other.otherResourceType.length != 0){
                                jQuery(".reserver-step-2 .all-reservation").append("<p>Même jour, même heure, autre type de terrain.</p>");
                                var div = '<table class="table-style-light"><thead><tr><th class="cell-background-orange">Date</th><th class="cell-background-orange">Heure</th><th class="cell-background-orange">Durée</th><th class="cell-background-orange">Centre</th><th class="cell-background-orange">Type</th><th class="cell-background-orange">Prix</th><th></th></tr></thead><tbody>';
                                for(var i = 0; i < result.other.otherResourceType.length ; i++){
                                    var start   = parseDate(result.other.otherResourceType[i].start);
                                    var day     = ("0" + (start.getDate())).slice(-2);
                                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                                    var year    = start.getFullYear();

                                    var heure   = ("0" + (start.getHours())).slice(-2);
                                    var minute  = ("0" + (start.getMinutes())).slice(-2);
                                    div += '<tr><td>'+day+'/'+month+'/'+year+'</td><td>'+heure+':'+minute+'</td><td>'+result.other.otherResourceType[i].durationDisplay+'</td><td>'+result.other.otherResourceType[i].centerName+'</td><td>'+result.other.otherResourceType[i].resourceTypeDisplay+'</td><td>'+result.other.otherResourceType[i].price+' €</td><td><a class="disable choose-reservation cell-link-underline" data-type="otherResourceType" data-target="'+i+'">Réserver ce terrain</a></td></tr>'

                                    var product = {
                                        "resaRevenue": result.other.otherResourceType[i].price,
                                        "resaTax": 0,
                                        "resaDate": day+'/'+month+'/'+year,
                                        "resaHour": heure+':'+minute,
                                        "resaCenter": result.other.otherResourceType[i].centerName,
                                        "resaType": result.other.otherResourceType[i].resourceTypeDisplay,
                                        "resaTime": result.other.otherResourceType[i].durationDisplay
                                    };
                                    products.push(product);

                                }
                                div += '</tbody></table>';
                                jQuery(".reserver-step-2 .all-reservation").append(div);
                            }

                            if(result.other.otherDuration != null && result.other.otherDuration.length != 0){
                                jQuery(".reserver-step-2 .all-reservation").append("<p>Même jour, même heure, autre durée.</p>");
                                var div = '<table class="table-style-light"><thead><tr><th class="cell-background-orange">Date</th><th class="cell-background-orange">Heure</th><th class="cell-background-orange">Durée</th><th class="cell-background-orange">Centre</th><th class="cell-background-orange">Type</th><th class="cell-background-orange">Prix</th><th></th></tr></thead><tbody>';
                                for(var i = 0; i < result.other.otherDuration.length ; i++){
                                    var start   = parseDate(result.other.otherDuration[i].start);
                                    var day     = ("0" + (start.getDate())).slice(-2);
                                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                                    var year    = start.getFullYear();

                                    var heure   = ("0" + (start.getHours())).slice(-2);
                                    var minute  = ("0" + (start.getMinutes())).slice(-2);
                                    div += '<tr><td>'+day+'/'+month+'/'+year+'</td><td>'+heure+':'+minute+'</td><td>'+result.other.otherDuration[i].durationDisplay+'</td><td>'+result.other.otherDuration[i].centerName+'</td><td>'+result.other.otherDuration[i].resourceTypeDisplay+'</td><td>'+result.other.otherDuration[i].price+' €</td><td><a class="disable choose-reservation cell-link-underline" data-type="otherDuration" data-target="'+i+'">Réserver ce terrain</a></td></tr>'

                                    var product = {
                                        "resaRevenue": result.other.otherDuration[i].price,
                                        "resaTax": 0,
                                        "resaDate": day+'/'+month+'/'+year,
                                        "resaHour": heure+':'+minute,
                                        "resaCenter": result.other.otherDuration[i].centerName,
                                        "resaType": result.other.otherDuration[i].resourceTypeDisplay,
                                        "resaTime": result.other.otherDuration[i].durationDisplay
                                    };
                                    products.push(product);

                                }
                                div += '</tbody></table>';
                                jQuery(".reserver-step-2 .all-reservation").append(div);
                            }

                            if(result.other.otherDay != null && result.other.otherDay.length != 0){
                                jQuery(".reserver-step-2 .all-reservation").append("<p>Même heure, même type de terrain, autre jour.</p>");
                                var div = '<table class="table-style-light"><thead><tr><th class="cell-background-orange">Date</th><th class="cell-background-orange">Heure</th><th class="cell-background-orange">Durée</th><th class="cell-background-orange">Centre</th><th class="cell-background-orange">Type</th><th class="cell-background-orange">Prix</th><th></th></tr></thead><tbody>';
                                for(var i = 0; i < result.other.otherDay.length ; i++){
                                    var start   = parseDate(result.other.otherDay[i].start);
                                    var day     = ("0" + (start.getDate())).slice(-2);
                                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                                    var year    = start.getFullYear();

                                    var heure   = ("0" + (start.getHours())).slice(-2);
                                    var minute  = ("0" + (start.getMinutes())).slice(-2);
                                    div += '<tr><td>'+day+'/'+month+'/'+year+'</td><td>'+heure+':'+minute+'</td><td>'+result.other.otherDay[i].durationDisplay+'</td><td>'+result.other.otherDay[i].centerName+'</td><td>'+result.other.otherDay[i].resourceTypeDisplay+'</td><td>'+result.other.otherDay[i].price+' €</td><td><a class="disable choose-reservation cell-link-underline" data-type="otherDay" data-target="'+i+'">Réserver ce terrain</a></td></tr>'

                                    var product = {
                                        "resaRevenue": result.other.otherDay[i].price,
                                        "resaTax": 0,
                                        "resaDate": day+'/'+month+'/'+year,
                                        "resaHour": heure+':'+minute,
                                        "resaCenter": result.other.otherDay[i].centerName,
                                        "resaType": result.other.otherDay[i].resourceTypeDisplay,
                                        "resaTime": result.other.otherDay[i].durationDisplay
                                    };
                                    products.push(product);
                                }
                                div += '</tbody></table>';
                                jQuery(".reserver-step-2 .all-reservation").append(div);
                            }

                            if(result.other.otherCenter != null && result.other.otherCenter.length != 0){
                                jQuery(".reserver-step-2 .all-reservation").append("<p>Même jour, même heure, même type de terrain, autre centre.</p>");
                                var div = '<table class="table-style-light"><thead><tr><th class="cell-background-orange">Date</th><th class="cell-background-orange">Heure</th><th class="cell-background-orange">Durée</th><th class="cell-background-orange">Centre</th><th class="cell-background-orange">Type</th><th class="cell-background-orange">Prix</th><th></th></tr></thead><tbody>';
                                for(var i = 0; i < result.other.otherCenter.length ; i++){
                                    var start   = parseDate(result.other.otherCenter[i].start);
                                    var day     = ("0" + (start.getDate())).slice(-2);
                                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                                    var year    = start.getFullYear();

                                    var heure   = ("0" + (start.getHours())).slice(-2);
                                    var minute  = ("0" + (start.getMinutes())).slice(-2);
                                    div += '<tr><td>'+day+'/'+month+'/'+year+'</td><td>'+heure+':'+minute+'</td><td>'+result.other.otherCenter[i].durationDisplay+'</td><td>'+result.other.otherCenter[i].centerName+'</td><td>'+result.other.otherCenter[i].resourceTypeDisplay+'</td><td>'+result.other.otherCenter[i].price+' €</td><td><a class="disable choose-reservation cell-link-underline" data-type="otherCenter" data-target="'+i+'">Réserver ce terrain</a></td></tr>'

                                    var product = {
                                        "resaRevenue": result.other.otherCenter[i].price,
                                        "resaTax": 0,
                                        "resaDate": day+'/'+month+'/'+year,
                                        "resaHour": heure+':'+minute,
                                        "resaCenter": result.other.otherCenter[i].centerName,
                                        "resaType": result.other.otherCenter[i].resourceTypeDisplay,
                                        "resaTime": result.other.otherCenter[i].durationDisplay
                                    };
                                    products.push(product);
                                }
                                div += '</tbody></table>';
                                jQuery(".reserver-step-2 .all-reservation").append(div);
                            }
                        }

                        dataLayer.push({
                            "event": "step2",
                            "products": products
                        });
                    }
                    clickResa = false;
                }
            )
        }else{
            btnLoaderOut(jQuery("#reservation-submit-step-1"));
        }
    });

    jQuery('.back-to-reserver-1').on('click', function(){
        clickResa = false;
        jQuery(".reserver-step").removeClass("active");
        jQuery(".reserver-step-1").addClass("active");

        jQuery("#reserver-telecommande ul li:nth-child(1)").removeClass("complete").addClass('active');
        jQuery("#reserver-telecommande ul li:nth-child(2), #reserver-telecommande ul li:nth-child(3)").removeClass("active complete");
    });

    jQuery('.back-to-reserver-2').on('click', function(){
        if(global.reservationAvailable) {
            jQuery(".reserver-step").removeClass("active");
            jQuery(".reserver-step-1").addClass("active");

            jQuery("#reserver-telecommande ul li:nth-child(1)").removeClass("complete").addClass('active');
            jQuery("#reserver-telecommande ul li:nth-child(2), #reserver-telecommande ul li:nth" +
              "-child(3)").removeClass("active complete");
        }else{
            jQuery(".reserver-step").removeClass("active");
            jQuery(".reserver-step-2").addClass("active");

            jQuery("#reserver-telecommande ul li:nth-child(2)").removeClass("complete").addClass('active');
            jQuery("#reserver-telecommande ul li:nth-child(3)").removeClass("active");
        }
    });

    if(typeof availabilitiesNotification !== 'undefined'){
        if(availabilitiesNotification.length == 0){
            jQuery(".availabilitiesNotification-text").css("display","block");
        }
    }

    jQuery(document).on("click",".choose-reservation", function(){
        var index = jQuery(this).attr("data-target");
        var type = jQuery(this).attr("data-type");

        if(typeof availabilitiesNotification !== 'undefined'){
            var reservationSelected = availabilitiesNotification[index];
        }else{
            var reservationSelected = global.listReservation[type][index];
        }


        var centreId = reservationSelected.centerId;
        var resourceType = reservationSelected.resourceType;
        var start = reservationSelected.start;
        var duration = reservationSelected.duration;

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'prebook_reservation',
                'centreId'              :   centreId,
                'resourceType'          :   resourceType,
                'start'                 :   start,
                'duration'              :   duration
            },
            function (response) {
                result = JSON.parse(response);
                global.reservationStep = 3;

                jQuery("#form-paiement-message").html('');

                jQuery(".reservation-payer-online").unbind("click");
                jQuery(".reservation-payer-online").bind("click", reservationPayerOnline);
                jQuery("#form-paiement").empty();

                //SI LE USER NE PEUT PAS BOOK ON SUPPRIME LE BOUTON DE RESERVATION SANS PAYER
                if(!result.canBook){
                    jQuery(".reservation-sans-payer").remove();

                    if(typeof availabilitiesNotification !== 'undefined'){
                        global.reservationFinal = availabilitiesNotification[index];
                    }else{
                        global.reservationFinal = global.listReservation[type][index];
                    }
                    global.reservationFinal.canBook = false;
                    global.reservationFinal.id = null;

                    jQuery(".reserver-step-2").removeClass("active");
                    jQuery("#reserver-telecommande ul li:nth-child(2)").addClass("complete").removeClass('active');
                    jQuery(".reserver-step-3").addClass("active");
                    jQuery("#reserver-telecommande ul li:nth-child(3)").addClass("active");

                    jQuery(".step-3-centre").text(global.reservationFinal.centerName);
                    jQuery(".step-3-type").text(global.reservationFinal.resourceTypeDisplay);

                    var start   = parseDate(global.reservationFinal.start);
                    var day     = ("0" + (start.getDate())).slice(-2);
                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                    var year    = start.getFullYear();

                    var heure   = ("0" + (start.getHours())).slice(-2);
                    var minute  = ("0" + (start.getMinutes())).slice(-2);

                    jQuery(".step-3-date").text(day+"/"+month+"/"+year);
                    jQuery(".step-3-heure").text(heure+":"+minute);
                    jQuery(".step-3-prix").text(global.reservationFinal.price+"€");


                    var hours = Math.floor( global.reservationFinal.duration / 60);
                    var minutes = global.reservationFinal.duration % 60;
                    hours = ("0" + (hours)).slice(-2);
                    minutes = ("0" + (minutes)).slice(-2);

                    jQuery(".step-3-duree").text(hours+"h"+minutes);
                    jQuery(".step-3-total").text(global.reservationFinal.price+"€");

                    dataLayer.push({
                        "event": "step3",
                        "resaRevenue": global.reservationFinal.price,
                        "resaTax": 0,
                        "resaDate": day+"/"+month+"/"+year,
                        "resaHour": heure+":"+minute,
                        "resaCenter": global.reservationFinal.centerName,
                        "resaType": global.reservationFinal.resourceTypeDisplay,
                        "resaTime": hours+"h"+minutes
                    });
                }

                if(result.canBook){
                    if(typeof availabilitiesNotification !== 'undefined'){
                        global.reservationFinal = availabilitiesNotification[index];
                    }else{
                        global.reservationFinal = global.listReservation[type][index];
                    }
                    global.reservationFinal.canBook = true;
                    global.reservationFinal.id = null;

                    jQuery(".reserver-step-2").removeClass("active");
                    jQuery("#reserver-telecommande ul li:nth-child(2)").addClass("complete").removeClass('active');
                    jQuery(".reserver-step-3").addClass("active");
                    jQuery("#reserver-telecommande ul li:nth-child(3)").addClass("active");

                    jQuery(".step-3-centre").text(global.reservationFinal.centerName);
                    jQuery(".step-3-type").text(global.reservationFinal.resourceTypeDisplay);

                    var start   = parseDate(global.reservationFinal.start);
                    var day     = ("0" + (start.getDate())).slice(-2);
                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                    var year    = start.getFullYear();

                    var heure   = ("0" + (start.getHours())).slice(-2);
                    var minute  = ("0" + (start.getMinutes())).slice(-2);

                    jQuery(".step-3-date").text(day+"/"+month+"/"+year);
                    jQuery(".step-3-heure").text(heure+":"+minute);
                    jQuery(".step-3-prix").text(global.reservationFinal.price+"€");


                    var hours = Math.floor( global.reservationFinal.duration / 60);
                    var minutes = global.reservationFinal.duration % 60;
                    hours = ("0" + (hours)).slice(-2);
                    minutes = ("0" + (minutes)).slice(-2);

                    jQuery(".step-3-duree").text(hours+"h"+minutes);
                    jQuery(".step-3-total").text(global.reservationFinal.price+"€");


                    dataLayer.push({
                        "event": "step3",
                        "resaRevenue": global.reservationFinal.price,
                        "resaTax": 0,
                        "resaDate": day+"/"+month+"/"+year,
                        "resaHour": heure+":"+minute,
                        "resaCenter": global.reservationFinal.centerName,
                        "resaType": global.reservationFinal.resourceTypeDisplay,
                        "resaTime": hours+"h"+minutes
                    });
                }

            }
        )
    });

    function reservationPayerOnline(){
        jQuery(".reservation-payer-online").unbind("click");
        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'set_paiement_form',
                'reservation'           :   global.reservationFinal
            },
            function (response) {
                result = JSON.parse(response);
                if(result.formPaiement.message){
                    jQuery(".reservation-sans-payer.reserver-btn-fill").css("background","#898989 none repeat scroll 0 0");
                    jQuery(".reservation-sans-payer.reserver-btn-fill").css("cursor","default");
                    jQuery(".reservation-sans-payer").unbind("click");
                    jQuery("#form-paiement-message").html("Ce créneau vous est maintenant reservé pendant 5 minutes, afin de le valider, merci de procéder au paiement en ligne.")
                    jQuery("#form-paiement").html(result.formPaiement.message);
                }else if(result.formPaiement.error){
                    jQuery("#form-paiement-message").html(result.formPaiement.error)
                }else{
                    jQuery("#form-paiement-message").html("Une erreur est survenue, le paiement en ligne n'est pas disponible.")
                }
            }
        );
    }

    /*jQuery(".reservation-payer-online").bind("click",function(){
        jQuery(".reservation-payer-online").unbind("click");
        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'set_paiement_form',
                'reservation'           :   global.reservationFinal
            },
            function (response) {
                result = JSON.parse(response);
                if(result.formPaiement.message){
                    jQuery(".reservation-sans-payer.reserver-btn-fill").css("background","#898989 none repeat scroll 0 0");
                    jQuery(".reservation-sans-payer.reserver-btn-fill").css("cursor","default");
                    jQuery(".reservation-sans-payer").unbind("click");
                    jQuery("#form-paiement-message").html("Ce créneau vous est maintenant reservé pendant 5 minutes, afin de le valider, merci de procéder au paiement en ligne.")
                    jQuery("#form-paiement").html(result.formPaiement.message);
                }else if(result.formPaiement.error){
                    jQuery("#form-paiement-message").html(result.formPaiement.error)
                }else{
                    jQuery("#form-paiement-message").html("Une erreur est survenue, le paiement en ligne n'est pas disponible.")
                }
            }
        );
    });*/


    jQuery(".reservation-sans-payer").bind("click",function(){
        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'set_reservation',
                'centreId'              :   global.reservationFinal.centerId,
                'resourceType'          :   global.reservationFinal.resourceType,
                'start'                 :   global.reservationFinal.start,
                'duration'              :   global.reservationFinal.duration,
                'idPreBook'             :   global.reservationFinal.id,
                'canBook'               :   global.reservationFinal.canBook
            },
            function (response) {
                result = JSON.parse(response);
                if(result.response.id){
                    jQuery(".reserver-step-3").removeClass("active");
                    jQuery("#reserver-telecommande ul li:nth-child(3)").addClass("complete").removeClass('active');
                    jQuery(".reserver-step-4").addClass("active");
                    jQuery("#reserver-telecommande ul li:nth-child(4)").addClass("active");


                    var start   = parseDate(result.response.start);
                    var day     = ("0" + (start.getDate())).slice(-2);
                    var month   = ("0" + (start.getMonth() + 1)).slice(-2);
                    var year    = start.getFullYear();

                    var heure   = ("0" + (start.getHours())).slice(-2);
                    var minute  = ("0" + (start.getMinutes())).slice(-2);

                    jQuery(".final-reservation-date").text(day+"/"+month+"/"+year);
                    jQuery(".final-reservation-heure").text(heure+":"+minute);
                    jQuery(".final-reservation-centre").text(result.response.centerName);

                    global.idReservationActive = result.response.id;

                    dataLayer.push({
                        "event": "resa",
                        "resaId": result.response.id,
                        "resaRevenue": result.response.price,
                        "resaTax": 0,
                        "resaTypePayment": 0,
                        "resaDate": day+"/"+month+"/"+year,
                        "resaHour": heure+":"+minute,
                        "resaCenter": result.response.centerName,
                        "resaType": result.response.resourceTypeDisplay,
                        "resaTime": result.response.duration
                    });
                }
            }
        )
    });

    jQuery("#table-mes-reservations tr td .supprimer").bind("click",function(){
        global.reservationAnnule = jQuery(this);
        jQuery("#confirmation-annulation-reservation").fadeIn(200);
    });

    jQuery("#confirmation-annulation-reservation #confirmation-annulation-reservation-annuler").bind("click",function(){
        jQuery("#confirmation-annulation-reservation").fadeOut(200);
    });

    jQuery("#confirmation-annulation-reservation #confirmation-annulation-reservation-confirmer").bind("click",function(){

        dataLayer.push({
            "event": "cancelResa",
            "resaId": global.reservationAnnule.val()
        });

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'cancel_reservation',
                'idReservation'              :   global.reservationAnnule.val()
            },
            function (response) {
                result = JSON.parse(response);
                if(result.response.statusDisplay == 'Annulée'){

                    var reservation = global.reservationAnnule.parents('tr');
                    global.reservationAnnule.parents('tr').remove();

                    jQuery("#reservation-annulee-bloc").css("display","block");
                    reservation.find("td").last().remove();
                    reservation.find("td").last().remove();
                    reservation.find("td").last().text("Annulée");
                    jQuery("#reservation-annulee-bloc #table-mes-reservations tbody").append(reservation);

                    /*global.reservationAnnule.parents('tr').find(".reservation_supprimer").empty();*/

                    jQuery("#confirmation-annulation-reservation").fadeOut(50);
                    jQuery("#confirmation-annulation-reservation-message").fadeIn(200);
                }
            }
        )
    });


    if(typeof reservationData !== 'undefined'){


        jQuery(".reserver-step-1").removeClass("active");
        jQuery("#reserver-telecommande ul li:nth-child(1)").addClass("complete").removeClass('active');
        jQuery("#reserver-telecommande ul li:nth-child(2)").addClass("complete").removeClass('active');
        jQuery("#reserver-telecommande ul li:nth-child(3)").addClass("complete").removeClass('active');
        jQuery(".reserver-step-4").addClass("active");
        jQuery("#reserver-telecommande ul li:nth-child(4)").addClass("active");

        jQuery(".rdv-accueil").css("display","none");


        if(response_code == 5){
            jQuery(".message-paiement").text("Votre paiement n'a pas été effectué. Merci de nous contacter à cas de probléme.")
        }

        var start   = parseDate(reservationData[1]);
        var day     = ("0" + (start.getDate())).slice(-2);
        var month   = ("0" + (start.getMonth() + 1)).slice(-2);
        var year    = start.getFullYear();

        var heure   = ("0" + (start.getHours())).slice(-2);
        var minute  = ("0" + (start.getMinutes())).slice(-2);

        jQuery(".final-reservation-date").text(day+"/"+month+"/"+year);
        jQuery(".final-reservation-heure").text(heure+":"+minute);
        jQuery(".final-reservation-centre").text(reservationData[0]);

        dataLayer.push({
            "event": "resa",
            "resaId": reservationData[4],
            "resaRevenue": reservationData[6],
            "resaTax": 0,
            "resaTypePayment": 1,
            "resaDate": day+"/"+month+"/"+year,
            "resaHour": heure+":"+minute,
            "resaCenter": reservationData[0],
            "resaType": "",
            "resaTime": ""
        });
    }

    jQuery('#bloc-when #bloc-when-datepicker').datepicker({
        format: "dd/mm/yyyy",
        language: "fr",
        startDate:today,
        todayHighlight: true
    }).change(dateChanged)
      .on('changeDate', dateChanged);

    function dateChanged(ev) {
        var d = new Date(ev.date);
        var today = new Date();

        global.reservationDay      =   ("0" + (d.getDate())).slice(-2);
        global.reservationMonth    =   ("0" + (d.getMonth() + 1)).slice(-2);
        global.reservationYear     =   d.getFullYear();

        console.log(global.reservationDay + '- ' + global.reservationMonth + ' - ' + global.reservationYear);

        if(((("0" + (today.getDate())).slice(-2)) == global.reservationDay) && ((("0" + (today.getMonth() + 1)).slice(-2)) == global.reservationMonth) && ((today.getFullYear()) == global.reservationYear)){
            jQuery("#bloc-when .telecommande_select_heure .select-list-style-1 li").css("display","block");
            jQuery("#bloc-when .telecommande_select_heure .select-list-style-1 li").each(function( index ){
                if(jQuery(this).attr("data-id") < today.getHours()){
                    jQuery(this).css("display","none");
                }
            });

            /*jQuery("#bloc-when .telecommande_select_minutes .select-list-style-1 li").each(function( index ){
                if(jQuery(this).attr("data-id") < today.getMinutes()){
                    jQuery(this).css("display","none");
                }
            });*/
        }else{
            jQuery("#bloc-when .telecommande_select_heure .select-list-style-1 li").css("display","block");
        }

        checkAllDate();
    }

    function checkAllDate(){
        if(global.reservationHeure && global.reservationMinute && global.reservationDureeHeure && global.reservationDureeMinute && global.reservationDay && global.reservationMonth && global.reservationYear){
            jQuery("#reservation-commande-content > ul > li#when .active").css("display","block");
            jQuery("#reservation-commande-content > ul > li#when .active li.date-picker span").html(global.reservationDay + '/' + global.reservationMonth);
            jQuery("#reservation-commande-content > ul > li#when .active li.heure-picker span").html(global.reservationHeure + 'h' + global.reservationMinute);
            jQuery("#reservation-commande-content > ul > li#when .active li.duree-picker span").html(global.reservationDureeHeure + 'h' + global.reservationDureeMinute);

            jQuery("#reservation-commande-content ul li#when").removeClass("active");
            jQuery("#bloc-when").fadeOut(200);
        }
    }

    jQuery(".datepicker thead tr th.prev,.datepicker thead tr th.next").empty();

    if (typeof isReservationActive !== 'undefined') {
        jQuery(".reserver-step .reserver-title p:first-child").text("Terminer votre réservation.");
        jQuery('#reservation-submit-step-1').trigger('click');
        jQuery('html, body').animate({
            scrollTop: jQuery(".mon-compte").offset().top
        }, 500);
    }

    /*function
    isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)jQuery)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?jQuery)/i);
        return pattern.test(emailAddress);
    }*/

    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }

    function cityNameIsValid(city){
        var pattern = new RegExp(/[0-9]/gi);
        return !pattern.test(city);
    }

    function errorsIn(container, time, success, delaySuccess){
        var h = 0;
        var messages = success ? container.find('p') : container.find('.error-message');
        var delay = delaySuccess ? delaySuccess : 4000;
        var time = time ? time : 0.2;

        messages.each(function(key, el){
            h = 0;
            var el = jQuery(el);
            var span = el.find('span');
            var link = el.find('.recuperer_mdp');

            if(el.hasClass('no-visible')){
                TweenMax.to(el, time, {height: 0, opacity: 0, onComplete:function(){
                    el.removeClass('visible no-visible');
                }});
            }else if(el.hasClass('visible')){
                h += span.outerHeight(true);
                if(link.length > 0){
                    h += link.outerHeight(true);
                }
                TweenMax.to(el, time, {height: h, opacity: 1});
            }
        });

        if(h == 0){
            TweenMax.to(container, time, {marginTop: 0, marginBottom: 0, ease: Cubic.easeInOut});
        }else{
            TweenMax.to(container, time, {marginTop: 25, marginBottom: 25, ease: Cubic.easeInOut});
        }

        if(success){
            setTimeout(function(){
                container.find('.success-message').removeClass('visible');
                errorsIn(container, time);
            }, delay)
        }
    }

    function successIn(container, time){
        var h = 0;
        var messages = container.find('.error-message');
        var time = time ? time : 0.2;

        messages.each(function(key, el){
            var el = jQuery(el);
            var span = el.find('span');

            if(el.hasClass('no-visible')){
                TweenMax.to(el, time, {height: 0, opacity: 0, onComplete:function(){
                    el.removeClass('visible no-visible');
                }});
            }else if(el.hasClass('visible')){
                h += span.outerHeight(true);
                TweenMax.to(el, time, {height: span.outerHeight(true), opacity: 1});
            }
        });

        if(h == 0){
            TweenMax.to(container, time, {marginTop: 0, marginBottom: 0, ease: Cubic.easeInOut});
        }else{
            TweenMax.to(container, time, {marginTop: 25, marginBottom: 25, ease: Cubic.easeInOut});
        }
    }

    function resetErrorsMessages(){
        var containers = jQuery('.error-message-container');
        jQuery('.error-message').addClass('no-visible');

        containers.each(function(key, container){
            errorsIn(jQuery(container), 0.1);
        });
    }

    jQuery("#deconexion-mon-compte").bind("click",function(){
        dataLayer.push({
            "event": "logout"
        });
    });


    /*CLICK LOGIN*/
    jQuery("#form-login").on("submit",function(e){
        e.preventDefault();
        var error           =   false;

        var login           =   jQuery("#login").find("#form-login-login").val();
        var pass            =   jQuery("#login").find("#form-login-psw").val();

        btnLoaderIn(jQuery('#link-login'));
        jQuery('.login-error').find("span").html("L'identifiant ou le mot de passe n'est pas correct.");
        if(login == ""){
            error = true;
            jQuery('.login-error').addClass('visible');
        }else{
            jQuery('.login-error').addClass('no-visible');
        }

        if(pass == ""){
            error = true;
            jQuery('.login-error').addClass('visible');
        }else{
            jQuery('.login-error').addClass('no-visible');
        }

        errorsIn(jQuery('#login-form .error-message-container'));

        if(error == false){
            jQuery.post(
                global.ajaxUrl,
                {
                    'action'            :   'login',
                    'login'             :   login,
                    'pass'              :   pass
                },
                function (response) {
                    //TODO GERER LES MESSAGES D'ERREUR
                    result = JSON.parse(response);

                    if(result.status == 'ok'){

                        dataLayer.push({
                            "event": "login"
                        });

                        if(global.isInNotification == true){
                            location.reload();
                            //window.location.href = global.siteUrl + 'notification/?token='.token;
                        }else if(global.isReservationActive == false){
                            window.location.href = global.siteUrl + 'mon-compte';
                        }else{
                            window.location.href = global.siteUrl + 'reserver-un-terrain';
                        }
                        jQuery('.login-error').addClass('no-visible');
                    }else{
                        if(result.Code == '-1'){
                            btnLoaderOut(jQuery('#link-login'));
                            jQuery('.confirm-psw-error').addClass('visible');
                        }else{
                            btnLoaderOut(jQuery('#link-login'));
                            jQuery('.login-error').addClass('visible');
                        }
                    }
                    errorsIn(jQuery('#login-form .error-message-container'));
                }
            ).fail(function() {
            })
        }else{
            btnLoaderOut(jQuery('#link-login'));
        }
    });

    jQuery("#send-back-confirm-mail").on("click",function(){
        jQuery.post(
           global.ajaxUrl,
           {
               'action'     :   'resend_verification_user',
               'login'      :   jQuery("#login").find("#form-login-login").val()
           },
           function (response) {
               result = JSON.parse(response);

               jQuery('#login').fadeOut(400, function(){
                   jQuery('#login .error-message').removeClass('visible');
                   jQuery("#resend-mail").fadeIn(400);
               });
           }
        )
    });

    jQuery(".confirm-change-password").on("click",function(){

        if(jQuery("#new-password").val() == jQuery("#confirm-new-password").val()){
            jQuery("p#mdp-identique").css("visibility","hidden");
            jQuery.post(
               global.ajaxUrl,
               {
                   'action'     :   'change_forgot_password',
                   'token'      :   token,
                   'password'      :   jQuery("#new-password").val()
               },
               function (response) {
                   result = JSON.parse(response);

                   jQuery(".bloc-layout").fadeIn(400);
                   jQuery('#login').fadeIn(400);
                   jQuery('#form-login-login').focus();
               }
            )
        }else{
            jQuery("p#mdp-identique").css("visibility","visible");
        }
    });

    /* MOT DE PASSE OUBLIE */
    jQuery('#mdp-oublie').on('click', function(){
        jQuery('#login').fadeOut(400, function(){
            jQuery("#message-mdp-forgot").css("dispaly","none");
            jQuery('#password-forgot').fadeIn(400);
        });
        btnLoaderOut(jQuery('#link-login'));
    });

    jQuery('.recuperer_mdp').bind("click",function(){
        if(global.emailAdressInscription){
            jQuery("#password-forgot-email").val(global.emailAdressInscription);
        }
        jQuery('#register').fadeOut(400, function(){
            jQuery("#message-mdp-forgot").css("display","none");
            jQuery('#password-forgot').fadeIn(400);
        });
        btnLoaderOut(jQuery('#link-login'));
    });

    jQuery('#password-forgot-form').on('submit', function(e){
        e.preventDefault();
        var emailAddress            =   jQuery("#password-forgot-email").val();
        var error = true;
        var data                    =   {
            action: 'password_forgot'
        };

        btnLoaderIn(jQuery('#link-password-forgot'));

        if(emailAddress == '' || !isValidEmailAddress(emailAddress)){
            error = true;
            jQuery('.password-forgot-error').addClass('visible');
        }else{
            error = false;
            data.email = emailAddress;
            jQuery('.password-forgot-error').addClass('no-visible');
        }

        errorsIn(jQuery('#password-forgot .error-message-container'));

        if(error == false){

            dataLayer.push({
                "event": "forgotPassword"
            });

            jQuery.post(
                global.ajaxUrl,
                data,
                function (response) {
                    result = JSON.parse(response);
                    btnLoaderOut(jQuery('#link-password-forgot'));
                    jQuery("#message-mdp-forgot").css("display","block");
                    errorsIn(jQuery('#password-forgot .error-message-container'), 0.1);
                }
            )
        }else{
            btnLoaderOut(jQuery('#link-password-forgot'));
        }
    });

    function Verifier_Numero_Telephone(num_tel){
        return (/^\d{7,}$/).test(num_tel.replace(/[\s()+\-\.]|ext/gi, ''));
       /* var regex = new RegExp(/^(01|02|03|04|05|06|08)[0-9]{8}/gi);

        var match = false;

        if(regex.test(num_tel))
        {
            match = true;
        }
        else
        {
            match = false;
        }

        return match;*/
    }

    if(typeof justRegister !== 'undefined'){

    }

    jQuery("#submitNotification").bind("click",function(){
        /*CENTRES FAVORIS*/
        var centreFavoris = [];
        jQuery(".notifications-list-favoris li").each(function( index ) {
            if(jQuery(this).find("input").prop('checked') == true){
                centreFavoris.push(parseInt(jQuery(this).find("input").attr("data-id")));
            }
        });
        centreFavoris = JSON.stringify(centreFavoris);
        jQuery.post(
           global.ajaxUrl,
           {
               'action'            :   'api_add_favoris',
               'favoris'              :   centreFavoris
           },
           function (response) {

               jQuery('#mon-compte-favoris .mon-compte-register-success').addClass('visible');
               errorsIn(jQuery('#mon-compte-favoris .error-message-container'), null, true);
           }
        )

        /*NOTIFICATIONS*/
        var indoor = false;
        if(jQuery('.notifications-list li input#indoor').prop('checked') == true){
            indoor = true;
        }

        var outdoor = false;
        if(jQuery('.notifications-list li input#outdoor').prop('checked') == true){
            outdoor = true;
        }

        var monday2Thursday1923 = false;
        if(jQuery('.notifications-list li input#monday2Thursday1923').prop('checked') == true){
            monday2Thursday1923 = true;
        }

        var monday2Thursday2022 = false;
        if(jQuery('.notifications-list li input#monday2Thursday2022').prop('checked') == true){
            monday2Thursday2022 = true;
        }

        var weekEnd1012 = false;
        if(jQuery('.notifications-list li input#weekEnd1012').prop('checked') == true){
            weekEnd1012 = true;
        }

        var notifiySameDay = false;
        if(jQuery('.notifications-list li input#notifiySameDay').prop('checked') == true){
            notifiySameDay = true;
        }

        var notifyTwoDaysBefore = false;
        if(jQuery('.notifications-list li input#notifyTwoDaysBefore').prop('checked') == true){
            notifyTwoDaysBefore = true;
        }


        jQuery.post(
           global.ajaxUrl,
           {
               'action'                :   'set_notification',
               'indoor'                :   indoor,
               'outdoor'               :   outdoor,
               'monday2Thursday1923'   :   monday2Thursday1923,
               'monday2Thursday2022'   :   monday2Thursday2022,
               'weekEnd1012'           :   weekEnd1012,
               'notifiySameDay'        :   notifiySameDay,
               'notifyTwoDaysBefore'   :   notifyTwoDaysBefore
           },
           function (response) {
               jQuery('#mon-compte-notifications .mon-compte-register-success').addClass('visible');
               errorsIn(jQuery('#mon-compte-notifications .error-message-container'), null, true);
           }
        )
    });

    jQuery('#register #register-infos-yes').change(function() {
        if(jQuery('#register #register-infos-no').prop('checked') == true){
            jQuery('#register #register-infos-no').attr("checked", false);
        }
    });

    jQuery('#register #register-infos-no').change(function() {
        if(jQuery('#register #register-infos-yes').prop('checked') == true){
            jQuery('#register #register-infos-yes').attr("checked", false);
        }
    });

    jQuery('#register #register-offres-yes').change(function() {
        if(jQuery('#register #register-offres-no').prop('checked') == true){
            jQuery('#register #register-offres-no').attr("checked", false);
        }
    });

    jQuery('#register #register-offres-no').change(function() {
        if(jQuery('#register #register-offres-yes').prop('checked') == true){
            jQuery('#register #register-offres-yes').attr("checked", false);
        }
    });

    ////////

    jQuery('#register-facebook #facebook-infos-yes').change(function() {
        if(jQuery('#register-facebook #facebook-infos-no').prop('checked') == true){
            jQuery('#register-facebook #facebook-infos-no').attr("checked", false);
        }
    });

    jQuery('#register-facebook #facebook-infos-no').change(function() {
        if(jQuery('#register-facebook #facebook-infos-yes').prop('checked') == true){
            jQuery('#register-facebook #facebook-infos-yes').attr("checked", false);
        }
    });

    jQuery('#register-facebook #facebook-offres-yes').change(function() {
        if(jQuery('#register-facebook #facebook-offres-no').prop('checked') == true){
            jQuery('#register-facebook #facebook-offres-no').attr("checked", false);
        }
    });

    jQuery('#register-facebook #facebook-offres-no').change(function() {
        if(jQuery('#register-facebook #facebook-offres-yes').prop('checked') == true){
            jQuery('#register-facebook #facebook-offres-yes').attr("checked", false);
        }
    });

    /*CLICK REGISTER*/
    jQuery("#register #submitMonCompte").bind("click",function(){
        var error =   false;
        jQuery('.register-error').fadeOut(400);

        var firstname               =   jQuery("#register").find("#prenom").val();
        var lastname                =   jQuery("#register").find("#nom").val();
        var centerId                =   jQuery("#register #leagues-search-centres-select .select-style-text").attr('data-id');
        var emailAddress            =   jQuery("#register").find("#email").val();
        var confirm_emailAddress    =   jQuery("#register").find("#confirm_email").val();
        var street                  =   jQuery("#register").find("#adresse_1").val();
        var street2                 =   jQuery("#register").find("#adresse_2").val();
        var zip                     =   jQuery("#register").find("#code_postal").val();
        var city                    =   jQuery("#register").find("#ville").val();
        var phoneNumber             =   jQuery("#register").find("#tel").val();
        var password                =   jQuery("#register").find("#mdp").val();
        var confirm_password        =   jQuery("#register").find("#confirm_mdp").val();
        var data                    =   {
            action: 'register',
            street2: street2,
            newsLetter : false,
            partnerNewsLetter : false
        };

        if(jQuery('#register #register-infos-yes').prop('checked') == true){
            data.newsLetter = true;
            jQuery('.news-error').addClass('no-visible');
        }else if(jQuery('#register #register-infos-no').prop('checked') == true){
            data.newsLetter = false;
            jQuery('.news-error').addClass('no-visible');
        }else{
            error = true;
            jQuery('.news-error').addClass('visible')
        }

        if(jQuery('#register #register-offres-yes').prop('checked') == true){
            data.partnerNewsLetter = true;
            jQuery('.news-partner-error').addClass('no-visible');
        }else if(jQuery('#register #register-offres-no').prop('checked') == true){
            data.partnerNewsLetter = false;
            jQuery('.news-partner-error').addClass('no-visible');
        }else{
            error = true;
            jQuery('.news-partner-error').addClass('visible');
        }

        btnLoaderIn(jQuery('#register #submitMonCompte'));

        if(firstname == ""){
            error = true;
            jQuery('.firstname-error').addClass('visible')
        }else{
            data.firstname = firstname;
            jQuery('.firstname-error').addClass('no-visible');
        }

        if(lastname == ""){
            error = true;
            jQuery('.lastname-error').addClass('visible')
        }else{
            data.lastname = lastname;
            jQuery('.lastname-error').addClass('no-visible');
        }

        if(centerId == ""){
            error = true;
            jQuery('.center-error').addClass('visible')
        }else{
            data.centerId = centerId;
            jQuery('.center-error').addClass('no-visible');
        }

        if(emailAddress == "" || !isValidEmailAddress(emailAddress)){
            error = true;
            jQuery('.email-error').addClass('visible');
        }else{
            jQuery('.email-error').addClass('no-visible');
            if(emailAddress  != confirm_emailAddress){
                error = true;
                jQuery('.same-email-error').addClass('visible')
            }else{
                global.emailAdressInscription = emailAddress;
                data.emailAddress = emailAddress;
                jQuery('.same-email-error').addClass('no-visible');
            }
        }

        if(street != "" || street2 != "" || zip != "" || city != ""){
            if(street == ""){
                error = true;
                jQuery('.street-error').addClass('visible');
            }else{
                data.street = street;
                jQuery('.street-error').addClass('no-visible');
            }

            if(zip == ""){
                error = true;
                jQuery('.zip-error').addClass('visible');
            }else{
                data.zip = zip;
                jQuery('.zip-error').addClass('no-visible');
            }

            if(city == ""){
                error = true;
                jQuery('.city-error').addClass('visible');
            }else{
                data.city = city;
                jQuery('.city-error').addClass('no-visible');
            }
        }else{
            data.street = street;
            data.zip = zip;
            data.city = city;

            jQuery('.street-error').addClass('no-visible');
            jQuery('.zip-error').addClass('no-visible');
            jQuery('.city-error').addClass('no-visible');
        }

        /*if(street == ""){
            error = true;
            jQuery('.street-error').addClass('visible')
        }else{
            data.street = street;
            jQuery('.street-error').addClass('no-visible');
        }

        if(zip == ""){
            error = true;
            jQuery('.zip-error').addClass('visible')
        }else{
            data.zip = zip;
            jQuery('.zip-error').addClass('no-visible');
        }

        if(city == "" && !cityNameIsValid(city)){
            error = true;
            jQuery('.city-error').addClass('visible')
        }else{
            data.city = city;
            jQuery('.city-error').addClass('no-visible');
        }*/

        if(phoneNumber == ""){
            error = true;
            jQuery('.phoneNumber-error').addClass('visible')
        }else if(!Verifier_Numero_Telephone(phoneNumber)){
            error = true;
            jQuery('.phoneNumberFormat-error').addClass('visible')
        }else
        {
            data.phoneNumber = phoneNumber;
            jQuery('.phoneNumberFormat-error').addClass('no-visible')
            jQuery('.phoneNumber-error').addClass('no-visible');
        }

        if(password != ''){
            jQuery('.password-error').addClass('no-visible');
            if(password === confirm_password){
                data.password = password;
                jQuery('.same-password-error').addClass('no-visible');
            }else{
                error = true;
                jQuery('.same-password-error').addClass('visible')
            }
        }else{
            jQuery('.password-error').addClass('visible')
            jQuery('.same-password-error').addClass('no-visible');
            error = true;
        }

        jQuery('.register-error span').addClass('no-visible');

        errorsIn(jQuery('#register .error-message-container'));

        if(error == false){
            jQuery.post(
                global.ajaxUrl,
                data,
                function (response) {
                    result = JSON.parse(response);
                    result = JSON.parse(result.response);

                    if(result.Code == 1){
                        jQuery(".recuperer_mdp").css("display","block");
                        jQuery('.register-error span').html(result.Message);
                        jQuery('.register-error').removeClass('no-visible').addClass('visible');
                        errorsIn(jQuery('#register .error-message-container'));
                    }else if(result.Code == 2){
                        jQuery(".recuperer_mdp").css("display","block");
                        jQuery('.register-error span').html(result.Message);
                        jQuery('.register-error').removeClass('no-visible').addClass('visible');
                        errorsIn(jQuery('#register .error-message-container'));
                    }

                    btnLoaderOut(jQuery('#register #submitMonCompte'));

                    if(result.id){
                        dataLayer.push({
                            "event": "register"
                        });

                        jQuery('#register').fadeOut(400, function(){
                            jQuery('#register .error-message').addClass('no-visible');
                            jQuery("#register-confirm").fadeIn(400);
                        });
                        /*dataLayer.push({
                            "event": "login"
                        });
                        window.location.reload();*/
                    }else{
                        if(result.error && result.error.Message){
                            if(result.error.Message == 'Cet email figure déjà dans la base de données'){
                                jQuery(".recuperer_mdp").css("display","block");
                            }
                            jQuery('.register-error span').html(result.error.Message);
                            jQuery('.register-error').removeClass('no-visible').addClass('visible')
                            errorsIn(jQuery('#register .error-message-container'));
                        }
                    }
                    errorsIn(jQuery('#register .error-message-container'), 0.1);
                }
            )
        }else{
            btnLoaderOut(jQuery('#register #submitMonCompte'));
        }
    })

    function readImage(file){
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            jQuery("#mon-compte-picture").attr("src",reader.result);
        });

        reader.readAsDataURL(file);
    }

    function changePictureMonCompte(file){
        if(file.size < 700000){
            global.pictureUser = file;
            jQuery("#error-image-size").css("display","none");
            readImage( file );

            var formData = new FormData();
            formData.append("picture", file);
            formData.append("action", 'changepicture');
            console.log(formData);
            jQuery.ajax({
                url: global.ajaxUrl,
                type: 'POST',
                data: formData,
                contentType:false,
                processData:false,
                async: false,
                success: function (data) {
                }
            });
        }else{
            jQuery("#error-image-size").css("display","inline-block");
        }
    }

    function checkDateBirthday(birthday){
        var regex = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
        return regex.test(birthday);
    }

    jQuery(".register-confirm-close-facebook").bind("click",function(){
        location.replace(location.href);
    });

    /*CLICK REGISTER*/
    jQuery("#register-facebook #submitMonCompte").bind("click",function(){
        var error           =   false;
        jQuery('.register-error').fadeOut(400);

        var firstname               =   jQuery("#register-facebook").find("#prenom").val();
        var lastname                =   jQuery("#register-facebook").find("#nom").val();
        var centerId                =   jQuery("#register-facebook #leagues-search-centres-select .select-style-text").attr('data-id');
        var emailAddress            =   jQuery("#register-facebook").find("#email").val();
        var confirm_emailAddress    =   jQuery("#register-facebook").find("#confirm_email").val();
        var street                  =   jQuery("#register-facebook").find("#adresse_1").val();
        var street2                 =   jQuery("#register-facebook").find("#adresse_2").val();
        var zip                     =   jQuery("#register-facebook").find("#code_postal").val();
        var city                    =   jQuery("#register-facebook").find("#ville").val();
        var phoneNumber             =   jQuery("#register-facebook").find("#tel").val();
        var password                =   jQuery("#register-facebook").find("#mdp").val();
        var confirm_password        =   jQuery("#register-facebook").find("#confirm_mdp").val();
        var facebookid              =   jQuery("#register-facebook").find("#fb-id").val();
        var facebookimg             =   jQuery("#register-facebook").find("#fb-img").val();
        var birthdate               =   jQuery("#register-facebook").find("#birthdate").val();
        var data                    =   {
            action: 'register_facebook',
            newsLetter : false,
            street2: street2,
            partnerNewsLetter : false
        };

        if(jQuery('#register-facebook #facebook-infos-yes').prop('checked') == true){
            data.newsLetter = true;
            jQuery('.news-error').addClass('no-visible');
        }else if(jQuery('#register-facebook #facebook-infos-no').prop('checked') == true){
            data.newsLetter = false;
            jQuery('.news-error').addClass('no-visible');
        }else{
            error = true;
            jQuery('.news-error').addClass('visible');
        }

        if(jQuery('#register-facebook #facebook-offres-yes').prop('checked') == true){
            data.partnerNewsLetter = true;
            jQuery('.news-partner-error').addClass('no-visible');
        }else if(jQuery('#register-facebook #facebook-offres-no').prop('checked') == true){
            data.partnerNewsLetter = false;
            jQuery('.news-partner-error').addClass('no-visible');
        }else{
            error = true;
            jQuery('.news-partner-error').addClass('visible');
        }

        data.facebookUserId = facebookid;
        data.birthdate = birthdate;
        data.picture = facebookimg;

        btnLoaderIn(jQuery('#register-facebook #submitMonCompte'));

        if(birthdate.length > 0){
            if(checkDateBirthday(birthdate) == false){
                error = true;
                jQuery('.birthday-error').addClass('visible');
            }else{
                jQuery('.birthday-error').addClass('no-visible');
            }
        }

        if(firstname == ""){
            error = true;
            jQuery('.firstname-error').addClass('visible')
        }else{
            data.firstname = firstname;
            jQuery('.firstname-error').addClass('no-visible');
        }

        if(lastname == ""){
            error = true;
            jQuery('.lastname-error').addClass('visible')
        }else{
            data.lastname = lastname;
            jQuery('.lastname-error').addClass('no-visible');
        }

        if(centerId == ""){
            error = true;
            jQuery('.center-error').addClass('visible')
        }else{
            data.centerId = centerId;
            jQuery('.center-error').addClass('no-visible');
        }


        data.street = street;
        jQuery('.street-error').addClass('no-visible');

        data.zip = zip;
        jQuery('.zip-error').addClass('no-visible');


        if(city != "" && !cityNameIsValid(city)){
            error = true;
            jQuery('.city-error').addClass('visible')
        }
        else {
            data.city = city;
            jQuery('.city-error').addClass('no-visible');
        }

        if(emailAddress == "" || !isValidEmailAddress(emailAddress)){
            error = true;
            jQuery('.email-error').addClass('visible');
        }else{
            jQuery('.email-error').addClass('no-visible');
            if(emailAddress  != confirm_emailAddress){
                error = true;
                jQuery('.same-email-error').addClass('visible')
            }else{
                global.emailAdressInscription = emailAddress;
                data.emailAddress = emailAddress;
                jQuery('.same-email-error').addClass('no-visible');
            }
        }

        if(phoneNumber == ""){
            error = true;
            jQuery('.phoneNumber-error').addClass('visible')
        }else if(!Verifier_Numero_Telephone(phoneNumber)){
            error = true;
            jQuery('.phoneNumberFormat-error').addClass('visible')
        }else
        {
            data.phoneNumber = phoneNumber;
            jQuery('.phoneNumberFormat-error').addClass('no-visible')
            jQuery('.phoneNumber-error').addClass('no-visible');
        }

        if(password != ''){
            jQuery('.password-error').addClass('no-visible');
            if(password === confirm_password){
                data.password = password;
                jQuery('.same-password-error').addClass('no-visible');
            }else{
                error = true;
                jQuery('.same-password-error').addClass('visible')
            }
        }else{
            jQuery('.password-error').addClass('visible')
            jQuery('.same-password-error').addClass('no-visible');
            error = true;
        }

        jQuery('.register-error span').addClass('no-visible');

        errorsIn(jQuery('#register-facebook .error-message-container'));

        if(emailAddress == global.facebookEmail){
            data.dontVerifyMail = true;
            global.dontVerifyMail = true;
        }else{
            data.dontVerifyMail = false;
            global.dontVerifyMail = false;
        }

        if(error == false){
            jQuery.post(
                global.ajaxUrl,
                data,
                function (response) {
                    result = JSON.parse(response);
                    result = JSON.parse(result.response);

                    if(result.Code == 1){
                        jQuery(".recuperer_mdp").css("display","block");
                        jQuery('.register-error span').html(result.Message);
                        jQuery('.register-error').removeClass('no-visible').addClass('visible');
                        errorsIn(jQuery('#register .error-message-container'));
                    }else if(result.Code == 2){
                        jQuery(".recuperer_mdp").css("display","block");
                        jQuery('.register-error span').html(result.Message);
                        jQuery('.register-error').removeClass('no-visible').addClass('visible');
                        errorsIn(jQuery('#register .error-message-container'));
                    }

                    btnLoaderOut(jQuery('#register-facebook #submitMonCompte'));

                    if(result.id){
                        dataLayer.push({
                            "event": "register"
                        });

                        if(global.dontVerifyMail == true){
                            jQuery('#register-facebook').fadeOut(400, function(){
                                jQuery('#register .error-message').addClass('no-visible');
                                jQuery("#register-confirm-facebook").fadeIn(400);
                            });
                        }else{
                            jQuery('#register-facebook').fadeOut(400, function(){
                                jQuery('#register .error-message').addClass('no-visible');
                                jQuery("#register-confirm").fadeIn(400);
                            });
                        }
                    }else{
                        if(result.error && result.error.Message){
                            if(result.error.Message == 'Cet email figure déjà dans la base de données'){
                                jQuery(".recuperer_mdp").css("display","block");
                            }
                            jQuery('.register-error span').html(result.error.Message);
                            jQuery('.register-error').removeClass('no-visible').addClass('visible')
                            errorsIn(jQuery('#register .error-message-container'));
                        }
                    }
                    errorsIn(jQuery('#register-facebook .error-message-container'), 0.1);
                }
            )
        }else{
            btnLoaderOut(jQuery('#register-facebook #submitMonCompte'));
        }
    });



    /*CLICK MODIFIER COMPTE*/
    jQuery(".mon-compte #submitMonCompte").bind("click",function(){
        var error           =   false;

        var firstname               =   jQuery(".mon-compte #mon-compte-prenom").val();
        var lastname                =   jQuery(".mon-compte #mon-compte-nom").val();
        var centerId                =   jQuery(".mon-compte #mon-compte-leagues-search-centres-select").val();
        var emailAddress            =   jQuery(".mon-compte #mon-compte-email").val();
        var confirm_emailAddress    =   jQuery(".mon-compte #mon-compte-confirm_email").val();
        var street                  =   jQuery(".mon-compte #mon-compte-adresse_1").val();
        var street2                 =   jQuery(".mon-compte #mon-compte-adresse_2").val();
        var zip                     =   jQuery(".mon-compte #mon-compte-code_postal").val();
        var city                    =   jQuery(".mon-compte #mon-compte-ville").val();
        var phoneNumber             =   jQuery(".mon-compte #mon-compte-tel").val();
        var passwordActual          =   jQuery(".mon-compte #mon-compte-mdp-actual").val();
        var password                =   jQuery(".mon-compte #mon-compte-mdp").val();
        var confirm_password        =   jQuery(".mon-compte #mon-compte-confirm_mdp").val();
        var birthdate               =   jQuery(".mon-compte #mon-compte-birthdate").val();
        var data                    =   {
            action: 'modifier',
            street2: street2,
            newsLetter : false,
            partnerNewsLetter : false
        };

        btnLoaderIn(jQuery(".mon-compte #submitMonCompte"));

        if(jQuery('#infos-pratiques').prop('checked') == true){
            data.newsLetter = true;
        }

        if(jQuery('#offres').prop('checked') == true){
            data.partnerNewsLetter = true;
        }

        /**/
        centerId = 8;
        /**/

        if(birthdate.length > 0){
            if(checkDateBirthday(birthdate) == false){
                error = true;
                jQuery('.birthday-errormon-compte-birthdate-error').addClass('visible');
            }else{
                data.birthdate = birthdate;
                jQuery('.mon-compte-birthdate-error').addClass('no-visible');
            }
        }


        if(firstname == ""){
            error = true;
            jQuery('.mon-compte-firstname-error').addClass('visible');
        }else{
            data.firstname = firstname;
            jQuery('.mon-compte-firstname-error').addClass('no-visible');
        }


        if(lastname == ""){
            error = true;
            jQuery('.mon-compte-lastname-error').addClass('visible');
        }else{
            data.lastname = lastname;
            jQuery('.mon-compte-lastname-error').addClass('no-visible');
        }

        if(centerId == ""){
            error = true;
            jQuery('.mon-compte-center-error').addClass('visible');
        }else{
            data.centerId = centerId;
            jQuery('.mon-compte-center-error').addClass('no-visible');
        }

        if(emailAddress == "" || !isValidEmailAddress(emailAddress)){
            error = true;
            jQuery('.mon-compte-email-error').addClass('visible');
        }else{
            jQuery('.mon-compte-email-error').addClass('no-visible');
            if(emailAddress  != confirm_emailAddress){
                error = true;
                jQuery('.mon-compte-same-email-error').addClass('visible');
            }else{
                data.emailAddress = emailAddress;
                jQuery('.mon-compte-same-email-error').addClass('no-visible');
            }
        }

        if(street != "" || street2 != "" || zip != "" || city != ""){
            if(street == ""){
                error = true;
                jQuery('.mon-compte-street-error').addClass('visible');
            }else{
                data.street = street;
                jQuery('.mon-compte-street-error').addClass('no-visible');
            }

            if(zip == ""){
                error = true;
                jQuery('.mon-compte-zip-error').addClass('visible');
            }else{
                data.zip = zip;
                jQuery('.mon-compte-zip-error').addClass('no-visible');
            }

            if(city == ""){
                error = true;
                jQuery('.mon-compte-city-error').addClass('visible');
            }else{
                data.city = city;
                jQuery('.mon-compte-city-error').addClass('no-visible');
            }
        }else{
            data.street = street;
            data.zip = zip;
            data.city = city;

            jQuery('.mon-compte-street-error').addClass('no-visible');
            jQuery('.mon-compte-zip-error').addClass('no-visible');
            jQuery('.mon-compte-city-error').addClass('no-visible');
        }

        if(phoneNumber == ""){
            error = true;
            jQuery('.mon-compte-phoneNumber-error').addClass('visible');
        }else{
            data.phoneNumber = phoneNumber;
            jQuery('.mon-compte-phoneNumber-error').addClass('no-visible');
        }

        var changePassword = false;
        if(passwordActual != ''){
            if(password != '') {
                if (password === confirm_password) {
                    data.password = password;
                    jQuery('.mon-compte-same-password-error').addClass('no-visible');
                    changePassword = true;
                } else {
                    error = true;
                    jQuery('.mon-compte-same-password-error').addClass('visible');
                }
            }
        }

        errorsIn(jQuery('#mon-compte-informations .error-message-container'));

        if(error == false){
            jQuery.post(
                global.ajaxUrl,
                data,
                function (response) {
                    jQuery('#mon-compte-informations .mon-compte-register-success').addClass('visible');
                    btnLoaderOut(jQuery(".mon-compte #submitMonCompte"));
                    errorsIn(jQuery('#mon-compte-informations .error-message-container'), null, true);
                    jQuery('html, body').animate({scrollTop: 760}, 750);
                }
            )

            if(changePassword == true){
                var dataPass =   {
                    action: 'changepassword',
                    passwordActual: passwordActual,
                    password : password,
                    mail : emailAddress
                };

                jQuery.post(
                    global.ajaxUrl,
                    dataPass,
                    function (response) {
                        jQuery('#mon-compte-informations .mon-compte-register-success').addClass('visible');
                        btnLoaderOut(jQuery(".mon-compte #submitMonCompte"));
                        errorsIn(jQuery('#mon-compte-informations .error-message-container'), null, true);
                        jQuery('html, body').animate({scrollTop: 760}, 750);
                    }
                )
            }
        }else{
            btnLoaderOut(jQuery(".mon-compte #submitMonCompte"));
        }

        /*CENTRES FAVORIS*/
        var centreFavoris = [];
        jQuery(".notifications-list-favoris li").each(function( index ) {
            if(jQuery(this).find("input").prop('checked') == true){
                centreFavoris.push(parseInt(jQuery(this).find("input").attr("data-id")));
            }
        });
        centreFavoris = JSON.stringify(centreFavoris);
        jQuery.post(
            global.ajaxUrl,
            {
                'action'            :   'api_add_favoris',
                'favoris'              :   centreFavoris
            },
            function (response) {

                jQuery('#mon-compte-favoris .mon-compte-register-success').addClass('visible');
                errorsIn(jQuery('#mon-compte-favoris .error-message-container'), null, true);
            }
        )

        /*NOTIFICATIONS*/
        var indoor = false;
        if(jQuery('.notifications-list li input#indoor').prop('checked') == true){
            indoor = true;
        }

        var outdoor = false;
        if(jQuery('.notifications-list li input#outdoor').prop('checked') == true){
            outdoor = true;
        }

        var monday2Thursday1923 = false;
        if(jQuery('.notifications-list li input#monday2Thursday1923').prop('checked') == true){
            monday2Thursday1923 = true;
        }

        var monday2Thursday2022 = false;
        if(jQuery('.notifications-list li input#monday2Thursday2022').prop('checked') == true){
            monday2Thursday2022 = true;
        }

        var weekEnd1012 = false;
        if(jQuery('.notifications-list li input#weekEnd1012').prop('checked') == true){
            weekEnd1012 = true;
        }

        var notifiySameDay = false;
        if(jQuery('.notifications-list li input#notifiySameDay').prop('checked') == true){
            notifiySameDay = true;
        }

        var notifyTwoDaysBefore = false;
        if(jQuery('.notifications-list li input#notifyTwoDaysBefore').prop('checked') == true){
            notifyTwoDaysBefore = true;
        }


        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'set_notification',
                'indoor'                :   indoor,
                'outdoor'               :   outdoor,
                'monday2Thursday1923'   :   monday2Thursday1923,
                'monday2Thursday2022'   :   monday2Thursday2022,
                'weekEnd1012'           :   weekEnd1012,
                'notifiySameDay'        :   notifiySameDay,
                'notifyTwoDaysBefore'   :   notifyTwoDaysBefore
            },
            function (response) {
                jQuery('#mon-compte-notifications .mon-compte-register-success').addClass('visible');
                errorsIn(jQuery('#mon-compte-notifications .error-message-container'), null, true);
            }
        )
    });

    /**/

    function sortRows(a, b){
        if ( jQuery(a).find('td:first-child').text() > jQuery(b).find('td:first-child').text() ) {
            return 1;
        }

        if ( jQuery(a).find('td:first-child').text() < jQuery(b).find('td:first-child').text() ) {
            return -1;
        }

        return 0;

    }

    function sortTable(table, excluSelector, child, attr, order){
        var jQuerytable = jQuery('#table-carnet-adresse');
        var jQuerytableBody = jQuerytable.find('tbody');
        var lastChildSelector = excluSelector;
        var lastChild = jQuerytableBody.find('tr' + lastChildSelector);
        child = child && child != '' ? child : 'first-child';
        order = order && order != '' ? order : 'asc';
        var rows, sortedRows;

        rows = jQuerytableBody.find('tr:not(' + lastChildSelector + ')');

        sortedRows = rows.sort(function(a, b){

            if ( jQuery(a).find('td:' + child + '').attr(attr) > jQuery(b).find('td:' + child + '').attr(attr) ) {
                return order == 'asc' ? 1 : -1;
            }

            if ( jQuery(a).find('td:' + child + '').attr(attr) < jQuery(b).find('td:' + child + '').attr(attr) ) {
                return order == 'asc' ? -1 : 1;
            }

            return 0;
        });

        jQuerytableBody.remove('tr:not(' + lastChildSelector + ')');
        if(lastChildSelector != '' && lastChildSelector) {
            sortedRows.insertBefore(lastChild);
        }else{
            sortedRows.appendTo(jQuerytableBody);
        }
    }


    function carnetSortTable(){
        sortTable(jQuery('#table-carnet-adresse'), "#footer-table-carnet-adresse", null, "data-text");
        /*var jQuerytable = jQuery('#table-carnet-adresse');
        var jQuerytableBody = jQuerytable.find('tbody');
        var lastChildSelector = "#footer-table-carnet-adresse";
        var lastChild = jQuerytableBody.find('tr' + lastChildSelector);
        var rows, sortedRows;

        rows = jQuerytableBody.find('tr:not(' + lastChildSelector + ')');

        sortedRows = rows.sort(sortRows);

        jQuerytableBody.remove('tr:not(' + lastChildSelector + ')');
        sortedRows.insertBefore(lastChild);*/
    }

    function addContactLineCarnet(){

        var div;

        if(jQuery("#add-carnet > ul > li.add-carnet-first-model").length == 1){
            div = jQuery('.add-carnet-first-model').eq(0).clone();
            div.insertAfter(jQuery('.add-carnet-other-model:nth-child(2)'));
        }else{
            div = jQuery('.add-carnet-other-model').eq(0).clone();
            jQuery("#add-carnet > ul").append(div);
        }

    }

    jQuery("#add-carnet a").bind("click",function(){
        addContactLineCarnet();
    });

    function resetAddCarnet(){
        addContactLineCarnet();
    }

    if(jQuery('#ok_carnet').length > 0){
        carnetSortTable();
        resetAddCarnet();
    }

    /*ADD CONTACT*/

    function addContactAjax(els, max, btn, i){
        var jQuerythis           =   els.eq(i);
        var error           =   false;
        var nomCarnet       =   jQuerythis.find(".nom_carnet");
        var prenomCarnet    =   jQuerythis.find(".prenom_carnet");
        var mailCarnet      =   jQuerythis.find(".mail_carnet");
        var nomCarnetVal    =   nomCarnet.val();
        var prenomCarnetVal =   prenomCarnet.val();
        var mailCarnetVal   =   mailCarnet.val();

        if(nomCarnetVal == ""){
            error = true;
            jQuerythis.find('.add-carnet-lastname-error').addClass('visible');
        }else{
            jQuerythis.find('.add-carnet-lastname-error').addClass('no-visible');
        }

        if(prenomCarnetVal == ""){
            error = true;
            jQuerythis.find('.add-carnet-firstname-error').addClass('visible');
        }else{
            jQuerythis.find('.add-carnet-firstname-error').addClass('no-visible');
        }

        if(mailCarnetVal == "" || !isValidEmailAddress(mailCarnetVal)){
            error = true;
            jQuerythis.find('.add-carnet-email-error').addClass('visible');
        }else{
            jQuerythis.find('.add-carnet-email-error').addClass('no-visible');
        }

        jQuerythis.find('.add-carnet-register-error').addClass('no-visible');
        errorsIn(jQuerythis.find('.error-message-container'), null, true);

        if(!error){
            jQuery.post(
                global.ajaxUrl,
                {
                    'action'                :   'addCarnet',
                    'nomCarnet'             :   nomCarnetVal,
                    'prenomCarnet'          :   prenomCarnetVal,
                    'mailCarnet'            :   mailCarnetVal
                },
                function (response) {
                    result = JSON.parse(response);

                    if(result.response.error){
                        jQuerythis.find('.add-carnet-register-error span').html(result.response.error.Message);
                        jQuerythis.find('.add-carnet-register-error').addClass('visible');
                    }else if(result.response.id){
                        var div = '<tr><td data-text="'+result.response.firstname+'">'+result.response.firstname+'</td><td>'+result.response.lastname+'</td><td>'+result.response.emailAddress+'</td><td><input type="checkbox" value="'+result.response.id+'" id="checkbox_'+result.response.id+'"/><label for="checkbox_'+result.response.id+'"></label></td></tr>';
                        jQuery("#footer-table-carnet-adresse").before(div);
                        jQuery(".remove_contact").removeClass("none");
                        jQuerythis.remove();
                        carnetSortTable();
                    }

                    errorsIn(jQuerythis.find('.error-message-container'), null, true);

                    global.addContactChecked++;
                    if(global.addContactChecked == max){
                        if(result.response.id){
                            resetAddCarnet();
                        }
                        btnLoaderOut(btn);
                        global.addContactProgress = false;
                    }
                }
            )
        }else{
            global.addContactChecked++;
            if(global.addContactChecked == max){
                btnLoaderOut(btn);
                global.addContactProgress = false;
            }
            errorsIn(jQuerythis.find('.error-message-container'), null, true);
        }
    }

    jQuery("#add-carnet").on("click", "#ok_carnet",function(){

        if(!global.addContactProgress){
            global.addContactProgress = true;
            global.addContactChecked = 0;
            var els = jQuery("#add-carnet > ul > li:not(.add-carnet-first-model:nth-of-type(1)):not(.add-carnet-other-model:nth-of-type(2))");
            var max = els.length;
            var btn = jQuery(this);

            btnLoaderIn(btn);

            dataLayer.push({
              "event": "addContact",
              "addContactNb": max
            });

            for(var i = 0; i < max; i++){
                addContactAjax(els, max, btn, i);
            };
        }

    });

    /*jQuery("#table-mes-reservations tr").bind("click",function(){
        global.idReservationActive = jQuery(this).attr("data-id");

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'add_invitation',
                'idReservation'         :   global.idReservationActive
            },
            function (response) {
                result = JSON.parse(response);
                jQuery('#modifier-reservations-loading').fadeOut(0);
                jQuery("#table-carnet-adresse").find("tbody tr:not(tbody tr:first-child)").remove();
                for(var i = 0 ; i < result.response.length; i++){

                    var div = '<tr><td>'+result.response[i].lastname+'</td><td>'+result.response[i].firstname+'</td><td title="'+result.response[i].emailAddress+'">'+result.response[i].emailAddress+'</td><td data-sort="'+result.response[i].status+'">'+result.response[i].statusDisplay+'</td></tr>';

                    jQuery("#table-carnet-adresse tbody").append(div);
                }
                sortTable(jQuery('#table-carnet-adresse'), '', 'last-child', 'data-sort', 'desc');
                jQuery("#modifier-reservation-inviter").fadeIn(300);
            }
        )
    });*/

    jQuery(document).on("click","#table-mes-reservations tr td .voir", function(){
        global.idReservationActive = jQuery(this).val();
        jQuery('#modifier-reservations-loading').fadeIn(0);
        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'add_invitation',
                'idReservation'         :   global.idReservationActive
            },
            function (response) {
                result = JSON.parse(response);
                jQuery('#modifier-reservations-loading').fadeOut(0);
                jQuery("#table-carnet-adresse").find("tbody tr:not(tbody tr:first-child)").remove();

                jQuery("#table-carnet-adresse tbody").empty();

                for(var i = 0 ; i < result.response.length; i++){
                    if(result.response[i].status == 0){
                        var div = '<tr><td>'+result.response[i].lastname+'</td><td>'+result.response[i].firstname+'</td><td title="'+result.response[i].emailAddress+'">'+result.response[i].emailAddress+'</td><td data-sort="'+result.response[i].status+'">'+result.response[i].statusDisplay+'</td></tr>';
                    }else if(result.response[i].status == 1){
                        var div = '<tr><td>'+result.response[i].lastname+'</td><td>'+result.response[i].firstname+'</td><td title="'+result.response[i].emailAddress+'">'+result.response[i].emailAddress+'</td><td data-sort="'+result.response[i].status+'"><img width="20" src='+templateDir+'"/images/mon-compte/tilt-orange.png" /></td></tr>';
                    }else{
                        var div = '<tr><td>'+result.response[i].lastname+'</td><td>'+result.response[i].firstname+'</td><td title="'+result.response[i].emailAddress+'">'+result.response[i].emailAddress+'</td><td data-sort="'+result.response[i].status+'"><img width="15" src='+templateDir+'"/images/mon-compte/croix-noir.png" /></td></tr>';
                    }

                    jQuery("#table-carnet-adresse tbody").append(div);
                }
                sortTable(jQuery('#table-carnet-adresse'), '', 'last-child', 'data-sort', 'desc');

                jQuery("#modifier-reservation-inviter").css("margin-top","-"+(jQuery("#modifier-reservation-inviter").height()/2)+"px");

                jQuery("#modifier-reservation-inviter").fadeIn(300);
            }
        )
    });

    jQuery("#inviter-joueur button").bind("click",function(){
       var nombreInvitation = jQuery("#inviter-joueur input").val();
        if(isInt(nombreInvitation) && nombreInvitation){
            jQuery("#inviter-joueur #error-send-invitation").fadeOut(200);

            jQuery('#modifier-reservations-loading').fadeIn(0);

            dataLayer.push({
                "event": "inviteFriends",
                "inviteFriendsNb": nombreInvitation
            });

            jQuery.post(
                global.ajaxUrl,
                {
                    'action'                :   'get_invitation',
                    'idReservation'         :   global.idReservationActive,
                    'nbrInvitation'         :   nombreInvitation
                },
                function (response) {
                    result = JSON.parse(response);
                    jQuery('#modifier-reservations-loading').fadeOut(0);
                    jQuery("#inviter-joueur").fadeOut(200);

                    global.selectedInvitation.addClass("voir").removeClass("inviter");

                    jQuery("#table-mes-reservations").find("tr[data-id='"+global.idReservationActive+"'] .inviter").addClass("voir").removeClass("inviter");
                }
            )

        }else{
            jQuery("#inviter-joueur #error-send-invitation").fadeIn(200);
        }
    });

    jQuery("#send-invitation-reservation").bind("click",function(){
       var nombreInvitation = jQuery("#inviter-joueur input").val();
        if(isInt(nombreInvitation) && nombreInvitation){
            dataLayer.push({
                "event": "inviteFriends",
                "inviteFriendsNb": nombreInvitation
            });

            jQuery.post(
                global.ajaxUrl,
                {
                    'action'                :   'get_invitation',
                    'idReservation'         :   global.idReservationActive,
                    'nbrInvitation'         :   nombreInvitation
                },
                function (response) {
                    result = JSON.parse(response);
                }
            )

        }else{

        }
    });

    jQuery(document).on("click",".inviter", function(){
        global.selectedInvitation = jQuery(this);
        jQuery("#inviter-joueur").fadeIn(200);
        global.idReservationActive = jQuery(this).val();
    });

    /**
     *
     * Code censé etre pour les convocations de match ? Convocation Yes ou No ?
     *
     */
    jQuery(".accepter-invitation").bind("click",function(event){

        jQuery( this ).unbind( event );

        dataLayer.push({
            "event": "participateGame"
        });

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'join_invitation',
                'token'                 :   token
            },
            function (response) {
                result = JSON.parse(response);

                jQuery("#reponse-positive").css("display","block");
                jQuery("#reponse-negative").css("display","none");
                jQuery("#participer-au-match").css("display","none");

                //TODO PLUS DE GESTION DES ERREURS
                /*if(result.response.error != null){
                    jQuery("#reponse-negative").empty();
                    jQuery("#reponse-negative").text(result.response.error.Message);

                    jQuery("#reponse-positive").css("display","none");
                    jQuery("#reponse-negative").css("display","block");
                    jQuery("#participer-au-match").css("display","none");
                }else{
                    jQuery("#reponse-positive").css("display","block");
                    jQuery("#reponse-negative").css("display","none");
                    jQuery("#participer-au-match").css("display","none");
                }*/
            }
        )
    });

    jQuery(".no-accepter-invitation").bind("click",function(event){

        jQuery( this ).unbind( event );

        dataLayer.push({
            "event": "refuseGame"
        });

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'decline_invitation',
                'token'                 :   token
            },
            function (response) {
                result = JSON.parse(response);

                jQuery("#reponse-negative").css("display","block");
                jQuery("#reponse-positive").css("display","none");
                jQuery("#participer-au-match").css("display","none");

                //TODO PLUS DE GESTION DES ERREURS
                /*if(result.response.error != null){
                    jQuery("#reponse-negative").empty();
                    jQuery("#reponse-negative").text(result.response.error.Message);

                    jQuery("#reponse-negative").css("display","block");
                    jQuery("#reponse-positive").css("display","none");
                    jQuery("#participer-au-match").css("display","none");
                }else{
                    jQuery("#reponse-negative").css("display","block");
                    jQuery("#reponse-positive").css("display","none");
                    jQuery("#participer-au-match").css("display","none");
                }*/
            }
        )
    });

    if(global.centreId && typeof leaguePageUrl !== 'undefined'){
        jQuery('.loader-leagues-general').fadeIn(400);

        jQuery('#leagues-calendrier ul').fadeOut(400).empty();

        jQuery.post(
           global.ajaxUrl,
           {
               'action'                :   'get_centre_leagues',
               'centreId'              :   global.centreId
           },
           function (response) {
               result = JSON.parse(response);

               jQuery('.loader-leagues-general').fadeOut(0);

               jQuery.each(result, function(index, value) {
                   for(var i = 0; i < value.length; i++){
                       var div = '<li><p><span>'+value[i].hour+' - </span>'+value[i].name+'</p><a href="'+leaguePageUrl+'?idLeague='+value[i].id+'">Accéder</a></li>';

                       jQuery(".league-semaine-liste[data-id='"+index.toLowerCase()+"']").append(div);

                       if(jQuery(".league-semaine-liste[data-id='"+index.toLowerCase()+"']").find("li").length > 1){
                           jQuery(".league-semaine-liste[data-id='"+index.toLowerCase()+"']").addClass("more");
                       }

                       //INSERT LEAGUES DANS LE SELECT
                       var list = '<li data-id="'+value[i].id+'"><span>'+value[i].name+'</span></li>';
                       jQuery("#leagues-search-leagues").find("ul").append(list);
                   }
               });
               jQuery("#leagues-calendrier").fadeIn(400);
               jQuery("#leagues-semaine").fadeIn(400);
               jQuery(".league-semaine-liste[data-id='lundi']").fadeIn(400);
               jQuery('#leagues-calendrier ul:first-child').fadeIn(400);
               jQuery("#league-les-equipes").css("display","none");
               jQuery("#leagues-search-equipes").css("display","none");
           }
        )
    }

    jQuery(".leagues_choose_centre").bind("click",function(){
        var idCentre = jQuery(this).attr("data-id");

        jQuery('.loader-leagues-general').fadeIn(400);

        jQuery('#leagues-calendrier ul').fadeOut(400).empty();

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'get_centre_leagues',
                'centreId'              :   idCentre
            },
            function (response) {
                result = JSON.parse(response);

                jQuery('.loader-leagues-general').fadeOut(0);

                jQuery.each(result, function(index, value) {
                    for(var i = 0; i < value.length; i++){
                        var div = '<li><p><span>'+value[i].hour+' - </span>'+value[i].name+'</p><a href="'+leaguePageUrl+'?idLeague='+value[i].id+'">Accéder</a></li>';

                        jQuery(".league-semaine-liste[data-id='"+index.toLowerCase()+"']").append(div);

                        if(jQuery(".league-semaine-liste[data-id='"+index.toLowerCase()+"']").find("li").length > 1){
                            jQuery(".league-semaine-liste[data-id='"+index.toLowerCase()+"']").addClass("more");
                        }

                        //INSERT LEAGUES DANS LE SELECT
                        var list = '<li data-id="'+value[i].id+'"><span>'+value[i].name+'</span></li>';
                        jQuery("#leagues-search-leagues").find("ul").append(list);
                    }
                });
                jQuery("#leagues-calendrier").fadeIn(400);
                jQuery("#leagues-semaine").fadeIn(400);
                jQuery(".league-semaine-liste[data-id='lundi']").fadeIn(400);
                jQuery('#leagues-calendrier ul:first-child').fadeIn(400);
                jQuery("#league-les-equipes").css("display","none");
                jQuery("#leagues-search-equipes").css("display","none");
            }
        )
    });

    jQuery(document).on('click', "#leagues-search-leagues li", function(e){
        var idLeague = jQuery(this).attr("data-id");

        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'ajax_get_teams_league',
                'leagueId'              :   idLeague
            },
            function (response) {
                result = JSON.parse(response);

                jQuery("#league-les-equipes").empty();
                jQuery("#leagues-search-equipes").find("ul").empty();

                for(var i = 0; i < result.length; i++){

                    var div ='<li>';
                    div +='<a href="'+global.siteUrl + 'team?idTeam='+result[i].id+'">';
                    div +='<img src='+templateDir+'"/images/layout/les_equipes.jpg" alt=""/>';
                    div +='<p>'+result[i].name+'</p>';
                    div +='</a>';
                    div +='</li>';

                    jQuery("#league-les-equipes").append(div);

                    var liste = '<li data-id="'+result[i].id+'"><span>'+result[i].name+'</span></li>';
                    jQuery("#leagues-search-equipes").find("ul").append(liste);
                }

                jQuery("#leagues-semaine").css("display","none");
                jQuery("#leagues-calendrier").css("display","none");
                jQuery("#league-les-equipes").css("display","block");
                /*jQuery("#leagues-search-equipes").css("display","block");*/
            }
        )
    });

    function setGetParameter(paramName, paramValue)
    {
        var url = window.location.href;
        if (url.indexOf(paramName + "=") >= 0)
        {
            var prefix = url.substring(0, url.indexOf(paramName));
            var suffix = url.substring(url.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            url = prefix + paramName + "=" + paramValue + suffix;
        }
        else
        {
            if (url.indexOf("?") < 0)
                url += "?" + paramName + "=" + paramValue;
            else
                url += "&" + paramName + "=" + paramValue;
        }
        window.location.href = url;
    }

    jQuery(".league_choose_centre").bind("click",function(){
        var idCentre = jQuery(this).attr("data-id");
        setGetParameter("idLeague",idCentre);
    });

    jQuery("#leagues-semaine ul li").bind("click",function(){
        var target = jQuery(this).attr("data-target");
        jQuery("#leagues-calendrier ul").css("display","none");
        jQuery(".league-semaine-liste[data-id='"+target+"']").css("display","block");
        jQuery("#leagues-semaine ul li").removeClass("active");
        jQuery(this).addClass("active");
    });

    jQuery("#leagues-button-type-calendrier").bind("click",function(){
        jQuery("#leagues-button-type-classement").removeClass('active');
        jQuery("#leagues-button-type-buteurs").removeClass('active');
        jQuery("#leagues-button-type-calendrier").addClass("active");

        jQuery("#leagues-table").css("display","none");
        jQuery("#leagues-joueurs").css("display","none");
        jQuery(".leagues-stats").css("display","table");
    });

    jQuery("#leagues-button-type-classement").bind("click",function(){
        jQuery("#leagues-button-type-classement").addClass('active');
        jQuery("#leagues-button-type-calendrier").removeClass("active");
        jQuery("#leagues-button-type-buteurs").removeClass("active");

        jQuery("#leagues-table").css("display","table");
        jQuery("#leagues-joueurs").css("display","none");
        jQuery(".leagues-stats").css("display","none");
    });

    jQuery("#leagues-button-type-buteurs").bind("click",function(){
        jQuery("#leagues-button-type-classement").removeClass('active');
        jQuery("#leagues-button-type-calendrier").removeClass("active");
        jQuery("#leagues-button-type-buteurs").addClass("active");

        jQuery("#leagues-table").css("display","none");
        jQuery(".leagues-stats").css("display","none");
        jQuery("#leagues-joueurs").css("display","block");
    });

    jQuery( "#table-carnet-adresse tr").find("input[type='checkbox']").each(function( index ) {
        jQuery(this).prop('checked',false);
    });

    jQuery("#table-carnet-adresse #footer-table-carnet-adresse th img").bind("click",function(){

        var friendsId = [];

        jQuery("#table-carnet-adresse tr").find("input[type='checkbox']").each(function( index ) {
            if(jQuery(this).prop('checked') == true){
                friendsId.push(jQuery(this).val());

                jQuery(this).parents("tr").remove();
            }
        });

        dataLayer.push({
            "event": "deleteContact",
            "deleteContactNb": friendsId.length
        });

        for(var i = 0; i < friendsId.length ; i++){
            jQuery.post(
                global.ajaxUrl,
                {
                    'action'                :   'removeCarnet',
                    'id'                    :   friendsId[i]
                },
                function (response) {
                    //TODO GERER LES MESSAGES D'ERREUR
                    var result = JSON.parse(response);
                }
            )
        }
    });


    // jQuery('.select-container .select-content').on('click', function(e){
    //     e.preventDefault();
    //     var ul = jQuery(this).closest('.select-container').find('.select-list');
    //     var c = jQuery(this).closest('.select-container');
    //     var cA = jQuery(this).closest('.select-container').hasClass('active');
    //
    //     jQuery('.select-container').removeClass('active');
    //     jQuery('.select-list').fadeOut(0);
    //
    //     if(cA){
    //         c.removeClass('active');
    //         ul.fadeOut(0);
    //     }else{
    //         c.addClass('active');
    //         ul.fadeIn(0);
    //     }
    // });

    jQuery(window).on('click', function(e){
        var t = jQuery(e.target);
        if(!t.hasClass('select-content') && t.parents('.select-content').length == 0){
            jQuery('.select-container').removeClass('active');
            t.parents('.select-container').addClass("selected");
            jQuery('.select-list').fadeOut(0);
        }
    });

    jQuery(".league-stats-equipe-match-league .team-see-goals").bind("click",function(){
        var container = jQuery(this).parents('.league-stats-equipe-match-league');
        if(container.find('.mini-slider-list').length === 0 && !container.hasClass('waiting') && container.hasClass('played')){
            container.addClass('waiting');
            jQuery.post(
                global.ajaxUrl,
                {
                    'action'                :   'getGameGoals',
                    'id'                    :   container.attr("data-id")
                },
                function (response) {
                    var result = JSON.parse(response);
                    container.removeClass('waiting');
                    if(result.length > 0){
                        var slider = '<div class="mini-slider mini-slider-video-equipe" data-step="0"><a href="#" class="disable mini-slider-arrow-prev slider-arrow-left slider-arrow-with-hover" style="display: none;"><span><img src="'+global.siteUrl+'wp-content/themes/urbansoccer/images/mon-compte/leagues-stats-arrow-left.png" alt=""></span></a><div class="mini-slider-container"><ul class="mini-slider-list">';

                        for(var i = 0 ; i < result.length ; i++){
                            if(result[i].videoUrl){

                                var name = result[i].playerName.split(" ");
                                var id = matchYoutubeUrl(result[i].videoUrl);
                                var thumb = 'http://img.youtube.com/vi/'+id+'/sddefault.jpg';

                                slider +=   '<li data-id="' + id + '" class="mini-slider-item" style="background:url(' + thumb + ') no-repeat center / cover;">';
                                slider +=   '<p>'+name[name.length-1]+'</p>';
                                slider +=   '</li>';
                            }
                        }


                        slider += '</ul></div><a href="#" class="disable mini-slider-arrow-next slider-arrow-right slider-arrow-with-hover" style="display: none;"><span><img src="'+global.siteUrl+'wp-content/themes/urbansoccer/images/mon-compte/leagues-stats-arrow-right.png" alt=""></span></a></div>';

                        slider = jQuery(slider);

                        slider.appendTo(container);

                        var arrowRight  = slider.find('.slider-arrow-right');
                        var items       = slider.find('.mini-slider-item');

                        if(items.length > 3){
                            arrowRight.fadeIn(0);
                        };


                        slider.find('.slider-arrow-right').on('click', function(){
                            var slider      =   jQuery(this).closest('.mini-slider');
                            var arrowRight  =   jQuery(this);
                            var arrowLeft   =   slider.find('.slider-arrow-left');
                            var items       =   slider.find('.mini-slider-item');
                            var list        =   slider.find('.mini-slider-list');
                            var max         =   Math.floor( items.length / 3);
                            var step        =   Math.min(max, parseInt((slider.attr('data-step') ? slider.attr('data-step') : 0)) + 1);
                            var left        =   items.outerWidth(true) * step;

                            list.css({width: items.outerWidth(true) * items.length});

                            slider.attr('data-step', step);
                            arrowLeft.fadeIn(200);

                            if(step * 3 >= max){
                                arrowRight.fadeOut(200);
                            };

                            TweenMax.to(list, 0.8, {left: -left, ease: Cubic.easeInOut});
                        });

                        slider.find('.slider-arrow-left').on('click', function(){
                            var slider      =   jQuery(this).closest('.mini-slider');
                            var arrowLeft   =   jQuery(this);
                            var arrowRight  =   slider.find('.slider-arrow-right');
                            var items       =   slider.find('.mini-slider-item');
                            var list        =   slider.find('.mini-slider-list');
                            var step        =   Math.min(0, parseInt(slider.attr('data-step') ? slider.attr('data-step') : 1) - 1);
                            var left        =   items.outerWidth(true) * step;

                            list.css({width: items.outerWidth(true) * items.length});

                            slider.attr('data-step', step);
                            arrowRight.fadeIn(200);

                            if(step * 3 >= 0){
                                arrowLeft.fadeOut(200);
                            };

                            TweenMax.to(list, 0.8, {left: left, ease: Cubic.easeInOut});
                        });
                    }
                }
            )
        }
    });

    jQuery(document).on('click', '.reservation-centre li',function(e){
        e.preventDefault();

        var idCentre    = jQuery(this).attr('data-id');

        for(var i = 0 ; i < global.bookableCenters.length ; i++){
            if(global.bookableCenters[i].key == idCentre){
                jQuery(".reservation-terrain-type .select-list.reservation-type ul li").each(function() {
                    var isTypeTerrain = false;
                    for(var j = 0; j < global.bookableCenters[i].resourceTypes.length; j++) {
                        if (jQuery(this).attr("data-id") == global.bookableCenters[i].resourceTypes[j].key) {
                            isTypeTerrain = true;
                        }
                    }
                    if(isTypeTerrain == false){
                        jQuery(this).addClass("hide");
                    }else{
                        jQuery(this).removeClass("hide");
                    }
                });
                break;
            }
        }

    });

    jQuery('.select-container .select-content').on('click', function(e){
      e.preventDefault();
      var ul = jQuery(this).closest('.select-container').find('.select-list');
      var c = jQuery(this).closest('.select-container');
      var cA = jQuery(this).closest('.select-container').hasClass('active');

      jQuery('.select-container').removeClass('active');
      jQuery('.select-list').fadeOut(0);

      if(cA){
        c.removeClass('active');
        ul.fadeOut(0);
      }else{
        c.addClass('active');
        ul.fadeIn(0);
      }
    });


    jQuery(document).on('click', '.select-list li', function(e){
        e.preventDefault();
        var t = jQuery(this).text();
        var c = jQuery(this).closest('.select-container');
        var u = jQuery(this).closest('.select-list');
        var s = c.find('.select-style-text');
        var id = jQuery(this).attr('data-id') ? jQuery(this).attr('data-id') : "";

        u.find('li.active').removeClass('active');
        jQuery(this).addClass('active');

        s.text(t).attr('data-id', id);
        c.removeClass('active');
        u.fadeOut(0);
    });



    function checkVideosPaginationArrows(){
        if(global.videosPageCurrent > 0){
            jQuery('.pagination-prev-container').css('display', 'inline-block');
        }else{
            jQuery('.pagination-prev-container').fadeOut(0);
        }

        if(global.videosPageCurrent < global.videosPageL){
            jQuery('.pagination-next-container').css('display', 'inline-block');
        }else{
            jQuery('.pagination-next-container').fadeOut(0);
        }
    }

    function changeVideosPage(n){
        jQuery('.video-pagination-item.active').removeClass('active');

        jQuery('.video-pagination-item').eq(n).addClass('active');

        jQuery('.videos-item').removeClass('visible');

        global.videosPageCurrent = n;

        n *= global.videosPerPage;
        var l = n + global.videosPerPage;

        for(n; n < l; n++){
            jQuery('.videos-item').eq(n).addClass('visible');
        }

        checkVideosPaginationArrows();
    }

    jQuery(document).on('click', '.video-pagination-item:not(.active)', function(e){
        e.preventDefault();
        var n = jQuery(this).index();

        changeVideosPage(n);
    });

    function matchYoutubeUrl(url){
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        return videoid[1];
        //var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?jQuery/;
        //return (url.match(p)) ? RegExp.jQuery1 : false ;
    }

    function pageScrollTo(pos, time){
        jQuery('html, body').animate({
            scrollTop: pos
        }, time);
    }

    var buzzVideoCourante = [];

    // jQuery(document).on("click",".videos-item-thumb", function(){
    //     jQuery(".videos-main").css("display","block");
    //     var url = jQuery(this).parents('.videos-item').attr('id');
    //     var centre = jQuery(this).parents('.videos-item').attr('data-centre');
    //     var nameVideo = jQuery(this).parents('.videos-item').attr('data-name');
    //
    //     buzzVideoCourante = [];
    //     matchVideoCourante = [];
    //
    //     if(nameVideo){
    //         for(var i = 0; i < buzzVideos.length; i++){
    //             if(nameVideo == buzzVideos[i].name){
    //                 buzzVideoCourante.push(buzzVideos[i]);
    //             }
    //         }
    //
    //         for(var i = 0; i < matchVideos.length; i++){
    //             if(nameVideo == matchVideos[i].name){
    //                 matchVideoCourante.push(matchVideos[i]);
    //             }
    //         }
    //     }
    //
    //     jQuery("#liste_videos_buzz, #liste_videos_match").css("display","none");
    //     jQuery("#liste_videos_buzz ul, #liste_videos_match ul").empty();
    //
    //
	   //  if (buzzVideoCourante.length > 0) {
    //        jQuery("#liste_videos_buzz ul, #liste_videos_match ul").empty();
    //        for(var i = 0; i < buzzVideoCourante.length; i++){
    //            var div = '<li class="videos-item" data-centre="pessac" data-name="'+buzzVideoCourante[i].name+'" data-type="buzz" id="'+buzzVideoCourante[i].link+'">';
    //            div += '<a href="#" class="disable">';
    //            div += '<div class="videos-item-thumb" style=""></div>';
    //            div += '</a>';
    //            div += '<div class="videos-item-content">';
    //            div += '<p class="videos-item-title text-orange">';
    //            div += 'À '+buzzVideoCourante[i].title;
    //            div += '</p>';
    //            div += '<p class="videos-item-desc">';
    //            div += '';
    //            div += '</p>';
    //            div += '</div>';
    //            div += '</li>';
    //
    //            div = jQuery(div);
    //
    //            jQuery("#liste_videos_buzz ul").append(div);
    //        }
    //
    //        for(var i = 0; i < matchVideoCourante.length; i++){
    //            var div = '<li class="videos-item" data-centre="pessac" data-name="'+matchVideoCourante[i].name+'" id="'+matchVideoCourante[i].link+'">';
    //            div += '<a href="#" class="disable">';
    //            div += '<div class="videos-item-thumb" style=""></div>';
    //            div += '</a>';
    //            div += '<div class="videos-item-content">';
    //            div += '<p class="videos-item-title text-orange">';
    //            div += 'À '+matchVideoCourante[i].title;
    //            div += '</p>';
    //            div += '<p class="videos-item-desc">';
    //            div += '';
    //            div += '</p>';
    //            div += '</div>';
    //            div += '</li>';
    //
    //            div = jQuery(div);
    //
    //            jQuery("#liste_videos_match ul").append(div);
    //        }
    //        jQuery("#liste_videos_buzz, #liste_videos_match").css("display","block");
    //    }
    //
    //     if(centre == 'pessac'){
    //         url = 'http://urbanpessac.inowys.com/'+url;
    //
    //         jQuery('.videos-main-iframe-container video').attr('src', url);
    //         jQuery('.videos-main-iframe-container iframe').css("display","none");
    //         jQuery('.videos-main-iframe-container video').css("display","block");
    //
    //         pageScrollTo(jQuery('.videos-main').offset().top - 100, 400);
    //     }else{
    //         video_id = matchYoutubeUrl(url);
    //
    //         url = 'https://www.youtube.com/embed/' + video_id + '?autoplay=1&controls=1&rel=0&disablekb=1';
    //
    //         jQuery('.videos-main-iframe-container iframe').attr('src', url);
    //         jQuery('.videos-main-iframe-container iframe').css("display","block");
    //         jQuery('.videos-main-iframe-container video').css("display","none");
    //
    //         pageScrollTo(jQuery('.videos-main').offset().top - 50, 400);
    //     }
    // });


    jQuery('.videos-first-page').on('click', function(){
        changeVideosPage(0);
    });

    jQuery('.videos-last-page').on('click', function(){
        changeVideosPage(global.videosPageL);
    });

    jQuery('.videos-next-page').on('click', function(){
        if(global.videosPageCurrent < global.videosPageL) {
            changeVideosPage(global.videosPageCurrent + 1);
        }
    });

    jQuery('.videos-prev-page').on('click', function(){
        if(global.videosPageCurrent > 0){
            changeVideosPage(global.videosPageCurrent - 1);
        }
    });

    jQuery('.videos-main-social-share').on('click', function(e){
        e.preventDefault();
        var p = jQuery(this).parent();

        p.toggleClass('active');
    });

    jQuery("#team-pick-stats li").bind("click",function(){
        var teamID = jQuery(this).attr("data-target");
        var teamStat = userStats[teamID];
        jQuery('.team-stats').removeClass("visible");
        jQuery(".team-stats[data-id='"+teamID+"']").addClass("visible");
    });

    // jQuery("#terrain-search li").bind("click",function(){
    //     if(!jQuery(this).hasClass('active')){
    //         var terrain = jQuery(this).find("span").text();
    //
    //         global.videoCentre = terrain;
    //
    //         jQuery(this).addClass("active");
    //
    //         jQuery("#centre-terrain-search li").css("display","none");
    //
    //         jQuery("#centre-terrain-search li").each(function( index ){
    //             if(jQuery(this).attr("data-centre") == terrain){
    //                 jQuery(".videos-filter-terrain").css("display","inline-block").fadeIn(400);
    //                 jQuery(this).css("display","block");
    //             }
    //         });
    //
    //         var defaultVal = jQuery('#centre-terrain-search .select-style-text').attr('data-default');
    //
    //         jQuery('#centre-terrain-search .select-style-text').html(defaultVal);
    //
    //         global.videoTerrain = null;
    //
    //         checkSearchVideo();
    //     }
    // });

    // jQuery("#centre-terrain-search li").bind("click",function(){
    //     if(!jQuery(this).hasClass('active')){
    //         var terrain = jQuery(this).find("span").text();
    //
    //         global.videoTerrain = terrain;
    //
    //         jQuery(this).addClass("active");
    //
    //         jQuery(".videos-filter-date").css("display","inline-block").fadeIn(400);
    //
    //         checkSearchVideo();
    //     }
    // });

    if(jQuery(".video-preselected-centre.active").length > 0){
        var centre =  jQuery(".video-preselected-centre.active").find("span").text();

        global.videoCentre = centre;

        jQuery(this).addClass("active");

        jQuery("#centre-terrain-search li").css("display","none");

        jQuery("#centre-terrain-search li").each(function( index ){
            if(jQuery(this).attr("data-centre") == centre){
                jQuery(".videos-filter-terrain").css("display","inline-block").fadeIn(400);
                jQuery(this).css("display","block");
            }
        });

        var defaultVal = jQuery('#centre-terrain-search .select-style-text').attr('data-default');

        jQuery('#centre-terrain-search .select-style-text').html(defaultVal);

        global.videoTerrain = null;
    }

    // jQuery(".videos-filter-date").bind("click",function(){
    //     jQuery(".videos-date-picker-container").fadeIn(400);
    //     //jQuery(".bloc-layout").fadeIn(400);
    // });

    // jQuery('#video-date-picker').datepicker({
    //     format: "dd/mm/yyyy",
    //     todayHighlight: true,
    //     language: "fr"
    //     /*format: "dd/mm/yyyy",
    //     language: "fr",
    //     startDate:today,
    //     todayHighlight: true*/
    // }).change(videoChangeDate)
    //     .on('changeDate', videoChangeDate);
    //
    // function videoChangeDate(ev){
    //     jQuery(".bloc-layout").fadeOut(400);
    //     jQuery("#mon-compte-date-picker").fadeOut(400);
    //
    //     var d = new Date(ev.date);
    //
    //     global.videoDay      =   ("0" + (d.getDate())).slice(-2);
    //     global.videoMonth    =   ("0" + (d.getMonth() + 1)).slice(-2);
    //     global.videoYear     =   d.getFullYear();
    //
    //     jQuery(".videos-filter-date .select-container").addClass("selected");
    //     jQuery(".videos-filter-date").find("span").text(global.videoDay+"/"+global.videoMonth+"/"+global.videoYear);
    //
    //     jQuery(".videos-date-picker-container").fadeOut(400);
    //     jQuery(".bloc-layout").fadeOut(400);
    //
    //     checkSearchVideo();
    // }

    function insertVideos(){
        jQuery('.loader-videos-general').fadeOut(0);
        if(result.response.nextItems){
            global.nextVideo = result.response.nextItems;
        }else{
            global.nextVideo = null;
        }

        for(var i = 0 ; i < result.response.items.length; i++){
            var d = parseDate(result.response.items[i].date);

            var day     =   ("0" + (d.getDate())).slice(-2);
            var month   =   ("0" + (d.getMonth() + 1)).slice(-2);
            var year    =   d.getFullYear();
            var hour    =   ("0" + (d.getHours())).slice(-2);
            var minute  =   ("0" + (d.getMinutes())).slice(-2);

            var div = '<li class="videos-item" id="'+result.response.items[i].url+'">';
            div += '<a href="#" class="disable">';
            div += '<div class="videos-item-thumb" style="background: url('+result.response.items[i].imageUrl+') no-repeat center; background-size: cover;"></div>';
            div += '</a>';
            div += '<div class="videos-item-content">';
            div += '<p class="videos-item-titl;e text-orange">';
            div += 'À '+hour+':'+minute+" le "+day + "/" + month + "/" + year;
            div += '</p>';
            div += '<p class="videos-item-desc">';
            div += '';
            div += '</p>';
            div += '</div>';
            div += '</li>';

            div = jQuery(div);

            jQuery("#liste_videos > ul").append(div);

                TweenMax.fromTo(div.find('.videos-item-thumb'), 0.4, {scale: 0.5}, {delay: i/10, scale: 1, ease: Back.easeOut});
                TweenMax.fromTo(div, 0.4, {opacity: 0}, {delay: i/10, opacity: 1, ease: Cubic.easeInOut});

        }
        jQuery("#liste_videos").css("display","block");
        if(global.nextVideo == null){
            jQuery(".see-more-videos").fadeOut(200);
        }else{
            jQuery(".see-more-videos").fadeIn(200);
        }
    }

    function btnLoaderIn(el, fn){
        var text = el.find('span');
        var loader = el.find('.loader-container');

        el.addClass('loading');

        TweenMax.to(text, 0.4, {opacity: 0, y: "-100%", ease: Cubic.easeInOut});
        loader.fadeIn(0);
        TweenMax.fromTo(loader, 0.4, {y: "100%"}, {opacity: 1, y: "0%", ease: Cubic.easeInOut, onComplete:function(){
            if(fn){
                fn();
            }
        }});
    }

    function btnLoaderOut(el, fn){
        var text = el.find('span');
        var loader = el.find('.loader-container');

        TweenMax.to(text, 0.4, {opacity: 1, y: "0%", ease: Cubic.easeInOut});
        TweenMax.to(loader, 0.4, {opacity: 0, y: "100%", ease: Cubic.easeInOut, onComplete:function(){
            loader.fadeOut(0);
            el.removeClass('loading');
            if(fn){
                fn();;
            }
        }});
    }

    jQuery(".see-more-videos").bind("click",function(){
        if(global.nextVideo && !jQuery(this).hasClass('loading')){

            btnLoaderIn(jQuery(this));

            jQuery.post(
                global.ajaxUrl,
                {
                    'action'                :   'more_video',
                    'nextVideo'             :   global.nextVideo
                },
                function (response) {
                    result = JSON.parse(response);
                    btnLoaderOut(jQuery(".see-more-videos"), function(){
                        insertVideos(result);
                    });
                }
            )
        }
    });

    jQuery(document).on('click', '.disable', function(e){
        e.preventDefault();
    });
    jQuery('.store-cart-cta').on('click', function(e){
        jQuery(this).parent().toggleClass('active');
    });

    jQuery(".create-account").remove();
    jQuery(".woocommerce-checkout .woocommerce-info").remove();

    jQuery('html').click(function(e) {
        if (!jQuery(e.target).parents('.store-cart-cta').length || !jQuery(e.target).parents('.store-cart').length) {
            jQuery('.store-cart').removeClass('active');
        }

    });

    jQuery(".search-centre-input-container button").bind("click",function(){

        btnLoaderIn(jQuery('.search-centre-input-container button'));

        var search = jQuery("#select-centre-localisation .default-input[type='text']").val();

        /**GEOLOC*/
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': search+' france'}, function(results, status){
            if (status == google.maps.GeocoderStatus.OK){
                var latitude    = results[0].geometry.location.lat();
                var longitude   = results[0].geometry.location.lng();

                jQuery.post(
                    global.ajaxUrl,
                    {
                        'action'                :   'get_center_around',
                        'latitude'              :   latitude,
                        'longitude'             :   longitude
                    },
                    function (response) {
                        result = JSON.parse(response);


                        var centresSearch = '';

                        if(result.length == 0){
                            jQuery("#no-result-search-centre").css("display","inline-block");
                        }else{
                            jQuery("#no-result-search-centre").css("display","none");
                        }

                        jQuery("#select-centre-localisation #select-centre-liste li").css("display","none");
                        jQuery.each(result, function(index, value) {
                            centresSearch += value.name+'|';

                            jQuery("#select-centre-localisation #select-centre-liste li").each(function( index ){
                                var indexSearch = jQuery(this).attr("data-target");
                                if(indexSearch == value.id){
                                    jQuery(this).css("display","block");
                                }
                            });
                        });

                        centresSearch.substring(0, centresSearch.length - 1);

                        dataLayer.push({
                            "event": "geocodeCenter",
                            "geocodeCenterSearch": search,
                            "geocodeCenterCities": centresSearch
                        });

                        btnLoaderOut(jQuery('.search-centre-input-container button'));
                    }
                )
            }
        });
    });

    jQuery("#bloc-where .bloc-reservation-close").bind("click",function(){
        jQuery("#bloc-where ul#bloc-where-centres li").css("display","block");
    });

    jQuery("#bloc-where #search-centre-localisation").bind("click",function(){
        jQuery("#bloc-where ul#bloc-where-centres li").css("display","block");
        var search = jQuery("#bloc-where ul#bloc-where-title li .default-input[type='text']").val();

        jQuery("#bloc-where ul#bloc-where-centres li a").each(function( index ){
            //var indexSearch = jQuery(this).parent().attr('data-name').toLowerCase().search(search.toLowerCase());
            var indexSearch = jQuery(this).parent().attr('data-name').toLowerCase();
            var result = indexSearch.indexOf(search);

            if(result == -1){
                jQuery(this).parents("li").css("display","none");
            }
        });
    });

    /*WOOCOMMERCE*/


    jQuery(".store-search-input").on('focus', function(){
        if(jQuery(".store-search-container .select-list-style-1 ul li").length > 0){
            jQuery(".store-search-container .select-list-style-1").fadeIn(0);
        }
    });

    jQuery(".store-search-input").keyup(function(){
        global.idSearchProduct++;
        jQuery('.store-search-loader').fadeIn(0);
        jQuery(".store-search-container .select-list-style-1 ul").empty();
        jQuery(".store-search-container .select-list-style-1").fadeIn(0);
        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'woocommerce_search',
                'search'                :   jQuery(this).val(),
                'idSearch'              :   global.idSearchProduct
            },
            function (response) {
                result = JSON.parse(response);

                var nbrProducts = 0;

                if(result.idSearch == global.idSearchProduct){
                    //DERNIÈRE RECHERCHE EFFECTUÉ
                    jQuery(".store-search-container .select-list-style-1").fadeIn(0);
                    jQuery(".store-search-container .select-list-style-1 ul").empty();
                    jQuery('.store-search-loader').fadeOut(0);
                    for(var i = 0; i < result.response.length; i++){
                        //CHECK SI Y'A DES CATEGORY
                        if(result.response[i].type == 'category'){
                            var divParent = '<li class="category-search">'+result.response[i].name+'</li>';
                            jQuery(".store-search-container .select-list-style-1 ul").append(divParent);
                            /*if(jQuery(".store-search-container .select-list-style-1 ul .category-search").length > 0){
                                jQuery(".store-search-container .select-list-style-1 ul .category-search").after(divParent);
                            }else{
                                jQuery(".store-search-container .select-list-style-1 ul").append(divParent);
                            }*/

                            for(var j = 0; j < result.response.length; j++){
                                if(result.response[j].type == 'product' && result.response[j].id_parent == result.response[i].id){
                                    var div = '<li class="product-search" data-id="'+result.response[j].id+'">';
                                    div += '<a href="'+result.response[j].link+'">';
                                    div += '<img width="50px" height="50px" src="'+result.response[j].thumbnail+'" />';
                                    div += '<p>'+result.response[j].name+'</p>';
                                    div += '</a>';
                                    div += '</li>';
                                    jQuery(".store-search-container .select-list-style-1 ul").append(div);
                                    nbrProducts++;
                                }
                            }
                        }
                    }

                    if(!nbrProducts){
                        jQuery(".store-search-container .select-list-style-1").fadeOut(0);
                    }
                }
            }
        )
    });

    jQuery('.cart_item .quantity-sub').on('click', function(){
        var input = jQuery(this).parent().find('input');
        var span = jQuery(this).parent().find('.quantity-current');
        var q = parseInt(input.val());
        var newq = q == 0 ? 0 : q-1;

        input.val(newq);
        span.html(newq);
    });

    jQuery('.cart_item .quantity-add').on('click', function(){
        var input = jQuery(this).parent().find('input');
        var span = jQuery(this).parent().find('.quantity-current');
        var q = parseInt(input.val());
        var qmax = span.attr('data-max');
        var newq = q+1;

        if(qmax != ''){
            newq = Math.min(newq, qmax);
        }

        input.val(newq);
        span.html(newq);
    });

    jQuery('.back-to-page-prev').on('click', function(){
        window.location.reload(history.go(-1));
    });

    if(jQuery('.product').length > 0){
        var l = jQuery('.products li.product').length;
        var baseDelay = 800;

            jQuery('.product:lt("'+global.productPerPage+'")').each(function(key, el){
                var el = jQuery(el);
                var thumb = el.find('.product-thumb-container');
                var delay = (baseDelay/1000) + el.index() / 10;
                el.addClass("visible");
                TweenMax.fromTo(el, 0.4, {opacity: 0}, {delay: delay, opacity: 1, ease: Circ.easeInOut});
                TweenMax.fromTo(thumb, 0.4, {scale: 0.5}, {delay: delay, scale: 1, ease: Circ.easeInOut});
            });

        if(l > global.productPerPage){
            jQuery('.see-more-products').delay(baseDelay).fadeIn(400);
        }

        global.productCurrent = global.productPerPage;

        jQuery('.see-more-products').on('click', function(){
            var index = jQuery('.product.visible').last().index() + 1;

            btnLoaderIn(jQuery('.see-more-products'));

            setTimeout(function(){
                btnLoaderOut(jQuery('.see-more-products'), function(){
                    for(var i = index, l = index + global.productPerPage; i < l; i++){
                        if(jQuery('.product').eq(i).length > 0) {
                            var el = jQuery('.product').eq(i);
                            var thumb = el.find('.product-thumb-container');
                            var delay = i / 10;
                            el.addClass("visible");
                            TweenMax.fromTo(el, 0.4, {opacity: 0}, {delay: delay, opacity: 1, ease: Circ.easeInOut});
                            TweenMax.fromTo(thumb, 0.4, {scale: 0.5}, {delay: delay, scale: 1, ease: Circ.easeInOut});
                            global.productCurrent++;
                        }else if(!jQuery('.product').eq(i).length || !jQuery('.product').eq(i+1).length){
                            jQuery('.see-more-products').fadeOut(400);
                            break;
                        }
                    }
                });
            }, 1000)
        });
    }

    global.productSliderPos = 0;

    if(jQuery('.product-thumb-item').outerWidth(true) * jQuery('.product-thumb-item').length <= jQuery('.product-thumbs').outerWidth(true)){
        jQuery('.product-slider-arrow-right').addClass('disabled');
    }
    jQuery('.product-slider-arrow-left').addClass('disabled');
    jQuery('.product-slider-arrow-right, .product-slider-arrow-left').fadeIn(200);

    jQuery('.product-slider-arrow-right').on('click', function(){
        if(!jQuery('.product-slider-arrow-right').hasClass('disabled')){
            jQuery('.product-slider-arrow-left').removeClass('disabled');

            global.productSliderPos++;

            global.productSliderPos = Math.min(global.productSliderPos, jQuery('.product-thumb-item').length - 4);

            if(global.productSliderPos == jQuery('.product-thumb-item').length - 4){
                jQuery('.product-slider-arrow-right').addClass('disabled');
            }

            var pos = - jQuery('.product-thumb-item').outerWidth(true) * global.productSliderPos;

            TweenMax.to(jQuery('.product-thumb-item'), 0.4, {x: pos});
        }
    });

    jQuery('.product-slider-arrow-left').on('click', function(){
        if(!jQuery('.product-slider-arrow-left').hasClass('disabled')) {
            jQuery('.product-slider-arrow-right').removeClass('disabled');

            global.productSliderPos--;

            global.productSliderPos = Math.max(global.productSliderPos, 0);

            if(global.productSliderPos == 0){
                jQuery('.product-slider-arrow-left').addClass('disabled');
            }


            var pos = - jQuery('.product-thumb-item').outerWidth(true) * global.productSliderPos;

            TweenMax.to(jQuery('.product-thumb-item'), 0.4, {x: pos});
        }
    });


    global.productMainAnimated = false;

    jQuery('.product-thumb-item').on('click', function(){
        if(!global.productMainAnimated) {
            global.productMainAnimated = true;
            var src = jQuery(this).find('img').attr('src');

            jQuery('.product-main-image-anim .woocommerce-main-image img').attr('src', src);

            TweenMax.fromTo(jQuery('.product-main-image-anim'), 0.4, {top: "100%"}, {
                top: 0, ease: Expo.easeInOut, onComplete: function () {
                    jQuery('.product-main-image-container .woocommerce-main-image img').attr('src', src);
                    jQuery('.product-main-image-anim').css({
                        top: "100%"
                    });
                    global.productMainAnimated = false;
                }
            });
        }
    });

    jQuery('.woocommerce-main-image').on('click touchend', function(e){
        e.preventDefault();
    });

    global.cartSliderPos = 0;

    if(jQuery('.cart-slider').length > 0){
        var l = jQuery('.cart-item').length;
        var w = jQuery('.cart-item').outerWidth(true);

        if(l > 2){
            jQuery('.cart-slider-arrow-right').fadeIn(200);
        }

        jQuery('.cart-list').css('width', l * w);

        jQuery('.cart-slider-arrow-right').on('click', function(){
            jQuery('.cart-slider-arrow-left').fadeIn(200);

            global.cartSliderPos++;

            global.cartSliderPos = Math.min(global.cartSliderPos, jQuery('.cart-item').length - 2);

            if(global.cartSliderPos == jQuery('.cart-item').length - 2){
                jQuery('.cart-slider-arrow-right').fadeOut(200);
            }

            var pos = - jQuery('.cart-item').outerWidth(true) * global.cartSliderPos;

            TweenMax.to(jQuery('.cart-list'), 0.4, {x: pos});
        });

        jQuery('.cart-slider-arrow-left').on('click', function(){
            jQuery('.cart-slider-arrow-right').fadeIn(200);

            global.cartSliderPos--;

            global.cartSliderPos = Math.max(global.cartSliderPos, 0);

            if(global.cartSliderPos == 0){
                jQuery('.cart-slider-arrow-left').fadeOut(200);
            }

            var pos = - jQuery('.cart-item').outerWidth(true) * global.cartSliderPos;

            TweenMax.to(jQuery('.cart-list'), 0.4, {x: pos});
        });

    }

    function checkActusPaginationArrows(){
        if(global.actusPageCurrent > 0){
            jQuery('.pagination-prev-container').css('display', 'inline-block');
        }else{
            jQuery('.pagination-prev-container').fadeOut(0);
        }

        if(global.actusPageCurrent < global.actusPageL){
            jQuery('.pagination-next-container').css('display', 'inline-block');
        }else{
            jQuery('.pagination-next-container').fadeOut(0);
        }
    }

    function changeActusPage(n){
        jQuery('.actus-pagination-item.active').removeClass('active');

        jQuery('.actus-pagination-item').eq(n).addClass('active');

        jQuery('.actus-item').removeClass('visible');

        global.actusPageCurrent = n;

        n *= global.actusPerPage;
        var l = n + global.actusPerPage + 3;

        for(n; n < l; n++){
            jQuery('.liste_actualites_bottom .actus-item').eq(n).addClass('visible');
        }

        checkActusPaginationArrows();
    }

    jQuery(document).on('click', '.actus-pagination-item:not(.active)', function(e){
        e.preventDefault();
        var n = jQuery(this).index();

        changeActusPage(n);
    });

    jQuery('.actus-first-page').on('click', function(){
        changeActusPage(0);
    });

    jQuery('.actus-last-page').on('click', function(){
        changeActusPage(global.actusPageL);
    });

    jQuery('.actus-next-page').on('click', function(){
        if(global.actusPageCurrent < global.actusPageL) {
            changeActusPage(global.actusPageCurrent + 1);
        }
    });

    jQuery('.actus-prev-page').on('click', function(){
        if(global.actusPageCurrent > 0){
            changeActusPage(global.actusPageCurrent - 1);
        }
    });

    jQuery('.confirm-cart').on('click', function(){
        var prenom = jQuery('#prenom').val();
        var nom = jQuery('#nom').val();
        var centre = jQuery('#centre').val();
        var email = jQuery("#email").val();
        var tel = jQuery('#tel').val();
        var error = false;

        if(prenom == ''){
            error = true;
            jQuery('.firstname-error').addClass('visible');
            return;
        }else{
            jQuery('.firstname-error').addClass('no-visible');
        }

        if(nom == ''){
            error = true;
            jQuery('.lastname-error').addClass('visible');
            return;
        }else{
            jQuery('.lastname-error').addClass('no-visible');
        }

        if(centre == ''){
            error = true;
            jQuery('.center-error').addClass('visible');
            return;
        }else{
            jQuery('.center-error').addClass('no-visible');
        }

        if(email == '' || !isValidEmailAddress(email)){
            error = true;
            jQuery('.email-error').addClass('visible');
            return;
        }else{
            jQuery('.email-error').addClass('no-visible');
        }

        if(phoneNumber == ''){
            error = true;
            jQuery('.phoneNumber-error').addClass('visible');
            return;
        }else{
            jQuery('.phoneNumber-error').addClass('no-visible');
        }

        if(!error){

        }

    });

    if(jQuery('.presse-item').length > 0){

        if(global.presseL > global.pressePerPage){
            jQuery('.see-more').fadeIn(200);
        }

        jQuery('.see-more').on('click', function(){
            /*var index = jQuery('.presse-item.visible').last().index();

            for(var i = 0; i < index + global.pressePerPage; i++){
                jQuery('.presse-item').eq(i).addClass('visible');
            }*/
        });
    }

    jQuery(".reserver-btn-fill").bind("click",function(){
        jQuery.post(
            global.ajaxUrl,
            {
                'action'                :   'woocommerce_validate'
            },
            function (response) {
            }
        )
    });

    var newsletterInterval = null;

    jQuery('.newsletter-form .wysija-paragraph .wysija-input').on('keyup blur', function(){
        var val = jQuery(this).val();

        if(val.length > 0 && val != 'email@exemple.com' && val != 'email@example.com'){
            jQuery('.newsletter-form .formError').fadeIn(200);
        }else{
            newsletterInterval = setInterval(function(){
                if(jQuery('.newsletter-form .formError').length > 0){
                    clearInterval(newsletterInterval);
                    jQuery('.newsletter-form .formError').fadeOut(200);
                }
            }, 0);
        }
    });

    jQuery('.woocommerce-checkout input').each(function(index, input){
        jQuery(input).attr('autocomplete', 'off');
        jQuery(input).attr('value', '');
    });

    TweenMax.to(jQuery('.woocommerce-checkout'), 0.6, {delay: 0.4, opacity: 1});



    jQuery('.subtitle-bloc-dropdown').on('click', function(e){
        var jQuerythis = jQuery(this);
        var container = jQuerythis.parent();
        var content = container.find('.container-dropdown');
        var visible = jQuerythis.is(":visible");
        var height = content.attr('data-height');
        var time = global.slideAnimationOptions.duration / 1000;
        var margin = container.attr('data-marginBottom');
        var ease = Quint.easeInOut;

        if(!height){
            height = content.fadeIn(0).outerHeight(true);
            content.attr('data-height', height);

            if(!visible) content.fadeOut(0);
        }

        if(!margin){
            margin = parseFloat(container.css('margin-bottom'));

            container.attr('data-marginBottom', margin);
        }

        content.css({
            overflow: 'hidden'
        });

        if(jQuerythis.hasClass('open')){
            jQuerythis.removeClass('open');
            //content.slideUp(10000);

            TweenMax.fromTo(container, time, {marginBottom: margin}, {marginBottom: 0, ease: ease});

            TweenMax.fromTo(content, time, {height: height}, {height: 0, ease: ease, onComplete:function(){
                //content.fadeOut(0);
                content.css({
                    overflow: 'auto'
                });
            }});
        }else{
            jQuerythis.addClass('open');
            //content.slideDown(global.slideAnimationOptions);
            //content.fadeIn(0);

            TweenMax.fromTo(container, time, {marginBottom: 0}, {marginBottom: margin, ease: ease});
            TweenMax.fromTo(content, time, {height: 0}, {height: height, ease: ease, onComplete:function(){
                content.css({
                    overflow: 'hidden'
                });
            }});
        }
    });

    jQuery(window).on('click', function(e){
        var t = jQuery(e.target);

        if(!t.hasClass('.store-search-container') && t.parents('.store-search-container').length == 0){
            jQuery(".store-search-container .select-list-style-1").fadeOut(0);
        }

        if(((!t.is('#changer-centre') && t.parents('#changer-centre').length == 0) &&
            (!t.is('#select-centre') && t.parents('#select-centre').length == 0)) &&
            global.changeCentre.hasClass('active')){
            global.changeCentre.removeClass('active');
            global.selectCentreHeader.slideUp(global.slideAnimationOptions);
        }

        if(!t.is("#my-urban") && t.parents('#my-urban').length == 0){
            jQuery("#my-urban").removeClass("active");
            jQuery("#menu-mon-compte").css("display","none");
        }

    });

    jQuery(".datepicker-switch").addClass("datepickerSwitch").removeClass("datepicker-switch");

    //NOTIFICATIONS
    if(typeof isUserNotificationLog !== 'undefined' && isUserNotificationLog == false){
        global.isInNotification = true;
        jQuery(".bloc-layout").fadeIn(400);
        jQuery("#login").fadeIn(400);
    }

    jQuery(".open-connect a").bind("click",function(e){
        e.preventDefault();
        jQuery(".bloc-layout").fadeIn(400);
        jQuery("#login").fadeIn(400);
    });

    jQuery(window).on('resize', function(){
        global.WW = window.innerWidth;
        global.WH = window.innerHeight;
    });
    jQuery(window).trigger('resize');
    //MEDIA QUERY

    if(global.WW < 978){
        jQuery("#menu-header").on("click",function(){
            if(jQuery(this).hasClass("active")){
                jQuery(".menu-menu-header-container").css("display","none");
                jQuery(this).removeClass("active")
            }else{
                jQuery(".menu-menu-header-container").css("display","block");
                jQuery(this).addClass("active")
            }
        });
    }


/*

*/

jQuery('#bloc-birth-datepicker').addClass('close');
jQuery('#bloc-birth-datepicker').hide();

/*jQuery('#bloc-birth-datepicker').datepicker({
    format: "dd/mm/yyyy",
    language: "fr",
    todayHighlight: true
}).change(birthdateChanged)
  .on('changeDate', birthdateChanged);

function birthdateChanged(ev) {
    var date = ev.date;
    var newdate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    jQuery('#birthdate').val(newdate);
}*/

/*jQuery('#birthdate').bind('click',function(){
    if(jQuery('#bloc-birth-datepicker').hasClass('close')){
        jQuery('#bloc-birth-datepicker').removeClass('close')
        jQuery('#bloc-birth-datepicker').fadeIn(300);
    }else{
        jQuery('#bloc-birth-datepicker').addClass('close')
        jQuery('#bloc-birth-datepicker').fadeOut(300);
    } 
});*/

jQuery('#bloc-birth-datepicker .bloc-reservation-close').bind('click',function(){
    jQuery('#bloc-birth-datepicker').addClass('close')
    jQuery('#bloc-birth-datepicker').fadeOut(300);
});

//}//);
//} )( jQuery );

global.datePickerLanguage = 'fr';