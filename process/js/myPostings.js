'use sctrict'

$(function () {

    $('[data-toggle="tooltip"]').tooltip();

    // viewModel plus get user postings
    // vscode-fold=1
    my.viewModel();

    $.ajax({
        url: '/api/getUserPostings?userId=' + my.userInfo.UserID
    }).success(function (data) {
        if (data) {
            var mappedPosts = $.map(data, function (item) {
                return new my.Posting(item);
            });
            my.vm.postings(mappedPosts);
        }

        $('[data-toggle="tooltip"]').tooltip();
    });

    // Carousel configuration
    // vscode-fold=2
    $(".carousel").swipe({

        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {

            if (direction == 'right') $(this).carousel('prev');

            if (direction == 'left') $(this).carousel('next');

        },
        threshold: 0,
        allowPageScroll: "vertical"
    });

});