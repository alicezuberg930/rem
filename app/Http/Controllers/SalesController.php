<?php

namespace App\Http\Controllers;

use App\Models\sales;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public static function getSales($current_page)
    {
        return sales::take(10)->skip(($current_page - 1) * 10)->get();
    }

    public function getSaleDetails(Request $request)
    {
        return sales::find($request->input('id'));
    }

    public function addSale(Request $request)
    {
        $response = sales::create($request->all());
        if (!$response)
            return response()->json(['message' => 'Thêm khuyến mãi thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Thêm khuyến mãi thành công', 'status' => 1, 'response' => $this->SaleReload($request->input('page'))]);
    }

    public function editSale(Request $request)
    {
        $Sale = sales::findOrFail($request->input('id'));
        $response = $Sale->update($request->all());
        if (!$response || $Sale == null)
            return response()->json(['message' => 'Sửa khuyến mãi thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Sửa khuyến mãi thành công', 'status' => 1, 'response' => $this->SaleReload($request->input('page'))]);
    }

    public function deleteSale(Request $request)
    {
        $response = sales::findOrFail($request->input('id'))->delete();
        if (!$response)
            return response()->json(['message' => 'Xóa khuyến mãi thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Xóa khuyến mãi thành công', 'status' => 1, 'response' => $this->SaleReload($request->input('page'))]);
    }

    public function manageSalePage()
    {
        $authorize = AuthController::tokenCan("sales:manage");
        if (session()->has('search')) session()->forget("search");
        return view('admin.sales_manager', ['authorize' => $authorize, 'Sales' => $this->getSales(1), 'total' => sales::all()->count(), 'currentpage' => 1]);
    }

    public function searchSale(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->SaleReload($request->input('page'));
    }

    public function SaleReload($current_page)
    {
        $Categories = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = sales::where('salename', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Categories = $query->take(10)->skip(($current_page - 1) * 10)->get();
        } else {
            $Categories = $this->getSales($current_page);
            $total = sales::all()->count();
        }
        return view('dynamic_layout.sale_reload', ['Sales' => $Categories, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
