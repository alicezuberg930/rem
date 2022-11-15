function AddCart(element) {
    element.click(function (e) {
        let text = $(this).children().eq(1);
        $.ajax({
            url: "/add_cart",
            method: "get",
            dataType: 'json',
            data: {
                "id": $(this).attr('data-id')
            },
            success: function (result) {
                if (result.status == 1) {
                    text.text('Đã thêm vào giỏ')
                    $('.toast').toast('show')
                    $('.toast-body').html(result.message)
                    $('.toast').css('background-color', 'rgb(71, 201, 71)')
                    $("#cart-count").html(result.count)
                }
            }
        });
    })
}

AddCart($(".card-quick-cart"))
AddCart($(".add-cart"))