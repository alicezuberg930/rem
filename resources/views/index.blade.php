<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Trang chủ</title>
</head>

<body>
    <x-header />
    <div class="container">
        <x-slideshow />
        @include('news')
        @include('onsale')
    </div>
    <x-footer />
    <x-toast />
</body>

@if (session()->has('invalid_token'))
    <script>
        $('.toast').toast('show')
        $('.toast-body').html("Vui lòng xác thực")
    </script>
@endif

<script src="{{ url('./js/add_cart.js') }}"></script>

</html>
