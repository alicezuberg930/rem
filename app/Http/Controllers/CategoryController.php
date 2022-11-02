<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public static function getCategory()
    {
        return category::all();
    }

    public function addCategory(Request $request)
    {
        $response = category::create($request->all());
        if (!$response)
            return response()->json(['message' => 'Thêm thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Thêm thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
    }

    public function editCategory(Request $request)
    {
        $Category = category::findOrFail($request->input('id'));
        $response = $Category->update($request->all());
        if (!$response)
            return response()->json(['message' => 'Sửa thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Sửa thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
    }

    public function deleteCategory(Request $request)
    {
        $response = category::findOrFail($request->input('id'))->delete();
        if (!$response)
            return response()->json(['message' => 'Xóa thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Xóa thành công', 'status' => 1, 'response' => $this->categoryReload($request->input('page'))]);
    }

    public function manageCategoryPage()
    {
        return view('admin.category_manager', ['Categories' => $this->getCategory(), 'currentpage' => 1]);
    }

    public function categoryReload($current_page)
    {
        return response(view('dynamic_layout.category_reload', ['Categories' => $this->getCategory(), 'currentpage' => $current_page]));
    }
}
