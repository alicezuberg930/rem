<!DOCTYPE html>
<html>

<head>
    <title>Thông tin đơn hàng</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
</head>

<body>
    <style>
        .nav-bar {
            background-color: var(--header);
        }

        .container {
            margin: 5rem auto;
        }

        .header {
            text-align: center;
            border-bottom: 1px solid grey;
            margin-bottom: 1.5rem;
        }
    </style>
    <nav class="nav-bar"></nav>
    <div class="container">
        <div class="header clearfix">
            <h1 class="text-muted">Trang thanh toán bật lửa zippo</h1>
        </div>
        <h3 class="">Thông tin đơn hàng</h3>
        <div class="table-responsive">
            <form action="/vnpay/vnpay_create_payment" id="create_form" method="get">
                <!-- <div class="form-group">
                    <label for="language">Loại hàng hóa </label>
                    <select name="order_type" id="order_type" class="form-control">
                        <option value="topup">Nạp tiền điện thoại</option>
                        <option value="billpayment">Thanh toán hóa đơn</option>
                        <option value="fashion">Thời trang</option>
                        <option value="other">Khác - Xem thêm tại VNPAY</option>
                    </select>
                </div> -->
                <div class="form-group">
                    <label for="order_id">Mã hóa đơn</label>
                    <input class="form-control" id="order_id" value="12345" name="order_id" type="text" readonly>
                </div>
                <div class="form-group">
                    <label for="amount">Tổng số tiền</label>
                    <input class="form-control" id="amount" value="350000" name="amount" type="text" readonly>
                </div>
                <div class="form-group">
                    <label for="order_desc">Nội dung thanh toán</label>
                    <input class="form-control" id="order_desc" name="order_desc" type="text"
                        value="Thanh toan bat lua zippo">
                </div>
                <div class="form-group">
                    <label for="bank_code">Chọn phương thức thanh toán</label>
                    <select name="bank_code" id="bank_code" class="form-control">
                        <option value="">Không chọn</option>
                        <option value="NCB">NCB</option>
                        <option value="AGRIBANK">Agribank</option>
                        <option value="SCB">SCB</option>
                        <option value="SACOMBANK">SacomBank</option>
                        <option value="EXIMBANK">EximBank</option>
                        <option value="MSBANK">MSBANK</option>
                        <option value="NAMABANK">NamABank</option>
                        <option value="VIETINBANK">Vietinbank</option>
                        <option value="VIETCOMBANK">VCB</option>
                        <option value="HDBANK">HDBank</option>
                        <option value="DONGABANK">Dong A Bank</option>
                        <option value="TPBANK">TPBank</option>
                        <option value="OJB">OceanBank</option>
                        <option value="BIDV">BIDV</option>
                        <option value="TECHCOMBANK">Techcombank</option>
                        <option value="VPBANK">VPBank</option>
                        <option value="MBBANK">MBBank</option>
                        <option value="ACB">ACB</option>
                        <option value="OCB">OCB</option>
                        <option value="IVB">IVB</option>
                        <option value="VNMART">Ví điện tử VnMart</option>
                        <option value="VISA">VISA/MASTER</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="language">Ngôn ngữ</label>
                    <select name="language" id="language" class="form-control">
                        <option value="vn">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <button type="submit" class="mt-2 btn btn-primary">Thanh toán</button>
            </form>
        </div>
    </div>
    <link href="https://sandbox.vnpayment.vn/paymentv2/lib/vnpay/vnpay.css" rel="stylesheet" />
    <script src="https://sandbox.vnpayment.vn/paymentv2/lib/vnpay/vnpay.js"></script>
</body>

</html>
