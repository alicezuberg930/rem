@extends('components.common')
@section('head')
    <title>Đặt lại mật khẩu</title>
@endsection

@section('body')
    <div class="shadow-md mx-auto my-8 bg-white p-3 rounded-md max-w-md">
        <div class="w-full">
            <div class="w-full">
                <p class="font-semibold text-lg mb-5">Đặt lại mật khẩu</p>
                <form action="/buyer/password/reset" method="POST">
                    @csrf
                    <input hidden name="token" value={{ $token }} />
                    <input hidden name="email" value={{ $_GET['email'] }} />
                    <div class="">
                        <div class="">
                            <p class="text-sm font-semibold mb-1">Nhập mật khẩu mới</p>
                            <div class="w-full">
                                <input type="text" placeholder="Mật khẩu mới" name="password"
                                    class="rounded-sm outline-none focus:outline-blue-300 w-full p-2 border">
                            </div>
                            @error('password')
                                <span class="text-xs text-red-700">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="h-3"></div>
                    <div class="">
                        <div class="mb-10">
                            <p class="text-sm font-semibold mb-1">Xác nhận mật khẩu</p>
                            <div class="w-full">
                                <input type="text" placeholder="Xác nhận mật khẩu" name="password_confirmation"
                                    class="rounded-sm outline-none focus:outline-blue-300 w-full p-2 border">
                            </div>
                            @error('error')
                                <span class="text-xs text-red-700">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="">
                        <button class="py-2 px-4 bg-blue-300 text-white rounded-sm">
                            Xác nhận
                        </button>
                    </div>
                    @if (Session::has('status'))
                        <span class="text-xs text-green-500">{{ Session::get('status') }}</span>
                    @endif
                </form>
            </div>
        </div>
    </div>
@endsection
