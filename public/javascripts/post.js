'use strict'

$(function () {

    // Socket.io for messages count indicator    
    // let client = io.connect('/postingMsg');
    // let address = window.location.protocol + '//' + window.location.host + ':8080';
    // let details = {
    //     resource: (window.location.pathname.split('/').slice(0, -1).join('/') + '/socket.io').substring(1)
    // };

    // let client = io.connect(address, details);
    // let client = io(window.location.protocol + '//' + window.location.host + ':8080');
    // if (my.userInfo) {
    //     client.emit('messages', my.userInfo.UserID, function (data) {
    //         console.log(data);
    //     });
    // }
    // client.on('usernames', function (data) {
    //     $('.newMsgCount').text(parseInt($('.newMsgCount').eq(0).text()) + data);
    //     my.sendNotification(window.location.protocol + '//' + window.location.host + '/images/logo_small.png', 'W1Buy.com.br', 'Nova mensagem recebida!', 6000, !my.hasFocus);
    // });

    $(".carousel").swipe({

        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {

            if (direction == 'right') $(this).carousel('prev');

            if (direction == 'left') $(this).carousel('next');

        },
        threshold: 0,
        allowPageScroll: "vertical"
    });

    if (my.userInfo.UserID == parseInt($('#ownerId').val())) {
        $('#lnkMakeOffer').hide();
    }

    // $('#txtPriorityValue').focusout(function (e) {
    //     if (e.clientX === 0) {
    //         return false;
    //     }
    //     e.preventDefault();

    //     if (parseInt($('#priorityValueAmount').val()) > 0) {
    //         if ((parseInt($(e.target).val()) > 0) && (parseInt($(e.target).val()) >= parseInt($('#priorityValueAmount').val()))) {
    //             swal({
    //                 title: "Atenção!",
    //                 html: '<p>Seu menor preço está em desvantagem ao<br />já ofertado por outro vendedor.</p><p>Diminua um pouco para conseguir vender.</p>',
    //                 type: "warning",
    //                 confirmButtonText: "Ok"
    //             });
    //         }
    //     }
    // });

    // $('#txtPriorityDelivery').focusout(function (e) {
    //     if (e.clientX === 0) {
    //         return false;
    //     }
    //     e.preventDefault();

    //     if (parseInt($('#priorityDeliveryAmount').val()) > 0) {
    //         if ((parseInt($(e.target).val()) > 0) && (parseInt($(e.target).val()) >= parseInt($('#priorityDeliveryAmount').val()))) {
    //             swal({
    //                 title: "Atenção!",
    //                 html: '<p>Seu prazo de entrega está em desvantagem ao<br />já ofertado por outro vendedor.</p><p>Diminua um pouco para conseguir vender.</p>',
    //                 type: "warning",
    //                 confirmButtonText: "Ok"
    //             });
    //         }
    //     }
    // });

    $('#rateYoContainer').rateYo({
        starWidth: '16px',
        fullStar: true,
        readOnly: true
    });

    // $("#msgTextarea").on('keyup', function () {
    //     if (this.value.length) {
    //         var words = this.value.match(/\S+/g).length;

    //         if (words > 30) {
    //             // Split the string on first 200 words and rejoin on spaces
    //             var trimmed = $(this).val().split(/\s+/, 30).join(" ");
    //             // Add a space at the end to make sure more typing creates new words
    //             $(this).val(trimmed + " ");
    //         } else {
    //             $('#display_count').text(words);
    //             $('#word_left').text(30 - words);
    //         }
    //     }
    // });

    // $('#btnAddMsg').click(function (e) {
    $("form").submit(function (e) {
        let $btn = e.target;
        e.preventDefault();

        var badWCount = 0;
        // $('#msgTextarea').val($('#msgTextarea').val().replace(my.badWords, "****"));

        // if ($('#msgTextarea').val().indexOf("***") !== -1) {
        //     badWCount++;
        //     swal({
        //         title: "Atenção!",
        //         text: "Uma ou mais palavras ou símbolos usado em seu texto vai contra os termos de uso do portal. Favor não usa-la(s).",
        //         type: "warning",
        //         confirmButtonText: "Ok"
        //     });
        // }

        if (badWCount == 0) {

            var numbers = $('#msgTextarea').val().toLowerCase().split(" "),
                numberCount = 0;
            for (var i = 0; i < numbers.length; i++) {
                if (numbers[i].replace(/[^0-9]/g, '').length >= 8) {
                    numberCount++;
                }
            }

            let emailCount = 0,
                emailsArray = $('#msgTextarea').val().toLowerCase().match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            if (emailsArray != null && emailsArray.length) {
                emailCount++;
            }

            if (numberCount > 0 || emailCount > 0) {
                swal({
                    title: "Atenção!",
                    text: "Uma suspeita de irregularidade contra os termos de uso site foi detectado.",
                    type: "warning",
                    confirmButtonText: "Ok"
                });
                numberCount = 0;
                emailCount = 0;
            } else {
                advance($btn);
            }
        }
    });

    $('#msgFormModal').on('shown.bs.modal', function () {
        if (!my.userInfo.Region && !my.userInfo.City) {
            swal({
                title: "Atenção!",
                text: "Favor preencher seu cadastro com pelo menos cidade e estado antes de começar a interagir.",
                type: "warning",
                confirmButtonText: "Ok"
            });

            $('#btnAddMsg').attr('disabled', true);
        }
    });

    if (postingMsgs) {
        let postMsgs = JSON.parse(postingMsgs);

        let msgId = 0,
            commentId = 0;
        $.each(postMsgs, function (i, item) {
            if (msgId !== item.MsgId) {
                msgId = item.MsgId;
                if (!$('#postMsgsContainer').find($('#msg_' + msgId)).length > 0) {
                    // $('#postMsgsContainer').append('<ul><li id="msg_' + msgId + '">' + item.DisplayName + '(<i>' + item.City + ' - ' + item.Region + '</i>) / ' + moment(item.CreatedOnDate).fromNow() + '<ul>');
                    $('#postMsgsContainer').append('<ul class="messages"><li id="msg_' + msgId + '" class="liHeader"><ul>');

                    $.each(item.MessageComments, function (j, comment) {
                        if (comment.CommentId !== commentId) {
                            commentId = comment.CommentId;

                            if (msgId === comment.MsgId) {
                                if (!$('#msg_' + comment.MsgId + ' ul').find('li:contains("' + comment.CommentText + '")').length) {
                                    $('#msg_' + comment.MsgId + ' ul').append('<li class="msgs"><i class="fa fa-wechat"></i>&nbsp; ' + comment.CommentText + '<span class="pull-right">' + moment(comment.CreatedOnDate).fromNow() + '</span>');
                                    $('#msg_' + comment.MsgId + ' ul').append('</li>');
                                }
                            } else {
                                if (!$('#msg_' + comment.MsgId + ' ul').find('li:contains("' + comment.CommentText + '")').length) {
                                    $('#msg_' + comment.MsgId + ' ul').append('<li class="msgs"><i class="fa fa-wechat"></i>&nbsp; ' + comment.CommentText + '<span class="pull-right">' + moment(comment.CreatedOnDate).fromNow() + '</span>');
                                    $('#msg_' + comment.MsgId + ' ul').append('</li>');
                                }
                            }

                            // if (!$('#msg_' + msgId + ' ul').find($('#cmm_' + comment.CommentId)).length > 0) {
                            //     $('#msg_' + msgId + ' ul').append('<li id="cmm_' + comment.CommentId + '">' + comment.CommentText);
                            //     $('#msg_' + msgId + ' ul').append('</li>');
                            // }
                        }
                    });

                    $('#postMsgsContainer').append('</ul></li></ul>');
                }
            }

            // if (commentId === item.city.split('-')[1].replaceAll(' ', '', true)) {
            //     countState++;
            //     $('#' + msgId + ' span:eq(0)').html('<span class="badge">' + countState + '</span>');
            //     if (nameCity !== item.city.split('-')[0].replaceAll(' ', '', true)) {
            //         nameCity = item.city.split('-')[0].replaceAll(' ', '', true);
            //         countCity = 0;
            //         if ($('#' + msgId + ' ul').find('#' + msgId + '_' + item.city.split('-')[0].replaceAll(' ', '', true)).length > 0) {
            //             countCity++;
            //             $('#' + msgId + '_' + item.city.split('-')[0].replaceAll(' ', '', true) + ' span:eq(0)').html('<span class="badge">' + countCity + '</span>');
            //         } else {
            //             $('#' + msgId + ' ul').append('<li id="' + msgId + '_' + item.city.split('-')[0].replaceAll(' ', '', true) + '"><a onclick="javascript: my.getItems(' + 1 + ',' + my.keyword + ',' + item.localeId + ')" href="#">' + item.city.split('-')[0].trim() + '</a> <span></span></li>');
            //         }
            //     }

            //     if (nameCity === item.city.split('-')[0].replaceAll(' ', '', true)) {
            //         countCity++;
            //         $('#' + msgId + '_' + nameCity + ' span:eq(0)').html('<span class="badge">' + countCity + '</span>');
            //     }
            // }

        });
    }

});

function advance(btn) {

    var params = {
        postingId: $('#postingId').val(),
        subject: $('#subject').val(),
        fromUserId: my.userInfo.UserID,
        msg: $('#msgTextarea').val().trim(), // messageHtmlContent,
        portalId: 0,
        priorityValueAmount: $('#txtPriorityValue').val() !== undefined ? $('#txtPriorityValue').val() : 0,
        priorityDeliveryAmount: $('#txtPriorityDelivery').val() !== undefined ? $('#txtPriorityDelivery').val() : 0,
        toUserId: $('#ownerId').val(),
        createdOnDate: moment().format('YYYY-MM-DD HH:mm'),
        modifiedOnDate: moment().format('YYYY-MM-DD HH:mm')
    }

    $('#btnAddMsg').html("Um momento...").prop('disabled', true);

    $.ajax({
        type: 'POST',
        url: '/api/sendPostingMessage',
        data: params
    }).done(function (data) {
        if (!data.error) {
            $('#msgTextarea').val('');
            $('#txtPriorityValue').val('');
            $('#txtPriorityDelivery').val('');
            $('#msgFormModal').modal('hide');
            swal({
                title: "Sucesso!",
                html: `Sua mensagem foi enviada com sucesso ao comprador. Por favor aguarde a resposta.<br /> 
                      Caso não receba uma resposta do comprador em até 48 horas, terá a oportunidade de refazer nova oferta.`,
                type: "success",
                confirmButtonText: "Ok"
            });
            $('#btnAddMsg').html("<i class='fa fa-send'></i>&nbsp; Enviar").prop('disabled', false);
            $('#lnkMakeOffer').html("Aguardando resposta...").prop('disabled', true);
        } else {
            console.log(data.error);
        }
    }).fail(function (jqXHR, textStatus) {
        console.log(jqXHR.responseText);
        $('#btnAddMsg').html("<i class='fa fa-send'></i>&nbsp; Enviar").prop('disabled', false);
    });
}

function startRating() {
    my.toUserId = $('#ownerId').val();
    $('#ratingContainer').html('');
    $('#ratingContainer').rateYo({
        rating: $('#rateYoContainer').rateYo('rating'),
        starWidth: '18px',
        fullStar: true
    });
    $('#ratingFormModal').find('.modal-title').html('Avalie ' + $('#displayName').val());
    $('#ratingFormModal').modal('show');

    $('#btnSaveRating').on('click', function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $(e.target).html('Um momento...').prop('disabled', true);

        var params = {
            portalId: 0,
            toUserId: my.toUserId,
            fromUserId: my.userInfo.UserID,
            vote: $('#ratingContainer').rateYo('rating'),
            comments: $('#ratingComments').val(),
            createdOnDate: moment().format('YYYY-MM-DD HH:mm')
        };

        $.ajax({
            type: "POST",
            url: "/api/saveReputation",
            data: params,
            dataType: "json",
        }).done(function (response) {
            if (!response.error) {
                $('#ratingFormModal').modal('hide');
                $('#rateYoContainer').attr('title', response.Ratings.Rating.toFixed(1) + ' de 5 (Clique para avaliar)').rateYo("option", "rating", response.Ratings.Rating.toFixed(10));
                swal("Sucesso!", "Seu voto foi registrado.", "success");
            }
            $(e.target).html('<i class="fa fa-check"></i>&nbsp; Salvar').prop('disabled', false);
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $(e.target).html('<i class="fa fa-check"></i>&nbsp; Salvar').prop('disabled', false);
            $('#ratingFormModal').modal('hide');
            // }).always(function () {
        });
    });
}