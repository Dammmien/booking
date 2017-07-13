

/**
 * Open facebook page to login and accept all autorizations to complete item for register
 */
function registerWithFB() {
    FB.login(function(response){
        if (response.status === 'connected') {
            modal();
        }

    }, {scope: 'public_profile,email,user_birthday'});
}

/**
 * Open facebook page to login and accept all autorizations to login
 */
function loginWithFB() {
    FB.login(function(response){
        if (response.status === 'connected') {
            var error           =   false;
            errorsIn(jQuery('#login-form .error-message-container'));
            var idfb = response['authResponse']['userID'];
            if (isNaN(idfb))
            {
                jQuery('.login-error').find("span").html("Impossible de récupérer les informations de votre compte Facebook")
                jQuery('.login-error').addClass('visible');
                errorsIn(jQuery('#login-form .error-message-container'));
                return false;
            }

            if(error == false){
                jQuery.post(
                    global.ajaxUrl,
                    {
                        'action'            :   'loginFb',
                        'facebookUserId'    :   idfb,
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
                            btnLoaderOut(jQuery('#link-login'));
                            jQuery('.login-error').find("span").html(result.error);
                            jQuery('.login-error').addClass('visible');
                        }
                        errorsIn(jQuery('#login-form .error-message-container'));
                    }
                ).fail(function() {
                })
            }else{
                btnLoaderOut(jQuery('#link-login'));
            }


        }
        else
        {
            btnLoaderOut(jQuery('#link-login'));
            jQuery('.login-error').find("span").html("Impossible de se connecter avec votre compte Facebook")
            jQuery('.login-error').addClass('visible');
            errorsIn(jQuery('#login-form .error-message-container'));
        }

    }, {scope: 'email'});
}


/**
 *
 * Open register modal
 *
 */

function modal() {
    FB.api('/me', {fields: ['last_name', 'first_name', 'email', 'picture','birthday']}, function(response) {
        if(!response.hasOwnProperty('error')){
            jQuery("#login").fadeOut(400, function(){
                resetErrorsMessages();
                jQuery("#register-facebook").fadeIn(400);
            });
            btnLoaderOut(jQuery('#link-login'));
            if (isValidEmailAddress(response['email']))
            {
                global.facebookEmail = response['email'];
                jQuery("#register-facebook").find("#email").val(response['email'])
                jQuery("#register-facebook").find("#confirm_email").val(response['email'])
            }
            else
                jQuery("#register-facebook").find("#tel").val(response['email'])

            if(response['birthday']){
                var birthdate = response['birthday'].split('/');
            }

            jQuery("#register-facebook").find("#nom").val(response['last_name']);
            jQuery("#register-facebook").find("#prenom").val(response['first_name']);
            if(response['birthday']){
                jQuery("#register-facebook").find("#birthdate").val(birthdate[1]+'/'+birthdate[0]+'/'+birthdate[2]);
            }
            jQuery("#register-facebook").find("#fb-id").val(response['id']);
            jQuery("#register-facebook").find("#fb-img").val(response['picture']['data']['url']);
        }

    });
}


