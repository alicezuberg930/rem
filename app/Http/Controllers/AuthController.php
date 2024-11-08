<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Models\employee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request as FacadesRequest;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        if (Auth::attempt($credentials, true)) {
            $request->session()->regenerate();
            return redirect("/");
        }

        return back()->withErrors([
            "email" => "The provided credentials do not match our records.",
            "password" => "The provided password is wrong",
        ]);
    }

    public function signup(Request $request)
    {
        try {
            $credentials = $request->validate([
                "email" => "required|email",
                "password" => "required",
                "username" => "required",
                "phone" => "required|regex:/(0)[0-9]{9}/",
                "gender" => "required",
                "role_id" => "required",
            ]);
            if (count(User::where('email', $request->email)->get()) > 0) {
                dd("The provided email is already registered.");
                return back()->withErrors([
                    "email" => "The provided email is already registered."
                ]);
            }
            if (count(User::where('phone', $request->phone)->get()) > 0) {
                dd("The provided phone is already registered");
                return back()->withErrors([
                    "phone" => "The provided phone is already registered."
                ]);
            }

            $user = User::create($credentials);

            if ($user) {
                Auth::login($user, true);
                Mail::send("email_templates.register", ['username' => $request->input('username')], function ($email) use ($request) {
                    $email->subject('Thông báo đăng ký');
                    $email->to($request->email, "Header");
                });
                return redirect("/");
            } else {
                return back()->withErrors([
                    "message" => "Đăng ký thất bại."
                ]);
            }
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        // FacadesRequest::session()->invalidate();
        // FacadesRequest::session()->regenerateToken();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect("/");
    }

    public function verifyUser($token)
    {
        $user = User::where('email', '=', session()->get('email'))->first();
        if ($user->remember_token == $token) {
            session()->forget('email');
            session()->put('UserID', $user->id);
            session()->save();
            $user->update(['email_verified_at' => date('Y-m-d h:i:s')]);
            return redirect('/');
        } else
            return response()->json(['message' => 'Người dùng không hợp lệ']);
    }

    public function editPersonalInfo(Request $request)
    {
        $user = User::find($request->input('id'));
        if ($user->update($request->all()))
            return response()->json(['message' => 'Đã thay đổi thông tin', 'status' => 1]);
        else
            return response()->json(['message' => 'Đổi thông tin thất bại', 'status' => 0]);
    }

    public function changePassword(Request $request)
    {
        // Auth::logoutOtherDevices($currentPassword);
        $user = User::find($request->input('id'));
        if ($request->input('current_password') != $user->password)
            return response()->json(['status' => 0, 'message' => "Mật khẩu không trùng với hiện tại"]);
        if ($request->input('current_password') != $request->input('retype_password'))
            return response()->json(['status' => 0, 'message' => "Mật khẩu không trùng"]);
        if (!$request->input('checkNewPassword'))
            return response()->json(['status' => 0, 'message' => "Mật khẩu mới không đúng định dạng"]);
        if ($user->update(['password' => $request->input("new_password")])) {
            return response()->json(['status' => 1, 'message' => "Cập nhật mật khẩu thành công"]);
        } else {
            return response()->json(['status' => 0, 'message' => "Cập nhật mật khẩu thất bại"]);
        }
    }

    public static function tokenCan($needle)
    {
        $abilitiesStr = '';
        if (session()->has("Employee")) {
            $abilitiesStr = employee::join('personal_access_tokens', 'employees.id', '=', 'tokenable_id')
                ->where('employees.id', '=', session('Employee')['EmployeeID'])->first(['abilities'])->abilities;
        }
        return str_contains($abilitiesStr, $needle);
    }
}
