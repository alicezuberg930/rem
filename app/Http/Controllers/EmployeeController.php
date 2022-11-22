<?php

namespace App\Http\Controllers;

use App\Models\employee;
use App\Models\group;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{


    public static function getEmployee($current_page)
    {
        return employee::join('groups', 'employees.role_as', '=', 'groups.id')->take(5)->skip(($current_page - 1) * 5)->get(['*', 'employees.id as eid']);
    }

    public function getEmployeeDetails(Request $request)
    {
        return employee::join('groups', 'employees.role_as', '=', 'groups.id')->where('employees.id', '=', $request->input('id'))->get(['*', 'employees.id as eid'])[0];
    }

    public function manageEmployeePage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.employees_manager', ['Employees' => $this->getEmployee(1), 'roles' => group::all(), 'total' => employee::all()->count(), 'currentpage' => 1]);
    }

    public function searchEmployee(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->employeeReload($request->input('page'));
    }

    public function employeeReload($current_page)
    {
        $Employees = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = employee::where('name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Employees = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Employees = $this->getEmployee($current_page);
            $total = employee::all()->count();
        }
        return view('dynamic_layout.employee_reload', ['Employees' => $Employees, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
