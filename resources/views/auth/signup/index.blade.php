@extends('components.common')

@section('head')
    <title>Đăng ký</title>
@endsection

@section('body')
    <div class="bg-half-gradient">
        <div class="bg-no-repeat mx-auto bg-center bg-cover h-full w-[500px] lg:w-[900px] flex justify-end"
            style="background-image: url({{ url('assets/online_shopping.jpg') }});">
            <div class="my-4 p-4 bg-white rounded-md">
                <div class="w-[340px]">
                    <div class="mb-3">
                        <div class="flex justify-between items-center">
                            <div class="font-semibold text-xl">Đăng ký</div>
                            <a title="Đăng nhập với mã QR" class="text-blue-300" href="/buyer/login/qr">
                                <x-bi-qr-code-scan class="w-10 h-10" />
                            </a>
                        </div>
                    </div>
                    <div class="mb-2">
                        <form method="POST" action="/buyer/signup" class="mb-1">
                            @csrf
                            <input hidden name="role_id" value="2" type="number" />
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <input class="focus:outline-blue-300 w-full p-2 border outline-none" type="text"
                                        placeholder="Email" autocomplete="on" name="email" maxlength="128">
                                </div>
                                <span class="error text-xs">
                                    @error('email')
                                        {{ $message }}
                                    @enderror
                                </span>
                            </div>
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <input class="focus:outline-blue-300 w-full p-2 border outline-none" type="text"
                                        placeholder="Số điện thoại" autocomplete="on" name="phone" maxlength="128">
                                </div>
                                <span class="error text-xs">
                                    @error('phone')
                                        {{ $message }}
                                    @enderror
                                </span>
                            </div>
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <input class="focus:outline-blue-300 w-full p-2 border outline-none" type="text"
                                        placeholder="Tên đăng nhập" autocomplete="on" name="username" maxlength="128">
                                </div>
                                <span class="error text-xs">
                                    @error('username')
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
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <input class="focus:outline-blue-300 w-full p-2 border outline-none" type="text"
                                        placeholder="Xác nhận mật khẩu" autocomplete="on" name="rePassword" maxlength="128">
                                </div>
                                <span class="error text-xs">
                                    @error('rePassword')
                                        {{ $message }}
                                    @enderror
                                </span>
                            </div>
                            <div class="mb-4">
                                <div class="w-[340px]">
                                    <select name="gender" class="focus:outline-blue-300 w-full p-2 border outline-none">
                                        <option selected value="1">Nam</option>
                                        <option value="0">Nữ</option>
                                    </select>
                                </div>
                                <span class="error text-xs">
                                    @error('gender')
                                        {{ $message }}
                                    @enderror
                                </span>
                            </div>
                            <button class="mb-3 rounded-md py-2 w-full bg-blue-300 text-white">Đăng ký</button>
                        </form>
                    </div>
                    <div class="text-sm text-center">
                        <span class="text-gray-500">
                            Bằng việc đăng ký, bạn đã đồng ý với ZippoStore về
                            <a class="text-blue-30" href="/policy">điều khoản dịch vụ</a>
                            &
                            <a class="text-blue-30" href="/privacy">chính sách bảo mật</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
