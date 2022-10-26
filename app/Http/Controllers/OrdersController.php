<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public function Test(Request $request)
    {
        return $request->input('name');
    }
}
