<?php

namespace App\Http\Controllers;

use App\Models\orderdetails;
use App\Models\orders;
use App\Models\product;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public static function getOrderQuantity($user_id)
    {
        $CountArray = array();
        $CountArray["Total"] = $user_id == -1 ? orders::all()->count() : orders::where('user_id', '=', $user_id)->count();
        $CountArray["Waiting"] = $user_id == -1 ? orders::where("status", '=', 0)->count() : orders::where([['user_id', '=', $user_id], ["status", '=', 0]])->count();
        $CountArray["Approved"] = $user_id == -1 ? orders::where("status", '=', 1)->count() : orders::where([['user_id', '=', $user_id], ["status", '=', 1]])->count();
        $CountArray["Canceled"] = $user_id == -1 ? orders::where("status", '=', 2)->count() : orders::where([['user_id', '=', $user_id], ["status", '=', 2]])->count();
        return $CountArray;
    }

    public static function getOrder($current_page, $type, $user_id)
    {
        $orders = null;
        if ($type != -1)
            $orders = orders::where('status', '=', $type)->take(5)->skip(($current_page - 1) * 5);
        else
            $orders = orders::take(5)->skip(($current_page - 1) * 5);
        if ($user_id != -1)
            $orders = $orders->where('user_id', '=', $user_id);
        return $orders->get();
    }

    public function updateOrderStatus(Request $request)
    {
        $orders = orders::findOrFail($request->input('id'));
        $response = $orders->update(['date_checked' => date('Y-m-d h:i:s'), 'status' => $request->input('status')]);
        if (!$response || $orders == null)
            return response()->json(['message' => 'Thay đổi trạng thái thất bại', 'status' => 0]);
        else {
            if ($request->input('status') == 2) {
                $order_details = orders::where('id', '=', $request->input('id'))->join('orderdetails', 'orders.id', '=', 'orderdetails.order_id')->get(['product_id', 'orderdetails.quantity as amount']);
                foreach ($order_details as $order_detail) {
                    $product = product::find($order_detail->product_id);
                    $product->update(['amount' => $product->amount + $order_detail->amount]);
                }
            }
            return response()->json(['message' => 'Đã thay đổi trạng thái', 'status' => 1, 'response' => $this->orderReload($request->input('page'), $request->input('type'), $request->input('user_id'))]);
        }
    }

    public function manageOrderPage(Request $request)
    {
        $type = -1;
        if (session()->has('search')) session()->forget("search");
        // if ($request->input("type") != NULL)
        // $type = $request->input("type");
        $Orders = $this->getOrder(1, $type, -1);
        return view('admin.orders_manager', ['Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getOrderQuantity(-1)]);
    }

    public function searchOrder(Request $request)
    {
        session()->put('search', $request->input('id'));
        session()->save();
        return $this->orderReload($request->input('page'), -1, $request->input('user_id'));
    }

    public function orderReload($current_page, $type, $user_id)
    {
        $Orders = null;
        if (session()->has('search') && session()->get('search') != '') {
            $query = orders::where('id', '=', session()->get('search'));
            if ($user_id != -1)
                $query = $query->where('user_id', '=', $user_id);
            $Orders = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Orders = $this->getOrder($current_page, $type, $user_id);
            session()->put('type', $type);
        }
        return view('dynamic_layout.order_reload', ['Orders' => $Orders, 'currentpage' => $current_page, "Quantity" => $this->getOrderQuantity($user_id)])->render();
    }

    public function getOrderDetails($order_id)
    {
        $Order_details = orderdetails::where('order_id', '=', $order_id)
            ->join('products', 'orderdetails.product_id', '=', 'products.id')
            ->leftjoin('sales', 'products.discount', '=', 'sales.id')->get();
        $Order = orders::where('id', '=', $order_id)->first();
        return view("order.order_details", ['Order_details' => $Order_details, 'Order' => $Order]);
    }

    public function getUserOrders($user_id)
    {
        if (session()->has('search')) session()->forget("search");
        $Orders = $this->getOrder(1, -1, $user_id);
        return view('user.purchase_history', ['user_id' => $user_id, 'Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getOrderQuantity($user_id)]);
        // orders::find($user_id)->get();
    }
}
