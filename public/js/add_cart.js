$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
$(".card-quick-cart").click(function (e) {
    console.log( $(this).attr('data-id'));
    $.ajax({
        url: "/add_cart",
        method: "get",
        dataType: 'json',
        data: {
            "id": $(this).attr('data-id')
        },
        success: function (result) {
            $('.toast').toast('show')
            $('.toast-body').html(result.message)
            $('.toast').css('background-color', 'rgb(71, 201, 71)')
        }
    });
})