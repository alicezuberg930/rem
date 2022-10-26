<?php ob_start();
$vnp_HashSecret = 'OUNLJDFELTPRZUKCHFBFBBSMVNROUCGB';
$vnp_SecureHash = $_GET['vnp_SecureHash'];
$inputData = [];
foreach ($_GET as $key => $value) {
    if (substr($key, 0, 4) == 'vnp_') {
        $inputData[$key] = $value;
    }
}
unset($inputData['vnp_SecureHashType']);
unset($inputData['vnp_SecureHash']);
ksort($inputData);
$i = 0;
$hashData = $Result = '';
foreach ($inputData as $key => $value) {
    if ($i == 1) {
        $hashData = $hashData . '&' . $key . '=' . $value;
    } else {
        $hashData = $hashData . $key . '=' . $value;
        $i = 1;
    }
}
$secureHash = hash('sha256', $vnp_HashSecret . $hashData);
if ($secureHash == $vnp_SecureHash) {
    if ($_GET['vnp_ResponseCode'] == '00') {
        //         $Time = date("d-m-Y", strtotime($_GET['vnp_PayDate']));
        //         $_SESSION["Order"]["OrderDate"] = $Time;
        //         $PaymentArray = array(
        //             "OrderID" => $_SESSION["Order"]["OrderID"], "Total" => $_GET['vnp_Amount'] / 100, "Note" => $_GET['vnp_OrderInfo'],
        //             "PaymentTime" => $Time, "vnp_response_code" => $_GET['vnp_ResponseCode'],
        //             "code_vnpay" => $_GET['vnp_TransactionNo'], "BankCode" => $_GET['vnp_BankCode']
        //         );
        //         $_SESSION["Payment"] = $PaymentArray;
        //         if (GetRows("select count(*) from payments where OrderID = '" . $_SESSION["Order"]["OrderID"] . "'") == 1) {
        //             return;
        //         }
        //         if (AddOrder($_SESSION["Order"]) != 0 && AddPayment($_SESSION["Payment"]) != 0 && AddOrderDetails($_SESSION["OrderDetail"]) != 0) {
        $Result = 'Giao dịch thành công';
        //         }
    } else {
        $Result = 'Giao dịch không thành công';
    }
} else {
    $Result = 'Chu kỳ không hợp lệ';
}
?>
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
                <label class="form-control">Mã đơn hàng: <?php echo $_GET['vnp_TxnRef']; ?></label>
            </div>
            <div class="form-group">
                <label class="form-control">Tổng số tiền: <?php echo number_format($_GET['vnp_Amount'] / 100); ?> VNĐ</label>
            </div>
            <div class="form-group">
                <label class="form-control">Nội dung thanh toán: <?php echo $_GET['vnp_OrderInfo']; ?></label>
            </div>
            <div class="form-group">
                <label class="form-control">Mã phản hồi (vnp_ResponseCode): <?php echo $_GET['vnp_ResponseCode']; ?></label>
            </div>
            <div class="form-group">
                <label class="form-control">Mã giao dịch của VNPAY: <?php echo $_GET['vnp_TransactionNo']; ?></label>
            </div>
            <div class="form-group">
                <label class="form-control">Mã Ngân hàng: <?php echo $_GET['vnp_BankCode']; ?></label>
            </div>
            <div class="form-group">
                <label class="form-control">Thời gian thanh toán: <?php echo date('d-m-Y h:i:s', strtotime($_GET['vnp_PayDate'])); ?></label>
            </div>
            <div class="form-group">
                <label class="form-control">Người thanh toán: {{ session()->get('UserID') }}</label>
            </div>
            <div class="form-group">
                <label class="form-control">Kết quả: <?php echo $Result; ?></label>
            </div>
            <a href="../pages/member-orders.html" class="btn btn-primary">Quay lại</a>
        </div>
        <footer class="footer">
            <p>&copy; Trang web bán bật lửa Zippo trực tuyến 2022</p>
        </footer>
    </div>
</body>

</html>
