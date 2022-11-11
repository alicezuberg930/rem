<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> ZippoStore </title>
    <link rel="shortcut icon" type="image/png" href="{{ url('./icon.png') }}">
    <script src="{{ url('./jquery/dist/jquery.min.js') }}"></script>
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <script src="{{ url('./popper/dist/umd/popper.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ url('./css/style.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.0.0/css/all.css">
</head>

<body>
    <x-header />
    <div class="container-md shadow mt-4 mb-4">
        <div class="pt-4 border-top">
            <div class="row">
                <div class="{!! session()->has('cart') && sizeof(session()->get('cart')) > 0 ? 'col-md-8' : 'col-md-12' !!}">
                    <div class="">
                        <table class="table table-sm align-middle">
                            <thead class="table-dark">
                                <tr>
                                    <th scope="col" style="width:20%">Sản phẩm</th>
                                    <th scope="col" class="col-md-2">Số lượng</th>
                                    <th scope="col" class="col-md-2">Giá</th>
                                    <th scope="col" class="col-md-2">Tổng</th>
                                </tr>
                            </thead>
                            <tbody id="cart-table">
                                <?php $quantity = $total_price = $total_discount = 0; ?>
                                @if (session()->has('cart') && count(session('cart')) > 0)
                                    @foreach (session()->get('cart') as $cart)
                                        <?php $discount_price = $cart['price'] * (1 - doubleval($cart['percent'] / 100));
                                        $total_price_per_product = $discount_price * $cart['quantity'];
                                        $total_price += $cart['price'] * $cart['quantity'];
                                        $total_discount += ($cart['price'] - $discount_price) * $cart['quantity'];
                                        $total_final = $total_price - $total_discount;
                                        $quantity += $cart['quantity']; ?>
                                        <tr>
                                            <td>
                                                <div class="d-flex">
                                                    <img class="img" src="{{ url('image/' . $cart['image']) }}"
                                                        width="120">
                                                    <span class="">{{ $cart['name'] }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex">
                                                    <button class="btn bi bi-dash-circle minus-btn"
                                                        data-id="{{ $cart['id'] }}"></button>
                                                    <input name="quantity" type="number" min="1" max="99"
                                                        class="bg-white border-0 text-center" step="1" disabled
                                                        value="{{ $cart['quantity'] }}" size="1">
                                                    <button class="btn bi bi-plus-circle plus-btn"
                                                        data-id="{{ $cart['id'] }}"></button>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="row">
                                                    @if ($cart['percent'] > 0)
                                                        <span
                                                            class="text-decoration-line-through">{{ number_format($cart['price']) }}
                                                            VND</span>
                                                        <span class="text-primary">{{ number_format($discount_price) }}
                                                            VND</span>
                                                    @else
                                                        <span>{{ number_format($cart['price']) }} VND</span>
                                                    @endif
                                                </div>
                                            </td>
                                            <td>
                                                <div class="row">
                                                    <span class="col-12">{{ number_format($total_price_per_product) }}
                                                        VND</span>
                                                    <span class="remove-cart"
                                                        class="col-12 text-decoration-underline text-danger"
                                                        data-id="{{ $cart['id'] }}">
                                                        <i class="bi bi-trash3"></i>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                @else
                                    <tr>
                                        <td colspan="4">
                                            <div class="d-flex justify-content-center">
                                                <div class="d-flex flex-column justify-content-center p-5">
                                                    <div class="d-flex justify-content-center">
                                                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                                            width="25px" height="25px"
                                                            viewBox="0 0 512.000000 512.000000"
                                                            preserveAspectRatio="xMidYMid meet">
                                                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                                fill="currentColor" stroke="none">
                                                                <path
                                                                    d="M575 4490 c-70 -28 -98 -134 -53 -200 40 -58 47 -60 335 -60 240 0 263 -2 271 -17 6 -10 29 -88 52 -173 23 -85 116 -414 206 -730 91 -316 183 -642 205 -725 41 -153 128 -461 136 -481 2 -7 -16 -19 -42 -28 -88 -29 -182 -111 -237 -204 -45 -76 -61 -145 -56 -247 3 -79 8 -101 40 -167 63 -133 187 -232 324 -260 45 -9 54 -14 48 -27 -4 -9 -9 -54 -12 -100 -13 -253 160 -451 409 -468 134 -10 257 34 346 122 111 112 151 259 117 437 l-6 28 257 0 258 0 -7 -32 c-25 -120 -15 -212 36 -314 146 -301 586 -328 772 -48 84 127 90 348 13 474 -52 84 -131 151 -228 192 l-54 23 -957 5 c-951 5 -957 5 -985 26 -95 70 -98 201 -6 261 26 17 89 18 1138 23 l1110 5 66 31 c116 55 189 137 227 254 12 36 51 187 87 335 36 149 72 295 80 325 8 30 17 69 19 85 3 17 44 183 91 370 77 302 86 347 81 405 -6 89 -20 128 -67 199 -44 66 -131 132 -202 153 -33 10 -334 13 -1397 13 l-1355 0 -63 -23 c-35 -13 -65 -22 -66 -20 -2 1 -34 111 -72 243 -75 262 -92 295 -162 315 -44 12 -668 13 -697 0z m1441 -927 c13 -62 30 -137 38 -167 7 -30 11 -57 8 -60 -3 -3 -86 -6 -184 -6 l-178 0 -11 28 c-6 15 -13 37 -15 49 -2 12 -13 50 -24 85 -24 77 -25 116 -4 146 25 37 49 41 203 39 l144 -2 23 -112z m834 -58 l0 -175 -238 0 -238 0 -33 148 c-19 81 -36 159 -38 175 l-5 27 276 0 276 0 0 -175z m870 170 c0 -2 -13 -64 -29 -137 -17 -73 -33 -150 -37 -171 l-6 -37 -247 2 -246 3 -3 160 c-1 87 0 165 2 172 4 10 66 13 286 13 154 0 280 -2 280 -5z m605 -19 c13 -13 27 -35 30 -49 5 -20 -20 -148 -51 -259 -5 -16 -22 -18 -176 -18 l-170 0 4 28 c8 46 59 296 63 310 3 9 40 12 140 12 130 0 137 -1 160 -24z m-2191 -643 c2 -10 17 -74 31 -143 14 -69 29 -133 31 -143 5 -16 -6 -17 -162 -15 l-167 3 -43 150 c-24 83 -44 153 -44 158 0 4 78 7 174 7 158 0 175 -2 180 -17z m716 -143 l0 -160 -170 0 c-93 0 -170 1 -170 3 0 7 -61 283 -66 300 -5 16 9 17 200 17 l206 0 0 -160z m730 153 c0 -21 -63 -299 -69 -306 -4 -4 -86 -6 -182 -5 l-174 3 -3 145 c-1 79 0 150 2 157 4 10 53 13 216 13 115 0 210 -3 210 -7z m634 -25 c-3 -18 -21 -89 -39 -158 l-31 -125 -157 -3 c-123 -2 -157 0 -157 10 0 18 60 290 66 300 3 4 77 8 165 8 l161 0 -8 -32z m-1916 -730 c18 -79 32 -146 32 -150 0 -5 -58 -8 -129 -8 -108 0 -132 3 -150 18 -15 12 -33 55 -56 137 -19 66 -34 126 -35 133 0 9 37 12 153 12 l154 0 31 -142z m552 -8 l0 -150 -105 0 c-58 0 -105 2 -105 5 0 3 -13 66 -30 140 -16 74 -30 139 -30 145 0 6 51 10 135 10 l135 0 0 -150z m595 138 c3 -7 -8 -74 -23 -148 l-28 -135 -122 -3 -122 -3 0 144 c0 79 3 147 7 150 3 4 69 7 145 7 102 0 140 -3 143 -12z m615 -5 c0 -10 -14 -70 -30 -133 -39 -152 -36 -150 -201 -150 -71 0 -129 3 -129 8 0 4 14 70 30 147 17 77 30 141 30 142 0 2 68 3 150 3 136 0 150 -2 150 -17z m-1777 -1217 c76 -31 113 -117 81 -187 -20 -45 -83 -89 -128 -89 -71 0 -147 76 -146 147 1 43 33 93 76 119 45 27 71 30 117 10z m1396 -14 c14 -10 34 -33 45 -51 49 -84 -10 -195 -110 -207 -79 -10 -154 59 -154 141 0 111 132 182 219 117z" />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div>Giỏ hàng của bạn đang rỗng</div>
                                                    <hr />
                                                    <a href="/">
                                                        <input class="btn btn-primary w-100" type="submit"
                                                            value="Đi mua hàng" />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                @endif
                            </tbody>
                        </table>
                    </div>
                </div>
                @if (session()->has('cart') && count(session('cart')) > 0)
                    <div class="col-md-4">
                        <form id="payment" method="POST" action="/direct_payment" class="p-3 mb-3 border">
                            @csrf
                            <h4>THÔNG TIN KHÁCH HÀNG</h4>
                            <div class="row mb-3">
                                <label for="inputEmail3" class="col-sm-4 col-form-label fs-6">Họ và tên</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" id="pay-name" name="fullname"
                                        value="Nguyễn Thị Minh Thư">
                                </div>
                            </div>
                            <div class="row mb-3"><label for="inputPassword3" class="col-sm-4 col-form-label">Số điện
                                    thoại</label>
                                <div class="col-sm-8">
                                    <input type="phone" class="form-control" id="pay-phone" name="phonenumber"
                                        value="0921123435">
                                </div>
                            </div>

                            <div class="row mb-3"><label for="inputPassword3"
                                    class="col-sm-4 col-form-label">Email</label>
                                <div class="col-sm-8"><input type="email" class="form-control" id="pay-email"
                                        name="email" value="minhthu@gmail.com"></div>
                            </div>
                            <hr>
                            <div class="row mb-3">
                                <label for="inputPassword3" class="col-sm-4 col-form-label">Địa chỉ</label>
                                <div class="col-sm-8">
                                    <select name="city" class="form-select mb-2"
                                        aria-label="Default select example" id="city-select">
                                        <option selected class="text-center">------Thành phố------</option>
                                        <?php $cities = Http::get('https://api.mysupership.vn/v1/partner/areas/province'); ?>
                                        @foreach ($cities['results'] as $city)
                                            <option value="{{ $city['name'] }}" data-id="{{ $city['code'] }}">
                                                {{ $city['name'] }}
                                            </option>
                                        @endforeach
                                    </select>
                                    <select name="district" class="form-select mb-2"
                                        aria-label="Default select example" id="district-select">
                                        <option selected class="text-center">------Quận, huyện------</option>
                                    </select>
                                    <select name="ward" class="form-select mb-2"
                                        aria-label="Default select example" id="ward-select">
                                        <option selected class="text-center">------Phường, xã------</option>
                                    </select>
                                    <textarea name="full-address" class="form-control" id="pay-address" id="pay-address"
                                        placeholder="Số nhà, tên đường" style="height: 50px;">99 An Dương Vương</textarea>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="inputPassword3" class="col-sm-4 col-form-label fw-semibold">Thanh
                                    toán</label>
                                <div class="col-sm-8">
                                    <select class="form-select" id="pay-options" name="pay-options">
                                        <option value="COD" selected>Thanh toán trực tiếp</option>
                                        <option value="VNPAY">Thanh toán qua VNPAY</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="inputPassword3" class="col-sm-4 col-form-label fw-bold">Tổng tiền</label>
                                <div class="col-sm-8">
                                    <span class="form-control fw-semibold bg-white"
                                        id="pay-sum">{{ number_format($total_price) }} VND</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="inputPassword3" class="col-sm-4 col-form-label fw-bold">Tiền giảm
                                    giá</label>
                                <div class="col-sm-8">
                                    <span class="form-control fw-semibold bg-white"
                                        id="pay-sum">{{ number_format($total_discount) }} VND</span>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="inputPassword3" class="col-sm-4 col-form-label fw-bold">Giá cuối
                                    cùng</label>
                                <div class="col-sm-8">
                                    <span class="form-control fw-semibold bg-white"
                                        id="pay-sum">{{ number_format($total_final) }} VND</span>
                                    <input name="total_price" class="d-none" value="{{ $total_final }}" />
                                    <input name="quantity" class="d-none" value="{{ $quantity }}" />
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary" id="submit" name="redirect">Đặt
                                hàng</button>
                        </form>
                    </div>
                @endif
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />
</body>
<script>
    $(document).on('change', '#city-select', function() {
        let id = $(this).find(':selected').attr('data-id')
        let district = document.getElementById('district-select');
        let ward = document.getElementById('ward-select');
        $.ajax({
            url: "/cart/get_district",
            method: "GET",
            dataType: 'json',
            data: {
                "id": id
            },
            success: function(result) {
                district.length = 1;
                ward.length = 1;
                for (var i = 0; i < result.length; i++) {
                    district.add(new Option(result[i]['name'], result[i]['name'] + '-' + result[i][
                        'code'
                    ]));
                }
            }
        });
    })

    $(document).on('change', '#district-select', function() {
        let id = $(this).find(':selected').val().split('-')[1]
        let ward = document.getElementById('ward-select');
        $.ajax({
            url: "/cart/get_ward",
            method: "GET",
            dataType: 'json',
            data: {
                "id": id
            },
            success: function(result) {
                ward.length = 1;
                for (var i = 0; i < result.length; i++) {
                    ward.add(new Option(result[i]['name'], result[i]['name'] + '-' + result[i][
                        'code'
                    ]));
                }
            }
        });
    })

    $(document).on('click', '.minus-btn', function(e) {
        let id = $(this).attr('data-id')
        $.ajax({
            url: "decrease_incart",
            method: "GET",
            dataType: 'json',
            data: {
                "id": id
            },
            success: function(result) {
                console.log(result)
                if (result.status == 0) {
                    $('.toast').toast('show')
                    $('.toast-body').html(result.message)
                }
            }
        });
    })

    $(document).on('click', '.plus-btn', function(e) {
        let id = $(this).attr('data-id')
        $.ajax({
            url: "increase_incart",
            method: "GET",
            dataType: 'json',
            data: {
                "id": id
            },
            success: function(result) {
                console.log(result)
                if (result.status == 0) {
                    $('.toast').toast('show')
                    $('.toast-body').html(result.message)
                }
            }
        });
    })

    $(document).on('click', '.remove-cart', function() {
        let id = $(this).attr('data-id')
        $.ajax({
            url: "remove_cart",
            method: "get",
            dataType: 'json',
            data: {
                "id": id
            },
            success: function(result) {
                console.log(result)
                $('.toast').toast('show')
                $('.toast-body').html(result.message + " " + result.id)
            }
        });
    })

    $("#pay-options").on('change', function() {
        if ($(this).val() == "COD")
            $("#payment").attr('action', "/direct_payment")
        if ($(this).val() == "VNPAY")
            $("#payment").attr('action', "/vnpay/vnpay_payment")
    })
</script>

</html>
