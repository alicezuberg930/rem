<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function addCategory(Request $request)
    {
        // return category::create($request->all());
        $Category = new category;
        // $Category->name = "BẬT LỬA ZIPPO PHỔ THÔNG";
        // $Category->save();
    }

    public function editCategory(Request $request)
    {
        $Category = category::findOrFail($request->input('id'));
        $Category->update($request->all());
        return $Category;
    }

    public function deleteCategory(Request $request)
    {
        // $Category = ;
        return category::findOrFail($request->input('id'))->delete();
    }

    public static function getCategory()
    {
        return category::all();
    }
}
