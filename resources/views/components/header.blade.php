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
                            <a href="/game/purchase_history/">
                                <div id="user-purchase-history" class="dropdown-item dropdown-login text-white">Lịch sử
                                    mua hàng</div>
                            </a>
                            <div id="user-edit-password" class="dropdown-item dropdown-login text-white">Đổi mật khẩu
                            </div>
                        </div>
                        <div class="mx-2"> | </div>
                        <a id="login-logout" class="d-flex text-danger font-weight-bold" href="#">
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
                        <a id="login-logout" class="nav-link text-white font-weight-bold" href="/loginregister"> Đăng ký </a>
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
                        <a class="nav-link d-flex" href="/game/">
                            <svg class="pr-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="home"
                                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="25px"
                                height="25px">
                                <path fill="currentColor"
                                    d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
                                    class=""></path>
                            </svg>
                            Trang chủ
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex" href="/filter">
                            <svg class="pr-1" version="1.0" xmlns="http://www.w3.org/2000/svg" width="25px"
                                height="25px" viewBox="0 0 400.000000 400.000000"
                                preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path
                                        d="M1760 3482 c-200 -93 -318 -148 -414 -192 -34 -15 -99 -46 -146 -68 -47 -22 -227 -106 -400 -187 -173 -81 -321 -152 -328 -158 -7 -5 -12 -24 -10 -41 3 -34 26 -48 228 -140 47 -21 351 -163 675 -315 l590 -276 70 0 70 0 590 276 c325 152 628 294 675 315 202 92 225 106 228 140 2 17 -3 36 -10 41 -7 6 -155 77 -328 158 -173 81 -366 171 -428 201 -63 30 -115 54 -117 54 -2 0 -41 18 -87 39 -45 21 -181 84 -301 140 l-217 101 -78 0 c-76 -1 -80 -3 -262 -88z" />
                                    <path
                                        d="M790 2163 c-17 -6 -102 -45 -237 -109 -92 -43 -93 -44 -93 -79 0 -35 1 -36 93 -79 187 -88 253 -119 307 -143 30 -14 98 -46 150 -70 52 -25 124 -59 160 -75 36 -17 98 -45 138 -64 161 -76 226 -106 435 -203 293 -136 271 -136 564 0 209 97 274 127 436 203 39 19 101 47 137 64 36 16 108 50 160 75 52 24 120 56 150 70 54 24 120 55 308 143 91 43 92 44 92 79 0 35 -1 36 -92 79 -51 24 -124 58 -163 77 -53 25 -87 34 -141 37 l-71 4 -504 -235 c-277 -130 -524 -240 -549 -246 -30 -7 -60 -7 -90 0 -25 6 -271 116 -547 245 -493 230 -503 234 -565 233 -35 0 -70 -3 -78 -6z" />
                                    <path
                                        d="M800 1301 c-31 -10 -169 -73 -265 -121 -62 -31 -70 -39 -73 -66 -2 -17 3 -36 10 -41 7 -6 155 -77 328 -158 173 -81 366 -171 428 -201 63 -30 115 -54 117 -54 2 0 41 -18 87 -39 558 -260 511 -241 593 -241 82 0 35 -19 593 241 46 21 85 39 87 39 2 0 54 24 117 54 62 30 255 120 428 201 173 81 321 152 328 158 7 5 12 24 10 41 -3 34 -15 41 -238 146 -84 39 -103 44 -165 44 l-70 1 -510 -240 -510 -240 -70 0 -70 0 -509 239 c-442 207 -515 239 -565 242 -31 2 -67 0 -81 -5z" />
                                </g>
                            </svg>
                            Lọc sản phẩm
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link d-flex" href="/cart">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                                viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path
                                        d="M575 4490 c-70 -28 -98 -134 -53 -200 40 -58 47 -60 335 -60 240 0 263 -2 271 -17 6 -10 29 -88 52 -173 23 -85 116 -414 206 -730 91 -316 183 -642 205 -725 41 -153 128 -461 136 -481 2 -7 -16 -19 -42 -28 -88 -29 -182 -111 -237 -204 -45 -76 -61 -145 -56 -247 3 -79 8 -101 40 -167 63 -133 187 -232 324 -260 45 -9 54 -14 48 -27 -4 -9 -9 -54 -12 -100 -13 -253 160 -451 409 -468 134 -10 257 34 346 122 111 112 151 259 117 437 l-6 28 257 0 258 0 -7 -32 c-25 -120 -15 -212 36 -314 146 -301 586 -328 772 -48 84 127 90 348 13 474 -52 84 -131 151 -228 192 l-54 23 -957 5 c-951 5 -957 5 -985 26 -95 70 -98 201 -6 261 26 17 89 18 1138 23 l1110 5 66 31 c116 55 189 137 227 254 12 36 51 187 87 335 36 149 72 295 80 325 8 30 17 69 19 85 3 17 44 183 91 370 77 302 86 347 81 405 -6 89 -20 128 -67 199 -44 66 -131 132 -202 153 -33 10 -334 13 -1397 13 l-1355 0 -63 -23 c-35 -13 -65 -22 -66 -20 -2 1 -34 111 -72 243 -75 262 -92 295 -162 315 -44 12 -668 13 -697 0z m1441 -927 c13 -62 30 -137 38 -167 7 -30 11 -57 8 -60 -3 -3 -86 -6 -184 -6 l-178 0 -11 28 c-6 15 -13 37 -15 49 -2 12 -13 50 -24 85 -24 77 -25 116 -4 146 25 37 49 41 203 39 l144 -2 23 -112z m834 -58 l0 -175 -238 0 -238 0 -33 148 c-19 81 -36 159 -38 175 l-5 27 276 0 276 0 0 -175z m870 170 c0 -2 -13 -64 -29 -137 -17 -73 -33 -150 -37 -171 l-6 -37 -247 2 -246 3 -3 160 c-1 87 0 165 2 172 4 10 66 13 286 13 154 0 280 -2 280 -5z m605 -19 c13 -13 27 -35 30 -49 5 -20 -20 -148 -51 -259 -5 -16 -22 -18 -176 -18 l-170 0 4 28 c8 46 59 296 63 310 3 9 40 12 140 12 130 0 137 -1 160 -24z m-2191 -643 c2 -10 17 -74 31 -143 14 -69 29 -133 31 -143 5 -16 -6 -17 -162 -15 l-167 3 -43 150 c-24 83 -44 153 -44 158 0 4 78 7 174 7 158 0 175 -2 180 -17z m716 -143 l0 -160 -170 0 c-93 0 -170 1 -170 3 0 7 -61 283 -66 300 -5 16 9 17 200 17 l206 0 0 -160z m730 153 c0 -21 -63 -299 -69 -306 -4 -4 -86 -6 -182 -5 l-174 3 -3 145 c-1 79 0 150 2 157 4 10 53 13 216 13 115 0 210 -3 210 -7z m634 -25 c-3 -18 -21 -89 -39 -158 l-31 -125 -157 -3 c-123 -2 -157 0 -157 10 0 18 60 290 66 300 3 4 77 8 165 8 l161 0 -8 -32z m-1916 -730 c18 -79 32 -146 32 -150 0 -5 -58 -8 -129 -8 -108 0 -132 3 -150 18 -15 12 -33 55 -56 137 -19 66 -34 126 -35 133 0 9 37 12 153 12 l154 0 31 -142z m552 -8 l0 -150 -105 0 c-58 0 -105 2 -105 5 0 3 -13 66 -30 140 -16 74 -30 139 -30 145 0 6 51 10 135 10 l135 0 0 -150z m595 138 c3 -7 -8 -74 -23 -148 l-28 -135 -122 -3 -122 -3 0 144 c0 79 3 147 7 150 3 4 69 7 145 7 102 0 140 -3 143 -12z m615 -5 c0 -10 -14 -70 -30 -133 -39 -152 -36 -150 -201 -150 -71 0 -129 3 -129 8 0 4 14 70 30 147 17 77 30 141 30 142 0 2 68 3 150 3 136 0 150 -2 150 -17z m-1777 -1217 c76 -31 113 -117 81 -187 -20 -45 -83 -89 -128 -89 -71 0 -147 76 -146 147 1 43 33 93 76 119 45 27 71 30 117 10z m1396 -14 c14 -10 34 -33 45 -51 49 -84 -10 -195 -110 -207 -79 -10 -154 59 -154 141 0 111 132 182 219 117z" />
                                </g>
                            </svg>
                            Giỏ hàng
                        </a>
                    </li>
                </ul>
            </div>
            <form id="search-bar" action="/search" method="GET" class="form-inline my-2 my-md-0">
                <div class="input-group rounded">
                    <input type="search" class="form-control rounded" name="search"
                        placeholder="Nhập tên tìm kiếm" aria-label="Search" aria-describedby="search-addon" />
                </div>
            </form>
        </nav>
    </div>
</div>
