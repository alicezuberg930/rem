<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function addCategory(Request $request)
    {
        try {
            Category::create($request->all());
            return response()->json(['message' => 'Thêm danh mục thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Thêm danh mục thất bại', 'status' => 0]);
        }
    }

    public function editCategory(Request $request)
    {
        try {
            Category::findOrFail($request->input('id'))->update($request->all());
            return response()->json(['message' => 'Sửa danh mục thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Sửa danh mục thất bại', 'status' => 0]);
        }
    }

    public function deleteCategory(Request $request)
    {
        try {
            Category::findOrFail($request->input('id'))->delete();
            return response()->json(['message' => 'Xóa danh mục thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
        } catch (\Exception) {
            return response()->json(['message' => 'Danh mục còn trong sản phẩm', 'status' => 0]);
        }
    }

    public static function getCategory($current_page = 1)
    {
        return Category::take(10)->skip(($current_page - 1) * 10)->get();
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

    public function categoryReload($current_page = 1)
    {
        $Categories = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = Category::where('category_name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Categories = $query->take(10)->skip(($current_page - 1) * 10)->get();
        } else {
            $Categories = $this->getCategory($current_page);
            $total = Category::all()->count();
        }
        return view('dynamic_layout.category_reload', ['Categories' => $Categories, 'total' => $total, 'currentpage' => $current_page])->render();
    }

    public function getAllCategory()
    {
        return Category::all();
    }
}
