<?php $price = $product->price; ?>
<div class="disable-select product-item col-6 col-md-4 col-lg-2 mb-4">
    <div class="card card-product h-100" role="button">
        <div class="card-quick-cart btn btn-primary" data-id="{{ $product->ProductsID }}">
            <i class="m-1 fa-solid fa-cart-shopping"></i>
            <span>{{ isset(session('cart')[$product->ProductsID]) ? 'Đã thêm vào giỏ' : 'Thêm vô giỏ hèng' }}</span>
        </div>
        <a class="h-100 d-flex flex-column text-decoration-none" href="/product_details/{{ $product->ProductsID }}">
            <div>
                <img src="{{ url('image/' . $product->image) }}" class="product-img card-img">
            </div>
            <div class="p-1">
                <div class="card-text text-wrap text-dark font-weight-bold">{{ $product->name }}</div>
                <div class="card-text text-dark">Hàng nhập từ {{ $product->origin }}</div>
                <div class="card-text mt-2">
                    @if ($product->percent != null && $product->percent > 0)
                        <span class="product-discount float-left badge bg-primary text-white">-{{ $product->percent }}%
                        </span>
                    @endif
                    <span class="float-right badge">
                        @if ($product->percent != null && $product->percent > 0)
                            <span
                                class="product-discount-price text-decoration-line-through text-secondary mr-1">{{ number_format($price, 0, '.') }}
                                VND</span>
                            <?php $discount = doubleval($product->price) * (1 - doubleval($product->percent / 100)); ?>
                            <span class="product-final-price text-info">
                                {{ number_format($discount, 0, '.') }} VND
                            </span>
                        @else
                            <span class="product-discount-price text-secondary mr-1">{{ number_format($price, 0, '.') }}
                                VND</span>
                        @endif
                        <span class="clearfix"></span>
                </div>
            </div>
        </a>
    </div>
</div>
