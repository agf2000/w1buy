'use strict';

$(() => {

    kendo.culture("pt-BR");
    kendo.culture().calendar.firstDay = 1;

    my.userInfo = JSON.parse(userInfo);

    function detailInit(e) {
        var detailRow = e.detailRow;

        // $.ajax({
        //     url: '/api/post?id=' + e.data.PostingId + '&userId=' + e.data.UserId
        // }).success(function (post) {
        //     if (post) {

        //     }
        // });
    }

    // Posts transport
    var postsTransport = {
        read: {
            url: '/admin/getPosts'
        },
        parameterMap: function (data, type) {
            return {
                portalId: 0
            };
        }
    };

    // Posts datasource
    var postsDataSource = new kendo.data.DataSource({
        transport: postsTransport,
        pageSize: 10,
        // serverPaging: true,
        // serverSorting: true,
        // serverFiltering: true,
        sort: {
            field: "Title",
            dir: "ASC"
        },
        schema: {
            model: {
                id: 'Title',
                fields: {
                    PostingId: {
                        editable: false,
                        nullable: false
                    },
                    ModifiedOnDate: {
                        type: "date",
                        format: "{0:MM/dd/yyyy}"
                    },
                    CreatedOnDate: {
                        type: "date",
                        format: "{0:dd/MM/yyyy}"
                    }
                }
            },
            data: 'postings',
            total: 'total'
        },
        // aggregate: [{
        //         field: "Locales",
        //         aggregate: "count"
        //     },
        //     {
        //         field: "CreatedOnDate",
        //         aggregate: "count"
        //     }
        // ]
    });

    $('#dataGrid').kendoGrid({
        autoBind: false,
        dataSource: postsDataSource,
        groupable: true,
        detailTemplate: kendo.template($("#tmplPost").html()),
        detailInit: detailInit,
        columns: [{
                field: "PostingId",
                title: "Cód.",
                width: 75
            },
            {
                field: "Title",
                title: "Título",
                template: '<a href="/anuncios/#= PostingId #/#= UserId #" target="_blank">#= Title #</a>'
            },
            {
                field: "PosterDisplayName",
                title: "Proprietário",
                template: "#= PosterDisplayName + ' - ' + PosterCity + '(' + PosterRegion + ')' #"
            },
            // {
            //     field: "Locales",
            //     title: "Local",
            //     width: 200,
            //     sortable: false,
            //     aggregates: ["count"],
            //     groupFooterTemplate: "#= kendo.toString(count, 'n0')  #"
            // },
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
                display: "{0} - {1} de {2} Anúncios",
                empty: "Sem Registro.",
                page: "Página",
                of: "de {0}",
                itemsPerPage: "Anúncios por vêz",
                first: "Ir para primeira página",
                previous: "Ir para página anterior",
                next: "Ir para próxima página",
                last: "Ir para última página",
                refresh: "Recarregar"
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

    // $('#btnGetPosts').click(function (e) {
    //     if (e.clientX === 0) {
    //         return false;
    //     }
    //     e.preventDefault();

    //     $.post('/admin/postsreport', function (data) { 

    //     });
    // });

});