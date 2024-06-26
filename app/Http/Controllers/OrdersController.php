<?php

namespace App\Http\Controllers;

use App\Models\OrderDetails;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public static function getAdminOrderQuantity()
    {
        $CountArray = array();
        $CountArray["Total"] = Order::all()->count();
        $CountArray["Waiting"] = Order::where("status", 0)->count();
        $CountArray["Approved"] = Order::where("status", 1)->count();
        $CountArray["Canceled"] = Order::where("status", 2)->count();
        $CountArray["Delivering"] = Order::where("status", 3)->count();
        $CountArray["Delivered"] = Order::where("status", 4)->count();
        return $CountArray;
    }

    public static function getUserOrderQuantity($user_id)
    {
        $CountArray = array();
        $CountArray["Total"] = Order::where('user_id', '=', $user_id)->count();
        $CountArray["Waiting"] = Order::where([['user_id', '=', $user_id], ["status", '=', 0]])->count();
        $CountArray["Approved"] = Order::where([['user_id', '=', $user_id], ["status", '=', 1]])->count();
        $CountArray["Canceled"] = Order::where([['user_id', '=', $user_id], ["status", '=', 2]])->count();
        $CountArray["Delivering"] = Order::where([['user_id', '=', $user_id], ["status", '=', 3]])->count();
        $CountArray["Delivered"] = Order::where([['user_id', '=', $user_id], ["status", '=', 4]])->count();
        return $CountArray;
    }

    public static function getAdminOrder($current_page, $type)
    {
        $orders = null;
        if ($type != -1)
            $orders = Order::where('status', '=', $type)->take(10)->skip(($current_page - 1) * 10)->get();
        else
            $orders = Order::take(10)->skip(($current_page - 1) * 10)->get();
        return $orders;
    }

    public static function getUserOrder($current_page, $type, $user_id)
    {
        $orders = null;
        if ($type != -1)
            $orders = Order::where([['status', '=', $type], ['user_id', '=', $user_id]])->take(10)->skip(($current_page - 1) * 10)->get();
        else
            $orders = Order::where('user_id', '=', $user_id)->take(10)->skip(($current_page - 1) * 10)->get();
        return $orders;
    }

    public function updateAdminOrderStatus(Request $request)
    {
        try {
            Order::findOrFail($request->input('id'))->update(['employee_id' => session('Employee')['EmployeeID'], 'status' => $request->input('status')]);
            if ($request->input('status') == 2) {
                $order_details = Order::where('id', '=', $request->input('id'))->join('orderdetails', 'orders.id', '=', 'orderdetails.order_id')->get(['product_id', 'orderdetails.quantity as amount']);
                foreach ($order_details as $order_detail) {
                    $product = Product::findOrFail($order_detail->product_id);
                    $product->update(['amount' => $product->amount + $order_detail->amount]);
                }
            }
            return response()->json(['message' => 'Đã thay đổi trạng thái', 'status' => 1, 'response' => $this->adminOrderReload($request->input('page'), $request->input('type'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Thay đổi trạng thái thất bại', 'status' => 0]);
        }
    }

    public function updateUserOrderStatus(Request $request)
    {
        try {
            Order::findOrFail($request->input('id'))->update(['status' => $request->input('status')]);
            return response()->json(['message' => 'Đã thay đổi trạng thái', 'status' => 1, 'response' => $this->userOrderReload($request->input('page'), $request->input('type'), session('UserID'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Thay đổi trạng thái thất bại', 'status' => 0]);
        }
    }

    public function manageAdminOrderPage()
    {
        $authorize = AuthController::tokenCan("orders:manage");
        if (session()->has('search')) session()->forget("search");
        $Orders = $this->getAdminOrder(1, -1);
        return view('admin.orders_manager', ['authorize' => $authorize, 'Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getAdminOrderQuantity()]);
    }

    public function manageUserOrderPage($id)
    {
        if (session()->has('search')) session()->forget("search");
        $Orders = $this->getUserOrder(1, -1, $id);
        return view('user.purchase_history', ['Orders' => $Orders, 'currentpage' => 1, "Quantity" => $this->getUserOrderQuantity($id)]);
    }

    public function adminOrderStatusAndPaginate(Request $request)
    {
        return $this->adminOrderReload($request->input('page'), $request->input('type'));
    }

    public function userOrderStatusAndPaginate(Request $request)
    {
        return $this->userOrderReload($request->input('page'), $request->input('type'), session('UserID'));
    }

    public function adminOrderReload($current_page, $type)
    {
        $Orders = null;
        if (session()->has('search') && session()->get('search') != '') {
            $Orders = Order::where('id', '=', session('search'))->get();
        } else {
            $Orders = $this->getAdminOrder($current_page, $type);
            session()->put('type', $type);
        }
        return view('dynamic_layout.order_reload', ['Orders' => $Orders, 'currentpage' => $current_page, "Quantity" => $this->getAdminOrderQuantity()])->render();
    }

    public function userOrderReload($current_page, $type, $user_id)
    {
        $Orders = null;
        if (session()->has('search') && session()->get('search') != '') {
            $Orders = Order::where([['id', '=', session()->get('search')], ['user_id', '=', session('UserID')]])->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Orders = $this->getUserOrder($current_page, $type, session('UserID'));
            session()->put('type', $type);
        }
        return view('dynamic_layout.order_reload', ['Orders' => $Orders, 'currentpage' => $current_page, "Quantity" => $this->getUserOrderQuantity($user_id)])->render();
    }

    public function searchOrder(Request $request)
    {
        session()->put('search', $request->input('id'));
        session()->save();
        return $this->adminOrderReload($request->input('page'), -1);
    }

    public function getOrderDetails($order_id)
    {
        $Order_details = OrderDetails::where('order_id', '=', $order_id)
            ->join('products', 'orderdetails.product_id', '=', 'products.id')
            ->leftjoin('sales', 'products.discount', '=', 'sales.id')->get();
        $Order = Order::where('id', '=', $order_id)->first();
        return view("order.order_details", ['Order_details' => $Order_details, 'Order' => $Order]);
    }

    public function getAllOrders()
    {
        return Order::all();
    }
}