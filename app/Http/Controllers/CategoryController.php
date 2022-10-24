<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function addCategory(Request $request)
    {
        return category::create($request->all());
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

    public function getCategory()
    {
    }
}
