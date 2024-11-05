<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Chi tiết sản phẩm</title>
    <link rel="stylesheet" href="{{ url('./css/product_details.css') }}">
</head>

<body>
    <x-header />
    <div id="product">
        <img id="product-background" src="{{ $product->getFirstMediaUrl('photos') }}">
        <div class="product-description text-light" style="background-color: rgb(118, 118, 118)">
            <div class="container mt-3">
                <div id="product-description-header">
                    <h1 id="product-description-display">{{ $product->name }}</h1>
                    <div id="product-cart">
                        <div class="product-cart-price">
                            @if ($product->sale != null && $product->sale->percent > 0)
                                <span
                                    class="product-cart-discount float-left badge bg-primary text-white">-{{ $product->sale->percent }}%</span>
                            @endif
                            <span class="badge p-0 pt-1 pb-2">
                                @if ($product->sale != null && $product->sale->percent > 0)
                                    <?php $discount = doubleval($product->price) * (1 - doubleval($product->sale->percent / 100)); ?>
                                    <span
                                        class="product-cart-discount-price text-decoration-line-through text-secondary mr-1">{{ number_format($discount, 0, '.') }}
                                        đ</span>
                                @endif
                                <span class="product-cart-final-price text-white">
                                    {{ $product->formatPrice() }} đ</span>
                            </span>
                        </div>
                        <div class="product-confirm m-0">
                            <button data-id="{{ $product->id }}"
                                class="add-cart btn btn-primary w-100 font-weight-bold">
                                <i class="m-1 fa-solid fa-cart-shopping"></i>
                                <span>{{ isset(session('cart')[$product->id]) ? 'Đã thêm vào giỏ' : 'Thêm vô giỏ hàng' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Nav tabs -->
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#description">Mô tả</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#details">Chi tiết</a>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content pb-5">
                    <div id="description" class="container tab-pane active"><br>
                        {!! $product->description !!}
                    </div>
                    <div id="details" class="container tab-pane fade"><br>
                        <div class="content-summary-section">
                            <h1 class="title">Chi tiết</h1>
                            <div class="container">
                                <div class="row">
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Xuất Xứ: </div>
                                        <div class="details-content">{{ $product->origin }}</div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Chất Liệu:</div>
                                        <div class="details-content">{{ $product->material }}</div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Ngày sản xuất: </div>
                                        <div class="details-content">{{ $product->created_at }}</div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Danh Mục: </div>
                                        <div class="details-content">{{ $product->category->name }}</div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Số lượng còn lại: </div>
                                        <div class="details-content">{{ $product->amount }}</div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Bảo hành: </div>
                                        <div class="details-content">Bảo hành trọn đời</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />
</body>

<script src="{{ url('/js/add_cart.js') }}"></script>

</html>
