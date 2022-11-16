<?php

namespace App\Http\Controllers;

use App\Models\orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function manageStatisticPage()
    {
        $Statisic = orders::select(
            DB::raw('sum(total_price) as sums'),
            DB::raw("DATE_FORMAT(order_date,'%M %Y') as months"),
            DB::raw('max(order_date) as createdAt')
        )->where("order_date", ">", \Carbon\Carbon::now()->subMonths(12))->orderBy('createdAt', 'desc')->groupBy('months')->get();
        return view('admin.statistic_manager', ['Statisic' => $Statisic]);
    }
}
