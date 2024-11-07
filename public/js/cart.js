$(document).on('click', '.minus-btn', function (e) {
    let id = $(this).attr('data-id')
    $.ajax({
        url: "decrease_incart",
        method: "GET",
        dataType: 'json',
        data: {
            "id": id
        },
        success: function (result) {
            if (result.status == 1)
                $("#cart-table").html(result.response)
            if (result.status == 0) {
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                $('.toast').css('background-color', 'rgb(239, 73, 73)')
            }
        }
    });
})

$(document).on('click', '.plus-btn', function (e) {
    let id = $(this).attr('data-id')
    $.ajax({
        url: "increase_incart",
        method: "GET",
        dataType: 'json',
        data: {
            "id": id
        },
        success: function (result) {
            if (result.status == 1)
                $("#cart-table").html(result.response)
            if (result.status == 0) {
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                $('.toast').css('background-color', 'rgb(239, 73, 73)')
            }
        }
    });
})

$(document).on('click', '.remove-cart', function () {
    let id = $(this).attr('data-id')
    $.ajax({
        url: "remove_cart",
        method: "get",
        dataType: 'json',
        data: {
            "id": id
        },
        success: function (result) {
            $("#cart-table").html(result.response)
            $('.toast').toast('show')
            $('.toast-body').html(result.message + " " + result.id)
        }
    });
})

$("#pay-options").on('change', function () {
    if ($(this).val() == "COD")
        $("#payment").attr('action', "/direct_payment")
    if ($(this).val() == "VNPAY")
        $("#payment").attr('action', "/vnpay_payment")
})

$(document).on('keypress', '.cart-quantity', function (e) {
    let id = $(this).attr('data-id')
    console.log(id);
    if (e.which == 13) {
        $.ajax({
            url: "/set_quantity",
            method: "get",
            dataType: 'json',
            data: {
                "id": id,
                "quantity": $(this).val()
            },
            success: function (result) {
                console.log(result);
                if (result.status == 1)
                    $("#cart-table").html(result.response)
                if (result.status == 0) {
                    $('.toast').toast('show')
                    $('.toast-body').html(result.message)
                    $('.toast').css('background-color', 'rgb(239, 73, 73)')
                }
            }
        });
    }
});