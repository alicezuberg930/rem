<?php

namespace App\Http\Controllers;

use App\Models\category;
use App\Models\import_slip;
use App\Models\import_slip_details;
use App\Models\product;
use App\Models\sales;
use Illuminate\Http\Request;

class ImportSlipController extends Controller
{
    // manageImportSlipPage

    public static function getImportSlip($current_page)
    {
        return import_slip::join('employees', 'employee_id', '=', 'employees.id')->join('suppliers', 'supplier_id', '=', 'suppliers.id')->take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function manageImportSlipPage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.import_slips_manager', [
            'Categories' => category::all(),
            'Sales' => sales::all(),
            'Products' => product::all(['id', 'name']),
            'Materials' => product::select('material')->distinct()->get(),
            'Import_slips' => $this->getImportSlip(1),
            'total' => import_slip::all()->count(),
            'currentpage' => 1
        ]);
    }

    public function importSlipDetailPage($id)
    {
        // $e = $id;
        // $import_slips = new import_slip_details();
        // return response()->json($import_slips::create([
        //     'import_slip_id' => 6,
        //     'product_id' => 6,
        //     'import_quantity' => 20,
        //     'import_price' => 340000
        // ]));
        $ImportSlipDetails = import_slip_details::join('products', 'import_slip_details.product_id', '=', 'products.id')
            ->join('import_slips', 'import_slip_details.product_id', '=', 'import_slips.id')
            ->where('products.id', '=', $id)->get();
        return view('admin.import_slip_details', [
            'ImportSlipDetails' => $ImportSlipDetails[0],
            'Categories' => category::all(),
            'Sales' => sales::all(),
            'Materials' => product::select('material')->distinct()->get(),
        ]);
    }

    public function searchImportSlip(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->importSlipReload($request->input('page'));
    }

    public function importSlipReload($current_page)
    {
        $import_slips = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = import_slip::where('name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $import_slips = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $import_slips = $this->getImportSlip($current_page);
            $total = import_slip::all()->count();
        }
        return view('dynamic_layout.import_slip_reload', ['Import_slips' => $import_slips, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
