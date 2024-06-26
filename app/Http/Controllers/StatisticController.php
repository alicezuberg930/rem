<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
  public function getAnnualStats(Request $request)
  {
    $data = array();
    if ($request->query('year')) {
      for ($i = 1; $i <= 12; $i++) {
        $order = Order::whereYear('order_date', $request->year)->where('status', 1)->whereMonth('order_date', $i);
        array_push(
          $data,
          [
            "receipts" => $order->count(),
            "total" => $order->sum('total_price')
          ]
        );
      }
    }
    return response()->json($data, 200);
  }

  public function getHighestSoldProduct(Request $request)
  {
    $sales = [];
    if ($request->input('config') == 'top-5-best') {
      $sales = DB::table('orderdetails')
        ->leftJoin('products', 'products.id', '=', 'orderdetails.product_id')
        ->selectRaw('products.product_name, sum(orderdetails.quantity) total')
        ->orderBy('total', 'asc')
        ->groupBy('orderdetails.product_id')
        ->take(5)
        ->get();
    }
    if ($request->input('config') == 'top-5-lowest') {
      $sales = DB::table('products')
        ->leftJoin('orderdetails', 'products.id', '=', 'orderdetails.product_id')
        ->selectRaw('products.product_name, COALESCE(sum(orderdetails.quantity),0) total')
        ->groupBy('products.id')
        ->orderBy('total', 'asc')
        ->take(5)
        ->get();
    }
    if ($request->input('config') == 'top-5-highest-gross') {
      $sales = DB::table('orderdetails')
        ->leftJoin('products', 'products.id', '=', 'orderdetails.product_id')
        ->selectRaw('products.product_name, sum(orderdetails.product_price*orderdetails.quantity) total')
        ->groupBy('orderdetails.product_id')
        ->orderBy('total', 'asc')
        ->take(5)
        ->get();
    }
    return $sales;
  }
}
