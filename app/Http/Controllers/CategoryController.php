<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getAllCategory()
    {
        return category::all();
    }

    public static function getCategory($current_page)
    {
        return category::take(10)->skip(($current_page - 1) * 10)->get();
    }

    public function addCategory(Request $request)
    {
        $response = category::create($request->all());
        if (!$response)
            return response()->json(['message' => 'Thêm danh mục thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Thêm danh mục thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
    }

    public function editCategory(Request $request)
    {
        $Category = category::findOrFail($request->input('id'));
        $response = $Category->update($request->all());
        if (!$response || $Category == null)
            return response()->json(['message' => 'Sửa danh mục thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Sửa danh mục thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
    }

    public function deleteCategory(Request $request)
    {
        $response = category::findOrFail($request->input('id'))->delete();
        if (!$response)
            return response()->json(['message' => 'Xóa danh mục thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Xóa danh mục thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
    }

    public function manageCategoryPage()
    {
        $authorize = AuthController::tokenCan("categories:manage");
        if (session()->has('search')) session()->forget("search");
        return view('admin.category_manager', ['authorize' => $authorize, 'Categories' => $this->getCategory(1), 'total' => category::all()->count(), 'currentpage' => 1]);
    }

    public function searchCategory(Request $request)
    {
        session()->put('search', $request->input('category_name'));
        session()->save();
        return $this->categoryReload($request->input('page'));
    }

    public function categoryReload($current_page)
    {
        $Categories = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = category::where('category_name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Categories = $query->take(10)->skip(($current_page - 1) * 10)->get();
        } else {
            $Categories = $this->getCategory($current_page);
            $total = category::all()->count();
        }
        return view('dynamic_layout.category_reload', ['Categories' => $Categories, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
