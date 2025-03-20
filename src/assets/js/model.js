$(document).ready(function() {
    $('.openModal').click(function() {
        var modalId = $(this).data('modal');
        $('#' + modalId).fadeIn();
    });

    $('.close').click(function() {
        $(this).closest('.modal').fadeOut();
    });

    $(window).click(function(event) {
        if ($(event.target).hasClass('modal')) {
            $(event.target).fadeOut();
        }
    });
});