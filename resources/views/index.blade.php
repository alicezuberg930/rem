<!DOCTYPE html>
<html lang="en">

<head>
    @include('components.head_tag')
    <title>Trang chủ</title>
</head>

<body>
    @include('components.header')
    <div class="xl:w-[65%] w-4/5 m-auto">
        @include('components.banners')
        @include('components.slideshow')
        <div class="news w-full mb-4">
            <h2 class="text-2xl font-bold mb-3">Sản Phẩm Mới</h2>
            <div class="w-full grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
                @foreach ($Products as $product)
                    @include('components.product_body')
                @endforeach
            </div>
        </div>
        <div class="onsale w-full mb-4">
            <h2 class="text-2xl font-bold mb-3">Đang khuyến mãi</h2>
            <div class="w-full grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
                @foreach ($Products as $product)
                    @if ($product->percent != null || $product->percent > 0)
                        @include('components.product_body')
                    @endif
                @endforeach
            </div>
        </div>
    </div>
    @include('components.footer')
    @include('components.toast')

</body>

@if (session()->has('invalid_token'))
    <script>
        $('.toast').toast('show')
        $('.toast-body').html("Vui lòng xác thực")
    </script>
@endif

<script src="{{ url('./js/add_cart.js') }}"></script>

</html>
