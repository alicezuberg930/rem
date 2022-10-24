<style>
    .cart-product {
        position: relative;
        display: flex;
        padding: 0.5rem 1rem;
        flex-wrap: wrap;
        border-bottom: solid 1px var(--sub-color);
    }

    .cart-product:last-child {
        border-bottom: unset;
    }

    .cart-remove {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        fill: var(--sub3-color);
        opacity: 0.8;
    }

    .cart-remove:hover {
        opacity: 1;
        cursor: pointer;
    }

    .cart-remove:active {
        opacity: 0.8;
    }

    .cart-detail {
        display: flex;
    }

    .cart-image {
        padding-right: 1rem;
    }

    .cart-image>img {
        max-height: 200px;
        width: 150px;
    }

    .cart-lore {
        display: flex;
        flex-flow: column;
    }

    .cart-description {
        display: flex;
        flex: 1;
        flex-flow: column;
        padding-right: 15px;
    }

    .cart-price {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-items: flex-end;
        overflow: hidden;
    }

    .cart-name {
        max-width: 250px;
        font-size: 1.3rem;
        font-weight: 600;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        text-overflow: ellipsis;
        max-height: 4.5em;
        overflow: hidden;
    }

    .cart-developer {
        font-size: 1.0rem;
        font-weight: 600;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        text-overflow: ellipsis;
    }

    .cart-control {
        display: flex;
        flex: 1;
        flex-flow: row;
        align-items: flex-end;
    }

    .cart-final-price {
        flex: 1;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .cart-quantity {
        display: flex;
        align-content: stretch
    }

    .cart-quantity-add {
        width: 30px;
        height: 30px;
        border: 0px;
        color: white;
    }

    .cart-quantity-add:active {
        opacity: 0.5;
    }

    .cart-quantity-remove {
        width: 30px;
        height: 30px;
        border: 0px;
        color: white;
    }

    .cart-quantity-remove:active {
        opacity: 0.5;
    }

    .cart-quantity-number {
        width: 40px;
        text-align: center;
        border: 0px;
        z-index: 1;
    }

    @media (min-width: 512px) {
        .cart-name {
            font-size: 1.5rem;
        }

        .cart-developer {
            font-size: 1.2rem;
        }
    }

    @media (min-width: 768px) {
        .cart-remove {
            left: 10px;
            top: calc(50% - 15px);
        }

        .cart-image {
            padding-left: 30px;
        }

        .cart-summary-container {
            width: 250px;
            margin-left: 20px;
        }
    }

    @media (min-width: 992px) {
        .cart-control {
            flex-flow: column;
        }
    }
</style>
@if (session()->has('cart') && count(session('cart')) > 0)
    <?php $cartArray = session()->get('cart'); ?>
    @foreach ($cartArray as $cart)
        <?php $final_price = 0;
        $price = $cart['price'];
        $discount_price = $cart['price'] * (1 - doubleval($cart['percent'] / 100));
        $final_price += $discount_price; ?>
        <div class="cart-product" data-name="{{ $cart['id'] }}">
            <div class="cart-remove">
                <svg viewBox="0 0 24 24">
                    <circle class="cart-remove-circle" cx="12" cy="12" r="12"></circle>
                    <polygon style="box-shadow: rgba(0,0,0,0.16) 0 1px 6px 0; fill: white; fill-opacity: 1"
                        points="17.8,16.7 16.6,17.9 12,13.3 7.4,17.9 6.2,16.7 10.8,12.1 6.2,7.5 7.4,6.3 12,11 16.6,6.4 17.8,7.6 13.2,12.2 ">
                    </polygon>
                </svg>
            </div>
            <div class="cart-detail">
                <div class="cart-image">
                    <img src="{{ url('image/' . $cart['image']) }}">
                </div>
                <div class="cart-lore">
                    <div class="cart-description">
                        <div class="cart-name">{{ $cart['name'] }}</div>
                        <div class="cart-developer">{{ $cart['origin'] }}</div>
                        <div class="cart-price">
                            @if ($cart['percent'] > 0)
                                <span class="badge badge-primary"> - {{ $cart['percent'] }}% </span>
                            @endif
                            <span class="badge">
                                <span
                                    class="product-discount-price text-decoration-line-through text-secondary mr-1">{{ $cart['price'] }}VND</span>
                                @if ($cart['percent'] > 0)
                                    <span
                                        class="product-final-price text-white">{{ number_format($discount_price, 0, '.') }}</span>
                                @endif
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart-control">
                <div class="cart-final-price">
                    Total Price: {{ $final_price }} VND
                </div>
                <div class="cart-quantity" data-name='{{ $cart['quantity'] }}'>
                    <input class="cart-quantity-remove bg-primary" type="button" value="-">
                    <input class="cart-quantity-number" type="text" min="1" max="10"
                        value="{{ $cart['quantity'] }}">
                    <input class="cart-quantity-add bg-primary" type="button" value="+">
                </div>
            </div>
        </div>
    @endforeach
@else
    <style>
        .cart-empty-container {
            display: flex;
            justify-content: center;
            height: 176px;
        }

        .cart-empty {
            display: flex;
            flex-flow: column;
            justify-content: center;
            padding: 2rem 2rem;
            width: 15rem;
        }

        .cart-empty>* {
            display: flex;
            justify-content: center;
        }
    </style>
    <div class="cart-empty-container">
        <div class="cart-empty">
            <div>
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="25px" height="25px"
                    viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor"
                        stroke="none">
                        <path
                            d="M575 4490 c-70 -28 -98 -134 -53 -200 40 -58 47 -60 335 -60 240 0 263 -2 271 -17 6 -10 29 -88 52 -173 23 -85 116 -414 206 -730 91 -316 183 -642 205 -725 41 -153 128 -461 136 -481 2 -7 -16 -19 -42 -28 -88 -29 -182 -111 -237 -204 -45 -76 -61 -145 -56 -247 3 -79 8 -101 40 -167 63 -133 187 -232 324 -260 45 -9 54 -14 48 -27 -4 -9 -9 -54 -12 -100 -13 -253 160 -451 409 -468 134 -10 257 34 346 122 111 112 151 259 117 437 l-6 28 257 0 258 0 -7 -32 c-25 -120 -15 -212 36 -314 146 -301 586 -328 772 -48 84 127 90 348 13 474 -52 84 -131 151 -228 192 l-54 23 -957 5 c-951 5 -957 5 -985 26 -95 70 -98 201 -6 261 26 17 89 18 1138 23 l1110 5 66 31 c116 55 189 137 227 254 12 36 51 187 87 335 36 149 72 295 80 325 8 30 17 69 19 85 3 17 44 183 91 370 77 302 86 347 81 405 -6 89 -20 128 -67 199 -44 66 -131 132 -202 153 -33 10 -334 13 -1397 13 l-1355 0 -63 -23 c-35 -13 -65 -22 -66 -20 -2 1 -34 111 -72 243 -75 262 -92 295 -162 315 -44 12 -668 13 -697 0z m1441 -927 c13 -62 30 -137 38 -167 7 -30 11 -57 8 -60 -3 -3 -86 -6 -184 -6 l-178 0 -11 28 c-6 15 -13 37 -15 49 -2 12 -13 50 -24 85 -24 77 -25 116 -4 146 25 37 49 41 203 39 l144 -2 23 -112z m834 -58 l0 -175 -238 0 -238 0 -33 148 c-19 81 -36 159 -38 175 l-5 27 276 0 276 0 0 -175z m870 170 c0 -2 -13 -64 -29 -137 -17 -73 -33 -150 -37 -171 l-6 -37 -247 2 -246 3 -3 160 c-1 87 0 165 2 172 4 10 66 13 286 13 154 0 280 -2 280 -5z m605 -19 c13 -13 27 -35 30 -49 5 -20 -20 -148 -51 -259 -5 -16 -22 -18 -176 -18 l-170 0 4 28 c8 46 59 296 63 310 3 9 40 12 140 12 130 0 137 -1 160 -24z m-2191 -643 c2 -10 17 -74 31 -143 14 -69 29 -133 31 -143 5 -16 -6 -17 -162 -15 l-167 3 -43 150 c-24 83 -44 153 -44 158 0 4 78 7 174 7 158 0 175 -2 180 -17z m716 -143 l0 -160 -170 0 c-93 0 -170 1 -170 3 0 7 -61 283 -66 300 -5 16 9 17 200 17 l206 0 0 -160z m730 153 c0 -21 -63 -299 -69 -306 -4 -4 -86 -6 -182 -5 l-174 3 -3 145 c-1 79 0 150 2 157 4 10 53 13 216 13 115 0 210 -3 210 -7z m634 -25 c-3 -18 -21 -89 -39 -158 l-31 -125 -157 -3 c-123 -2 -157 0 -157 10 0 18 60 290 66 300 3 4 77 8 165 8 l161 0 -8 -32z m-1916 -730 c18 -79 32 -146 32 -150 0 -5 -58 -8 -129 -8 -108 0 -132 3 -150 18 -15 12 -33 55 -56 137 -19 66 -34 126 -35 133 0 9 37 12 153 12 l154 0 31 -142z m552 -8 l0 -150 -105 0 c-58 0 -105 2 -105 5 0 3 -13 66 -30 140 -16 74 -30 139 -30 145 0 6 51 10 135 10 l135 0 0 -150z m595 138 c3 -7 -8 -74 -23 -148 l-28 -135 -122 -3 -122 -3 0 144 c0 79 3 147 7 150 3 4 69 7 145 7 102 0 140 -3 143 -12z m615 -5 c0 -10 -14 -70 -30 -133 -39 -152 -36 -150 -201 -150 -71 0 -129 3 -129 8 0 4 14 70 30 147 17 77 30 141 30 142 0 2 68 3 150 3 136 0 150 -2 150 -17z m-1777 -1217 c76 -31 113 -117 81 -187 -20 -45 -83 -89 -128 -89 -71 0 -147 76 -146 147 1 43 33 93 76 119 45 27 71 30 117 10z m1396 -14 c14 -10 34 -33 45 -51 49 -84 -10 -195 -110 -207 -79 -10 -154 59 -154 141 0 111 132 182 219 117z" />
                    </g>
                </svg>
            </div>
            <div>Giỏ hàng của bạn đang rỗng</div>
            <hr />
            <form action="/game/browse">
                <input class="btn btn-primary w-100" type="submit" value="Browse Now" />
            </form>
        </div>
    </div>
@endif
<script>
    function updateQuantity($input, name, quantity) {
        $.ajax({
            url: "update_cart.php",
            method: "POST",
            data: {
                "name": name,
                "quantity": quantity
            },
            success: function(result) {
                if (result >= 0) {
                    window.alert('This game has only ' + result + ' code left in stock!');
                    $input.val(result);
                }
            }
        });
    }

    function updateSummary() {
        $.ajax({
            url: "summary.php",
            success: function(result) {
                $(".cart-summary").html(result);
            }
        });
    }

    $('.cart-quantity-number').on('keyup', function() {
        $quantity = $(this);
        v = parseInt($quantity.val());
        min = parseInt($quantity.attr('min'));
        max = parseInt($quantity.attr('max'));

        if (isNaN(v) || isNaN($quantity.val())) {
            v = 1;
            $quantity.val("1");
        } else if (v < min) {
            v = min;
            $quantity.val(min);
        } else if (v > max) {
            v = max;
            $quantity.val(max);
        }

        updateQuantity($quantity, $quantity[0].parentNode.dataset.name, v);
        updateSummary();
    })

    $('.cart-quantity-number').focusout(function() {
        if ($(this).val() == "") {
            $(this).val("1");
        }
        updateSummary();
    })

    $('.cart-quantity-remove').click(function() {
        $quantity = $(".cart-quantity[data-name='" + $(this).parent()[0].dataset.name +
            "']>.cart-quantity-number");
        v = parseInt($quantity.val()) - 1;
        $quantity.val(v);
        min = parseInt($quantity.attr('min'));
        max = parseInt($quantity.attr('max'));

        if (v < min) {
            v = min;
            $quantity.val(min);
        } else if (v > max) {
            v = max;
            $quantity.val(max);
        }

        updateQuantity($quantity, $quantity[0].parentNode.dataset.name, v);
        updateSummary();
    });

    $('.cart-quantity-add').click(function() {
        $quantity = $(".cart-quantity[data-name='" + $(this).parent()[0].dataset.name +
            "']>.cart-quantity-number");
        v = parseInt($quantity.val()) + 1;
        $quantity.val(v);
        min = parseInt($quantity.attr('min'));
        max = parseInt($quantity.attr('max'));

        if (v < min) {
            v = min;
            $quantity.val(min);
        } else if (v > max) {
            v = max;
            $quantity.val(max);
        }

        updateQuantity($quantity, $quantity[0].parentNode.dataset.name, v);
        updateSummary();
    });

    $('.cart-remove').click(function() {
        let name = $(this).parent()[0].dataset.name;

        $.ajax({
            url: "remove_cart.php",
            method: "POST",
            data: {
                "name": name,
            },
            success: function(result) {
                $.ajax({
                    url: "list_cart.php",
                    success: function(result) {
                        $('.cart-products').html(result);
                    }
                });
                updateSummary();
            }
        });
    });
</script>
