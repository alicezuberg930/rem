@include('vnpay.config');
<?php $vnp_TmnCode = 'Y4U88XFK'; //Mã website tại VNPAY
$vnp_Returnurl = '/vnpay/vnpay_return';
$vnp_Url = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
$vnp_TxnRef = $_GET['order_id']; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
$vnp_OrderInfo = $_GET['order_desc'];
// $vnp_OrderType = $_GET['order_type'];
$vnp_Amount = str_replace('VND', '', str_replace(',', '', $_GET['amount'])) * 100;
$vnp_Locale = $_GET['language'];
$vnp_BankCode = $_GET['bank_code'];
$vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
$inputData = [
    'vnp_Version' => '2.0.0',
    'vnp_TmnCode' => $vnp_TmnCode,
    'vnp_Amount' => $vnp_Amount,
    'vnp_Command' => 'pay',
    'vnp_CreateDate' => date('YmdHis'),
    'vnp_CurrCode' => 'VND',
    'vnp_IpAddr' => $vnp_IpAddr,
    'vnp_Locale' => $vnp_Locale,
    'vnp_OrderInfo' => $vnp_OrderInfo,
    // "vnp_OrderType" => $vnp_OrderType,
    'vnp_ReturnUrl' => $vnp_Returnurl,
    'vnp_TxnRef' => $vnp_TxnRef,
];
if (isset($vnp_BankCode) && $vnp_BankCode != '') {
    $inputData['vnp_BankCode'] = $vnp_BankCode;
}
ksort($inputData);
$query = $hashdata = '';
$i = 0;
foreach ($inputData as $key => $value) {
    if ($i == 1) {
        $hashdata .= '&' . $key . '=' . $value;
    } else {
        $hashdata .= $key . '=' . $value;
        $i = 1;
    }
    $query .= urlencode($key) . '=' . urlencode($value) . '&';
}
$vnp_Url = $vnp_Url . '?' . $query;
if (isset($vnp_HashSecret)) {
    $vnpSecureHash = hash('sha256', $vnp_HashSecret . $hashdata);
    $vnp_Url .= 'vnp_SecureHashType=SHA256&vnp_SecureHash=' . $vnpSecureHash;
}
$returnData = ['code' => '00', 'message' => 'success', 'data' => $vnp_Url];
header('Location: ' . $vnp_Url);
die();
