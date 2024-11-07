@extends('components.common')

@section('head')
    <title>Chi tiết sản phẩm</title>
@endsection

@section('body')
    {{-- <form action="/review/post" enctype="multipart/form-data" method="POST">
        @csrf
        <input name="comment" type="text" />
        <input name="star" type="number" />
        <input name="images[]" type="file" multiple />
        <input name="product_id" type="number" value={{ $product->id }} />
        <input name="user_id" type="number" value="37" />
        <button type="submit">erhfie</button>
    </form> --}}
    <div class="w-full bg-[#f6f5fa] py-6">
        <div class="xl:w-[65%] w-4/5 mx-auto">
            <div class="w-full flex gap-4 p-3 rounded-md bg-white">
                <div class="">
                    <div id="img-container" class="relative z-10">
                        <div id="lens"
                            class="w-44 h-44 absolute border-2 border-blue-400 cursor-none bg-no-repeat -z-10">
                        </div>
                        <img id="featured" alt="" class="h-[470px] w-full object-cover cursor-zoom-in"
                            src="{{ $product->getPhotosAttribute()[0]['original_url'] }}" />
                    </div>
                    <div id="slide-wrapper" class="flex justify-between items-center">
                        <button class="mr-3 w-6 h-6 inline-block" id="leftBtn">
                            <x-bi-arrow-left-circle class="w-6 h-6 text-gray-500" />
                        </button>
                        <div id="slider" class="-mx-2 w-[400px] overflow-x-hidden flex flex-nowrap">
                            @foreach ($product->getPhotosAttribute() as $key => $photo)
                                <img src={{ $photo['original_url'] }}
                                    class="thumbnail w-16 h-16 object-cover inline-block m-2 border-[1.1px] {{ $key == 0 ? 'border-blue-300' : '' }}" />
                            @endforeach
                        </div>
                        <button class="ml-3 w-6 h-6 inline-block" id="rightBtn">
                            <x-bi-arrow-right-circle class="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>
                <section class="flex flex-auto">
                    <div class="flex-auto flex-col pr-3">
                        <div class="font-semibold text-xl">
                            <span>{{ $product->name }}</span>
                        </div>
                        <div class="flex mt-2">
                            <button class="gap-2 flex items-center">
                                <div class="underline text-xl">4.5</div>
                                <div class="flex">
                                    <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-3 w-3" />
                                </div>
                            </button>
                            <div class="mx-2">|</div>
                            <button class="gap-2 flex items-center">
                                <div class="underline text-xl">{{ sizeof($product->reviews) }}</div>
                                <span class="opacity-50">đánh giá</span>
                            </button>
                            <div class="mx-2">|</div>
                            <div class="gap-2 flex items-center">
                                <div class="underline text-xl">200</div>
                                <span class="opacity-50">đã bán</span>
                            </div>
                        </div>
                        <div class="mt-3">
                            <div class="flex items-center gap-3">
                                <div class="text-3xl text-blue-400 font-semibold">₫{{ $product->formatDiscountedPrice() }}
                                </div>
                                @if ($product->sale->percent != 0)
                                    <div class="opacity-50 text-sm line-through">₫{{ $product->formatPrice() }}</div>
                                    <div class="w-auto p-1 text-sm rounded-lg text-blue-400 bg-blue-50">
                                        -{{ $product->sale->percent }}%</div>
                                @endif
                            </div>
                        </div>
                        <div class="py-3">
                            <div class="font-semibold text-lg">Số lượng</div>
                            <div class="flex items-center my-3">
                                <div class="mr-4">
                                    <div class="border rounded-md flex items-center">
                                        <button class="p-2 border-r">
                                            <x-mdi-minus class="w-5 h-5" />
                                        </button>
                                        <input type="text" id="quantity" value="1"
                                            class="w-12 h-8 mb-[1px] text-center outline-none" name="quantity">
                                        <button class="p-2 border-l">
                                            <x-bi-plus class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <span class="text-sm opacity-80">{{ $product->amount }} sản phẩm</span>
                            </div>
                        </div>
                        <div class="pb-4 border-b">
                            <div class="flex gap-3">
                                <button
                                    class="rounded-sm py-2 px-3 text-blue-400 border-[1.1px] border-blue-400 bg-blue-50 flex items-center justify-center gap-2">
                                    <x-monoicon-shopping-cart-add class="w-6 h-6" />
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button class="rounded-sm py-2 px-10 text-white bg-blue-300">Mua ngay</button>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="">
                                <div class="font-semibold text-lg">Thông tin vận chuyển</div>
                                <div class="my-2">
                                    <div class="flex items-center justify-between cursor-pointer gap-1 text-sm flex-1">
                                        <span>Giao đến Q. 1, P. Cầu Kho, Hồ Chí Minh</span>
                                        <span class="text-[rgb(10,104,255)]">Đổi</span>
                                    </div>
                                </div>
                                <div class="">
                                    <div class="py-2 border-b">
                                        <div class="flex gap-2 items-center">
                                            <div class="w-8">
                                                <img src="https://salt.tikicdn.com/ts/upload/04/da/1e/eac32401f048ffd380e50dfeda2a1c55.png"
                                                    alt="" class="h-4 w-8">
                                            </div>
                                            <span>Giao siêu tốc 2h</span>
                                        </div>
                                        <div class="">
                                            <div class="">
                                                <span class="text-[#27272A]">Trước 17h hôm nay:
                                                    10.000<sup><small>₫</small></sup>
                                                    <span
                                                        class="text-[#808089]">&nbsp;<del>25.000<sup><small>₫</small></sup></del>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="py-2 border-b">
                                        <div class="flex gap-2 items-center">
                                            <div class="w-8">
                                                <img src="https://salt.tikicdn.com/ts/upload/6b/59/d9/783a8f53f8c251dbe5f644df40c21c15.png"
                                                    alt="" class="h-4 w-8">
                                            </div>
                                            <span>Giao đúng sáng mai</span>
                                        </div>
                                        <div class="">
                                            <div class="">
                                                <span class="text-[#27272A]">8h - 12h, 08/11:
                                                    1.500<sup><small>₫</small></sup>
                                                    <span
                                                        class="text-[#808089]">&nbsp<del>16.500<sup><small>₫</small></sup></del>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="py-2">
                                    <div class="">
                                        <div class="flex flex-wrap items-center gap-1">
                                            <img src={{ url('assets/free_ship.png') }} alt="freeship-icon" class="w-4 h-4">
                                            <span class="text-sm">Freeship 10k đơn từ 45k, Freeship 25k đơn từ
                                                100k</span>
                                            <x-bi-info-circle class="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="h-6"></div>

                            <div class="">
                                <div class="font-semibold text-lg">Thông tin bảo hành</div>
                                <div class="py-2 border-b">
                                    <div class="flex gap-1">
                                        <span>Thời gian bảo hành:</span>
                                        <span class="text-[rgb(39,39,42)] font-semibold">12 Tháng</span>
                                    </div>
                                </div>
                                <div class="py-2 border-b">
                                    <div class="flex gap-1">
                                        <span>Hình thức bảo hành:</span>
                                        <span class="text-[rgb(39,39,42)] font-semibold">Điện tử</span>
                                    </div>
                                </div>
                                <div class="py-2 border-b">
                                    <div class="flex gap-1">
                                        <span>Nơi bảo hành:</span>
                                        <span class="text-[rgb(39,39,42)] font-semibold">Bảo hành chính hãng</span>
                                    </div>
                                </div>
                                <div class="my-2">
                                    <div class="flex gap-1">
                                        <span>Hướng dẫn bảo hành:</span>
                                        <span class="text-[rgb(10,104,255)]">Xem chi tiết</span>
                                    </div>
                                </div>
                            </div>

                            <div class="h-6"></div>

                            <div class="">
                                <div class="font-semibold text-lg">Thông tin chi tiết</div>
                                <div class="py-2 border-b">
                                    <div class="grid gap-1 grid-cols-2">
                                        <span class="text-[rgb(128,128,137)] max-w-[300px]">Thương hiệu</span>
                                        <span class="">OEM</span>
                                    </div>
                                </div>
                                <div class="py-2 border-b">
                                    <div class="grid gap-1 grid-cols-2">
                                        <span class="text-[rgb(128,128,137)] max-w-[300px]">
                                            Thể loại
                                        </span>
                                        <span class="">{{ $product->category->category_name }}</span>
                                    </div>
                                </div>
                                <div class="py-2 border-b">
                                    <div class="grid gap-1 grid-cols-2">
                                        <span class="text-[rgb(128,128,137)] max-w-[300px]">
                                            Xuất xứ
                                        </span>
                                        <span class="">{{ $product->origin }}</span>
                                    </div>
                                </div>
                                <div class="py-2 border-b">
                                    <div class="grid gap-1 grid-cols-2">
                                        <span class="text-[rgb(128,128,137)] max-w-[300px]">
                                            Chất liệu
                                        </span>
                                        <span class="">{{ $product->material }}</span>
                                    </div>
                                </div>
                                <div class="py-2">
                                    <div class="grid gap-1 grid-cols-2">
                                        <span class="text-[rgb(128,128,137)] max-w-[300px]">
                                            Sản phẩm có bảo hành không?
                                        </span>
                                        <span class="">Không</span>
                                    </div>
                                </div>
                            </div>

                            <div class="h-6"></div>

                            <div class="pr-3">
                                <div class="font-semibold text-lg">Mô tả sản phẩm</div>
                                <div class="py-2">
                                    {!! $product->description !!}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="w-full mt-4 p-3 rounded-md bg-white">
                <div class="font-semibold text-lg">Đánh giá sản phẩm</div>
                <div class="mt-4 pb-3 border-b">
                    <div class="flex gap-12">
                        <div>
                            <span>Tổng quan</span>
                            <div class="flex items-center gap-3">
                                <div class="text-3xl font-bold">{{ $product->calculateAverageStars() }}</div>
                                <div class="flex flex-wrap gap-1">
                                    <x-go-star-fill-24 class="text-[#faca51] h-6 w-6" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-6 w-6" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-6 w-6" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-6 w-6" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-6 w-6" />
                                </div>
                            </div>
                            <div class="my-2 opacity-80 text-sm font-[200]">({{ sizeof($product->reviews) }} đánh giá)
                            </div>
                        </div>
                        <div class="-my-1">
                            <div class="flex items-center gap-3 my-1">
                                <div class="flex">
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                </div>
                                <div class="w-36 bg-blue-300 h-3 rounded-lg" id="progress_bar">
                                    <div class=""></div>
                                </div>
                                <div class="text-gray-500 text-sm">{{ sizeof($product->getStarsReview(5)) }}</div>
                            </div>
                            <div class="flex items-center gap-3 my-1">
                                <div class="flex">
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                </div>
                                <div class="w-36 bg-blue-300 h-3 rounded-lg" id="progress_bar">
                                    <div class=""></div>
                                </div>
                                <div class="text-gray-500 text-sm">{{ sizeof($product->getStarsReview(4)) }}</div>
                            </div>
                            <div class="flex items-center gap-3 my-1">
                                <div class="flex">
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                </div>
                                <div class="w-36 bg-blue-300 h-3 rounded-lg" id="progress_bar">
                                    <div class=""></div>
                                </div>
                                <div class="text-gray-500 text-sm">{{ sizeof($product->getStarsReview(3)) }}</div>
                            </div>
                            <div class="flex items-center gap-3 my-1">
                                <div class="flex">
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                </div>
                                <div class="w-36 bg-blue-300 h-3 rounded-lg" id="progress_bar">
                                    <div class=""></div>
                                </div>
                                <div class="text-gray-500 text-sm">{{ sizeof($product->getStarsReview(2)) }}</div>
                            </div>
                            <div class="flex items-center gap-3 my-1">
                                <div class="flex">
                                    <x-go-star-fill-24 class="text-[#faca51] h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                    <x-go-star-fill-24 class="text-gray-300 h-4 w-4" />
                                </div>
                                <div class="w-36 bg-blue-300 h-3 rounded-lg" id="progress_bar">
                                    <div class=""></div>
                                </div>
                                <div class="text-gray-500 text-sm">{{ sizeof($product->getStarsReview(1)) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pb-3 border-b">
                    <span>Lọc theo</span>
                    <div class="flex flex-wrap gap-3 mt-2">
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">Mới nhất</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">Có hình ảnh</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">Đã mua hàng</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">5 sao</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">4 sao</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">3 sao</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">2 sao</span>
                        </div>
                        <div class="px-3 py-2 rounded-lg border-[1.1px] filter">
                            <span class="filter-review__text">1 sao</span>
                        </div>
                    </div>
                </div>
                <div class="pb-3">
                    @foreach ($product->reviews as $review)
                        <div class="flex gap-4 py-4 border-b">
                            <div class="w-1/5">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="rounded-full">
                                        <img class="w-12 h-12 rounded-full" src={{ $review->user->getAvatarAttribute() }}
                                            alt={{ $review->id }} />
                                    </div>
                                    <div>
                                        <div class="text-ellipsis line-clamp-1">{{ $review->user->username }}</div>
                                        <div class="text-sm text-gray-500">Đã tham gia 2 tháng</div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between text-gray-500">
                                    <x-mdi-comment-alert-outline class="w-4 h-4" />
                                    <span class="text-sm">{{ sizeof($review->user->reviews) }} Đánh giá</span>
                                </div>
                                <div class="border my-2"></div>
                                <div class="flex items-center justify-between text-gray-500">
                                    <x-mdi-thumb-up-outline class="w-4 h-4" />
                                    <span class="text-sm">0 Lượt cảm ơn</span>
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="">
                                    <div class="flex flex-wrap gap-1">
                                        @for ($i = 1; $i <= $review->star; $i++)
                                            <x-go-star-fill-24 class="text-[#faca51] h-6 w-6" />
                                        @endfor
                                        @for ($i = 0; $i < 5 - $review->star; $i++)
                                            <x-go-star-fill-24 class="text-gray-300 h-6 w-6" />
                                        @endfor
                                    </div>
                                </div>
                                <div class="my-3">
                                    <div class="text-green-500 flex items-center gap-1">
                                        <x-bi-check-circle class="w-5 h-5" fill="green" />
                                        <span class="text-sm">Đã mua hàng</span>
                                    </div>
                                </div>
                                <span class="text-sm">{{ $review->comment }}</span>
                                <div class="flex flex-nowrap overflow-x-hidden w-full gap-3 my-2">
                                    @foreach ($review->getMediasAttribute() as $media)
                                        <img src={{ $media['original_url'] }} alt="" class="h-24 w-24" />
                                    @endforeach
                                </div>
                                <div class="flex gap-2 items-center mb-3">
                                    <span class="text-sm text-gray-500">Đánh giá vào {{ date('h:m d-m-Y') }}</span>
                                    <span class="w-1 h-1 bg-gray-500"></span>
                                    <span class="text-sm text-gray-500">Đã dùng 1 giờ</span>
                                </div>
                                <div class="flex items-center justify-between text-gray-500">
                                    <div class="flex gap-5">
                                        <span class="flex items-center gap-1">
                                            <x-mdi-thumb-up-outline class="w-6 h-6" />
                                            <span class="text-sm">0</span>
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <x-forkawesome-comment-o class="w-6 h-6" />
                                            <span class="text-sm">0</span>
                                        </span>
                                    </div>
                                    <span class="flex items-center gap-1">
                                        <x-bi-share class="w-6 h-6" />
                                        <span class="text-sm">Chia sẻ</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        const imageZoom = () => {
            const img = document.getElementById("featured");
            const lens = document.getElementById("lens");
            lens.style.backgroundImage = `url(${img.src})`
            let ratio = 1.5 //150% zoom
            lens.style.backgroundSize = (img.width * ratio) + 'px ' + (img.height * ratio) + 'px'
            img.addEventListener('mousemove', () => {
                moveLens()
            })
            lens.addEventListener('mousemove', () => {
                moveLens()
            })
            const moveLens = () => {
                let pos = getCursor()
                // set position of the lens div relative to the image based on position of the cursor
                let lensLeft = pos.x - (lens.offsetWidth / 2)
                let lensTop = pos.y - (lens.offsetHeight / 2)
                // set bounds for lens
                if (lensLeft < 0) lensLeft = 0
                if (lensTop < 0) lensTop = 0
                if (lensLeft > img.width - lens.offsetWidth) lensLeft = (img.width - lens.offsetWidth)
                if (lensTop > img.height - lens.offsetHeight) lensTop = (img.height - lens.offsetHeight)
                lens.style.left = lensLeft + 'px'
                lens.style.top = lensTop + 'px'
                // set lens background position
                lens.style.backgroundPosition = "-" + (pos.x * ratio / 1.1) + 'px -' + (pos.y * ratio / 1.1) + 'px'

            }
            const getCursor = () => {
                let e = window.event
                let bounds = img.getBoundingClientRect()
                let x = e.pageX - bounds.left
                let y = e.pageY - bounds.top
                x = x - window.pageXOffset
                y = y - window.pageYOffset
                return {
                    'x': x,
                    'y': y
                }
            }
        }
        document.getElementById("img-container").addEventListener('mouseover', () => {
            document.getElementById("lens").classList.remove("-z-10")
            imageZoom()
        })
        document.getElementById("img-container").addEventListener('mouseout', () => {
            document.getElementById("lens").classList.add("-z-10")
        })

        let thumbnails = document.getElementsByClassName("thumbnail")
        for (let i = 0; i < thumbnails.length; i++) {
            thumbnails[i].addEventListener('mouseover', () => {
                let activeImg = document.getElementsByClassName("border-blue-300")
                if (activeImg.length > 0) activeImg[0].classList.remove("border-blue-300")
                thumbnails[i].classList.add("border-blue-300")
                document.getElementById("featured").src = thumbnails[i].src
            })
        }
        let leftBtn = document.getElementById("leftBtn")
        let rightBtn = document.getElementById("rightBtn")
        leftBtn.addEventListener('click', () => {
            document.getElementById("slider").scrollLeft -= 180
        })

        rightBtn.addEventListener("click", () => {
            document.getElementById("slider").scrollLeft += 180
        })

        let filterOptions = document.getElementsByClassName("filter");
        for (let i = 0; i < filterOptions.length; i++) {
            filterOptions[i].addEventListener("click", () => {
                ["border-blue-400", "text-blue-400", "bg-blue-50"].forEach((className) => {
                    filterOptions[i].classList.toggle(className)
                })
            })
        }
    </script>
    <script src="{{ url('/js/add_cart.js') }}"></script>
@endsection
