@extends('components.common')

@section('head')
    <title>Trang chủ</title>
@endsection

@section('body')
    {{-- <a href="test">test</a> --}}
    {{-- <form method="POST" action="banner/gay" enctype="multipart/form-data">
        @csrf
        <input name="name" type="text" />
        <input type="number" name="order">
        <input type="file" name="image" />
        <button>Submut</button>
    </form> --}}
    <div class="xl:w-[65%] w-4/5 mx-auto">
        <div class="carousel slide h-[450px]" id="carouselDemo" data-bs-ride="carousel" data-bs-wrap="true">
            <div class="carousel-inner h-full">
                @foreach ($banners as $key => $banner)
                    <div class="carousel-item object-cover h-full {{ $key == 0 ? 'active' : '' }}">
                        <img src="{{ $banner->getFirstMediaUrl() }}" alt="{{ $banner->name }}" class="w-full h-full" />
                    </div>
                @endforeach
            </div>
            <button class="carousel-control-prev justify-start left-2" data-bs-target="#carouselDemo" data-bs-slide="prev"
                type="button">
                <x-bi-arrow-left-circle class="w-10 h-10" fill="white" />
            </button>
            <button class="carousel-control-next justify-end right-2" data-bs-target="#carouselDemo" data-bs-slide="next"
                type="button">
                <x-bi-arrow-right-circle class="w-10 h-10" fill="white" />
            </button>

            <div class="carousel-indicators">
                @foreach ($banners as $key => $banner)
                    <button type="button" data-bs-target="#carouselDemo" data-bs-slide-to="{{ $key }}"
                        class="{{ $key == 0 ? 'active' : '' }}"></button>
                @endforeach
            </div>
        </div>

        <div class="news w-full pb-4 mt-12">
            <h2 class="text-2xl font-bold mb-3">Sản Phẩm Mới</h2>
            <div class="w-full grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
                @foreach ($products as $product)
                    @include('components.product_list')
                @endforeach
            </div>
        </div>

        <div class="onsale w-full">
            <h2 class="text-2xl font-bold mb-3">Đang khuyến mãi</h2>
            <div class="w-full grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
                @foreach ($products as $product)
                    @if ($product->sale != null && $product->sale->percent > 0)
                        @include('components.product_list')
                    @endif
                @endforeach
            </div>
        </div>
    </div>
@endsection
