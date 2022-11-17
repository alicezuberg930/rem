<!DOCTYPE html>
<html>

<head>
    <x-head_tag />
    <title>Thông tin thanh toán</title>
</head>

<body class="bg-light">
    <div class="container bg-light">
        <div class="p-1">
            <div class="m-auto card p-4 rounded-0 shadow" style="width:35rem">
                <div class="header clearfix">
                    <h2 class="text-muted">Thông tin giao dịch</h2>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Mã đơn hàng:</label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext" value="{{ $vnp_TxnRef }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Tổng số tiền:</label>
                    <div class="col-md-6">
                        <input type="text" class="form-control-plaintext" readonly
                            value="{{ number_format(session('orders')['total_price']) }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Nội dung thanh
                        toán:</label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext" value="{{ $vnp_OrderInfo }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Mã phản hồi:</label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext" value="{{ $vnp_ResponseCode }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Mã giao dịch VNPAY:</label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext" value="{{ $vnp_TransactionNo }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Mã Ngân hàng:</label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext" value="{{ $vnp_BankCode }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Thời gian thanh
                        toán:</label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext"
                            value="{{ date('d-m-Y h:i:s', strtotime($vnp_PayDate)) }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Người thanh toán:</label>
                    <div class="col-md-6">
                        <input type="text" class="form-control-plaintext" readonly
                            value="{{ session('orders')['fullname'] }}">
                    </div>
                </div>
                <div class="mb-2 row">
                    <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Kết quả: </label>
                    <div class="col-md-6">
                        <input type="text" readonly class="form-control-plaintext {!! $vnp_ResponseCode == '00' ? 'text-success fw-bold' : 'text-danger fw-bold' !!}"
                            value="{{ $Result }}">
                    </div>
                </div>
                <a href="/" class="btn btn-primary rounded-0">Quay lại trang chủ</a>
            </div>
        </div>
        <footer class="footer mt-5">
            <p>&copy; Trang web bán bật lửa zippo trực tuyến {!! date('Y') !!}</p>
        </footer>
    </div>
</body>

</html>
