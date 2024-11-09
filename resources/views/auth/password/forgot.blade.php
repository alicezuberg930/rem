@extends('components.common')
@section('head')
    <title>Gửi email xác nhận</title>
@endsection

@section('body')
    <div class="shadow-md mx-auto my-8 bg-white p-3 rounded-md max-w-md">
        <form action="/buyer/password/forgot" method="POST">
            @csrf
            <p class="font-semibold text-lg mb-5">Quên mật khẩu?</p>
            <div class="">
                <p class="mb-3 text-sm">Hãy nhập địa chỉ email/số điện thoại mà bạn muốn reset mật khẩu.</p>
                <div class="mb-10">
                    <p class="text-sm font-semibold mb-1">Mobile Number or Email</p>
                    <div class="w-full">
                        <input type="text" placeholder="Email/SĐT" name="email"
                            class="rounded-sm outline-none focus:outline-blue-300 w-full p-2 border">
                    </div>
                    @error('email')
                        <span class="text-xs text-red-700">{{ $message }}</span>
                    @enderror
                    @if (Session::has('status'))
                        <span class="text-xs text-green-500">{{ Session::get('status') }}</span>
                    @endif
                </div>
            </div>
            <div class="">
                <div class="flex gap-3">
                    <a href="/buyer/login" class="py-2 px-4 border-2 border-blue-300 text-blue-300 rounded-sm">
                        Quay lại
                    </a>
                    <button class="py-2 px-4 bg-blue-300 text-white rounded-sm">
                        Xác nhận
                    </button>
                </div>
            </div>
        </form>
    </div>
@endsection
