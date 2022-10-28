<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function login(Request $request)
    {
        $user = User::where('email', '=', $request->input('email'))->first();
        if ($user) {
            if (($request->input('password') == $user->password)) {
                session()->put('UserID', $user->id);
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
        auth()->logout();
        session()->forget('UserID');
        return response()->json([
            'message' => 'Đã đăng xuất thành công'
        ]);
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
        $user = new User();
        $user->email = $request->input('email');
        $user->gender = $request->input('gender');
        $user->password = $request->input('password');
        $user->phonenumber = $request->input('phonenumber');
        $user->username = $request->input('username');
        $res = $user->save();
        if ($res) {
            return response()->json([
                'message' => 'Đăng ký thành công',
                'status' => 1
            ], 201);
        } else {
            return response()->json([
                'message' => 'Đăng ký thất bại',
                'status' => 0
            ], 200);
        }
        // $password = $request->input('r-password');
        // $user = User::create(array_merge([
        //     $validator->validated(),
        //     ['password' => bcrypt($password)]
        // ]));
    }
}
