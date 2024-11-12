<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validate = $request->validate([
            "comment" => "required",
            "star" => "required|min:0|max:5",
            "product_id" => "required|exists:products,id",
        ]);
        try {
            DB::commit();
            $review = new Review();
            $review->create($request->all());
            $review->user_id = auth()->user()->id;
            $review->save();
            
            if ($request->has("images") && sizeof($request->images) > 0) {
                foreach ($request->images as $image) {
                    $review->addMedia($image)->toMediaCollection("medias");
                }
            }
            return back();
        } catch (\Throwable $th) {
            DB::rollBack();
            dd($th->getMessage());
        }
    }
}
