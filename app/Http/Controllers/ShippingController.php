<?php

namespace App\Http\Controllers;

use App\Models\orders;

class ShippingController extends Controller
{
    public static function getOrderQuantity()
    {
        $CountArray = array();
        $CountArray["Approved"] = orders::where('status', '=', 1)->count();
        $CountArray["Delivering"] = orders::where("status", '=', 3)->count();
        $CountArray["Delivered"] = orders::where("status", '=', 4)->count();
        return $CountArray;
    }
    public function manageOrderPage()
    {
        $authorize = AuthController::tokenCan("orders:manage");
        $type = -1;
        if (session()->has('search')) session()->forget("search");
        $Orders = $this->getOrder(1, $type, -1);
        return view('admin.shippings_manager', ['authorize' => $authorize, 'Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getOrderQuantity(-1)]);
    }
    public static function getOrder($current_page, $type, $user_id)
    {
        $orders = null;
        if ($type != -1)
            $orders = orders::where('status', '=', $type)->take(10)->skip(($current_page - 1) * 5);
        else
            $orders = orders::take(10)->skip(($current_page - 1) * 10);
        if ($user_id != -1)
            $orders = $orders->where('user_id', '=', $user_id);
        return $orders->get();
    }
   
}
