@extends('admin.adminpage')
@section('body_manager')
    @include('components.order_body')
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

        $(document).on('click', '.checked-btn', function() {
            $.ajax({
                url: "/admin/manage_orders/update_order_status",
                method: "get",
                data: {
                    id: $(this).attr("data-id"),
                    status: $(this).attr("data-status"),
                    type: $('input[name=btnradio]:checked', '#status-form').val()
                },
                success: function(result) {
                    $("#order-table").html(result.response);
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
@endsection
