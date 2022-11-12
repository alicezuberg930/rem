<div class="d-flex flex-column mb-3 gx-5 icky-top bg-white border p-3 justify-content-between">
    <div class="row justify-content-between">
        <span class="col-md-6 fw-semibold text-danger mx-2" id="soluong"> (Có 0 sản phẩm)</span>
    </div>
</div>
<div class="row row-cols-1 row-cols-md-3">
    @if (isset($products))
        @foreach ($products as $product)
            <div class="col mb-3">
                <?php $price = $product->price; ?>
                <div class="disable-select product-item card h-100 rounded-pill">
                    <div class="card card-product h-100" role="button">
                        <div class="card-quick-cart">
                            @csrf
                            <svg class="card-quick-add" data-name="{{ $product->ProductsID }}" version="1.0"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200.000000 200.000000"
                                preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" fill="green"
                                    stroke="none">
                                    <path
                                        d="M773 1875 c-320 -83 -567 -331 -649 -652 -34 -135 -34 -311 0 -446 82 -322 331 -571 653 -653 135 -34 311 -34 446 0 322 82 571 331 653 653 34 135 34 311 0 446 -82 322 -331 571 -653 653 -134 34 -317 33 -450 -1z m394 -160 c264 -62 480 -278 547 -546 21 -86 21 -252 0 -338 -67 -268 -277 -478 -545 -545 -86 -21 -252 -21 -338 0 -268 67 -484 283 -546 547 -19 81 -19 254 0 337 9 36 37 108 62 160 40 80 61 109 137 186 77 76 106 98 186 137 52 26 122 53 155 61 80 19 263 20 342 1z" />
                                    <path
                                        d="M890 1290 l0 -180 -180 0 -180 0 0 -110 0 -110 180 0 180 0 0 -180 0 -180 110 0 110 0 0 180 0 180 180 0 180 0 0 110 0 110 -180 0 -180 0 0 180 0 180 -110 0 -110 0 0 -180z" />
                                </g>
                            </svg>
                        </div>
                        <a class="h-100 d-flex flex-column text-decoration-none"
                            href="/product_detail/{{ $product->ProductsID }}">
                            <div>
                                <img src="{{ url('image/' . $product->image) }}" class="product-img card-img">
                            </div>
                            <div class="p-1">
                                <div class="card-text text-wrap text-dark font-weight-bold">{{ $product->name }}</div>
                                <div class="card-text text-dark">Hàng nhập từ {{ $product->origin }}</div>
                                <div class="card-text mt-2">
                                    @if ($product->percent > 0)
                                        <span
                                            class="product-discount float-left badge bg-primary text-white">-{{ $product->percent }}%
                                        </span>
                                    @endif
                                    <span class="float-right badge">
                                        @if ($product->percent > 0)
                                            <span
                                                class="product-discount-price text-decoration-line-through text-secondary mr-1">{{ number_format($price, 0, '.') }}
                                                VND</span>
                                            <?php $discount = doubleval($product->price) * (1 - doubleval($product->percent / 100)); ?>
                                            <span class="product-final-price text-info">
                                                {{ number_format($discount, 0, '.') }} VND
                                            </span>
                                        @else
                                            <span
                                                class="product-discount-price text-secondary mr-1">{{ number_format($price, 0, '.') }}
                                                VND</span>
                                        @endif
                                        <span class="clearfix"></span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        @endforeach
    @else
        <div class="text-center col-md-12">
            <h3>Chọn sản phẩm cần tìm</h3>
        </div>
    @endif
</div>
@if (isset($total))
    <nav aria-label="Page navigation example" class="col-md-12 my-3">
        <ul class="pagination pagination-sm justify-content-end" id="phantrang">
            @for ($i = 0; $i < ceil($total / 9); $i++)
                @if ($i == $current_page - 1)
                    <li class="page-item p-0"><a class="page-link active">{!! $i + 1 !!}</a></li>
                @else
                    <li class="page-item p-0"><a class="page-link text-dark"
                            data-page={{ $i + 1 }}>{!! $i + 1 !!}</a></li>
                @endif
            @endfor
        </ul>
    </nav>
@endif
