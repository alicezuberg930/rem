<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use App\Models\User;
use Dotenv\Repository\RepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    public function resetPasswordRequest(Request $request)
    {
        $selector = bin2hex(random_bytes(8));
        $token = random_bytes(32);
        $expire_in = date("U") + 300;
        $reset_email = $request->input("email");
        if ($reset_email == '')
            return response()->json(['message' => 'Email không được rỗng', 'status' => 0]);
        if (PasswordReset::where("email", "=", $reset_email)->first() != null)
            PasswordReset::where("email", "=", $reset_email)->first()->delete();
        $response = new PasswordReset();
        $response->email = $reset_email;
        $response->selector = $selector;
        $response->token = password_hash($token, PASSWORD_DEFAULT);
        $response->expire = $expire_in;
        if ($response->save()) {
            Mail::send(
                "email_templates.reset_password_templates",
                ['token' => bin2hex($token), 'selector' => $selector],
                function ($email) use ($reset_email) {
                    $email->subject('Thông báo đặt lại mật khẩu');
                    $email->to($reset_email, "Header");
                }
            );
            return response()->json(['message' => 'Yêu cầu đổi mật khẩu đã được gửi đến email của bạn', 'status' => 1]);
        } else
            return response()->json(['message' => 'Yêu cầu thất bại', 'status' => 0]);
    }

    public function createNewPasswordPage($selector, $token)
    {
        if (empty($selector) || empty($token)) {
            return "Could not validate your request!";
        }
        if (ctype_xdigit($selector) == true && ctype_xdigit($token) == true) {
            return view("forget_password.create_new_password", ["token" => $token, "selector" => $selector]);
        }
    }

    public function resetPasswordHandler(Request $request)
    {
        $selector = $request->input("selector");
        $token = $request->input("token");
        $password = $request->input("password");
        $retype_password = $request->input("retype_password");
        if ($password == '' || $retype_password == '') {
            return response()->json(["status" => 0, "message" => "Các trường không được trống"]);
        } else if ($password !== $retype_password) {
            return response()->json(["status" => 0, "message" => "Mật khẩu không trùng"]);
        } else {
            $currentDate = date("U");
            $result = PasswordReset::where("selector", "=", $selector)->first();
            if ($result->expire < $currentDate) {
                return response()->json(["status" => 0, "message" => "Hết hạn sử dụng"]);
            } else {
                if (password_verify(hex2bin($token), $result->token)) {
                    $email = $result->email;
                    $user = new User();
                    $user::where("email", "=", $email)->update(['password' => $password]);
                    PasswordReset::where("email", "=", $email)->first()->delete();
                    return response()->json(["status" => 1, "message" => "Đặt lại mật khẩu thành công"]);
                } else {
                    return response()->json(["status" => 0, "message" => "Token không trùng"]);
                }
            }
        }
    }
}
