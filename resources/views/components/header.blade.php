<div id="header-bar">
    <div class="container">
        <div class="navbar justify-content-end p-0 pr-3">
            @if (session()->has('UserID'))
                <?php $user = App\Models\User::where('id', '=', session()->get('UserID'))->get(); ?>
                <div class="nav-link dropdown disable-select p-0 pt-1">
                    <div class="d-flex">
                        <button class="btn bg-sub p-0 text-white dropdown-toggle font-weight-bold bw-0" type="button"
                            id="dropdownAccountMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <svg class="pr-1 pb-1" version="1.0" xmlns="http://www.w3.org/2000/svg" width="25px"
                                height="25px" viewBox="0 0 1200.000000 1200.000000"
                                preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,1200.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path
                                        d="M5835 11004 c-380 -38 -650 -110 -930 -248 -259 -129 -470 -282 -690 -501 -406 -407 -641 -865 -726 -1417 -27 -173 -33 -564 -11 -738 81 -639 383 -1194 887 -1629 381 -329 792 -515 1310 -593 140 -20 609 -18 755 5 571 89 1044 335 1455 758 390 402 616 849 700 1389 26 164 31 531 11 710 -70 600 -305 1081 -740 1516 -413 411 -863 641 -1421 725 -124 19 -498 33 -600 23z" />
                                    <path
                                        d="M3495 6289 c-284 -16 -528 -81 -776 -205 -297 -148 -569 -411 -775 -750 -254 -417 -411 -880 -523 -1534 -66 -391 -90 -668 -98 -1140 -5 -302 -3 -375 12 -490 51 -403 192 -706 445 -960 227 -227 500 -373 831 -444 247 -53 95 -51 3434 -51 2934 0 3117 1 3235 18 437 62 773 224 1036 500 183 191 305 413 375 684 49 194 61 315 60 638 -1 537 -39 945 -132 1425 -144 741 -384 1286 -752 1709 -146 167 -312 293 -530 401 -264 131 -530 196 -820 201 l-119 2 -76 -40 c-43 -22 -223 -134 -402 -249 -436 -280 -607 -366 -949 -480 -333 -111 -601 -155 -936 -155 -340 0 -620 48 -970 168 -337 116 -480 189 -920 472 -335 216 -436 275 -490 283 -16 3 -88 2 -160 -3z" />
                                </g>
                            </svg>
                            {{ $user[0]->username }}
                        </button>
                        <div class="dropdown-menu animation bg-sub" aria-labelledby="dropdownAccountMenu">
                            <div id="user-edit-information" class="dropdown-item dropdown-login text-white">Đổi thông
                                tin</div>
                            <a href="/purchase_history">
                                <div id="user-purchase-history" class="dropdown-item dropdown-login text-white">Lịch sử
                                    mua hàng</div>
                            </a>
                            <div id="user-edit-password" class="dropdown-item dropdown-login text-white">Đổi mật khẩu
                            </div>
                        </div>
                        <div class="mx-2"> | </div>
                        <a id="login-logout" class="d-flex text-decoration-none text-danger font-weight-bold"
                            href="/logout">
                            Đăng xuất
                            <svg style="padding-top: 2px" version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="25px" height="25px" viewBox="0 0 512.000000 512.000000"
                                preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path
                                        d="M724 4786 l-34 -34 0 -1786 0 -1786 28 -29 c17 -19 318 -181 814 -440 604 -316 795 -411 822 -411 25 0 45 9 68 29 l33 29 3 376 3 376 384 0 384 0 36 31 35 31 0 718 0 718 -35 31 c-48 42 -92 42 -140 0 l-35 -31 0 -639 0 -639 -315 0 -315 0 -2 1310 -3 1310 -25 23 c-14 14 -257 145 -540 292 -283 148 -542 283 -575 302 l-60 33 918 0 917 0 0 -619 0 -619 26 -31 c22 -27 32 -31 76 -31 41 0 54 5 79 29 l29 29 0 700 0 700 -35 31 -36 31 -1235 0 -1236 0 -34 -34z" />
                                    <path
                                        d="M3724 3840 c-48 -19 -71 -100 -43 -151 6 -12 102 -151 215 -311 112 -159 204 -291 204 -294 0 -2 -316 -4 -702 -4 -451 0 -716 -4 -740 -10 -76 -22 -105 -117 -54 -177 l24 -28 741 -5 741 -5 -175 -247 c-277 -394 -265 -374 -265 -425 0 -63 40 -103 102 -103 24 0 53 7 65 15 12 8 102 129 200 268 422 600 393 555 393 602 0 47 29 2 -393 602 -98 139 -188 260 -200 268 -23 16 -79 19 -113 5z" />
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>
            @else
                <div class="d-flex pt-1">
                    <div class="font-weight-bold">
                        <a class="nav-link p-0 text-white font-weight-bold" href="/loginregister"> Đăng nhập </a>
                    </div>
                    <div class="mx-2"> | </div>
                    <div class="font-weight-bold">
                        <a id="login-logout" class="nav-link text-white font-weight-bold" href="/loginregister"> Đăng ký
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>
    <div class="container">
        <nav class="navbar navbar-expand-md navbar-dark font-weight-bold">
            <a href="/" class="position-relative" style="width: 5rem;">
                <img src="{{ url('black-fire-logo.png') }}" width="50" height="50"
                    class="d-inline-block align-top position-absolute" alt="" style="top: -40px; left: 0px">
                <div class="position-absolute text-main"
                    style="top: -5px; left: -15px; background: -webkit-linear-gradient(left, #1d39be, #0bdad0, #745eed, #e900a7);-webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ZippoStore</div>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link d-flex align-items-center" href="/">
                            <i class="m-1 fa-solid fa-house"></i>
                            Trang chủ
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex align-items-center" href="/filter">
                            <i class="m-1 fa-solid fa-filter"></i>
                            Lọc sản phẩm
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex align-items-center" href="/cart">
                            <i class="m-1 fa-solid fa-cart-shopping"></i>
                            Giỏ hàng
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex align-items-center" href="/admin/category">
                            <i class="m-1 fa-solid fa-bars-progress"></i>
                            Quản lý
                        </a>
                    </li>
                </ul>
            </div>
            <form id="search-bar" action="/search" method="GET" class="form-inline my-2 my-md-0">
                <div class="input-group rounded-pill">
                    <input type="text" class="form-control" placeholder="Nhập tên sản phẩm..."
                        id="search_name">
                    <i class="btn bg-white text-dark bi bi-search"></i>
                </div>
            </form>
        </nav>
    </div>
</div>
