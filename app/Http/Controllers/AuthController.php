<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\employee;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Request as FacadesRequest;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            if (Auth::attempt($credentials, true)) {
                $request->session()->regenerate();
                return redirect("/");
            } else {
                return back()->withErrors(["message" => "Đăng nhập thất bại."]);
            }
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    public function signup(RegisterRequest $request)
    {
        try {
            DB::commit();
            $credentials = $request->validated();

            $user = User::create($credentials);

            if ($user) {
                Auth::login($user, true);
                Mail::send("email_templates.register", ['username' => $request->input('username')], function ($email) use ($request) {
                    $email->subject('Thông báo đăng ký');
                    $email->to($request->email, "Header");
                });
                return redirect("/");
            } else {
                return back()->withErrors(["message" => "Đăng ký thất bại."]);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
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

    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return redirect('/');
    }

    public function resendVerifyEmail(Request $request)
    {
        try {
            $request->user()->sendEmailVerificationNotification();
            return back()->with('message', 'Đã gửi lại link xác thực!');
        } catch (\Throwable $th) {
            return back()->with('message', $th->getMessage());
        }
    }

    public function forgotPassword(Request $request)
    {
        try {
            DB::commit();
            $request->validate(["email" => "required|email"]);

            $status = Password::sendResetLink($request->only("email"));

            return $status === Password::RESET_LINK_SENT
                ? back()->with(["status" => __($status)])
                : back()->withErrors(["email" => __($status)]);
        } catch (\Throwable $th) {
            DB::rollBack();
            dd($th->getMessage());
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            "token" => "required",
            "email" => "required|email",
            "password" => "required|min:8|confirmed",
        ]);
        try {
            $status = Password::reset(
                $request->only("email", "password", "password_confirmation", "token"),
                function (User $user, string $password) {
                    $user->forceFill([
                        "password" => $password
                    ])->setRememberToken(Str::random(60));
                    $user->save();
                    event(new PasswordReset($user));
                }
            );

            return $status === Password::PASSWORD_RESET
                ? redirect()->route("buyer.login")->with("status", __($status))
                : back()->withErrors(['error' => [__($status)]]);
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
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
