<?php

namespace App\Http\Controllers;

use App\Models\orderdetails;
use App\Models\orders;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public static function getOrderQuantity()
    {
        $CountArray = array();
        $CountArray["Total"] = orders::all()->count();
        $CountArray["Waiting"] = orders::where("status", '=', 0)->count();
        $CountArray["Approved"] = orders::where("status", '=', 1)->count();
        $CountArray["Canceled"] = orders::where("status", '=', 2)->count();
        return $CountArray;
    }

    public static function getOrder($current_page, $type)
    {
        if ($type != -1)
            return orders::where('status', '=', $type)->take(5)->skip(($current_page - 1) * 5)->get();
        else
            return orders::take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function updateOrderStatus(Request $request)
    {
        $orders = orders::findOrFail($request->input('id'));
        $response = $orders->update(['date_checked' => date('Y-m-d h:i:s'), 'status' => $request->input('status')]);
        if (!$response || $orders == null)
            return response()->json(['message' => 'Thay đổi trạng thái thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Đã thay đổi trạng thái', 'status' => 1, 'response' => $this->orderReload($request->input('page'), $request->input('type'))]);
    }

    public function manageOrderPage(Request $request)
    {
        $type = -1;
        if (session()->has('search')) session()->forget("search");
        if ($request->input("type") != NULL)
            $type = $request->input("type");
        $Orders = $this->getOrder(1, $type);
        session()->put('type', -1);
        return view('admin.orders_manager', ['Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getOrderQuantity()]);
    }

    public function searchOrder(Request $request)
    {
        session()->put('search', $request->input('id'));
        session()->save();
        return $this->orderReload($request->input('page'), -1);
    }

    public function orderReload($current_page, $type)
    {
        $Orders = null;
        if (session()->has('search') && session()->get('search') != '') {
            $query = orders::where('id', '=', session()->get('search'));
            $Orders = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Orders = $this->getOrder($current_page, $type);
            session()->put('type', $type);
        }
        return view('dynamic_layout.order_reload', ['Orders' => $Orders, 'currentpage' => $current_page, "Quantity" => $this->getOrderQuantity()])->render();
    }

    public function getOrderDetails(Request $request)
    {
        $order_details = orderdetails::where('order_id', '=', $request->input('id'));
        return view("product.order_details");
    }
}
