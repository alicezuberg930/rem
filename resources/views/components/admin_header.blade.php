<?php $employee = App\Models\employee::where('id', '=', session('Employee')['EmployeeID'])->get(); ?>
<div class="row row-cols-1 row-cols-md-4 justify-content-end bg-secondary">
    <div class="">
        <div class="d-flex align-items-center p-1">
            <button class="btn bg-sub p-0 text-white font-weight-bold" type="button">
                <i class="fa-solid fa-user"></i>
                {{ $employee[0]->username }}
            </button>
            <div class="mx-2 text-white"> | </div>
            <a id="login-logout" class="d-flex text-decoration-none text-danger font-weight-bold" href="/admin/logout">
                Đăng xuất
                <svg style="padding-top: 2px" version="1.0" xmlns="http://www.w3.org/2000/svg" width="25px"
                    height="25px" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor"
                        stroke="none">
                        <path
                            d="M724 4786 l-34 -34 0 -1786 0 -1786 28 -29 c17 -19 318 -181 814 -440 604 -316 795 -411 822 -411 25 0 45 9 68 29 l33 29 3 376 3 376 384 0 384 0 36 31 35 31 0 718 0 718 -35 31 c-48 42 -92 42 -140 0 l-35 -31 0 -639 0 -639 -315 0 -315 0 -2 1310 -3 1310 -25 23 c-14 14 -257 145 -540 292 -283 148 -542 283 -575 302 l-60 33 918 0 917 0 0 -619 0 -619 26 -31 c22 -27 32 -31 76 -31 41 0 54 5 79 29 l29 29 0 700 0 700 -35 31 -36 31 -1235 0 -1236 0 -34 -34z" />
                        <path
                            d="M3724 3840 c-48 -19 -71 -100 -43 -151 6 -12 102 -151 215 -311 112 -159 204 -291 204 -294 0 -2 -316 -4 -702 -4 -451 0 -716 -4 -740 -10 -76 -22 -105 -117 -54 -177 l24 -28 741 -5 741 -5 -175 -247 c-277 -394 -265 -374 -265 -425 0 -63 40 -103 102 -103 24 0 53 7 65 15 12 8 102 129 200 268 422 600 393 555 393 602 0 47 29 2 -393 602 -98 139 -188 260 -200 268 -23 16 -79 19 -113 5z" />
                    </g>
                </svg>
            </a>
        </div>
    </div>
</div>
