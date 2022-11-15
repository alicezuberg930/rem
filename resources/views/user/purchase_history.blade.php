<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Quản lý đơn hàng</title>
</head>

<body>
    <x-header />
    @include('components.order_body')
    <x-footer />
    <x-toast />
</body>
<script>
    $(document).on('click', '.btnradio', function() {
        $.ajax({
            url: "/user/manage_orders/status/1/" + $(this).val() + "/" +
                "{{ session()->get('UserID') }}",
            method: "get",
            success: function(result) {
                $("#order-table").html(result);
            }
        })
    })

    $(document).on('click', '.checked-btn', function() {
        $.ajax({
            url: "/user/manage_orders/update_order_status",
            method: "get",
            data: {
                id: $(this).attr("data-id"),
                status: $(this).attr("data-status"),
                type: $('input[name=btnradio]:checked', '#status-form').val(),
                user_id: $(this).attr("data-user_id")
            },
            success: function(result) {
                $("#order-table").html(result.response);
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                if (result.status == 1)
                    $('.toast').css('background-color', 'rgb(71, 201, 71)')
                else
                    $('.toast').css('background-color', 'rgb(239, 73, 73)')
            }
        })
    })

    $('#search_id').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $.ajax({
                url: "/user/manage_orders/search",
                method: "get",
                data: {
                    id: $(this).val(),
                    page: "{{ $currentpage }}",
                    user_id: "{{ session()->get('UserID') }}"
                },
                success: function(result) {
                    $("#order-table").html(result)
                }
            })
        }
    });

    $(document).on('click', '.page-item', function() {
        $.ajax({
            url: "/user/manage_orders/paginate/" + {{ $currentpage }} + "/" + $(
                    'input[name=btnradio]:checked', '#status-form').val() + "/" +
                "{{ session()->get('UserID') }}",
            method: "get",
            success: function(result) {
                $("#order-table").html(result)
            }
        })
    })
</script>

</html>
