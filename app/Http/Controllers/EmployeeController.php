<?php

namespace App\Http\Controllers;

use App\Models\employee;
use App\Models\group;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public static function getEmployee($current_page)
    {
        return employee::join('groups', 'employees.role_as', '=', 'groups.id')->take(10)->skip(($current_page - 1) * 10)->orderBy('employees.id', 'asc')->get(['*', 'employees.id as eid']);
    }

    public function getEmployeeDetails(Request $request)
    {
        return employee::join('groups', 'employees.role_as', '=', 'groups.id')->where('employees.id', '=', $request->input('id'))->get(['*', 'employees.id as eid'])[0];
    }

    public function addEmployee(Request $request)
    {
        $response = employee::create($request->all());
        if (!$response)
            return response()->json(['message' => 'Thêm nhân viên thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Thêm nhân viên thành công', 'status' => 1, 'response' => $this->employeeReload($request->input('page'))]);
    }

    public function editEmployee(Request $request)
    {
        $employee = employee::findOrFail($request->input('id'));
        $response = $employee->update($request->all());
        if ($response == 0 || $employee == null)
            return response()->json(['message' => 'Sửa nhân viên thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Sửa nhân viên thành công', 'status' => 1, 'response' => $this->employeeReload($request->input('page'))]);
    }

    public function deleteEmployee(Request $request)
    {
        $response = employee::findOrFail($request->input('id'))->delete();
        if (!$response)
            return response()->json(['message' => 'Xóa nhân viên thất bại', 'status' => 0]);
        else
            return response()->json(['message' => 'Xóa nhân viên thành công', 'status' => 1, 'response' => $this->employeeReload($request->input('page'))]);
    }

    public function manageEmployeePage()
    {
        $authorize = AuthController::tokenCan("employees:manage");
        if (session()->has('search')) session()->forget("search");
        return view('admin.employees_manager', ['authorize' => $authorize, 'Employees' => $this->getEmployee(1), 'roles' => group::all(), 'total' => employee::all()->count(), 'currentpage' => 1]);
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
            $query = employee::where('username', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Employees = $query->take(10)->skip(($current_page - 1) * 10)->get();
        } else {
            $Employees = $this->getEmployee($current_page);
            $total = employee::all()->count();
        }
        return view('dynamic_layout.employee_reload', ['Employees' => $Employees, 'total' => $total, 'currentpage' => $current_page])->render();
    }
}
