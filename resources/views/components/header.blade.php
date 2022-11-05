<div id="header-bar">
    <div class="container">
        <div class="navbar justify-content-end p-0 pr-3">
            @if (session()->has('UserID'))
                <?php $user = App\Models\User::where('id', '=', session()->get('UserID'))->get(); ?>
                <div class="nav-link pt-1">
                    <div class="d-flex dropdown">
                        <button class="btn bg-sub p-0 text-white dropdown-toggle font-weight-bold" type="button"
                            id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa-solid fa-user"></i>
                            {{ $user[0]->username }}
                        </button>
                        <div class="dropdown-menu animation bg-secondary mt-4" aria-labelledby="dropdownMenuButton">
                            <a id="user-edit-information" class="dropdown-item text-white">Đổi
                                thông tin</a>
                            <a class="text-white dropdown-item" href="/purchase_history">Lịch sử mua hàng</a>
                            <a id="user-edit-password" class="dropdown-item text-white">Đổi mật
                                khẩu</a>
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
                    <div class="mx-2 text-light"> | </div>
                    <div class="font-weight-bold">
                        <a id="login-logout" class="nav-link text-white font-weight-bold" href="/loginregister">Đăng
                            ký</a>
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
                        <a class="nav-link d-flex align-items-center" href="/admin/manage_category">
                            <i class="m-1 fa-solid fa-bars-progress"></i>
                            Quản lý
                        </a>
                    </li>
                </ul>
            </div>
            <form id="search-bar" action="/search" method="GET" class="form-inline my-2 my-md-0">
                <div class="input-group rounded-pill">
                    <input type="text" class="form-control" placeholder="Nhập tên sản phẩm..." id="search_name">
                    <i class="btn bg-white text-dark bi bi-search"></i>
                </div>
            </form>
        </nav>
    </div>
</div>
