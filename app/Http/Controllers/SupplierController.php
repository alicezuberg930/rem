<?php

namespace App\Http\Controllers;

use App\Models\supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SupplierController extends Controller
{

    public function addSupplier(Request $request)
    {
        $response = supplier::create($request->all());
        if (!$response)
            return response()->json(['message' => 'Thêm nhà cung cấp thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Thêm nhà cung cấp thành công', 'status' => 1, 'response' => $this->supplierReload($request->input('page'))]);
    }

    public function editSupplier(Request $request)
    {
        $Supplier = supplier::findOrFail($request->input('id'));
        $response = $Supplier->update($request->all());
        if (!$response || $Supplier == null)
            return response()->json(['message' => 'Sửa nhà cung cấp thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Sửa nhà cung cấp thành công', 'status' => 1, 'response' => $this->supplierReload($request->input('page'))]);
    }

    public function deleteSupplier(Request $request)
    {
        $response = supplier::findOrFail($request->input('id'))->delete();
        if (!$response)
            return response()->json(['message' => 'Xóa nhà cung cấp thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Xóa nhà cung cấp thành công', 'status' => 1, 'response' => $this->SupplierReload($request->input('page'))]);
    }

    public static function getSupplier($current_page)
    {
        return supplier::take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function getSupplierDetails(Request $request)
    {
        return supplier::find($request->input('id'));
    }

    public function manageSupplierPage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.suppliers_manager', ['Suppliers' => $this->getSupplier(1), 'cities' => Http::get('https://api.mysupership.vn/v1/partner/areas/province'), 'total' => supplier::all()->count(), 'currentpage' => 1]);
    }

    public function searchSupplier(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->supplierReload($request->input('page'));
    }

    public function supplierReload($current_page)
    {
        $Suppliers = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = supplier::where('name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Suppliers = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Suppliers = $this->getSupplier($current_page);
            $total = supplier::all()->count();
        }
        return view('dynamic_layout.supplier_reload', ['Suppliers' => $Suppliers, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
