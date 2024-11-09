<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::commit();
            $review = Review::create($request->all());
            if ($request->has("images") && sizeof($request->images) > 0) {
                $review->addMultipleMediaFromRequest(['images'])->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('medias');
                });
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            dd($th->getMessage());
        }
    }
}
