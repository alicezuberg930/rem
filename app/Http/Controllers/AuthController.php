<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function verifyUser($token)
    {
        $user = User::where('email', '=', session()->get('email'))->first();
        if ($user->remember_token === $token) {
            session()->forget('email');
            session()->put('UserID', $user->id);
            session()->save();
            $user->update(['email_verified_at' => date('Y-m-d h:i:s')]);
            return redirect('/');
        } else
            return response()->json(['message' => 'Người dùng không hợp lệ']);
    }

    public function login(Request $request)
    {
        $token = $request->input('token');
        $user = User::where('email', '=', $request->input('email'))->first();
        if ($user) {
            if ($user->email_verified_at == null)
                return response()->json(['message' => 'Hãy xác nhận tài khoản của mình trước khi đăng nhập', 'status' => -2]);
            if (($request->input('password') == $user->password)) {
                session()->put('UserID', $user->id);
                session()->put('token', $token);
                $user::where("id", "=", session()->get('UserID'))->update(['remember_token' => $token]);
                return response()->json(['message' => 'Đăng nhập thành công', 'status' => 1,]);
            } else
                return response()->json(['message' => 'Mật khẩu không hợp lệ', 'status' => 0]);
        } else {
            return response()->json(['message' => 'Email chưa được sử dụng', 'status' => -1]);
        }
    }

    // public function CreateNewToken($token)
    // {
    //     return response()->json([
    //         'access_token' => $token,
    //         'token_type' => 'bearer',
    //         'expires_in' => JWTAuth::factory()->getTTL() * 60,
    //         'user' => auth()->user()
    //     ]);
    // }

    public function logout()
    {
        $user = new User();
        $user::where("id", "=", session()->get('UserID'))->update(['remember_token' => '']);
        session()->forget('token');
        session()->forget('UserID');
        return redirect('/');
    }

    public function register(Request $request)
    {
        if (count(User::where('email', '=', $request->input('email'))->get()) > 0)
            return response()->json([
                'message' => 'Email đã được sử dụng',
                'status' => -1
            ]);
        if (count(User::where('phonenumber', '=', $request->input('phonenumber'))->get()) > 0)
            return response()->json([
                'message' => 'Số điện thoại đã được sử dụng',
                'status' => -2
            ]);
        $token = $request->input('token');
        $RegisteredEmail = $request->input('email');
        $user = new User();
        $user->email = $RegisteredEmail;
        $user->gender = $request->input('gender');
        $user->password = $request->input('password');
        $user->phonenumber = $request->input('phonenumber');
        $user->username = $request->input('username');
        $user->remember_token = $token;
        $res = $user->save();
        if ($res) {
            Mail::send("email_templates.register", ['token' => $token, 'username' => $request->input('username')], function ($email) use ($RegisteredEmail) {
                $email->subject('Thông báo đăng ký');
                $email->to($RegisteredEmail, "Header");
            });
            session()->put('email', $RegisteredEmail);
            return response()->json([
                'message' => '1 email đã được gửi đến hòm thư của bạn, hãy kiểm tra nó',
                'status' => 1
            ], 201);
        } else {
            return response()->json([
                'message' => 'Đăng ký thất bại',
                'status' => 0
            ], 200);
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
}
