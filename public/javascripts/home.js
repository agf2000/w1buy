'use strict'

$(() => {

    $('#btnStart').click((e) => {
        e.preventDefault();

        $('#myCarousel').carousel(4);
        $("#myCarousel").carousel("pause");
    });

    $('.btnStart').click((e) => {
        e.preventDefault();

        $('#loginModal').modal('show');

        window.setTimeout(function () {
            $('#login_username').focus();
        }, 1000);
    });

    let slider = $('#slider-pro').data('sliderPro');

    //triggered when modal is about to be shown
    $('#loginModal').on('show.bs.modal', function (e) {

        //get data-id attribute of the clicked element
        var firstChoice = $(e.relatedTarget).data('firstChoice');

        //populate the textbox
        $(e.currentTarget).find('input[name="firstChoice"]').val(firstChoice);
    });
});

function slideAction(action) {

    let slider = $('#slider-pro').data('sliderPro');

    switch (action) {
        case 'moveNext':
            slider.nextSlide();
            break;
        case 'moveBack':
            slider.previousSlide();
            break;
        case 'gotoSlide':
            slider.gotoSlide(3);
            break;
        default:
            break;
    };

};