<?php

namespace App\Http\Controllers;

use App\Models\orderdetails;
use App\Models\orders;
use Illuminate\Http\Request;

class OrdersController extends Controller
{

    public static function getOrder($current_page)
    {
        return orders::take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function updateOrderStatus(Request $request)
    {
        $orders = orders::findOrFail($request->input('id'));
        $response = $orders->update(['date_checked' => date('Y-m-d h:i:s'), 'status' => $request->input('status')]);
        if (!$response || $orders == null)
            return response()->json(['message' => 'Thay đổi trạng thái thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Đã thay đổi trạng thái', 'status' => 1, 'response' => $this->orderReload($request->input('page'))]);
    }

    public function manageOrderPage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.orders_manager', ['Orders' => $this->getOrder(1), 'total' => orders::all()->count(), 'currentpage' => 1]);
    }

    public function searchOrder(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->orderReload($request->input('page'));
    }

    public function orderReload($current_page)
    {
        $Orders = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = orders::where('name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Orders = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Orders = $this->getOrder($current_page);
            $total = orders::all()->count();
        }
        return view('dynamic_layout.order_reload', ['Orders' => $Orders, 'total' => $total, 'currentpage' => $current_page])->render();
    }

    public function getOrderDetails(Request $request)
    {
        $order_details = orderdetails::where('order_id', '=', $request->input('id'))->get();
        return view("product.order_details");
    }
}
