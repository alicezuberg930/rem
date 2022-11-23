<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public static function getCustomer($current_page)
    {
        return User::take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function manageCustomerPage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.customers_manager', ['Customers' => $this->getCustomer(1), 'total' => User::all()->count(), 'currentpage' => 1]);
    }

    public function searchCustomer(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->customerReload($request->input('page'));
    }

    public function customerReload($current_page)
    {
        $Customers = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = User::where('username', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Customers = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Customers = $this->getCategory($current_page);
            $total = User::all()->count();
        }
        return view('dynamic_layout.customer_reload', ['Customers' => $Customers, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
