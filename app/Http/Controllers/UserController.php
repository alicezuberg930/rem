<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $image = $request->file('image');
        if (!in_array($image->extension(), ["jpg", "png", "jpeg", "jiff"])) {
            return response()->json(["error" => "Wrong extension"], 400);
        }
        $user = User::find(Auth::id());
        $user->clearMediaCollection("avatar");
        $user->addMedia($image)->toMediaCollection("avatar");
        return response()->json(["url" => $user->getFirstMediaUrl("avatar")], 200);
        // $user = User::find($request->input('id'));
        // if ($user->update($request->all()))
        //     return response()->json(['message' => 'Đã thay đổi thông tin', 'status' => 1]);
        // else
        //     return response()->json(['message' => 'Đổi thông tin thất bại', 'status' => 0]);
    }

    // public function changePassword(Request $request)
    // {
    //     // Auth::logoutOtherDevices($currentPassword);
    //     $user = User::find($request->input('id'));
    //     if ($request->input('current_password') != $user->password)
    //         return response()->json(['status' => 0, 'message' => "Mật khẩu không trùng với hiện tại"]);
    //     if ($request->input('current_password') != $request->input('retype_password'))
    //         return response()->json(['status' => 0, 'message' => "Mật khẩu không trùng"]);
    //     if (!$request->input('checkNewPassword'))
    //         return response()->json(['status' => 0, 'message' => "Mật khẩu mới không đúng định dạng"]);
    //     if ($user->update(['password' => $request->input("new_password")])) {
    //         return response()->json(['status' => 1, 'message' => "Cập nhật mật khẩu thành công"]);
    //     } else {
    //         return response()->json(['status' => 0, 'message' => "Cập nhật mật khẩu thất bại"]);
    //     }
    // }
}
