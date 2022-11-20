<?php

namespace App\Http\Controllers;

use App\Models\supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SupplierController extends Controller
{

    public static function getSupplier($current_page)
    {
        return supplier::take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function manageSupplierPage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.suppliers_manager', ['Suppliers' => $this->getSupplier(1), 'cities' => Http::get('https://api.mysupership.vn/v1/partner/areas/province'), 'total' => supplier::all()->count(), 'currentpage' => 1]);
    }

    public function searchCustomer(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->employeeReload($request->input('page'));
    }

    public function employeeReload($current_page)
    {
        $Suppliers = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = supplier::where('name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Suppliers = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Suppliers = $this->getCategory($current_page);
            $total = supplier::all()->count();
        }
        return view('dynamic_layout.supplier_reload', ['Suppliers' => $Suppliers, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
