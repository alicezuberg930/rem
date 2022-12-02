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
                            <input checked type="radio" class="btnradio btn-check" name="btnradio" id="btnradio3"
                                value="1">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio3">Đã xác nhận
                                <span class="badge bg-danger type" data-status="1">{{ $Quantity['Approved'] }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio4" value="3">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio4">Đang giao
                                <span class="badge bg-danger type" data-status="3">{{ $Quantity['Delivering'] }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio5" value="4">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio5">Đã giao
                                <span class="badge bg-danger type" data-status="4">{{ $Quantity['Delivered'] }}</span>
                            </label>
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
                url: "/admin/manage_shippings/status",
                method: "get",
                data: {
                    page: 1,
                    type: $('input[name=btnradio]:checked', '#status-form').val()
                },
                success: function(result) {
                    console.log(result);
                    $("#order-table").html(result);
                }
            })
        })
        $(document).on('click', '.checked-btn', function() {
            $.ajax({
                url: "/admin/manage_shippings/update_shipping_status",
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
        $(document).on('click', '.page-item', function() {
            $.ajax({
                url: "/admin/manage_shippings/paginate",
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
    </script>
@endsection
