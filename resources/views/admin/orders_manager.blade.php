@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <x-admin_header />
        @if (!$authorize)
            <h3>Bạn không có quyền quản lý đơn hàng</h3>
        @else
            @include('components.order_body')
        @endif
    </div>
    <script>
        let current_page = 1
        $(document).on('click', '.btnradio', function() {
            $.ajax({
                url: "/admin/manage_orders/status/1/" + $(this).val() + "/-1",
                method: "get",
                success: function(result) {
                    console.log(result);
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
                    type: $('input[name=btnradio]:checked', '#status-form').val(),
                    user_id: $(this).attr("data-user_id"),
                    page: current_page
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
                        page: 1,
                        user_id: -1
                    },
                    success: function(result) {
                        $("#order-table").html(result)
                    }
                })
            }
        });
        $(document).on('click', '.page-item', function() {
            current_page = $(this).text()
            $.ajax({
                url: "/admin/manage_orders/paginate/" + $(this).text() + "/" + $(
                    'input[name=btnradio]:checked', '#status-form').val() + "/-1",
                method: "get",
                success: function(result) {
                    $("#order-table").html(result)
                }
            })
        })
        $("#export").on('click', () => {
            $.ajax({
                url: "/admin/manage_orders/export",
                method: 'get',
                success: function(result) {
                    JSONToCSVConvertor(result, "orders_sheet", true)
                }
            })
        })
    </script>
@endsection
