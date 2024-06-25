<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\employee;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    private $sale_abilities = ['products:manage', 'categories:manage', 'statistic:manage', 'orders:manage', 'sales:manage', 'customers:manage',];
    private $storage_abilities = ['suppliers:manage', 'import_slips:manage'];
    private $admin_abilities = ['employees:manage'];
    private $shipper_abilities = ['shippings:manage'];

    public function login(Request $request)
    {
        $token = '';
        $employee = employee::where('email', $request->input('email'))->first();
        if ($employee) {
            if (($request->input('password') == $employee->password)) {
                if ($employee->role_as == 1)
                    $token = $employee->createToken('access-token', $this->sale_abilities)->plainTextToken;
                if ($employee->role_as == 2)
                    $token = $employee->createToken('access-token', $this->storage_abilities)->plainTextToken;
                if ($employee->role_as == 3)
                    $token = $employee->createToken('access-token', array_merge($this->sale_abilities, $this->storage_abilities, $this->admin_abilities, $this->shipper_abilities))->plainTextToken;
                if ($employee->role_as == 4)
                    $token = $employee->createToken('access-token', $this->shipper_abilities)->plainTextToken;
                session()->put('Employee', ['EmployeeID' => $employee->id, 'Token' => $token]);
                return response()->json(['message' => 'Đăng nhập thành công', 'status' => 1,]);
            } else {
                return response()->json(['message' => 'Mật khẩu không hợp lệ', 'status' => 0]);
            }
        } else {
            return response()->json(['message' => 'Email không tồn tại', 'status' => -1]);
        }
    }

    public function logout()
    {
        employee::find(session('Employee')['EmployeeID'])->tokens()->delete();
        session()->forget('Employee');
        return redirect('/');
    }
}
