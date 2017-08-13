'use strict'

$(() => {

    let $formLogin = $('#login-form'),
        $formLost = $('#lost-form'),
        $formRegister = $('#register-form'),
        $divForms = $('#div-forms'),
        $modalAnimateTime = 300,
        $msgAnimateTime = 150;

    let checkPass = () => {
        //Store the password field objects into variables ...
        var pass1 = document.getElementById('register_password');
        var pass2 = document.getElementById('register_password2');
        //Store the Confimation Message Object ...
        var message = document.getElementById('confirmMessage');
        //Set the colors we will be using ...
        var goodColor = "#66cc66";
        var badColor = "#ff6666";
        //Compare the values in the password field 
        //and the confirmation field
        if (pass2.value.length > 1) {
            window.setTimeout(() => {
                if (pass1.value == pass2.value) {
                    //The passwords match. 
                    //Set the color to the good color and inform
                    //the user that they have entered the correct password 
                    pass2.style.backgroundColor = '';
                    message.style.color = '';
                    message.innerHTML = '';
                    // window.setTimeout(() => {
                    //     message.innerHTML = '';
                    //     pass2.style.backgroundColor = '';
                    //     message.style.color = '';
                    // }, 1000);
                } else {
                    //The passwords do not match.
                    //Set the color to the bad color and
                    //notify the user.
                    pass2.style.backgroundColor = badColor;
                    message.style.color = badColor;
                    message.innerHTML = "Senhas não batem!";
                }
            }, 1000);
        }
    };

    $('#register_password2').keyup(checkPass);

    $("form").submit(function (e) {
        let $btn = e.target;
        switch (this.id) {
            case "login-form":
                e.preventDefault();
                let $lg_username = $('#login_username').val();
                let $lg_password = $('#login_password').val();
                let $lg_remember_me = $('#remember_me').prop('checked');
                if ($lg_username == "ERRO") {
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Login ou senha incorreto");
                } else {
                    //     msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "glyphicon-ok", "Login OK");
                    // }

                    $('#login_btn').html("Um momento...").attr('disabled');

                    $.ajax({
                        type: 'POST',
                        data: {
                            username: $lg_username,
                            password: $lg_password,
                            remember_me: $lg_remember_me
                        },
                        url: '/contas/login'
                    }).done(function (data) {
                        if (data.error) {
                            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", data.error, 6000);
                        } else {
                            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "glyphicon-ok", "Login OK. Redirecionando...", 6000);
                        }

                        window.setTimeout(() => {
                            window.location.replace('/contas/minhaconta');
                        }, 2000);
                    }).fail(function (jqXHR, textStatus) {
                        msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", jqXHR.responseJSON, 6000);
                        $('#login_btn').html("Login").removeAttr('disabled');
                        // }).always(function () {
                        //     $('#login_btn').html("Login").removeAttr('disabled');
                    });
                }

                break;
            case "lost-form":
                let $ls_email = $('#lost_email').val();
                if ($ls_email == "ERROR") {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", "Send error", 6000);
                } else {
                    e.preventDefault();

                    let $lost_email = $('#lost_email').val();

                    let personData = {
                        email: $lost_email
                    };

                    $('#lost_btn').html("Um momento...").attr('disabled');

                    $.ajax({
                        type: 'POST',
                        data: personData,
                        url: '/contas/resetpassword'
                    }).done(function (data) {
                        if (data.error) {
                            msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", data.error, 10000);
                        } else {
                            $('#lost_email').val('');
                            msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "success", "glyphicon-ok", "Link enviado para o email cadastrado", 10000);
                        }
                        $('#lost_btn').html("Enviar").removeAttr('disabled');
                    }).fail(function (jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                        msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "glyphicon-remove", jqXHR.responseText, 6000);
                        $('#lost_btn').html("Enviar").removeAttr('disabled');
                    });

                }
                break;
            case "register-form":

                if (e.isDefaultPrevented()) {

                } else {
                    // Prevent form submission
                    e.preventDefault();

                    let $register_firstname = $('#register_firstname').val();
                    let $register_lastname = $('#register_lastname').val();
                    let $register_email = $('#register_email').val();
                    // let $register_telephone = $('#register_telephone').val();
                    // let $register_cell = $('#register_telephone').val();
                    let $register_password = $('#register_password').val();
                    let $firstChoice = $('input[name="firstChoice"]').val();

                    let personData = {
                        portalId: 0,
                        firstName: $register_firstname,
                        lastName: $register_lastname,
                        email: $register_email,
                        username: $register_email,
                        // telephone: $register_telephone,
                        // cell: $register_telephone,
                        firstChoice: $firstChoice,
                        password: $register_password,
                        createdOnDate: moment().format('YYYY-MM-DD HH:mm')
                    };

                    // if ($register_telephone.length > 10) {
                    //     personData.cell = $register_telephone.replace(/\D/g, '');
                    // } else {
                    //     personData.telephone = $register_telephone.replace(/\D/g, '');
                    // }

                    $('#register_btn').html("Um momento...").attr('disabled');

                    $.ajax({
                        type: 'POST',
                        // contentType: false,
                        // processData: false,
                        data: personData,
                        url: '/contas/registeruser'
                    }).done(function (data) {
                        if (data.error) {
                            msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", data.error, 6000);
                        } else {
                            $('#login_username').val($register_email);
                            modalAnimate($formRegister, $formLogin);
                            msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "glyphicon-ok", "Agora digite sua senha para logar.", 10000);
                            window.setTimeout(() => {
                                $('#login_password').val(null);
                                $('#login_password').focus();
                            });
                        }
                        $('#register_btn').html("Cadastrar").removeAttr('disabled');
                    }).fail(function (jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                        msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", jqXHR.responseText, 6000);
                        $('#register_btn').html("Cadastrar").removeAttr('disabled');
                        // }).always(function () {
                        //     $('#register_btn').html("Cadastrar").removeAttr('disabled');
                    });
                }
                break;
            default:
                return false;
        }
        return false;
    });

    $('#login_register_btn').click(function () {
        modalAnimate($formLogin, $formRegister);
        window.setTimeout(() => {
            $('#register_firstname').focus();
        }, 500);
    });
    $('#register_login_btn').click(function () {
        modalAnimate($formRegister, $formLogin);
        window.setTimeout(() => {
            $('#login_username').focus();
        }, 500);
    });
    $('#login_lost_btn').click(function () {
        modalAnimate($formLogin, $formLost);
        window.setTimeout(() => {
            $('#lost_email').focus();
        }, 500);
    });
    $('#lost_login_btn').click(function () {
        modalAnimate($formLost, $formLogin);
        window.setTimeout(() => {
            $('#login_username').focus();
        }, 500);
    });
    $('#lost_register_btn').click(function () {
        modalAnimate($formLost, $formRegister);
        window.setTimeout(() => {
            $('#register_firstname').focus();
        }, 500);
    });
    $('#register_lost_btn').click(function () {
        modalAnimate($formRegister, $formLost);
        window.setTimeout(() => {
            $('#lost_email').focus();
        }, 500);
    });

    function modalAnimate($oldForm, $newForm) {
        let $oldH = $oldForm.height();
        let $newH = $newForm.height();
        $divForms.css("height", $oldH);
        $oldForm.fadeToggle($modalAnimateTime, function () {
            $divForms.animate({
                height: $newH
            }, $modalAnimateTime, function () {
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    };

    function msgFade($msgId, $msgText) {
        $msgId.fadeOut($msgAnimateTime, function () {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    };

    function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText, $msgShowTime) {
        let $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("glyphicon-chevron-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(() => {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("glyphicon-chevron-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
        }, $msgShowTime);
    };

    $('input[required], input[required="required"]').each(function (i, e) {
        e.oninput = function (el) {
            el.target.setCustomValidity("");

            if (el.target.type == "email") {
                if (el.target.validity.patternMismatch) {
                    el.target.setCustomValidity("E-Mail com formato inválido.");

                    if (el.target.validity.typeMismatch) {
                        el.target.setCustomValidity("E-Mail inválido.");
                    }
                }
            }
        };

        e.oninvalid = function (el) {
            el.target.setCustomValidity(!el.target.validity.valid ? e.attributes.requiredmessage.value : "");
        };
    });

    window.setTimeout(function () {
        $('#login_username').focus();
    }, 500);

    $(window).on('load', function () {
        $("#cover").fadeOut(200);
    });

    //stackoverflow does not fire the window onload properly, substituted with fake load

    // function newW() {
    //     $(window).load();
    // }
    // setTimeout(newW, 1000);
});