<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Product;

class HomeController extends Controller
{

    public function index()
    {
        return view("index", ["products" => Product::all(), "banners" => Banner::orderBy("order", "asc")->get()]);
    }

    public function show($id)
    {
        return view("product.details", ["product" => Product::with("reviews")->find($id)]);
    }
}
