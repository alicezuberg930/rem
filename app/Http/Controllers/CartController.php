<?php

namespace App\Http\Controllers;

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
}
