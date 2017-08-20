'use strict';

$(() => {

    // vscode-fold=1
    my.userInfo = JSON.parse(userInfo);

    function createUserDateChart() {
        $("#userDateChart").kendoChart({
            dataSource: {
                transport: {
                    read: {
                        url: "admin/getPeopleDate?year=2017"
                    }
                }
                // sort: {
                //     field: "Months",
                //     dir: "asc"
                // }
            },
            title: {
                align: "center",
                text: "Usuários / Mensal 2017"
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: "bar",
                labels: {
                    visible: true
                }
            },
            series: [{
                field: "quantity"
                // colorField: "userColor"
            }],
            valueAxis: {
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: true
                },
                labels: {
                    rotation: "auto"
                }
            },
            categoryAxis: {
                field: "months",
                majorGridLines: {
                    visible: false
                }
            }
        });
    };

    function createUserLocaleChart() {
        $("#userLocaleChart").kendoChart({
            dataSource: {
                transport: {
                    read: {
                        url: "admin/getPeopleLocales?year=2017"
                    }
                    // parameterMap: function (data, type) {
                    //     return {
                    //         sel: "set language brazilian; select convert(char(3), datename(month, createdondate), 0) as months, count(*) as quantity from w1buy_postings where year(createdondate) = '2017' group by convert(char(3), datename(month, createdondate), 0);"
                    //     };
                    // }
                }
                // sort: {
                //     field: "Months",
                //     dir: "asc"
                // }
            },
            title: {
                align: "center",
                text: "Usuários / Região 2017"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "pie",
                labels: {
                    visible: true
                }
            },
            series: [{
                field: "quantity",
                categoryField: "region"
                // colorField: "userColor"
            }],
            valueAxis: {
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: true
                },
                labels: {
                    rotation: "auto"
                }
            },
            categoryAxis: {
                field: "months",
                majorGridLines: {
                    visible: false
                }
            }
        });
    };

    function createPostDateChart() {
        $("#postDateChart").kendoChart({
            dataSource: {
                transport: {
                    read: {
                        url: "admin/getPostingsDate?year=2017"
                    }
                }
                // sort: {
                //     field: "Months",
                //     dir: "asc"
                // }
            },
            title: {
                align: "center",
                text: "Anúncios / Mensal 2017"
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: "bar",
                labels: {
                    visible: true
                }
            },
            series: [{
                field: "quantity"
                // colorField: "userColor"
            }],
            valueAxis: {
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: true
                },
                labels: {
                    rotation: "auto"
                }
            },
            categoryAxis: {
                field: "months",
                majorGridLines: {
                    visible: false
                }
            }
        });
    };

    function createPostLocaleChart() {
        $("#postLocaleChart").kendoChart({
            dataSource: {
                transport: {
                    read: {
                        url: "admin/getPostingsLocales?year=2017"
                    }
                    // parameterMap: function (data, type) {
                    //     return {
                    //         sel: "set language brazilian; select convert(char(3), datename(month, createdondate), 0) as months, count(*) as quantity from w1buy_postings where year(createdondate) = '2017' group by convert(char(3), datename(month, createdondate), 0);"
                    //     };
                    // }
                }
                // sort: {
                //     field: "Months",
                //     dir: "asc"
                // }
            },
            title: {
                align: "center",
                text: "Anúncios / Região 2017"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "pie",
                labels: {
                    visible: true
                }
            },
            series: [{
                field: "quantity",
                categoryField: "region"
                // colorField: "userColor"
            }],
            valueAxis: {
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: true
                },
                labels: {
                    rotation: "auto"
                }
            },
            categoryAxis: {
                field: "region",
                majorGridLines: {
                    visible: false
                }
            }
        });
    };

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

    $(document).bind("kendo:skinChange", createUserDateChart);

    createUserDateChart();
    createUserLocaleChart();
    createPostDateChart();
    createPostLocaleChart();

});