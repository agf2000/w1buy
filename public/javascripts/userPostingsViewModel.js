my.viewModel = function () {

    my.Posting = function (data) {
        var self = this;
        data = data || {};

        self.ownerId = data.UserId;
        self.postingId = data.PostingId;
        self.title = data.Title;
        self.description = data.PostingDescription;
        self.complete = data.Complete;
        self.keywords = data.Keywords;
        self.locales = JSON.parse(data.Locales.replace(/\,(?!\s*[\{\[\"\'\w])/g, ''));
        self.expiryDate = data.ExpiryDate;
        self.createdOnDate = data.CreatedOnDate;

        self.postingType = ko.computed(function () {
            return data.PostingType === '1' ? 'Mercadoria' : 'Serviços';
        });

        self.condition = data.PostingCondition;
        self.priorityValue = data.PriorityValue;
        self.priorityDelivery = data.PriorityDelivery;
        self.priorityPlace = data.PriorityPlace;
        // self.imageUrl = data.ImageUrl || '';

        if (data.Files) {
            self.files = JSON.parse(data.Files.replace(/\,(?!\s*[\{\[\"\'\w])/g, ''));
            ko.utils.arrayForEach(self.files, function (item) {
                item.FileName = item.FileName.replace(/(\.[\w\d_-]+)$/i, '_thumb$1');
            });
        } else {
            self.files = null;
        }

        self.locked = data.Locked;

        self.deletePost = function (index, data, e) {
            if (e.clientX === 0) {
                return false;
            }
            e.preventDefault();

            swal({
                title: 'Tem certeza?',
                text: "Todos os dados relacionados a este anuncio serão excluido.",
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sim, quero excluir!",
                cancelButtonText: "Não, cancele!"
            }).then(function (isConfirm) {
                if (isConfirm === true) {
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/removePosting?postingId=' + data.postingId
                    }).done(function (data) {
                        if (!data.error) {
                            my.vm.postings.remove(function (remove) {
                                return remove.postingId == self.postingId;
                            });
                            swal("Excluido!", "Anúncio excluido com sucesso!.", "success");
                        } else {
                            swal("Erro ao tentar excluir o anúncio!", "Favor entrar em contato com o administrador do sistema.", "error");
                        }
                    }).fail(function (jqXHR, textStatus) {
                        console.log(jqXHR.responseText);
                    });
                } else {
                    swal("Cancelado", "O Anúncio não foi excluido.", "info");
                }
            });
        };

        self.openImages = function (data, e) {
            if (e.clientX === 0) {
                return false;
            }
            e.preventDefault();

            let imagePath = $(e.target).prop('src').replace('thumbnail', 'large');
            imagePath = imagePath.replace('_thumb', '');

            $("#galleryModal #imagePath").attr({
                "src": imagePath
            });

            $('#galleryModal').modal('show');

            // BootstrapDialog.show({
            //     //size: BootstrapDialog.SIZE_WIDE,
            //     //type: BootstrapDialog.TYPE_PRIMARY,
            //     title: 'Imagem',
            //     message: $('<a href="/uploads/' + data.UserId + '/' + data.filename + '" target="_blank"><img src="/uploads/' + data.UserId + '/' + data.filename + '" /></a>'),
            //     buttons: [{
            //         label: 'Fechar',
            //         cssClass: 'btn-default',
            //         action: function (dialogRef) {
            //             dialogRef.close();
            //         }
            //     }]
            // });
        };
    };

    // knockout js view model
    my.vm = function () {
        // this is knockout view model
        var self = this;

        self.localesQtyCount = ko.observable(0),
            self.postings = ko.observableArray([]),
            self.soldPostings = ko.dependentObservable(function () {
                return ko.utils.arrayFilter(self.postings(), function (item) {
                    return ko.utils.arrayFilter([item.complete], function (condition) {
                        return condition == true;
                    }).length > 0;
                });
            }, self),
            self.activePostings = ko.dependentObservable(function () {
                return ko.utils.arrayFilter(self.postings(), function (item) {
                    return ko.utils.arrayFilter([item.complete], function (condition) {
                        return condition != true;
                    }).length > 0;
                });
            }, self),
            self.localeCounter = ko.observable(0);

        // make view models available for apps
        return {
            localesQtyCount: localesQtyCount,
            postings: postings,
            soldPostings: soldPostings,
            activePostings: activePostings,
            localeCounter: localeCounter
        };

    }();

    ko.applyBindings(my.vm);
};