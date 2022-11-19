<!DOCTYPE html>
<html>

<head>
    <x-head_tag />
    <title>Thông tin thanh toán</title>
</head>

<body class="bg-light">
    <style>
        .container {
            margin: 2rem auto;
        }

        .header {
            margin-bottom: 2rem;
            text-align: center;
            border-bottom: 1px solid grey;
        }

        .footer {
            border-top: 1px solid grey;
            text-align: center;
            margin-top: 7rem;
        }

        .form-group {
            margin-bottom: 0.4rem;
        }
    </style>
    <div class="container bg-light">
        <div class="card p-4 rounded-0 shadow container" style="width:35rem">
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
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Tổng tiền:</label>
                <div class="col-md-6">
                    <input type="text" class="form-control-plaintext" readonly
                        value="{{ number_format(session('orders')['total_price']) }} đ">
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Đơn hàng được gửi đến
                    email:</label>
                <div class="col-md-6">
                    <input type="text" class="form-control-plaintext" readonly
                        value="{{ session('orders')['email'] }}">
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Địa chỉ:</label>
                <div class="col-md-6">
                    <div class="text-wrap form-control-plaintext">{{ session('orders')['address'] }}</div>
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
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Ngày thanh
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
        <footer class="footer mt-5">
            <p>&copy; Trang web bán bật lửa zippo trực tuyến {!! date('Y') !!}</p>
        </footer>
    </div>
</body>

</html>
