<?php

namespace App\Http\Controllers;

use App\Models\orderdetails;
use App\Models\orders;
use App\Models\product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class CheckoutController extends Controller
{
    private $vnp_HashSecret = "OUNLJDFELTPRZUKCHFBFBBSMVNROUCGB"; //Secret key
    private $vnp_TmnCode = "HNM3NYHP"; //Website ID in VNPAY System

    public function getOrderInfo(Request $request)
    {
        session()->put('orders', [
            'fullname' => $request->input('fullname'),
            'phonenumber' => $request->input('phonenumber'),
            'email' => $request->input('email'),
            'address' => $request->input('city') . ' ' . explode('-', $request->input('district'))[0] . ' ' . explode('-', $request->input('ward'))[0],
            'total_price' => $request->input('total_price'),
            'quantity' => $request->input('quantity'),
            'order_date' => date('Y-m-d h:i:s'),
            'order_id' => ''
        ]);
        session()->save();
    }

    public function vnpayPayment(Request $request)
    {
        $this->getOrderInfo($request);
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = URL::to("/vnpay_return");
        $vnp_TxnRef = random_int(PHP_INT_MIN, PHP_INT_MAX);
        // $_POST['order_id']; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
        $vnp_OrderInfo = "Thanh toan hoa don";
        // $_POST['order_desc'];
        $vnp_OrderType = 'mua hang hoa';
        // $_POST['order_type'];
        $vnp_Amount = $request->input('total_price') * 100;
        $vnp_Locale = 'vn';
        // $_POST['language'];
        $vnp_BankCode = '';
        // $_POST['bank_code'];
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        //Add Params of 2.0.1 Version
        // $vnp_ExpireDate = $_POST['txtexpire'];
        //Billing
        // $vnp_Bill_Mobile = $_POST['txt_billing_mobile'];
        // $vnp_Bill_Email = $_POST['txt_billing_email'];
        // $fullName = trim($_POST['txt_billing_fullname']);
        // if (isset($fullName) && trim($fullName) != '') {
        //     $name = explode(' ', $fullName);
        //     $vnp_Bill_FirstName = array_shift($name);
        //     $vnp_Bill_LastName = array_pop($name);
        // }
        // $vnp_Bill_Address = $_POST['txt_inv_addr1'];
        // $vnp_Bill_City = $_POST['txt_bill_city'];
        // $vnp_Bill_Country = $_POST['txt_bill_country'];
        // $vnp_Bill_State = $_POST['txt_bill_state'];
        // // Invoice
        // $vnp_Inv_Phone = $_POST['txt_inv_mobile'];
        // $vnp_Inv_Email = $_POST['txt_inv_email'];
        // $vnp_Inv_Customer = $_POST['txt_inv_customer'];
        // $vnp_Inv_Address = $_POST['txt_inv_addr1'];
        // $vnp_Inv_Company = $_POST['txt_inv_company'];
        // $vnp_Inv_Taxcode = $_POST['txt_inv_taxcode'];
        // $vnp_Inv_Type = $_POST['cbo_inv_type'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $this->vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );
        if (isset($vnp_BankCode) && $vnp_BankCode != "")
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "")
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($this->vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $this->vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        if (isset($_POST['redirect'])) return redirect($vnp_Url);
        else return response()->json(['code' => '00', 'message' => 'success', 'data' => $vnp_Url]);
    }

    public function paymentsResult(Request $request)
    {
        $inputData = [];
        foreach ($_GET as $key => $value) {
            if (substr($key, 0, 4) == 'vnp_') {
                $inputData[$key] = $value;
            }
        }
        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHashType']);
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = '';
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . '=' . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . '=' . urlencode($value);
                $i = 1;
            }
        }
        $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);
        if ($secureHash == $vnp_SecureHash) {
            if ($_GET['vnp_ResponseCode'] == '00') {
                $orders = new orders();
                $orders->order_date = $request->input('vnp_PayDate');
                $orders->fullname = session('orders')['fullname'];
                $orders->phone_number = session('orders')['phonenumber'];
                $orders->address = session('orders')['address'];
                $orders->quantity = session('orders')['quantity'];
                $orders->total_price = session('orders')['total_price'];
                $orders->email = session('orders')['email'];
                $orders->user_id = session('UserID');
                if ($orders->save()) {
                    foreach (session()->get('cart') as $item) {
                        $orderdetails = new orderdetails();
                        $orderdetails->order_id = orders::max('id');
                        $orderdetails->product_id = $item['id'];
                        $orderdetails->quantity = $item['quantity'];
                        $orderdetails->product_price = $item['price'];
                        $orderdetails->save();

                        $product = product::find($item['id']);
                        $product->update(['amount' => $product->amount - $item['quantity']]);
                    }
                    $Result = 'Giao dịch thành công';
                    Mail::send("email_templates.order_template", [], function ($email) {
                        $email->subject('Thông báo đơn hàng');
                        $email->to(session()->get('orders')["email"], "Header");
                    });
                }
            } else {
                $Result = 'Giao dịch không thành công';
            }
        } else {
            $Result = 'Chu kỳ không hợp lệ';
        }
        return view("payment.vnpay_return", [
            'Result' => $Result
        ]);
    }

    public function directPayment(Request $request)
    {
        $this->getOrderInfo($request);
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $orders = new orders();
        $orders->order_date = session('orders')['order_date'];
        $orders->fullname = session('orders')['fullname'];
        $orders->phone_number = session('orders')['phonenumber'];
        $orders->address = session('orders')['address'];
        $orders->quantity = session('orders')['quantity'];
        $orders->total_price = session('orders')['total_price'];
        $orders->email = session('orders')['email'];
        $orders->user_id = session('UserID');
        if ($orders->save()) {
            $order_id = $orders->id;
            foreach (session()->get('cart') as $item) {
                $orderdetails = new orderdetails();
                $orderdetails->order_id = $order_id;
                $orderdetails->product_id = $item['id'];
                $orderdetails->quantity = $item['quantity'];
                $orderdetails->product_price = $item['price'];
                $orderdetails->save();

                $product = product::find($item['id']);
                $product->update(['amount' => $product->amount - $item['quantity']]);
            }
            Mail::send("email_templates.order_template", ['order_id' => $order_id], function ($email) {
                $email->subject('Thông báo đơn hàng');
                $email->to(session()->get('orders')["email"], "Header");
            });
            return view('payment.direct_payment', ['order_id' => $order_id, 'message' => 'Đã đặt hàng thành công', 'status' => 1]);
        } else {
            return view('payment.direct_payment', ['message' => 'Đặt hàng thất bại', 'status' => 0]);
        }
    }
}
