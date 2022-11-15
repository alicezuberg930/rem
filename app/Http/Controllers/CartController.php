<?php

namespace App\Http\Controllers;

use App\Models\product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CartController extends Controller
{

    public function getDistrict(Request $request)
    {
        $respon = Http::get('https://api.mysupership.vn/v1/partner/areas/district?province=' . $request->input('id'));
        return response($respon['results'], 200);
    }

    public function getWard(Request $request)
    {
        $respon = Http::get('https://api.mysupership.vn/v1/partner/areas/commune?district=' . $request->input('id'));
        return response($respon['results'], 200);
    }

    public function addCart(Request $request)
    {
        $id = $request->input('id');
        $cart = session('cart');
        $product = product::where('products.id', '=', $id)
            ->leftjoin('sales', 'products.discount', '=', 'sales.id')
            ->get(['sales.percent', 'products.amount', 'products.image', 'products.name', 'products.price', 'products.origin', 'products.category']);

        if (isset($cart[$id])) {
            return response()->json(['status' => 0]);
        } else {
            $cart[$id] = [
                'id' => $id,
                'image' => $product[0]->image,
                'name' => $product[0]->name,
                'amount' => $product[0]->amount,
                'price' => $product[0]->price,
                'category' => $product[0]->category,
                'origin' => $product[0]->origin,
                'percent' => $product[0]->percent,
                'quantity' => 1
            ];
        }
        session()->put('cart', $cart);
        session()->save();
        return response()->json(['message' => "Đã thêm vào giỏ hàng", 'status' => 1, 'count' => count(session()->get('cart'))]);
    }

    public function removeCart(Request $request)
    {
        $cities = Http::get("https://api.mysupership.vn/v1/partner/areas/province");
        session()->pull('cart.' . $request->input('id'));
        session()->save();
        return response()->json(['message' => 'Đã xóa sản phẩm', 'id' => $request->input('id'), 'response' => view('dynamic_layout.cart_reload', ['cities' => $cities])->render()]);
    }

    public function increaseIncart(Request $request)
    {
        $cities = Http::get("https://api.mysupership.vn/v1/partner/areas/province");
        $id = $request->input('id');
        $cart = session('cart');
        if ($cart[$id]['quantity'] < product::where('id', $id)->first()->amount) {
            $cart[$id]['quantity'] += 1;
            session()->put('cart', $cart);
            session()->save();
            return response()->json(['status' => 1, 'response' => view('dynamic_layout.cart_reload', ['cities' => $cities])->render()]);
        } else
            return response()->json(['message' => "Vượt số lượng trong kho", 'status' => 0]);
    }

    public function decreaseIncart(Request $request)
    {
        $cities = Http::get("https://api.mysupership.vn/v1/partner/areas/province");
        $id = $request->input('id');
        $cart = session('cart');
        if ($cart[$id]['quantity'] > 1) {
            $cart[$id]['quantity'] -= 1;
            session()->put('cart', $cart);
            session()->save();
            return response()->json(['status' => 1, 'response' => view('dynamic_layout.cart_reload', ['cities' => $cities])->render()]);
        } else
            return response()->json(['message' => "Số lượng không được dưới 0", 'status' => 0]);
    }
}
