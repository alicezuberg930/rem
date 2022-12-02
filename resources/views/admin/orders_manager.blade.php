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
                url: "/admin/manage_orders/status",
                method: "get",
                data: {
                    page: 1,
                    type: $('input[name=btnradio]:checked', '#status-form').val()
                },
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
                    type: $('input[name=btnradio]:checked', '#status-form').val(),
                    page: current_page
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
                    url: "/admin/manage_orders/search",
                    method: "get",
                    data: {
                        id: $(this).val(),
                        page: 1,
                        type: -1
                    },
                    success: function(result) {
                        console.log(result);
                        $("#order-table").html(result)
                    }
                })
            }
        });
        $(document).on('click', '.page-item', function() {
            current_page = $(this).text()
            $.ajax({
                url: "/admin/manage_orders/paginate/",
                method: "get",
                data: {
                    page: $(this).text(),
                    type: $('input[name=btnradio]:checked', '#status-form').val()
                },
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
