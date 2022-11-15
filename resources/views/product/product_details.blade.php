<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title></title>
    <link rel="stylesheet" href="{{ url('./css/product_details.css') }}">
</head>
{{-- @dd($product) --}}

<body>
    <x-header />
    <div id="product">
        <div id="product-background" style='background-image: url("{{ url("/image/$product->image") }}")'>
        </div>
        <div class="product-description">
            <div class="container mt-3">
                <div id="product-description-header">
                    <h1 id="product-description-display">Zippo Eye of Providence</h1>
                    <div id="product-cart">
                        <div class="product-cart-price">
                            @if (isset($product->percent) && $product->percent > 0)
                                <span
                                    class="product-cart-discount float-left badge bg-primary text-white">-{{ $product->percent }}%</span>
                            @endif
                            <span class="badge p-0 mt-2 mb-2">
                                @if (isset($product->percent) && $product->percent > 0)
                                    <?php $discount = doubleval($product->price) * (1 - doubleval($product->percent / 100)); ?>
                                    <span
                                        class="product-cart-discount-price text-decoration-line-through text-secondary mr-1">{{ number_format($discount, 0, '.') }}
                                        VND</span>
                                @endif
                                <span class="product-cart-final-price text-white">
                                    {{ number_format($product->price, 0, '.') }} VND </span>
                                {{-- <span class="clearfix"> </span> --}}
                            </span>
                        </div>
                        <div class="product-confirm m-0">
                            <button id="add-cart" type="submit" name="name"
                                class="btn btn-primary w-100 font-weight-bold">Thêm vô giỏ hèng
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Nav tabs -->
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" href="#description">Mô tả</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#gamedetails">Chi tiết</a>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div id="description" class="container tab-pane active"><br>
                        <h1 class="title">Mô tả</h1>{{ $product->description }}
                    </div>
                    <div id="gamedetails" class="container tab-pane fade"><br>
                        <div class="content-summary-section">
                            <h1 class="title">Details</h1>
                            <div class="container">
                                <div class="row">
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Developer: </div>
                                        <div class="details-content">
                                            Developer
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Publisher:</div>
                                        <div class="details-content">
                                            Publisher
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Release Date: </div>
                                        <div class="details-content">
                                            Release Date
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-4 pl-0">
                                        <div class="details-category"> Category: </div>
                                        <div class="details-content">
                                            Category
                                        </div>
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
</body>

<script>
    $(document).ready(function() {
        $(".nav-tabs a").click(function() {
            $(this).tab('show');
        });
    });

    // document.getElementById("product-background").style.backgroundImage = "')";
    $("#add-cart").click(function(e) {
        $.ajax({
            url: "add_cart.php",
            method: "POST",
            data: {
                "name": ""
            },
            success: function(result) {
                if (result == 0) {
                    callSuccessNotice("Successful add to cart!");
                } else {
                    callDangerNotice("Out of stock!");
                }
            }
        });
    })
</script>

</html>
