<!DOCTYPE html>
<html lang="en">

<head>
    <<x-head_tag />
    <title></title>
</head>

<body>
    @include('components.order_body')
</body>
<script>
    $(document).on('click', '.btnradio', function() {
        $.ajax({
            url: "/admin/manage_orders/status/1/" + $(this).val(),
            method: "get",
            success: function(result) {
                $("#order-table").html(result);
            }
        })
    })

    $('#search_id').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $.ajax({
                url: "/admin/manage_orders/search",
                method: "get",
                data: {
                    id: $(this).val(),
                    page: "{{ $currentpage }}"
                },
                success: function(result) {
                    $("#order-table").html(result)
                }
            })
        }
    });

    $(document).on('click', '.page-item', function() {
        $.ajax({
            url: "/admin/manage_orders/paginate/" + {{ $currentpage }} + "/" + $(
                'input[name=btnradio]:checked', '#status-form').val(),
            method: "get",
            success: function(result) {
                $("#order-table").html(result)
            }
        })
    })
</script>

</html>
