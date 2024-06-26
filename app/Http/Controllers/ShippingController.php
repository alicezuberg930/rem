<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public static function getShipperOrderQuantity()
    {
        $CountArray = array();
        $CountArray["Approved"] = Order::where('status', '=', 1)->count();
        $CountArray["Delivering"] = Order::where("status", '=', 3)->count();
        $CountArray["Delivered"] = Order::where("status", '=', 4)->count();
        return $CountArray;
    }

    public function manageShippingPage()
    {
        $authorize = AuthController::tokenCan("shippings:manage");
        session()->put('type', 1);
        $Orders = $this->getShipperOrder(1, 1);
        return view('admin.shippings_manager', ['authorize' => $authorize, 'Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getShipperOrderQuantity()]);
    }

    public static function getShipperOrder($current_page, $type)
    {
        return Order::where('status', '=', $type)->take(10)->skip(($current_page - 1) * 10)->get();
    }

    public function updateShippingStatus(Request $request)
    {
        try {
            Order::findOrFail($request->input('id'))->update(['status' => $request->input('status')]);
            return response()->json(['message' => 'Thay đổi trạng thái thành công', 'status' => 1, 'response' => $this->shippingReload($request->input('page'), $request->input('type'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Thay đổi trạng thái thất bại', 'status' => 0]);
        }
    }

    public function shippingStatusAndPaginate(Request $request)
    {
        return $this->shippingReload($request->input('page'), $request->input('type'));
    }

    public function shippingReload($current_page, $type)
    {
        $Orders = $this->getShipperOrder($current_page, $type);
        session()->put('type', $type);
        return view('dynamic_layout.shipping_reload', ['Orders' => $Orders, 'currentpage' => $current_page, "Quantity" => $this->getShipperOrderQuantity()])->render();
    }
}
