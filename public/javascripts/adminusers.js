'use strict';

$(() => {

    kendo.culture("pt-BR");
    kendo.culture().calendar.firstDay = 1;

    my.userInfo = JSON.parse(userInfo);

    function detailInit(e) {
        var detailRow = e.detailRow;

        if (e.data.CountryId) {
            e.detailRow.find('#' + e.data.UserID + '_select2Countries').append($('<option value="' + e.data.CountryId + '" selected>' + e.data.Country + '</option>'));
            e.detailRow.find('#' + e.data.UserID + '_select2Countries').trigger("change");
        }
        if (e.data.RegionId) {
            e.detailRow.find('#' + e.data.UserID + '_select2Regions').append($('<option value="' + e.data.RegionId + '" selected>' + (e.data.Region ? my.getStateName(e.data.Region) : '') + '</option>'));
            e.detailRow.find('#' + e.data.UserID + '_select2Regions').trigger("change");
        }
        if (e.data.CityId) {
            e.detailRow.find('#' + e.data.UserID + '_select2Cities').append($('<option value="' + e.data.CityId + '" selected>' + e.data.City + '</option>'));
            e.detailRow.find('#' + e.data.UserID + '_select2Cities').trigger("change");
        }

        e.detailRow.find('#' + e.data.UserID + '_txtTelephone').mask('(00) 0000-0000');
        e.detailRow.find('#' + e.data.UserID + '_txtCell').mask('(00) 00000-0000');
        e.detailRow.find('#' + e.data.UserID + '_txtBoxPostalCode').mask('00000-000');
        e.detailRow.find('#' + e.data.UserID + '_txtSSN').mask('000.000.000-00');

        e.detailRow.find('#' + e.data.UserID + '_select2Countries').select2({
            placeholder: 'Selecione seu país de origem',
            language: "pt-BR",
            theme: "bootstrap",
            ajax: {
                url: '/api/lists',
                dataType: 'json',
                data: function (params) {
                    return {
                        term: params.term,
                        listname: 'country',
                        pageIndex: params.page,
                        pageSize: 10,
                        sortCol: 'Text',
                        sortOrder: 'ASC'
                    };
                },
                processResults: function (data, page) {

                    let results = [];

                    $.each(data.list, function (i, v) {
                        let o = {};
                        o.id = v.EntryID;
                        o.name = v.Text;
                        o.value = v.Value;
                        results.push(o);
                    });

                    return {
                        results: results
                    };
                },
                cache: true
            },
            minimumInputLength: 1,
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: function format(repo) {
                if (repo.loading) return repo.text;
                let markup = '<option value="' + repo.value + '">' + repo.name + '</option>'
                return markup;
            },
            templateSelection: function (people) {
                return people.name || people.text;
            }
        });

        e.detailRow.find('#' + e.data.UserID + '_select2Regions').select2({
            placeholder: 'Selecione o estado',
            language: "pt-BR",
            theme: "bootstrap",
            ajax: {
                url: '/api/lists',
                dataType: 'json',
                data: function (params) {
                    return {
                        term: params.term,
                        listname: 'region',
                        parentId: e.detailRow.find('#' + e.data.UserID + '_select2Countries').select2('data')[0].id || (my.CountryId || 29),
                        pageIndex: params.page,
                        pageSize: 10,
                        sortCol: 'Text',
                        sortOrder: 'ASC'
                    };
                },
                processResults: function (data, page) {

                    let results = [];

                    $.each(data.list, function (i, v) {
                        let o = {};
                        o.id = v.EntryID;
                        o.name = v.Text;
                        o.value = v.Value;
                        results.push(o);
                    });

                    return {
                        results: results
                    };
                },
                cache: true
            },
            minimumInputLength: 1,
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: function format(repo) {
                if (repo.loading) return repo.text;
                let markup = '<option value="' + repo.value + '">' + repo.name + '</option>'
                return markup;
            },
            templateSelection: function (people) {
                return people.name || people.text;
            }
        });

        e.detailRow.find('#' + e.data.UserID + '_select2Regions').on("select2:select", function (ele) {
            if (e.detailRow.find('#' + e.data.UserID + '_select2Regions').val() !== null) {
                $.getJSON('/api/lists?listname=city&parentId=' + e.detailRow.find('#' + e.data.UserID + '_select2Regions').select2('data')[0].id, function (data) {
                    if (data) {
                        if (data.list.length > 0) {
                            e.detailRow.find('#' + e.data.UserID + '_txtCity').prop("disabled", true).hide();
                            e.detailRow.find('#' + e.data.UserID + '_select2Cities').prop("disabled", false);
                            e.detailRow.find('#' + e.data.UserID + '_select2Cities').show();
                        } else {
                            e.detailRow.find('#' + e.data.UserID + '_select2Cities').prop("disabled", true);
                            e.detailRow.find('#' + e.data.UserID + '_txtCity').prop("disabled", false).show();
                            e.detailRow.find('#' + e.data.UserID + '_select2Cities').hide();
                        }
                    }
                });
                e.detailRow.find('#' + e.data.UserID + '_select2Cities').select2('open');
            }
        });

        e.detailRow.find('#' + e.data.UserID + '_select2Cities').select2({
            placeholder: 'Selecione a cidade',
            language: "pt-BR",
            theme: "bootstrap",
            ajax: {
                url: '/api/lists',
                dataType: 'json',
                data: function (params) {
                    return {
                        term: params.term,
                        listname: 'city',
                        parentId: e.detailRow.find('#' + e.data.UserID + '_select2Regions').select2('data')[0].id || my.userInfo.RegionId,
                        pageIndex: params.page,
                        pageSize: 10,
                        sortCol: 'Text',
                        sortOrder: 'ASC'
                    };
                },
                processResults: function (data, page) {

                    let results = [];

                    $.each(data.list, function (i, v) {
                        let o = {};
                        o.id = v.EntryID;
                        o.name = v.Text;
                        o.value = v.Value;
                        results.push(o);
                    });

                    return {
                        results: results
                    };
                },
                cache: true
            },
            minimumInputLength: 1,
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: function format(repo) {
                if (repo.loading) return repo.text;
                let markup = '<option value="' + repo.value + '">' + repo.name + '</option>'
                return markup;
            },
            templateSelection: function (people) {
                return people.name || people.text;
            }
        });

        e.detailRow.find('#' + e.data.UserID + '_select2Cities').on("select2:select", function (ele) {
            e.detailRow.find('#' + e.data.UserID + '_txtBoxStreet').focus();
        });

        e.detailRow.find('#' + e.data.UserID + '_btnPostalCode').click(function (ele) {
            if (ele.clientX === 0) {
                return false;
            }
            ele.preventDefault();

            let $this = $(this);

            if (e.detailRow.find('#' + e.data.UserID + '_txtBoxPostalCode').val().length > 0) {
                $this.attr('disabled', true);

                $.ajax({
                    url: '/api/address?postalCode=' + e.detailRow.find('#' + e.data.UserID + '_txtBoxPostalCode').val().replace(/[^\/\d]/g, '')
                }).done(function (data) {
                    if (!data.error) {
                        let address = data.address[0];
                        e.detailRow.find('#' + e.data.UserID + '_select2Countries').append($('<option value="' + address.countryid + '" selected>' + address.country + '</option>'));
                        e.detailRow.find('#' + e.data.UserID + '_select2Countries').trigger("change");

                        e.detailRow.find('#' + e.data.UserID + '_select2Regions').append($('<option value="' + address.regionid + '" selected>' + address.region + '</option>'));
                        e.detailRow.find('#' + e.data.UserID + '_select2Regions').trigger("change");

                        e.detailRow.find('#' + e.data.UserID + '_select2Cities').append($('<option value="' + address.cityid + '" selected>' + address.city + '</option>'));
                        e.detailRow.find('#' + e.data.UserID + '_select2Cities').trigger("change");

                        e.detailRow.find('#' + e.data.UserID + '_txtBoxStreet').val(address.street);
                        e.detailRow.find('#' + e.data.UserID + '_txtBoxDistrict').val(address.district);

                        e.detailRow.find('#' + e.data.UserID + '_txtAddressNumber').focus();
                    } else {

                        $.ajax({
                            url: 'https://viacep.com.br/ws/' + e.detailRow.find('#' + e.data.UserID + '_txtBoxPostalCode').val().replace(/[^\/\d]/g, '') + '/json/'
                        }).done(function (data1) {
                            if (!data1.erro) {
                                e.detailRow.find('#' + e.data.UserID + '_select2Countries').append($('<option value="29" selected>Brazil</option>'));
                                e.detailRow.find('#' + e.data.UserID + '_select2Countries').trigger("change");

                                e.detailRow.find('#' + e.data.UserID + '_select2Regions').append($('<option value="' + my.getStateName(data1.uf) + '" selected>' + my.getStateName(data1.uf) + '</option>'));
                                e.detailRow.find('#' + e.data.UserID + '_select2Regions').trigger("change");

                                e.detailRow.find('#' + e.data.UserID + '_select2Cities').append($('<option value="' + data1.localidade + '" selected>' + data1.localidade + '</option>'));
                                e.detailRow.find('#' + e.data.UserID + '_select2Cities').trigger("change");

                                e.detailRow.find('#' + e.data.UserID + '_txtBoxStreet').val(data1.logradouro);
                                e.detailRow.find('#' + e.data.UserID + '_txtBoxDistrict').val(data1.bairro);

                                e.detailRow.find('#' + e.data.UserID + '_txtAddressNumber').focus();
                            } else {
                                let notice2 = new PNotify({
                                    title: 'Atenção!',
                                    text: 'Erro ao tentar buscar o CEP. O CEP não existe ou o serivço opcional ViaCEP talvez não esteja disponível no momento.',
                                    type: 'error',
                                    addclass: 'stack-bottomright',
                                    stack: my.stack_bottomright
                                });
                                notice2.get().click(function () {
                                    notice2.remove();
                                });
                            }
                        }).fail(function (jqXHR, textStatus) {
                            console.log(jqXHR.responseText);
                            let notice3 = new PNotify({
                                title: 'Atenção!',
                                text: 'Erro ao tentar completar a ação.',
                                type: 'error',
                                animation: 'none',
                                addclass: 'stack-bottomright',
                                stack: my.stack_bottomright
                            });
                            notice3.get().click(function () {
                                notice3.remove();
                            });
                        }).always(function () {
                            $this.attr('disabled', false);
                        });
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                    let notice4 = new PNotify({
                        title: 'Atenção!',
                        text: 'Erro ao tentar completar a ação.',
                        type: 'error',
                        animation: 'none',
                        addclass: 'stack-bottomright',
                        stack: my.stack_bottomright
                    });
                    notice4.get().click(function () {
                        notice4.remove();
                    });
                }).always(function () {
                    $this.attr('disabled', false);
                });
            }
        });

        e.detailRow.find('#' + e.data.UserID + '_btnUpdateUser').click(function (ele) {
            if (ele.clientX === 0) {
                return false;
            }
            ele.preventDefault();

            let $this = $(this);

            $this.html("Um momento...").prop('disabled', true);

            let params = {
                portalId: 0,
                userId: e.data.UserID,
                firstName: e.detailRow.find('#' + e.data.UserID + '_txtFirstName').val().trim(),
                lastName: e.detailRow.find('#' + e.data.UserID + '_txtLastName').val().trim(),
                displayName: e.detailRow.find('#' + e.data.UserID + '_txtDisplayName').val().trim(),
                country: e.detailRow.find('#' + e.data.UserID + '_select2Countries').select2('data')[0].id,
                region: e.detailRow.find('#' + e.data.UserID + '_select2Regions').select2('data')[0].id,
                city: e.detailRow.find('#' + e.data.UserID + '_select2Cities').select2('data')[0].id,
                street: e.detailRow.find('#' + e.data.UserID + '_txtBoxStreet').val().trim(),
                streetNumber: e.detailRow.find('#' + e.data.UserID + '_txtAddressNumber').val().trim(),
                district: e.detailRow.find('#' + e.data.UserID + '_txtBoxDistrict').val().trim(),
                postalCode: e.detailRow.find('#' + e.data.UserID + '_txtBoxPostalCode').val().replace(/[^\/\d]/g, ''),
                telephone: e.detailRow.find('#' + e.data.UserID + '_txtTelephone').val(),
                cell: e.detailRow.find('#' + e.data.UserID + '_txtCell').val(),
                docId: e.detailRow.find('#' + e.data.UserID + '_txtSSN').val().trim(),
                lastModifiedByUserId: e.data.UserID,
                lastModifiedOnDate: moment().format('YYYY-MM-DD HH:mm')
            };

            $.ajax({
                type: 'PUT',
                url: '/api/updatePerson',
                data: params
            }).done(function (data) {
                if (!data.error) {
                    swal({
                        title: "Sucesso!",
                        text: "Cadastro atualizado.",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        timer: 2000
                    }).then(
                        function () {},
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                console.log('I was closed by the timer')
                            }
                        }
                    );
                }
            }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR.responseText);
            }).always(function () {
                $this.html('Atualizar').prop('disabled', false);
            });
        });
    };

    // Users transport
    var usersTransport = {
        read: {
            url: '/admin/getPeople'
        },
        parameterMap: function (data, type) {
            return {
                portalId: 0
            };
        }
    };

    // Users datasource
    var usersDataSource = new kendo.data.DataSource({
        transport: usersTransport,
        pageSize: 10,
        sort: {
            field: "DisplayName",
            dir: "ASC"
        },
        schema: {
            model: {
                id: 'DisplayName',
                fields: {
                    UserID: {
                        editable: false,
                        nullable: false
                    },
                    LastModifiedOnDate: {
                        type: "date",
                        format: "{0:MM/dd/yyyy}"
                    },
                    CreatedOnDate: {
                        type: "date",
                        format: "{0:dd/MM/yyyy}"
                    }
                }
            },
            data: 'users',
            total: 'total'
        }
    });

    $('#dataGrid').kendoGrid({
        autoBind: false,
        dataSource: usersDataSource,
        groupable: true,
        detailTemplate: kendo.template($("#tmplUser").html()),
        detailInit: detailInit,
        columns: [{
                field: "UserID",
                title: "Cód.",
                width: 75
            },
            {
                field: "FirstName",
                title: "Nome"
            },
            {
                field: "LastName",
                title: "Sobrenome"
            },
            {
                field: "Email",
                title: "Email"
            },
            {
                field: "CreatedOnDate",
                title: "Cadastrado Em",
                width: 170,
                format: '{0:g}'
            }
        ],
        sortable: {
            allowUnsort: true
        },
        pageable: {
            pageSizes: [10, 40, 70, 100],
            refresh: true,
            numeric: false,
            input: true,
            messages: {
                display: "{0} - {1} de {2} Usuários",
                itemsPerPage: "Usuários por vêz"
            }
        }
    });

    if (my.userInfo.Roles != undefined) {
        var match = my.userInfo.Roles.find(function (item) {
            let result = false;
            if (item.rolename == 'Administrators') {
                result = true;
            };
            return result;
        });

        if (match) {
            $('#dataGrid').data('kendoGrid').dataSource.read();
        } else {
            window.location.href = '/';
        }
    }

    if (window.location.pathname !== '/contas/minhaconta') {
        if (my.userInfo.Roles != undefined) {
            var match = my.userInfo.Roles.find(function (item) {
                let result = false;
                if (item.rolename == 'Administrators') {
                    result = true;
                };
                return result;
            });

            if (match) {
                $('a[href="/admin/anuncios"]').removeClass('hidden');
                $('a[href="/admin/usuarios"]').removeClass('hidden');

                if (!$('a[href="/contas/meusanuncios"]').hasClass('hidden')) {
                    $('a[href="/contas/meusanuncios"]').addClass('hidden');
                }

                if (!$('a[href="/contas/mensagens"]').hasClass('hidden')) {
                    $('a[href="/contas/mensagens"]').addClass('hidden');
                }
            }
        }
    } else {
        if (my.userInfo.Roles != undefined) {
            var match = my.userInfo.Roles.find(function (item) {
                let result = false;
                if (item.rolename == 'Administrators') {
                    result = true;
                };
                return result;
            });

            if (match) {
                $('a[href="/admin"]').removeClass('hidden');
                $('a[href="/admin/anuncios"]').removeClass('hidden');
                $('a[href="/admin/usuarios"]').removeClass('hidden');

                if (!$('a[href="/contas/meusanuncios"]').hasClass('hidden')) {
                    $('a[href="/contas/meusanuncios"]').addClass('hidden');
                }

                if (!$('a[href="/contas/mensagens"]').hasClass('hidden')) {
                    $('a[href="/contas/mensagens"]').addClass('hidden');
                }

                if (!$('#usersHome').hasClass('hidden')) {
                    $('#usersHome').addClass('hidden');
                }

            }
        }
    }

});

let validateCpf = function (ele) {
    let cpfEle = $(ele);
    if (!my.validaCPF(cpfEle.val())) {
        swal({
            title: "Atenção!",
            text: "O CPF inserido não parece ser válido. Por favor corrija antes de prosseguir.",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: "Ok",
            allowOutsideClick: false
        }).then(function () {
            cpfEle.focus();
        });


    }
};