<div class="carousel slide mt-5 h-[450px]" id="carouselDemo" data-bs-ride="carousel" data-bs-wrap="true">
    <div class="carousel-inner h-full">
        @foreach ($banners as $key => $banner)
            <div class="carousel-item object-cover h-full {{ $key == 0 ? 'active' : '' }}">
                <img src="{{ $banner['src'] }}" alt="{{ $banner['src'] }}" class="w-full h-full" />
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
