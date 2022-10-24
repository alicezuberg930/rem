<?php

namespace App\Http\Controllers;

use App\Models\sales;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function addSale(Request $request)
    {
        $sales = new sales();
        $sales->salename = "summer_discount";
        $sales->percent = "30";
        $sales->save();
    }
}
