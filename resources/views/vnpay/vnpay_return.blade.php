<!DOCTYPE html>
<html>

<head>
    <title>Thông tin thanh toán</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
</head>

<body>
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
    <div class="container">
        <div class="header clearfix">
            <h2 class="text-muted">Thông tin hóa đơn</h2>
        </div>
        <div class="table-responsive">
            <div class="form-group">
                <label class="form-control">Mã đơn hàng: {{ $vnp_TxnRef }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Tổng số tiền: {{ number_format(session('orders')['vnp_Amount']) }}
                    VNĐ</label>
            </div>
            <div class="form-group">
                <label class="form-control">Nội dung thanh toán: {{ $vnp_OrderInfo }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Mã phản hồi: {{ $vnp_ResponseCode }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Mã giao dịch của VNPAY: {{ $vnp_TransactionNo }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Mã Ngân hàng: {{ $vnp_BankCode }} </label>
            </div>
            <div class="form-group">
                <label class="form-control">Thời gian thanh toán:
                    {{ date('d-m-Y h:i:s', strtotime($vnp_PayDate)) }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Người thanh toán: {{ session('orders')['fullname'] }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Kết quả: {{ $Result }}</label>
            </div>
            <a href="/cart" class="btn btn-primary">Quay lại</a>
        </div>
        <footer class="footer">
            <p>&copy; Trang web bán bật lửa Zippo trực tuyến 2022</p>
        </footer>
    </div>
</body>

</html>
