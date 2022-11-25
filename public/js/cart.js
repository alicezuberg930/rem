$(document).on('change', '#city-select', function () {
    let id = $(this).find(':selected').attr('data-id')
    let district = document.getElementById('district-select');
    let ward = document.getElementById('ward-select');
    $.ajax({
        url: "/cart/get_district",
        method: "GET",
        dataType: 'json',
        data: {
            "id": id
        },
        success: function (result) {
            district.length = 1;
            ward.length = 1;
            for (var i = 0; i < result.length; i++) {
                district.add(new Option(result[i]['name'], result[i]['name'] + '-' + result[i][
                    'code'
                ]));
            }
        }
    });
})

$(document).on('change', '#district-select', function () {
    let id = $(this).find(':selected').val().split('-')[1]
    let ward = document.getElementById('ward-select');
    $.ajax({
        url: "/cart/get_ward",
        method: "GET",
        dataType: 'json',
        data: {
            "id": id
        },
        success: function (result) {
            ward.length = 1;
            for (var i = 0; i < result.length; i++) {
                ward.add(new Option(result[i]['name'], result[i]['name'] + '-' + result[i][
                    'code'
                ]));
            }
        }
    });
})

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