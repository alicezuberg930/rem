<div
    class="border-[1.1px] border-gray-300 bg-white rounded-md mb-2 hover:border-blue-500 hover:shadow-md transition-shadow">
    <div class="relative w-full">
        @if ($product->sale != null && $product->sale->percent > 0)
            <div class="absolute top-0 right-0">
                <div class="bg-gray-100 flex items-center p-1 border rounded-bl-lg">
                    <span class="text-blue-500 text-xs text-center font-semibold">-{{ $product->sale->percent }}%</span>
                </div>
            </div>
        @endif
        <a class="h-100 d-flex flex-column text-decoration-none" href="/product/{{ $product->id }}">
            <div class="h-48 w-full">
                <img src="{{ $product->getFirstMediaUrl('photos') }}" class="rounded-t-md h-full w-full object-cover"
                    alt="{{ $product->id }}">
            </div>
            <div class="p-1">
                <span class="text-wrap line-clamp-2 text-bold text-sm h-9">{{ $product->name }}</span>
                <div class="mt-2">
                    <span class="text-blue-500 text-sm">đ</span>
                    <span class="text-blue-500 font-semibold text-lg">{{ $product->formatPrice() }}</span>
                </div>
                <div class="flex items-center">
                    <div class="">
                        <div class="flex">
                            <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                            <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                            <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                            <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                            <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                        </div>
                    </div>
                    <div class="text-sm opacity-70">(263)</div>
                </div>
            </div>
        </a>
    </div>
</div>
