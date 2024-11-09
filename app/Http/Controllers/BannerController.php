<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::commit();
            $review = Banner::create($request->all());
            if ($request->has("image")) {
                $review->addMediaFromRequest('image')->toMediaCollection();
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            dd($th->getMessage());
        }
    }
}
