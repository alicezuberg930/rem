<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
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
            return redirect('/');
        } else
            return response()->json(['message' => 'Người dùng không hợp lệ']);
    }

    public function login(Request $request)
    {
        $token = $request->input('_token');
        $user = User::where('email', '=', $request->input('email'))->first();
        if ($user) {
            if (($request->input('password') == $user->password)) {
                session()->put('UserID', $user->id);
                session()->put('token', $token);
                $a = new User();
                $a->setRememberToken($token);
                $a->save();
                return response()->json([
                    'message' => 'Đăng nhập thành công',
                    'status' => 1,
                ]);
            } else
                return response()->json([
                    'message' => 'Mật khẩu không hợp lệ',
                    'status' => 0
                ]);
        } else {
            return response()->json([
                'message' => 'Email chưa được sử dụng',
                'status' => -1
            ]);
        }
        // $validator = Validator::make($request->all(), [
        //     'email' => 'required|email',
        //     'password' => 'required|min:6'
        // ]);
        // if (!$token = auth()->attempt($validator->validated()))
        //     return response()->json(['error' => 'Người dùng không hợp lệ'], 401);
        // return $this->CreateNewToken($token);
    }

    public function CreateNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

    public function logout()
    {
        // auth()->logout();
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
        $token = $request->input('_token');
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
    public function setCookie(Request $request)
    {
        Cookie::queue('name', 'valusase', 60);
        $value = Cookie::get('name');
        dd($value);
    }
}
