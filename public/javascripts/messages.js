'use strict'

$(function () {

    my.messagesViewModel();

    // my.waitingDialog.show('Carregando mensagens...', {
    //     dialogSize: 'md',
    //     progressType: 'warning'
    // });

    // moment.tz.setDefault("Europe/London");

    // Gets user's postings messages
    // vscode-fold=1
    $.getJSON('/api/getPostingsMessages?userId=' + my.userInfo.UserID, function (data) {
        if (data) {
            if (data.length) {
                my.vm.messages(data);
                // if (my.vm.messages()[0].Comments) {

                //     $('#subjectHeader').html(my.vm.messages()[0].Subject + ' (ID: ' + my.vm.messages()[0].MsgId + ')');

                //     $('#aPosting').attr({
                //         href: "/anuncios?id=" + my.vm.messages()[0].PostingId
                //     });

                //     $('.mail-list li').eq(0).addClass('selected');

                //     $('#answerBtn, #btnSendRequest, #btnSendContact, #btnSendPurchase').attr({
                //         'data-PostingId': my.vm.messages()[0].PostingId,
                //         'data-MsgId': my.vm.messages()[0].MsgId,
                //         'data-FromUserId': my.vm.messages()[0].FromUserId,
                //         'data-OwnerId': my.vm.messages()[0].UserId,
                //         'data-Subject': my.vm.messages()[0].Subject
                //     });

                //     if ((my.userInfo.UserID == my.vm.messages()[0].UserId)) {
                //         if (!my.vm.messages()[0].BuyerPaid) {
                //             $('#btnSendRequest').removeClass('hidden');
                //         }
                //     }

                //     if (my.userInfo.UserID !== my.vm.messages()[0].UserId && (!my.vm.messages()[0].BuyerPaid)) {
                //         $('#btnSendContact').removeClass('hidden');
                //     }

                //     if (my.userInfo.UserID !== my.vm.messages()[0].UserId && (my.vm.messages()[0].BuyerPaid)) {
                //         $('#answerBtn').addClass('hidden');
                //     }

                //     if (my.vm.messages()[0].BuyerPaid && my.vm.messages()[0].SellerPaid) {
                //         $('#btnSendRequest').addClass('hidden');
                //         $('#btnSendContact').addClass('hidden');
                //         $('#btnRemoveMsgs').addClass('hidden');
                //         $('#answerBtn').addClass('hidden');
                //     }

                //     if (my.vm.messages()[0].BuyerPaid && (my.userInfo.UserID == my.vm.messages()[0].UserId) && my.vm.messages()[0].SellerPaid) {
                //         $('#btnSendPurchase').removeClass('hidden');
                //     }

                //     if ((my.vm.messages()[0].BuyerPaid && (my.userInfo.UserID !== my.vm.messages()[0].UserId) && (!my.vm.messages()[0].SellerPaid))) {
                //         $('#btnSendContact').removeClass('hidden');
                //     } else {
                //         $('#btnSendContact').addClass('hidden');
                //     }

                //     if (my.vm.messages()[0].Complete) {
                //         if (!$('#messageButtons').hasClass('hidden')) {
                //             $('#messageButtons').addClass('hidden');
                //         }
                //     } else {
                //         $('#messageButtons').removeClass('hidden');
                //     }

                //     my.vm.comments(my.vm.messages()[0].Comments);

                //     if (my.vm.messages()[0].Files) {
                //         if (my.vm.messages()[0].Files.length) {
                //             $.each(my.vm.messages()[0].Files, function (i, item) {
                //                 $('#imagesContainer').append('<a href="/uploads/' + my.vm.messages()[0].UserId + '/chats/' + my.vm.messages()[0].MsgId + '/large/' + item.FileName + '" target="_blank" title="Anexo"><span class="fa fa-paperclip fa-2x"></span></a> &nbsp; ')
                //             });
                //         }
                //     }

                //     if (parseInt($('.newMsgCount').eq(0).text()) > 0) {
                //         $('.newMsgCount').text(parseInt($('.newMsgCount').eq(0).text()) - 1);
                //     }

                //     $('.rateYo').rateYo({
                //         starWidth: '16px',
                //         fullStar: true,
                //         readOnly: true
                //     });

                // } else {
                //     $('#messagesBlock').addClass('col-xs-12');
                // }
                // $('#messagesBlock').addClass('col-md-4');

                // ko.utils.arrayForEach(my.vm.messages(), function (item) {
                //     $('#rating_' + item.FromUserId + '_' + item.MsgId).rateYo("option", "rating", item.Rating);
                // });
                // } else {
                //     $('#messagesBlock').addClass('col-xs-12');
            }
            // my.waitingDialog.hide();
        }
    });

    // File ipload configurations
    // vscode-fold=2
    $("#attachments").fileinput({
        language: 'pt-BR',
        showUpload: false,
        previewFileType: 'none',
        uploadAsync: true,
        maxFileCount: 5,
        // browseLabel: 'Anexos',
        showPreview: false,
        msgSelected: '{n} selecionado(s)'
    });

    // Send comment button click event
    // vscode-fold=3
    $('#btnSendComment').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        var commentData = new FormData($('#commentForm')[0]);

        commentData.append('portalId', 0);
        commentData.append('msgId', $('.hiddenMsgId').eq(0).val());
        commentData.append('subject', $('#hiddenSubject').val());
        commentData.append('postingId', $('#hiddenPostingId').val());
        commentData.append('createdOnDate', moment().format('YYYY-MM-DD HH:mm'));
        commentData.append('createdByUser', my.userInfo.UserID);

        if (my.userInfo.UserID == parseInt($('#hiddenOwnerId').val())) {
            commentData.append('toUserId', $('#hiddenFromUserId').val());
            commentData.append('fromUserId', my.userInfo.UserID);
        } else {
            commentData.append('toUserId', $('#hiddenOwnerId').val());
            commentData.append('fromUserId', my.userInfo.UserID);
        }

        $.ajax({
            type: 'POST',
            url: '/api/addPostingMessageComment',
            contentType: false,
            processData: false,
            dataType: 'json',
            data: commentData
        }).done(function (data) {
            if (!data.error) {

                swal({
                    title: "Sucesso!",
                    html: '<p>Mensagem enviada com sucesso.</p>',
                    type: "success",
                    confirmButtonText: "Ok"
                });

                // $('#fromWhoContainer').hide();
                $('#answerBtn').hide();
                $('#btnSendRequest').hide();
                $('#btnSendContact').hide();
                $('#messageModal').modal('hide');

                my.vm.comments.unshift({
                    CommentId: data,
                    CommentText: my.userInfo.DisplayName + ': ' + $("#messageModal").find('#messageTextarea').val(),
                    CreatedByUser: my.userInfo.UserID,
                    CreatedOnDate: moment().format('YYYY-MM-DD HH:mm'),
                    FromUser: my.userInfo.DisplayName,
                    MsgId: $('#messageModal .hiddenMsgId').val(),
                    PostingId: $('#messageModal .hiddenPostingId').val(),
                    SenderCity: '',
                    SenderRegion: 'Você'
                });
                if (data.Files) {
                    $('#imagesContainer').html('');
                    $.each(data.Files, function (i, item) {
                        $('#imagesContainer').append('<a href="/uploads/' + my.vm.messages()[0].UserId + '/chats/' + my.vm.messages()[0].MsgId + '/large/' + item.FileName + '" target="_blank" title="Anexo"><span class="fa fa-paperclip fa-2x"></span></a> &nbsp; ')
                    });
                }
                $("#messageModal").find('#messageTextarea').val('');
                $('#attachments').fileinput('clear');
            } else {
                swal({
                    title: "Erro!",
                    text: data.error,
                    type: "error",
                    confirmButtonText: "Ok"
                });
            }

        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
        }).always(function () {
            // e.currentTarget.value = 'ENVIAR';
            // e.currentTarget.disabled = false;
        });
    });

    // Request contact button click event
    // vscode-fold=4
    $('#btnSendRequest').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        if (parseInt(my.userInfo.Progress) < 100) {
            swal({
                title: "Atenção!",
                text: "É necessário completar seu cadastro inteiramente.",
                type: "warning",
                confirmButtonText: "Ok"
            });
        } else {
            swal({
                title: 'Informativo!',
                text: "Um comunicado será enviado ao destinatário solitando as informações de contato.",
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Prosseguir',
                cancelButtonText: 'Não, cancelar!'
            }).then(function () {

                var params = {
                    portalId: 0,
                    postingId: $('#hiddenPostingId').val(),
                    fromUserId: my.userInfo.UserID,
                    toUserId: $('#hiddenFromUserId').val(),
                    msgId: $('.hiddenMsgId').eq(0).val(),
                    subject: $('#hiddenSubject').val(),
                    createdByUser: 2,
                    createdOnDate: moment().format('YYYY-MM-DD HH:mm')
                };

                $.ajax({
                    type: 'POST',
                    url: '/api/requestContact',
                    data: params
                }).done(function (data) {
                    if (!data.error) {

                        swal({
                            title: "Sucesso!",
                            html: 'Seu pedido para visualização de contato foi enviado com sucesso. Por favor aguarde a liberação!',
                            type: "success",
                            confirmButtonText: "Ok"
                        });

                        my.vm.comments.unshift({
                            CommentId: data,
                            CommentText: '<strong>W1Buy (Administração):</strong><br />Pedido de contato enviado. Por favor aguarde!',
                            CreatedByUser: 2, // my.userInfo.UserID,
                            CreatedOnDate: new Date(),
                            FromUser: 'W1Buy', // my.userInfo.DisplayName,
                            MsgId: $('.hiddenMsgId').eq(0).val(),
                            PostingId: $('#hiddenPostingId').val(),
                            SenderCity: '', // my.userInfo.City,
                            SenderRegion: 'Administração' // my.userInfo.Region
                        });
                        $('#btnSendRequest').addClass('hidden');
                        $('#btnRemoveMsgs').addClass('hidden');
                        $('#answerBtn').addClass('hidden');
                    } else {
                        swal({
                            title: "Erro!",
                            text: data.error,
                            type: "error",
                            confirmButtonText: "Ok"
                        });
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                }).always(function () {});

            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
                if (dismiss === 'cancel') {
                    swal(
                        'Cancelado',
                        'Solicitação não enviada',
                        'warning'
                    )
                }
            });
        }
    });

    // Send contact button click event
    // vscode-fold=6
    $('#btnSendContact').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        if (parseInt(my.userInfo.Progress) < 100) {
            swal({
                title: "Atenção!",
                text: "É necessário completar seu cadastro inteiramente.",
                type: "warning",
                confirmButtonText: "Ok"
            });
        } else {
            swal({
                title: 'Informativo!',
                text: "Suas informações de contato como email e telefone serão enviadas ao destinatário.",
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Prosseguir',
                cancelButtonText: 'Não, cancelar!'
            }).then(function () {

                var params = {
                    portalId: 0,
                    postingId: $('#hiddenPostingId').val(),
                    fromUserId: my.userInfo.UserID,
                    msgId: $('.hiddenMsgId').eq(0).val(),
                    subject: $('#hiddenSubject').val(),
                    createdByUser: my.userInfo.UserID,
                    createdOnDate: moment().format('YYYY-MM-DD HH:mm')
                };

                if (my.userInfo.UserID == parseInt($('#hiddenOwnerId').val())) {
                    params.toUserId = $('#hiddenFromUserId').val();
                } else {
                    params.toUserId = $('#hiddenOwnerId').val();
                }

                $.ajax({
                    type: 'POST',
                    url: '/api/sendContact',
                    data: params
                }).done(function (data) {
                    if (!data.error) {

                        swal({
                            title: "Sucesso!",
                            html: '<p>Seu contato foi enviado. Por favor aguarde o processamento de averiguação.</p>',
                            type: "success",
                            confirmButtonText: "Ok"
                        });

                        my.vm.comments.unshift({
                            CommentId: data,
                            CommentText: '<strong>W1Buy (Administração):</strong><br />Contato enviado, aguarde averiguação.',
                            CreatedByUser: 2, // my.userInfo.UserID,
                            CreatedOnDate: new Date(),
                            FromUser: 'W1Buy', // my.userInfo.DisplayName,
                            MsgId: $('.hiddenMsgId').eq(0).val(),
                            PostingId: $('#hiddenPostingId').val(),
                            SenderCity: '', //my.userInfo.City,
                            SenderRegion: 'Administração', // my.userInfo.Region
                        });

                        $('#btnRemoveMsgs').addClass('hidden');
                        $('#answerBtn').addClass('hidden');
                        $('#btnSendContact').addClass('hidden');
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                }).always(function () {
                    e.currentTarget.value = 'ENVIAR CONTATO';
                    e.currentTarget.disabled = false;
                });

            }, function (dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
                if (dismiss === 'cancel') {
                    swal(
                        'Cancelado',
                        'Solicitação não enviada',
                        'warning'
                    )
                }
            });
        }
    });

    // Purchase button click event
    // vscode-fold=7
    $('#btnSendPurchase').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        swal({
            title: 'Informativo!',
            text: "Suas informações de contato como email e telefone serão enviadas ao destinatário.",
            type: 'info',
            showCancelButton: true,
            confirmButtonText: 'Prosseguir',
            cancelButtonText: 'Não, cancelar!'
        }).then(function () {

            let fromContactInfo = 'Parabéns, sua negociação chegou ao fim. Agora entre em contato com a outra parte.<br />';

            let toContactInfo = 'Parabéns, sua negociação chegou ao fim. Agora entre em contato com a outra parte.<br />';
            toContactInfo += '<u class="text-success"><a href="#" data-bind="click: startRating.bind($data, $index())">Clique aqui e qualifique a outra parte.</a></u><br /><br />';
            toContactInfo += '<strong>Nome:</strong> ' + my.userInfo.FirstName + ' ' + my.userInfo.LastName + '<br />';
            toContactInfo += '<strong>Email:</strong> ' + my.userInfo.Email + '<br />';
            toContactInfo += '<strong>Telefone:</strong> ' + my.userInfo.Telephone + '<br />';
            toContactInfo += '<strong>Celular:</strong> ' + my.userInfo.Cell + '<br />';

            var params = {
                portalId: 0,
                postingId: $('#hiddenPostingId').val(),
                fromUserId: my.userInfo.UserID,
                toUserId: $('#hiddenFromUserId').val(),
                msgId: $('.hiddenMsgId').eq(0).val(),
                subject: $('#hiddenSubject').val(),
                commentText: 'Conclusão de negociação',
                fromContactInfo: fromContactInfo,
                toContactInfo: toContactInfo,
                createdByUser: my.userInfo.UserID,
                createdOnDate: moment().format('YYYY-MM-DD HH:mm')
            };

            $.ajax({
                type: 'POST',
                url: '/api/purchase',
                data: params
            }).done(function (data) {
                if (!data.error) {

                    swal({
                        title: "Sucesso!",
                        html: '<p>Seu pedido para visualizar o contato foi enviado com sucesso.</p><p>Por favor aguarde a liberação.</p>',
                        type: "success",
                        confirmButtonText: "Ok"
                    });

                    my.vm.comments.unshift({
                        CommentId: data,
                        CommentText: '<strong>W1Buy (Administração):</strong><br />Suas informações de contato foram enviadas, Por favor aguarde averiguação.<br />',
                        CreatedByUser: my.userInfo.UserID,
                        CreatedOnDate: new Date(),
                        FromUser: 'W1Buy',
                        MsgId: $('.hiddenMsgId').eq(0).val(),
                        PostingId: $('#hiddenPostingId').val(),
                        SenderCity: '',
                        SenderRegion: 'Administração'
                    });

                    $('#btnRemoveMsgs').addClass('hidden');
                    $('#answerBtn').addClass('hidden');
                    $('#btnSendRequest').addClass('hidden');
                    $('#btnSendPurchase').addClass('hidden');
                }
            }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            }).always(function () {
                e.currentTarget.value = 'ENVIAR CONTATO';
                e.currentTarget.disabled = false;
            });

        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'
            if (dismiss === 'cancel') {
                swal(
                    'Cancelado',
                    'Solicitação não enviada',
                    'warning'
                )
            }
        });
    });

    // Purchase button click event
    // vscode-fold=8
    $('#btnRemoveMsg').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        var params = {
            portalId: 0,
            postingId: $('#hiddenPostingId').val(),
            fromUserId: my.userInfo.UserID,
            toUserId: $('#hiddenFromUserId').val(),
            msgId: $('.hiddenMsgId').eq(0).val(),
            createdOnDate: moment().format('YYYY-MM-DD HH:mm')
        };

        swal({
            title: 'Atenção!',
            text: "Tem certeza que deseja excluir a mensagem?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não, cancelar!'
        }).then(function () {

            $.ajax({
                type: 'DELETE',
                url: '/api/removeMsg',
                data: params
            }).done(function (data) {
                if (!data.error) {
                    swal({
                        title: "Sucesso!",
                        html: '<p>Os diálogos foram exluidos com sucesso e não estarão mais disponíveis para visualização.</p>',
                        type: "success",
                        confirmButtonText: "Ok"
                    });

                    $('#btnRemoveMsg').addClass('hidden');
                    $('#answerBtn').addClass('hidden');
                    $('#btnSendRequest').addClass('hidden');
                    $('#btnSendContact').addClass('hidden');
                    $('#btnSendPurchase').addClass('hidden');
                }
            }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR.responseText);
                // }).always(function () {
            });

        }, function (dismiss) {
            // dismiss can be 'cancel', 'overlay',
            // 'close', and 'timer'
            if (dismiss === 'cancel') {
                swal(
                    'Cancelado',
                    'A messagem não foi excluida',
                    'warning'
                )
            }
        });
    });

    // Comment modal on close event
    // vscode-fold=9
    $('#messageModal').on('hidden.bs.modal', function () {
        $('#messageModal').find('#btnSendPurchase').addClass('hidden');
        $('#messageModal').find('#btnSendRequest').addClass('hidden');
        $('#messageModal').find('#btnSendContact').addClass('hidden');
        // $('#messageModal').find('#attachmentsDiv').addClass('hidden');
        // $('#messageModal').find('#btnSendComment').addClass('hidden');
    });

    // Comment modal on open event
    // vscode-fold=10
    // $('#messageModal').on('shown.bs.modal', function () {
    //     if (parseInt(my.userInfo.Progress) < 100) {
    //         swal({
    //             title: "Atenção!",
    //             text: "É necessário completar seu cadastro antes de começar a interagir.",
    //             type: "warning",
    //             confirmButtonText: "Ok"
    //         });

    //         $('#btnSendComment').attr('disabled', true);
    //     }
    // });

});

function getMessages() {
    $.getJSON('/api/getPostingsMessages?userId=' + my.userInfo.UserID, function (data) {
        if (data) {
            if (data.length) {
                my.vm.messages([]);
                my.vm.messages(data);
            }
        }
    });

    $('.inbox').show();
    $('.detail').hide();
}