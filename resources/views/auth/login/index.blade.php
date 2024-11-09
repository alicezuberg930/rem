@extends('components.common')

@section('head')
    <title>Đăng Nhập</title>
    <link rel="stylesheet" type="text/css" href="{{ url('./css/login_register.css') }}">
@endsection

@section('body')
    <div class="bg-half-gradient h-[600px]">
        <div class="bg-no-repeat mx-auto bg-center bg-cover h-full w-[500px] lg:w-[900px] flex justify-between items-center"
            style="background-image: url({{ url('assets/online_shopping.jpg') }});">
            <div></div>
            <div class="p-4 bg-white rounded-md">
                <div class="">
                    <div class="mb-3">
                        <div class="flex justify-between items-center">
                            <div class="font-semibold text-xl">Đăng nhập</div>
                            <a title="Đăng nhập với mã QR" class="text-blue-300" href="/buyer/login/qr">
                                <x-bi-qr-code-scan class="w-10 h-10" />
                            </a>
                        </div>
                    </div>
                    <div class="mb-2">
                        <form method="POST" action="/buyer/login" class="mb-1">
                            @csrf
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <input class="focus:outline-blue-300 w-full p-2 border outline-none" type="text"
                                        placeholder="Email/Số điện thoại/Tên đăng nhập" autocomplete="off" name="email"
                                        maxlength="128">
                                </div>
                                <span class="error text-xs">
                                    @error('email')
                                        {{ $message }}
                                    @enderror
                                </span>
                            </div>
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <input class="focus:outline-blue-300 w-full p-2 border outline-none" type="password"
                                        placeholder="Mật khẩu" autocomplete="current-password" name="password"
                                        maxlength="16">
                                </div>
                                <span class="error text-xs">
                                    @error('password')
                                        {{ $message }}
                                    @enderror
                                </span>
                            </div>
                            <button class="rounded-md py-2 w-full bg-blue-300 text-white">Đăng nhập</button>
                        </form>
                        <div class="text-xs text-blue-300 flex justify-between mb-2">
                            <a class="" href="/buyer/password/forgot">Quên mật khẩu</a>
                            <a class="" href="/buyer/login/otp">Đăng nhập với SMS</a>
                        </div>
                        <div class="">
                            <div class="mb-3 flex justify-center items-center">
                                <div class="border-b w-full"></div>
                                <span class="px-4 text-sm">hoặc</span>
                                <div class="border-b w-full"></div>
                            </div>
                            <div class="mb-4 flex gap-4 text-sm">
                                <button class="flex gap-2 items-center justify-center flex-1 p-2 border">
                                    <div class="">
                                        <x-bi-facebook class="w-6 h-6 hover:text-blue-500" fill="#1a77e1" />
                                    </div>
                                    <div class="">Facebook</div>
                                </button>
                                <button class="flex gap-2 items-center justify-center flex-1 p-2 border">
                                    <div class="">
                                        <img class="w-6 h-6" src={{ url('assets/google_icon.png') }} />
                                    </div>
                                    <div class="">Google</div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm text-center">
                        <div class="text-gray-500">
                            Bạn mới biết đến Store?
                            <a class="text-blue-30" href="/buyer/signup">Đăng ký</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
