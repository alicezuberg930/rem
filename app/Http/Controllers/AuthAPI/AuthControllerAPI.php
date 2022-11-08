<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthControllerAPI extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);
        if ($validator->fails())
            return response()->json($validator->errors()->toJson(), 422);
        if (!$token = auth()->attempt($validator->validated()))
            return response()->json(['error' => 'Người dùng không hợp lệ'], 401);
        return $this->CreateNewToken($token);
    }

    public function CreateNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->getTL
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request()->all(), [
            'r-username' => 'required',
            'r-email' => 'required|email|unique:users',
            'r-password' => 'required|min:6',
            'check-password' => 'required|same:password',
            'phone-number' => 'required',
            'gender' => 'required'
        ]);
        if ($validator->fails())
            return response()->json($validator->errors()->toJson(), 400);
        $password = $request->input('r-password');
        $user = User::create(array_merge([
            $validator->validated(),
            ['password' => bcrypt($password)]
        ]));
        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => $user,
        ], 201);
    }
}
