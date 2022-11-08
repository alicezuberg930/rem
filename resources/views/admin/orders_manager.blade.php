@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <div class="container-md p-0">
            <div class="p-3 row row-cols-1 row-cols-md-4 sticky-top bg-light justify-content-between">
                <div class="col-md-auto row">
                    <div class="col-md-auto">
                        <input checked type="radio" class="btnradio btn-check" name="btnradio" id="btnradio1"
                            autocomplete="off" value="-1">
                        <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng<span class="badge bg-danger"
                                id="badge_tongdon">14</span>
                        </label>
                    </div>
                    <div class="col-md-auto">
                        <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio2" autocomplete="off"
                            value="0"><label class="btn btn-outline-primary btn-sm" for="btnradio2">Chờ xác nhận
                            <span class="badge bg-danger" id="badge_tongdon">14</span></label>
                    </div>
                    <div class="col-md-auto">
                        <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio3" autocomplete="off"
                            value="1"><label class="btn btn-outline-primary btn-sm" for="btnradio3">Đã xác nhận
                            <span class="badge bg-danger" id="badge_tongdon">14</span></label>
                    </div>
                    <div class="col-md-auto">
                        <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio4" autocomplete="off"
                            value="2"><label class="btn btn-outline-primary btn-sm" for="btnradio4">Đã hủy
                            <span class="badge bg-danger" id="badge_tongdon">14</span></label>
                    </div>
                </div>

                <div class="col-md-auto">
                    <div class="input-group">
                        <input type="text" class="form-control form-control-sm" placeholder="Mã đơn" id="search_id">
                        <button class="btn btn-sm btn-primary" type="button"
                            onclick="searched(this.parentElement)">Tìm</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive" id="quanlydonhang">
                @include('dynamic_layout.order_reload')
            </div>
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" class="toast text-bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">Cập nhật đơn hàng thành công</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                            aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="order-details">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Thông tin chi tiết đơn hàng</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã hóa đơn</th>
                                <th>Số sản phẩm</th>
                                <th>Giá sản phẩm</th>

                            </tr>
                        </thead>
                        <tbody id="order-details-body"></tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Thoát</button>
                    <button type="button" class="btn btn-info" id="export-details" onclick="window.print()">Xuất chi
                        tiết</button>
                </div>
            </div>
        </div>
        <script>
            $(document).on('click', '.checked-btn', function() {
                $.ajax({
                    url: "/admin/manage_orders/update_order_status",
                    method: "get",
                    data: {
                        id: $(this).attr("data-id"),
                        status: $(this).attr("data-status")
                    },
                    success: function(result) {
                        $("#quanlydonhang").html(result.response);
                    }
                })
            })
        </script>
    @endsection
