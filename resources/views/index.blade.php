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
        <div class="news">
            <h2 class="title">Sản Phẩm Mới</h2>
            <div class="row">
                <?php $a = 0; ?>
                @foreach ($NewProducts as $product)
                    @include('components.product_body')
                    <?php if ($a != 11) {
                        $a++;
                    } else {
                        break;
                    } ?>
                @endforeach
            </div>
        </div>
        <div class="onsale">
            <h2 class="title">Đang khuyến mãi</h2>
            <div class="row">
                <?php $i = 0; ?>
                @foreach ($SaleProducts as $product)
                    @if ($product->percent > 0)
                        @include('components.product_body')
                        <?php if ($i != 11) {
                            $i++;
                        } else {
                            break;
                        } ?>
                    @endif
                @endforeach
            </div>
        </div>
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
