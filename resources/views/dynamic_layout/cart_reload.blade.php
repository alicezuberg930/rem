@if (session()->has('UserID') && session()->has('message'))
    {{ session()->forget('message') }}
@endif
<div class="{!! session()->has('cart') && sizeof(session()->get('cart')) > 0 ? 'col-md-8 col-sm-auto' : 'col-md-12' !!}">
    <div class="">
        <table class="table table-sm align-middle">
            <thead class="table-dark">
                <tr class="text-center">
                    <th scope="col" class="col-md-4">Sản phẩm</th>
                    <th scope="col" class="col-md-2">Số lượng</th>
                    <th scope="col" class="col-md-3">Giá</th>
                    <th scope="col" class="col-md-3">Tổng</th>
                </tr>
            </thead>
            <tbody id="cart-table" class="text-center">
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
                                <div class="d-flex justify-content-center align-items-center">
                                    <img class="img" src="{{ url('image/' . $cart['image']) }}" width="120">
                                    <span class="">{{ $cart['name'] }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center align-items-center">
                                    <i class="fa-solid fa-circle-minus minus-btn" data-id="{{ $cart['id'] }}"></i>
                                    <span class="p-2">{{ $cart['quantity'] }}</span>
                                    <i class="fa-solid fa-circle-plus plus-btn" data-id="{{ $cart['id'] }}"></i>
                                </div>
                            </td>
                            <td>
                                <div class="row">
                                    @if ($cart['percent'] > 0)
                                        <span class="text-decoration-line-through">{{ number_format($cart['price']) }}
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
                                    <span class="remove-cart" class="col-12 text-decoration-underline text-danger"
                                        data-id="{{ $cart['id'] }}">
                                        <i class="fa-solid fa-trash text-warning"></i>
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
                                    <i class="fa-solid fa-cart-arrow-down fs-1 text-info"></i>
                                    <div>Giỏ hàng của bạn đang rỗng</div>
                                    <hr />
                                    <a href="/">
                                        <input class="btn btn-primary w-100" type="submit" value="Đi mua hàng" />
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
    <div class="col-md-4 col-sm-auto">
        <form id="payment" method="POST" action='/direct_payment' class="p-3 mb-3 border">
            @csrf
            <h4>THÔNG TIN KHÁCH HÀNG</h4>
            <div class="row mb-3">
                <label for="inputEmail3" class="col-sm-4 col-form-label fs-6">Họ và tên</label>
                <div class="col-sm-8">
                    <input type="text" class="form-control" id="pay-name" name="fullname"
                        value="Nguyễn Thị Minh Thư">
                </div>
            </div>
            <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-4 col-form-label">Số điện thoại</label>
                <div class="col-sm-8">
                    <input type="phone" class="form-control" id="pay-phone" name="phonenumber" value="0921123435">
                </div>
            </div>
            <div class="row mb-3"><label for="inputPassword3" class="col-sm-4 col-form-label">Email</label>
                <div class="col-sm-8"><input type="email" class="form-control" id="pay-email" name="email"
                        value="minhthu@gmail.com"></div>
            </div>
            <hr>
            <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-4 col-form-label">Địa chỉ</label>
                <div class="col-sm-8">
                    <select name="city" class="form-select mb-2" aria-label="Default select example"
                        id="city-select">
                        <option selected class="text-center" value="">------Thành phố------</option>
                        @foreach ($cities['results'] as $city)
                            <option value="{{ $city['name'] }}" data-id="{{ $city['code'] }}">
                                {{ $city['name'] }}
                            </option>
                        @endforeach
                    </select>
                    <select name="district" class="form-select mb-2" aria-label="Default select example"
                        id="district-select">
                        <option selected class="text-center" value="">------Quận, huyện------</option>
                    </select>
                    <select name="ward" class="form-select mb-2" aria-label="Default select example"
                        id="ward-select">
                        <option selected class="text-center" value="">------Phường, xã------</option>
                    </select>
                    <textarea name="full-address" class="form-control" id="pay-address" placeholder="Số nhà, tên đường"
                        style="height: 50px;"></textarea>
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
            {{-- <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-4 col-form-label fw-bold">Tổng tiền</label>
                <div class="col-sm-8">
                    <span class="form-control fw-semibold bg-white" id="pay-sum">{{ number_format($total_price) }}
                        VND</span>
                </div>
            </div> --}}
            {{-- <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-4 col-form-label fw-bold">Tiền giảm
                    giá</label>
                <div class="col-sm-8">
                    <span class="form-control fw-semibold bg-white"
                        id="pay-sum">{{ number_format($total_discount) }} VND</span>
                </div>
            </div> --}}
            <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-4 col-form-label fw-bold">Tổng tiền</label>
                <div class="col-sm-8">
                    <span class="form-control fw-semibold bg-white" id="pay-sum">{{ number_format($total_final) }}
                        đ</span>
                    <input name="total_price" hidden value="{{ $total_final }}" />
                    <input name="quantity" hidden value="{{ $quantity }}" />
                </div>
            </div>
            <button type="submit" class="btn btn-primary" id="submit"
                name="redirect">{{ session()->has('message') ? session('message') : 'Mua hàng' }}</button>
        </form>
    </div>
@endif
