<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CartController extends Controller
{

    public function index()
    {
        return view('cart.index', ['provinces' => Province::all()]);
    }

    public function addCart(Request $request)
    {
        $id = $request->input('id');
        $cart = session('cart');
        $product = Product::where('products.id', '=', $id)->leftjoin('sales', 'products.discount', '=', 'sales.id')->get()[0];
        if (isset($cart[$id])) {
            return response()->json(['status' => 0]);
        } else {
            $cart[$id] = [
                'id' => $id,
                'image' => $product->image,
                'name' => $product->product_name,
                'amount' => $product->amount,
                'price' => $product->price,
                'category' => $product->category,
                'origin' => $product->origin,
                'percent' => $product->percent,
                'quantity' => 1
            ];
        }
        session()->put('cart', $cart);
        session()->save();
        return response()->json(['message' => "Đã thêm vào giỏ hàng", 'status' => 1, 'count' => count(session()->get('cart'))]);
    }

    public function setQuantity(Request $request)
    {
        $cities = Http::get("https://api.mysupership.vn/v1/partner/areas/province");
        $id = $request->input('id');
        $cart = session('cart');
        if ($request->input('quantity') < Product::where('id', $id)->first()->amount) {
            $cart[$id]['quantity'] = $request->input('quantity');
            session()->put('cart', $cart);
            session()->save();
            return response()->json(['status' => 1, 'response' => view('dynamic_layout.cart_reload', ['cities' => $cities])->render()]);
        } else
            return response()->json(['message' => "Vượt số lượng trong kho", 'status' => 0]);
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
        if ($cart[$id]['quantity'] < Product::where('id', $id)->first()->amount) {
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
