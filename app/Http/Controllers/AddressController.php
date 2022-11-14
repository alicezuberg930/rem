<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function userAddressPage()
    {
        return view('user.user_address');
    }
}
