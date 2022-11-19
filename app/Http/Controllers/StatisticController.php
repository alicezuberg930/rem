<?php

namespace App\Http\Controllers;

use App\Models\orders;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PDO;

class StatisticController extends Controller
{
    public function manageStatisticPage(Request $request)
    {
        $Statisic = DB::select('select t1.month, t1.md,
        coalesce(SUM(t1.amount+t2.amount), 0) AS total
        from 
        (
          select DATE_FORMAT(a.Date,"%b") as month,
          DATE_FORMAT(a.Date, "%Y-%m") as md,
          "0" as amount
          from (
            select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY as Date
            from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
            cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
          ) a
          where a.Date <= date("2022-12-31") and a.Date >= Date_add(date("2022-12-31"),interval - 11 month)
          group by md
        )t1
        left join
        (
          SELECT DATE_FORMAT(order_date, "%b") AS month, SUM(total_price) as amount ,DATE_FORMAT(order_date, "%Y-%m") as md
          FROM orders
          where order_date <= date("2022-12-31") and order_date >= Date_add(date("2022-12-31"),interval - 11 month)
          GROUP BY md
        )t2
        on t2.md = t1.md 
        group by t1.md
        order by t1.md asc');
        // orders::select(
        //     DB::raw('sum(total_price) as sums'),
        //     DB::raw("DATE_FORMAT(order_date,'%M %Y') as months"),
        //     DB::raw('max(order_date) as createdAt')
        // )->where("order_date", ">", \Carbon\Carbon::now()->subMonths(12))->orderBy('order_date', 'desc')->groupBy('months')->get();
        return view('admin.statistic_manager', ['Statisic' => $Statisic]);
    }
}
