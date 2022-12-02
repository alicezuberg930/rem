<?php

namespace App\Http\Controllers;

use App\Models\supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SupplierController extends Controller
{
    public function addSupplier(Request $request)
    {
        try {
            supplier::create($request->all());
            return response()->json(['message' => 'Thêm nhà cung cấp thành công', 'status' => 1, 'response' => $this->supplierReload($request->input('page'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Thêm nhà cung cấp thất bại', 'status' => 0]);
        }
    }

    public function editSupplier(Request $request)
    {
        try {
            supplier::findOrFail($request->input('id'))->update($request->all());
            return response()->json(['message' => 'Sửa nhà cung cấp thành công', 'status' => 1, 'response' => $this->supplierReload($request->input('page'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Sửa nhà cung cấp thất bại', 'status' => 0]);
        }
    }

    public function deleteSupplier(Request $request)
    {
        try {
            supplier::findOrFail($request->input('id'))->delete();
            return response()->json(['message' => 'Xóa nhà cung cấp thành công', 'status' => 1, 'response' => $this->SupplierReload($request->input('page'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Nhà cung cấp còn trong phiếu nhập', 'status' => 0]);
        }
    }

    public static function getSupplier($current_page)
    {
        return supplier::take(10)->skip(($current_page - 1) * 10)->get();
    }

    public function getSupplierDetails(Request $request)
    {
        return supplier::find($request->input('id'));
    }

    public function manageSupplierPage()
    {
        $authorize = AuthController::tokenCan("suppliers:manage");
        if (session()->has('search')) session()->forget("search");
        return view('admin.suppliers_manager', ['authorize' => $authorize, 'Suppliers' => $this->getSupplier(1), 'cities' => Http::get('https://api.mysupership.vn/v1/partner/areas/province'), 'total' => supplier::all()->count(), 'currentpage' => 1]);
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
            $Suppliers = $query->take(10)->skip(($current_page - 1) * 10)->get();
        } else {
            $Suppliers = $this->getSupplier($current_page);
            $total = supplier::all()->count();
        }
        return view('dynamic_layout.supplier_reload', ['Suppliers' => $Suppliers, 'total' => $total, 'currentpage' => $current_page])->render();
    }

    public function getAllSuppliers()
    {
        return supplier::all();
    }
}
