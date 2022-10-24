<?php $i = 0; ?>
<div class="onsale">
    <h2 class="title">Đang khuyến mãi</h2>
    <div class="row" style="min-height: 300px">
        @foreach ($SaleProducts as $product)
            <?php $price = $product->price; ?>
            <div class="disable-select product-item col-6 col-md-4 col-lg-2 mb-4">
                <div class="card card-product h-100" role="button">
                    <div class="card-quick-cart">
                        <svg class="card-quick-add" data-name="{{ $product->ProductsID }}" version="1.0"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.000000 200.000000"
                            preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" fill="blue"
                                stroke="none">
                                <path
                                    d="M773 1875 c-320 -83 -567 -331 -649 -652 -34 -135 -34 -311 0 -446 82 -322 331 -571 653 -653 135 -34 311 -34 446 0 322 82 571 331 653 653 34 135 34 311 0 446 -82 322 -331 571 -653 653 -134 34 -317 33 -450 -1z m394 -160 c264 -62 480 -278 547 -546 21 -86 21 -252 0 -338 -67 -268 -277 -478 -545 -545 -86 -21 -252 -21 -338 0 -268 67 -484 283 -546 547 -19 81 -19 254 0 337 9 36 37 108 62 160 40 80 61 109 137 186 77 76 106 98 186 137 52 26 122 53 155 61 80 19 263 20 342 1z" />
                                <path
                                    d="M890 1290 l0 -180 -180 0 -180 0 0 -110 0 -110 180 0 180 0 0 -180 0 -180 110 0 110 0 0 180 0 180 180 0 180 0 0 110 0 110 -180 0 -180 0 0 180 0 180 -110 0 -110 0 0 -180z" />
                            </g>
                        </svg>
                    </div>
                    <a class="h-100 d-flex flex-column" href="/product_detail/{{ $product->ProductsID }}">
                        <img id="product-news-image-{{ $i }}" src="{{ url('./image/' . $product->image) }}"
                            alt="" class="card-img">
                        <div>
                            <div class="card-text text-truncate text-white font-weight-bold">{{ $product->name }}</div>
                            <div class="card-text text-white-50">Hàng nhập từ {{ $product->origin }}</div>
                            <div class="card-text mt-2">
                                <span
                                    class="product-discount float-left badge bg-primary text-white">{{ $product->percent }}
                                    %</span>';
                                <span class="float-right badge">
                                    <span
                                        class="product-discount-price text-decoration-line-through text-secondary mr-1">
                                        {{ number_format($price, 0, '.') }}VND</span>';
                                    <?php $price2 = doubleval($product->price) * (1 - doubleval($product->percent / 100)); ?>
                                    <span class="product-final-price text-white">{{ number_format($price2, 0, '.') }}
                                        VND</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <?php
            if ($i != 11) {
                $i++;
            } else {
                break;
            } ?>
        @endforeach
    </div>
</div>
