<div class="container-md p-0">
    <div class="p-3 row row-cols-1 row-cols-md-4 sticky-top bg-light justify-content-between">
        <div id="status-form" class="col-md-auto row">
            <div class="col-md-auto">
                <input checked type="radio" class="btnradio btn-check" name="btnradio" id="btnradio1" value="-1">
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
            <div class="col-md-auto">
                <input type="radio" class="btnradio btn-check" name="btnradio" id="btnradio6" value="2">
                <label class="btn btn-outline-primary btn-sm" for="btnradio6">Đã hủy
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
        @include('dynamic_layout.order_reload')
    </div>
</div>
