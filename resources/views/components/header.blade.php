<div class="bg-gray-800 w-full">
    <div class="xl:w-[65%] w-4/5 m-auto">
        <div class="flex justify-end">
            @if (auth()->user())
                <div class="group pt-2">
                    <div class="relative">
                        <button class="text-white flex gap-2 items-center">
                            <img src={{ auth()->user()->getAvatarAttribute() }}
                                class="h-6 w-6 rounded-full object-cover" />
                            {{ auth()->user()->username }}
                        </button>
                        <div
                            class="rounded-md whitespace-nowrap mt-2 hidden w-fit group-hover:block absolute top-4 right-0 shadow-lg p-3 bg-white z-50">
                            <a class="block" href="/user/profile">Thông tin cá nhân</a>
                            <a class="block py-3" href="/user/orders">Lịch sử mua hàng</a>
                            <a class="block" href="/logout">Đăng xuất</a>
                        </div>
                    </div>
                </div>
            @else
                <div class="flex pt-1">
                    <div class="">
                        <a class="p-0 text-white" href="/buyer/login">Đăng nhập</a>
                    </div>
                    <div class="mx-2 text-light"> | </div>
                    <div class="">
                        <a id="login-logout" class="text-white" href="/buyer/signup">Đăng ký</a>
                    </div>
                </div>
            @endif
        </div>
    </div>
    <div class="xl:w-[65%] w-4/5 m-auto">
        <nav class="py-3 flex justify-between items-center gap-8">
            <a href="/" class="h-full flex items-center gap-2">
                <img src="{{ url('assets/black-fire-logo.png') }}" width="50" height="50" alt="logo">
                <div class="logo-text text-2xl font-semibold hidden md:block">ZippoStore</div>
            </a>
            <div class="flex flex-auto gap-3 items-center">
                <form action="/search_product" method="GET" class="w-full">
                    <div class="flex rounded-md bg-white">
                        <input type="text" name="search_name" class="px-3 focus:outline-none w-full bg-transparent"
                            placeholder="Tìm kiếm" id="search_name">
                        <x-monoicon-search class="py-1 px-2 text-white h-11 w-12 bg-blue-300 rounded-r-md" />
                    </div>
                </form>
                <div class="relative h-6 w-6">
                    <div class="absolute -top-3 -right-3 p-[3px] bg-blue-300 text-xs text-white rounded-xl">10</div>
                    <a href="/cart">
                        <x-bi-cart class="text-blue-300 h-6 w-6" />
                    </a>
                </div>
            </div>
        </nav>
    </div>
</div>
