<div class="bg-gray-800 w-full">
    <div class="xl:w-[65%] w-4/5 m-auto">
        <div class="navbar justify-content-end p-0 pr-3">
            @if (session()->has('UserID'))
                <?php $user = App\Models\User::where('id', '=', session()->get('UserID'))->get(); ?>
                <div class="nav-link pt-1">
                    <div class="d-flex dropdown">
                        <button class="btn p-0 text-white dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <x-forkawesome-user class="text-white w-5 h-5" />
                            {{ $user[0]->username }}
                        </button>
                        <div class="dropdown-menu animation bg-secondary mt-4" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item text-white"
                                href="/personal_information/{{ session()->get('UserID') }}">Thông tin cá nhân</a>
                            <a class="text-white dropdown-item"
                                href="/purchase_history/{{ session()->get('UserID') }}">Lịch sử mua hàng</a>
                            <a class="dropdown-item text-white" href="/personal_password">Đổi mật khẩu</a>
                        </div>
                        <div class="mx-2 text-white"> | </div>
                        <a class="flex text-white items-center gap-1" href="/logout">
                            Đăng xuất
                            <x-mdi-logout class="text-white w-5 h-5" />
                        </a>
                    </div>
                </div>
            @else
                <div class="d-flex pt-1">
                    <div class="">
                        <a class="p-0 text-white" href="/login_register">Đăng nhập</a>
                    </div>
                    <div class="mx-2 text-light"> | </div>
                    <div class="">
                        <a class="p-0 text-white" href="/admin_login">Đăng nhập quản lý</a>
                    </div>
                    <div class="mx-2 text-light"> | </div>
                    <div class="">
                        <a id="login-logout" class="text-white" href="/login_register">Đăng ký</a>
                    </div>
                </div>
            @endif
        </div>
    </div>
    <div class="xl:w-[65%] w-4/5 m-auto">
        <nav class="py-3 flex justify-between items-center gap-10">
            <a href="/" class="h-full flex items-center gap-2">
                <img src="{{ url('assets/black-fire-logo.png') }}" width="50" height="50" alt="logo">
                <div class="logo-text text-2xl font-semibold">ZippoStore</div>
            </a>
            <div class="flex flex-auto gap-3">
                <form action="/search_product" method="GET" class="w-full">
                    <div class="flex rounded-md bg-white">
                        <input type="text" name="search_name" class="px-3 focus:outline-none w-full bg-transparent"
                            placeholder="Tìm kiếm" id="search_name">
                        <x-monoicon-search class="py-1 px-2 text-white h-11 w-12 bg-orange-500 rounded-r-md" />
                    </div>
                </form>
                <a href="/cart">
                    <x-bi-cart class="text-white h-10 w-10" />
                </a>
            </div>
        </nav>
    </div>
</div>
