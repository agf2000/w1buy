my.messagesViewModel = function () {

    // vscode-fold=1

    // knockout js view model
    my.vm = function () {
        // this is knockout view model
        var self = this;

        // vscode-fold=2
        // open an image inside modal
        self.openImage = function (data, e) {
            if (e.clientX === 0) {
                return false;
            }
            e.preventDefault();

            $('#imageContainer').find('img').attr('src', ((data.fileId() > 0) ? '/dnn/portals/0/' + data.folder() + data.fileName() : ''));
            $('#imageContainerLabel').html('Imagem do Anúncio');
            $('#imageContainer').modal('show');
        };

        // vscode-fold=3
        // Removes an image (not yet implemented)
        self.removeImage = function (data, e) {

            var fileName = $(e.target).parent('button').parent().find('a').attr('href').split("/");
            var fileId = $(e.target).parent('button').parent().find('a').attr('data');

            $.ajax({
                type: 'POST',
                url: '/dnn/desktopmodules/w1b/api/postings/RemovePostingFile?fileName=' + fileName.pop() + '&fileId=' + fileId
            }).done(function (dataBack) {
                if (dataBack) {
                    if (dataBack.Result.indexOf('success') !== -1) {
                        $(e.target).parent('button').parent().hide();
                        $(e.target).parent('button').parent().closest('li').removeAttr('style')
                        $(e.target).parent('button').next('a').remove();
                        $(e.target).parent('button').parent().closest('.imageArea').hide();
                        $(e.target).parent('button').parent().closest('li').find('.k-upload-button').removeClass('hidden');
                        $(e.target).parent('button').parent().closest('li').find('.k-upload-status').hide();
                        $(e.target).parent('button').parent().closest('li').find('fieldset').hide();
                    }
                }

                $('.k-upload-button').removeClass('hidden');
                $('.k-upload-status').removeClass('hidden');
            }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            });
        };

        // vscode-fold=4
        // Open a message dialog
        self.openMsgModal = function (ele) {

            let msgId = $(ele).data('msgid');
            $('#messageModal').find('.hiddenMsgId').val(msgId);

            let postingId = $(ele).data('postingid');
            $('#messageModal').find('.hiddenPostingId').val(postingId);

            let fromUserId = $(ele).data('fromuserid');
            $('#messageModal').find('.hiddenFromUserId').val(fromUserId);

            let ownerId = $(ele).data('ownerid');
            $('#messageModal').find('.hiddenOwnerId').val(ownerId);

            let subject = $(ele).data('subject');
            $('#messageModal').find('.hiddenSubject').val(subject);

            $('#messageModal').modal('show');
        };

        // vscode-fold=5
        // Open message comments on a message click
        self.openComments = function (index, data, e) {
            if (e.clientX === 0) {
                return false;
            }
            e.preventDefault();

            // my.waitingDialog.show('Carregando mensagens...', {
            //     dialogSize: 'md',
            //     progressType: 'warning'
            // });

            $.getJSON('/api/getPostingMessageComments?msgId=' + data.MsgId + '&userId=' + my.userInfo.UserID + '&postingId=' + data.PostingId, function (messages) {
                if (messages) {
                    // let msg = message[0];
                    self.comments([]);
                    $('.inbox').hide();
                    $('.detail').show();
                    $('#imagesContainer').text(null);
                    $('.mail-list li').removeClass('selected');

                    if (data.FromUserId == my.userInfo.UserID || data.BuyerPaid) {
                        // $('#fromWhoContainer').hide();
                        $('#answerBtn').hide();
                        $('#btnSendRequest').hide();
                        $('#fromWho').html(((data.Sender.toLowerCase().indexOf('w1buy') !== -1) ? 'W1Buy (Administração)' : data.Sender + ' - ' + data.SenderCity + ' (' + data.SenderRegion + ')'));

                        $('#rateYoContainer').prop('title', data.Rating.toFixed(1) + ' de 5 (Clique para avaliar)')
                            .on('click', startRating.bind(index, data, this));

                        $('#rateYoContainer').rateYo({
                            starWidth: '16px',
                            fullStar: true,
                            readOnly: true,
                            rating: data.Rating.toFixed(1)
                        });
                    } else {
                        // $('#fromWhoContainer').show();
                        $('#answerBtn').show();
                        $('#btnSendRequest').show();
                        $('#fromWho').html(((data.FromUser.toLowerCase().indexOf('w1buy') !== -1) ? 'W1Buy (Administração)' : data.FromUser + ' - ' + data.FromCity + ' (' + data.FromRegion + ')'));

                        $('#rateYoContainer').prop('title', data.Rating.toFixed(1) + ' de 5 (Clique para avaliar)')
                            .on('click', startRating.bind(index, data, this));

                        $('#rateYoContainer').rateYo({
                            starWidth: '16px',
                            fullStar: true,
                            readOnly: true,
                            rating: data.Rating.toFixed(1)
                        });
                    }

                    if (data.PriorityValueAmount) {
                        $('#priorityValueText').html('<strong>Valor inicial ofertado:</strong> ' + data.PriorityValueAmount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }));
                    }

                    if (data.PriorityDeliveryAmount) {
                        $('#priorityDeliveryText').html('<strong>Prazo inicial ofertado:</strong> ' + data.PriorityDeliveryAmount + (data.PriorityDeliveryAmount > 1 ? ' dias' : ' dia') + '<br /><br />');
                    }

                    $('#subjectHeader').html(data.Subject + ' (ID: ' + data.MsgId + ')').attr({
                        href: "/anuncios/" + data.PostingId + '/' + data.UserId
                    });

                    $('#sentOn').html(moment(data.CreatedOnDate).fromNow());

                    $('#hiddenPostingId').val(data.PostingId);
                    $('.hiddenMsgId').val(data.MsgId);
                    $('#hiddenOwnerId').val(data.UserId);
                    $('#hiddenFromUserId').val(data.FromUserId);
                    $('#hiddenSubject').val(data.Subject);

                    if ((my.userInfo.UserID == data.UserId)) {
                        if (!data.BuyerPaid) {
                            $('#btnSendRequest').removeClass('hidden');
                        }
                    }

                    if (my.userInfo.UserID !== data.UserId && (!data.BuyerPaid)) {
                        $('#btnSendContact').removeClass('hidden');
                    }

                    if (data.BuyerPaid && data.SellerPaid) {
                        $('#btnSendRequest').addClass('hidden');
                        $('#btnSendContact').addClass('hidden');
                        $('#btnRemoveMsgs').addClass('hidden');
                        $('#answerBtn').html('Nova Mensagem');
                    }

                    if (data.BuyerPaid && (my.userInfo.UserID == data.UserId) && data.SellerPaid && (!data.Complete)) {
                        $('#btnSendPurchase').removeClass('hidden');
                    }

                    if (data.BuyerPaid && (my.userInfo.UserID !== data.UserId) && (!data.SellerPaid)) {
                        $('#btnSendContact').removeClass('hidden');
                    } else {
                        $('#btnSendContact').addClass('hidden');
                    }

                    if (data.Files) {
                        if (data.Files.length) {
                            $.each(data.Files, function (i, item) {
                                $('#imagesContainer').append('<a href="/uploads/' + data.UserId + '/chats/' + data.MsgId + '/large/' + item.FileName + '" target="_blank" title="Anexo"><span class="fa fa-paperclip fa-2x"></span></a> &nbsp; ')
                            });
                        }
                    }

                    if (parseInt($('.newMsgCount').eq(0).text()) > 0) {
                        $('.newMsgCount').text(parseInt($('.newMsgCount').eq(0).text()) - 1);
                    }

                    self.comments(messages);
                }
            });
        };

        // vscode-fold-6
        // Open rating window
        self.startRating = function (data, e, index) {
            my.toUserId = data.FromUserId;
            my.fromUserId = data.ToUserId;
            $('#ratingContainer').html('');
            $('#ratingContainer').rateYo({
                rating: data.Rating,
                starWidth: '18px',
                fullStar: true
            });
            $('#ratingFormModal').find('.modal-title').html('Avalie ' + data.FromUser);
            $('#ratingFormModal').modal('show');

            $('#btnSaveRating').on('click', function (event) {
                if (event.clientX === 0) {
                    return false;
                }
                event.preventDefault();

                $(event.target).html('Um momento...').prop('disabled', true);

                var params = {
                    portalId: 0,
                    toUserId: data.FromUserId,
                    fromUserId: data.ToUserId,
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
                        $('.rating_' + data.FromUserId).attr('title', response.Ratings.Rating.toFixed(1) + ' de 5 (Clique para avaliar)').rateYo("option", "rating", response.Ratings.Rating.toFixed(10));
                        swal("Sucesso!", "Seu voto foi registrado.", "success");
                    }
                    $(event.target).html('<i class="fa fa-check"></i>&nbsp; Salvar').prop('disabled', false);
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                    $(event.target).html('<i class="fa fa-check"></i>&nbsp; Salvar').prop('disabled', false);
                    $('#ratingFormModal').modal('hide');
                    // }).always(function () {
                });
            });
        }

        self.messages = ko.observableArray();
        self.comments = ko.observableArray();

        // make view models available for apps
        return {
            messages: messages,
            comments: comments
        };

    }();

    ko.applyBindings(my.vm);
};