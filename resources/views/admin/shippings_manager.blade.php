@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <x-admin_header />
        @if (!$authorize)
            <h3>Bạn không có quyền quản lý đơn hàng</h3>
        @else
            <div class="container-md p-0">
                <div class="p-3 row row-cols-1 row-cols-md-4 sticky-top bg-light justify-content-between">
                    <div id="status-form" class="col-md-auto row">
                        <div class="col-md-auto">
                            <input checked type="radio" class="btnradio btn-check" name="btnradio" id="btnradio1"
                                value="-1">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng
                                <span class="badge bg-danger type" data-status="-1">{{ $Quantity['Total'] }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio2"value="0">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio2">Chờ xác nhận
                                <span class="badge bg-danger type" data-status="0">{{ $Quantity['Waiting'] }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio3" value="1">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio3">Đã xác nhận
                                <span class="badge bg-danger type" data-status="1">{{ $Quantity['Approved'] }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio4" value="2">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio4">Đã hủy
                                <span class="badge bg-danger type" data-status="2">{{ $Quantity['Canceled'] }}</span>
                            </label>
                        </div>
                        @if (session()->has('Employee'))
                            <div class="col-md-auto">
                                <button class="btn btn-info btn-sm" id="export">Xuất Excel</button>
                            </div>
                        @endif
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group">
                            <input type="text" class="form-control form-control-sm" placeholder="Mã đơn" id="search_id">
                            <i class="fa-solid fa-magnifying-glass text-light p-2 bg-primary"></i>
                        </div>
                    </div>
                </div>
                <div class="table-responsive" id="order-table">
                    @include('dynamic_layout.shipping_reload')
                </div>
            </div>
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
