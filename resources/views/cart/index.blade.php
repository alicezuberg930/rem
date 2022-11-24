<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Giỏ hàng của bạn</title>
</head>

<body>
    <x-header />
    <div class="container-md shadow mt-4 mb-4">
        <div class="pt-4 border-top">
            <div class="row" id="cart-table">
                @include('dynamic_layout.cart_reload')
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />
</body>
<script src="{{ url('./js/cart.js') }}"></script>

</html>
