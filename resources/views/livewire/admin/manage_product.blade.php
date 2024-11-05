<div class="flex flex-col flex-1 w-full">
    <main class="h-full overflow-y-auto">
        <div class="container grid px-6 mt-5 mx-auto">
            <div class="px-4">
                <div class="flex items-center justify-between w-full mb-2 text-2xl font-semibold">
                    <h2>Products</h2>
                    <button class="flex items-center text-sm font-medium rounded-xl bg-blue-300 text-white p-2"
                        x-on:click="$dispatch('open-create-modal')">
                        <x-bi-plus class="w-5 h-5 mr-1" />
                        <span>Thêm mới</span>
                    </button>
                </div>
                <div class="flex-col">
                    <div class="space-y-4">
                        <div class="p-6 md:flex md:justify-between md:p-0">
                            <div class="w-full mb-4 md:mb-0 flex items-center gap-4">
                                {{-- <button wire:click="enableReordering" type="button" class="inline-flex justify-center items-center w-full md:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:text-gray-800">Reorder</button> --}}
                                <div class="rounded-md shadow-sm border">
                                    <input wire:model.live.debounce.250ms="search" placeholder="Tìm kiếm" type="text"
                                        class="p-2 shadow-sm block sm:text-sm sm:leading-5 focus:outline-none focus:border-indigo-300 focus:shadow-blue-300 rounded-md">
                                </div>
                                <div x-data="{ open: false }" x-on:keydown.escape.stop="open = false"
                                    x-on:mousedown.away="open = false" class="relative block text-left md:inline-block">
                                    <button type="button"
                                        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                                        x-on:click="open = !open" aria-haspopup="true" x-bind:aria-expanded="open">
                                        Filters
                                        <svg class="w-5 h-5 ltr:ml-2 ltr:-mr-1 rtl:mr-2 rtl:-ml-1"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
                                            </path>
                                        </svg>
                                    </button>
                                    <div x-show="open" x-transition:enter="transition ease-out duration-100"
                                        x-transition:enter-start="transform opacity-0 scale-95"
                                        x-transition:enter-end="transform opacity-100 scale-100"
                                        x-transition:leave="transition ease-in duration-75"
                                        x-transition:leave-start="transform opacity-100 scale-100"
                                        x-transition:leave-end="transform opacity-0 scale-95"
                                        class="absolute right-0 z-50 w-full mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg md:w-56 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu" aria-orientation="vertical" aria-labelledby="filters-menu">
                                        <div class="py-1" role="none">
                                            <div class="block px-4 py-2 text-sm text-gray-700" role="menuitem">
                                                <label for="filter-digital"
                                                    class="block text-sm font-medium leading-5 text-gray-700 ltr:text-left rtl:text-right">
                                                    Digital
                                                </label>
                                                <div class="mt-1 relative rounded-md shadow-sm">
                                                    <select wire:key="filter-digital" id="filter-digital"
                                                        class="rounded-md shadow-sm block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo sm:text-sm sm:leading-5">
                                                        <option value="">Any</option>
                                                        <option value="1">Yes</option>
                                                        <option value="0">No</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="rounded-md shadow-sm border">
                                    <select wire:model.live.debounce.250ms="perPage"
                                        class="block w-full py-2 pl-3 pr-10 text-base leading-6 border border-gray-300 focus:outline-none focus:border-indigo-300 focus:shadow-blue-300 sm:text-sm">
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="align-middle min-w-full shadow rounded-none md:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th class="px-3 py-2 md:px-6 md:py-3 bg-gray-50">
                                            <button wire:click="sortBy('id', 'ID')"
                                                class="flex items-center space-x-1 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase ltr:text-left rtl:text-right group focus:outline-none focus:underline">
                                                <span>ID</span>
                                                <span class="relative flex items-center">
                                                    <svg class="w-3 h-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </th>
                                        <th class="px-3 py-2 md:px-6 md:py-3 bg-gray-50">
                                            <span
                                                class="block text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase text-left">
                                                Ảnh
                                            </span>
                                        </th>
                                        <th
                                            class="px-3 py-2 md:px-6 md:py-3 bg-gray-50 w-3/12 line-clamp-1 text-ellipsis truncate">
                                            <button wire:click="sortBy('name', 'Name')"
                                                class="flex items-center space-x-1 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase text-left group focus:outline-none focus:underline">
                                                <span>Tên</span>
                                                <span class="relative flex items-center">
                                                    <svg class="w-3 h-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </th>
                                        <th class="px-3 py-2 md:px-6 md:py-3 bg-gray-50">
                                            <button wire:click="sortBy('price', 'Price')"
                                                class="flex items-center space-x-1 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase text-left group focus:outline-none focus:underline">
                                                <span>Giá</span>

                                                <span class="relative flex items-center">
                                                    <svg class="w-3 h-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </th>
                                        <th class="px-3 py-2 md:px-6 md:py-3 bg-gray-50">
                                            <button wire:click="sortBy('available_qty', 'Available Qty')"
                                                class="flex items-center space-x-1 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase text-left group focus:outline-none focus:underline">
                                                <span>Số lượng</span>

                                                <span class="relative flex items-center">
                                                    <svg class="w-3 h-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </th>
                                        {{-- <th class="px-3 py-2 md:px-6 md:py-3 bg-gray-50">
                                            <button wire:click="sortBy('has_options', 'Has Options')"
                                                class="flex items-center space-x-1 text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase text-left group focus:outline-none focus:underline">
                                                <span>Has Options</span>
    
                                                <span class="relative flex items-center">
                                                    <svg class="w-3 h-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M5 15l7-7 7 7"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </th> --}}

                                        <th class="px-3 py-2 md:px-6 md:py-3 bg-gray-50 flex items-center">
                                            <span
                                                class="block text-xs font-medium leading-4 tracking-wider text-gray-500 uppercase text-left">
                                                Hành động
                                            </span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody wire:sortable="" class="bg-white divide-y divide-gray-200">
                                    @foreach ($products as $product)
                                        <tr class="bg-white" wire:loading.class.delay="opacity-50">
                                            <td
                                                class="px-3 py-2 md:px-6 md:py-4 whitespace-normal text-sm leading-5 text-gray-900">
                                                {{ $product->id }}
                                            </td>

                                            <td
                                                class="px-3 py-2 md:px-6 md:py-4 whitespace-normal text-sm leading-5 text-gray-900">
                                                <div class="h-24 w-20">
                                                    <img class="object-cover w-full h-full"
                                                        src={{ $product->getFirstMediaUrl('photos') }} />
                                                </div>
                                            </td>

                                            <td
                                                class="px-3 py-2 md:px-6 md:py-4 whitespace-normal text-sm leading-5 text-gray-900">
                                                {{ $product->name }}
                                            </td>

                                            <td
                                                class="px-3 py-2 md:px-6 md:py-4 whitespace-normal text-sm leading-5 text-gray-900">
                                                <div class="text-gray-700">
                                                    <span class="font-medium">{{ $product->formatPrice() }} đ</span>
                                                </div>
                                            </td>

                                            <td
                                                class="px-3 py-2 md:px-6 md:py-4 whitespace-normal text-sm leading-5 text-gray-900">
                                                {{ $product->amount }}
                                            </td>

                                            <td
                                                class="px-3 py-2 md:px-6 md:py-4 whitespace-normal text-sm leading-5 text-gray-900">
                                                <div x-data="{ showMore: false }">
                                                    <div class="flex flex-wrap items-center space-x-2 gap-y-2">
                                                        <button
                                                            class="flex items-center p-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-yellow-600 border border-transparent rounded-lg active:bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:shadow-outline-yellow"
                                                            wire:click="$emit('showDetailsModal', 26 ) ">
                                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                                stroke="currentColor" aria-hidden="true">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                                </path>
                                                            </svg></button>
                                                        <button
                                                            class="flex items-center p-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray"
                                                            wire:click="edit({{ $product->id }})" title="Edit">
                                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                                stroke="currentColor" aria-hidden="true">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                                                </path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            class="flex items-center p-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                                                            wire:click="initiateDeactivate(26)" title="Deactivate">
                                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                                stroke="currentColor" aria-hidden="true">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M6 18L18 6M6 6l12 12"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            class="flex items-center p-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
                                                            wire:click="initiateDelete(26)" title="Delete">
                                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                                stroke="currentColor" aria-hidden="true">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                                                </path>
                                                            </svg></button>
                                                        <button type="button"
                                                            class="  flex items-center p-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-red-500 border border-transparent rounded-lg active:bg-gray-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-gray"
                                                            wire:click="$emit('setOutOfStock', 26 )"
                                                            title="Set product to out of stock">
                                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 32 32" fill="currentColor">
                                                                <path
                                                                    d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 18.726563 26.011719 21.207031 24.375 23.125 L 9.03125 7.46875 C 10.925781 5.917969 13.351563 5 16 5 Z M 7.625 8.875 L 22.96875 24.53125 C 21.074219 26.082031 18.648438 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 13.273438 5.988281 10.792969 7.625 8.875 Z">
                                                                </path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        <div class="p-6 md:p-0">
                            {{ $products->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    {{-- create modal --}}
    <div class="w-full h-screen fixed inset-0 z-20 overflow-y-scroll" x-data="{ show: false }" x-show="show"
        x-on:open-create-modal.window="show=true" x-on:close-create-modal.window="show=false">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div
                class="relative inline-block bg-white shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl rounded-md w-full">
                <span class="absolute right-2 top-5 p-2 text-white" wire:click="$dispatch('close-create-modal')">
                    <x-bi-x-circle-fill class="w-6 h-6" fill="red" />
                </span>
                <form wire:submit.prevent="save">
                    <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 text-left rounded-md">
                        <p class="text-xl font-semibold">Tạo sản phẩm</p>
                        <div class="flex gap-4">
                            <div class="w-3/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Tên</span>
                                    <input
                                        class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                        wire:model.defer="name">
                                </label>
                            </div>
                            <div class="w-1/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Số lượng</span>
                                    <input
                                        class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                        wire:model.defer="amount" step="1" type="number" value="1">
                                </label>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="w-3/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Thể loại</span>
                                    <div class="w-full inline-block">
                                        <select
                                            class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                            wire:model.defer="category_id">
                                            @foreach ($categories as $category)
                                                <option value="{{ $category->id }}">{{ $category->category_name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                </label>
                            </div>
                            <div class="w-1/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Nguồn gốc</span>
                                    <div class="w-full inline-block">
                                        <select
                                            class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                            wire:model.defer="origin">
                                            <option checked value="Anh">Anh</option>
                                            <option checked value="Mỹ">Mỹ</option>
                                            <option checked value="Hàn">Hàn</option>
                                            <option checked value="Nhật">Nhật</option>
                                        </select>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block mt-4 text-sm">
                                <span class="text-gray-700">Hình ảnh</span>
                                <div class="w-full mt-1 inline-block">
                                    <x-filepond::upload wire:model.defer="photos" multiple="true" />
                                </div>
                            </label>
                        </div>
                        <div>
                            <label class="block mt-4 text-sm" wire:ignore>
                                <span class="text-gray-700">Mô tả</span>
                                <div class="w-full mt-1 inline-block h-56">
                                    <div x-data x-ref="editor" x-init="const quill = new Quill($refs.editor, {
                                        theme: 'snow'
                                    });
                                    quill.on('text-change', () => {
                                        $wire.set('description', quill.root.innerHTML)
                                    })">
                                        {!! $description !!}
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div class="flex gap-4">
                            <div class="w-3/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Giá</span>
                                    <input
                                        class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                        wire:model.defer="price" step="1" type="number" value="1">
                                </label>
                            </div>
                            <div class="w-1/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Giảm giá</span>
                                    <div class="w-full inline-block">
                                        <select
                                            class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                            wire:model.defer="sale_id">
                                            @foreach ($sales as $sale)
                                                <option value="{{ $sale->id }}">
                                                    {{ $sale->sale_name }}(-{{ $sale->percent }}%)</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block mt-4 text-sm">
                                <div class="flex items-center gap-4">
                                    <input class="w-5 h-5 border border-gray-300 rounded-sm" type="checkbox"
                                        wire:model.defer="active">
                                    <span class="font-semibold text-gray-700">Kích hoạt</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 flex">
                        <button type="submit"
                            class="bg-blue-300 inline-flex justify-center w-full px-4 py-2 font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Lưu
                        </button>
                        <button type="button"
                            class="inline-flex justify-center w-full px-4 py-2 mt-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            wire:click="$dispatch('close-create-modal')">
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {{-- edit modal --}}
    <div class="w-full h-screen fixed inset-0 z-20 overflow-y-scroll" x-data="{ show: false }" x-show="show"
        x-on:open-edit-modal.window="show=true" x-on:close-edit-modal.window="show=false">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div
                class="relative inline-block bg-white shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl rounded-md w-full">
                <span class="absolute right-2 top-5 p-2 text-white" wire:click="$dispatch('close-edit-modal')">
                    <x-bi-x-circle-fill class="w-6 h-6" fill="red" />
                </span>
                <form wire:submit.prevent="update">
                    <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 text-left rounded-md">
                        <p class="text-xl font-semibold">Sửa sản phẩm</p>
                        <div class="flex gap-4">
                            <div class="w-3/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Tên</span>
                                    <input
                                        class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                        wire:model.defer="name">
                                </label>
                            </div>
                            <div class="w-1/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Số lượng</span>
                                    <input
                                        class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                        wire:model.defer="amount" step="1" type="number" value="1">
                                </label>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="w-3/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Thể loại</span>
                                    <div class="w-full inline-block">
                                        <select
                                            class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                            wire:model.defer="category_id">
                                            @foreach ($categories as $category)
                                                <option value="{{ $category->id }}">{{ $category->category_name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                </label>
                            </div>
                            <div class="w-1/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Nguồn gốc</span>
                                    <div class="w-full inline-block">
                                        <select
                                            class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                            wire:model.defer="origin">
                                            <option checked value="Anh">Anh</option>
                                            <option checked value="Mỹ">Mỹ</option>
                                            <option checked value="Hàn">Hàn</option>
                                            <option checked value="Nhật">Nhật</option>
                                        </select>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block mt-4 text-sm">
                                <span class="text-gray-700">Hình ảnh</span>
                                <div class="w-full mt-1 inline-block">
                                    <x-filepond::upload wire:model.defer="photos" multiple="true" />
                                </div>
                            </label>
                        </div>
                        <div>
                            <label class="block mt-4 text-sm" wire:ignore>
                                <span class="text-gray-700">Mô tả</span>
                                <div class="w-full mt-1 inline-block h-56">
                                    <div x-data x-ref="editor" x-init="const quill = new Quill($refs.editor, {
                                        theme: 'snow'
                                    });
                                    quill.on('text-change', () => {
                                        $wire.set('description', quill.root.innerHTML)
                                    })">
                                        {!! html_entity_decode($description) !!}
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div class="flex gap-4">
                            <div class="w-3/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Giá</span>
                                    <input
                                        class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                        wire:model.defer="price" step="1" type="number" value="1">
                                </label>
                            </div>
                            <div class="w-1/4">
                                <label class="block mt-4 text-sm">
                                    <span class="text-gray-700">Giảm giá</span>
                                    <div class="w-full inline-block">
                                        <select
                                            class="w-full p-2 mt-1 text-sm border border-gray-300 rounded focus:border-blue-300 focus:outline-none focus:shadow-sm"
                                            wire:model.defer="sale_id">
                                            @foreach ($sales as $sale)
                                                <option value="{{ $sale->id }}">
                                                    {{ $sale->sale_name }}(-{{ $sale->percent }}%)</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block mt-4 text-sm">
                                <div class="flex items-center gap-4">
                                    <input class="w-5 h-5 border border-gray-300 rounded-sm" type="checkbox"
                                        wire:model.defer="active">
                                    <span class="font-semibold text-gray-700">Kích hoạt</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 flex">
                        <button type="submit"
                            class="bg-blue-300 inline-flex justify-center w-full px-4 py-2 font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Lưu
                        </button>
                        <button type="button"
                            class="inline-flex justify-center w-full px-4 py-2 mt-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            wire:click="$dispatch('close-edit-modal')">
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@script
@endscript
{{-- <script>
    let current_page = 1;
    const uploadImage = (input, display) => {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
            }
        });
        input.on('change', () => {
            let image = input.prop("files")[0]
            let form = new FormData()
            form.append("image", image);
            $.ajax({
                url: "/admin/manage_products/upload_file",
                method: "post",
                data: form,
                contentType: false,
                processData: false,
                success: function(result) {
                    display.attr('src', result)
                }
            })
        })
    }
    uploadImage($("#product-image"), $("#display-product"))
    uploadImage($("#edit-product-image"), $("#edit-display-product"))
    $("#add-btn").on('click', function() {
        $.ajax({
            url: "/admin/manage_products/add",
            method: "get",
            data: {
                image: $("#display-product").attr('src').split('/')[4],
                product_name: $("#product-name").val(),
                price: $("#product-price").val(),
                category: $("#product-category").val(),
                amount: 0,
                material: $("#product-material").val(),
                origin: $("#product-origin").val(),
                product_description: $("#product-description").val(),
                discount: $("#product-discount").val(),
                page: current_page
            },
            success: function(result) {
                $("#product-table").html(result.response)
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                if (result.status == 1)
                    $('.toast').css('background-color', 'rgb(71, 201, 71)')
                else
                    $('.toast').css('background-color', 'rgb(239, 73, 73)')
            }
        })
    })
    $(document).on('click', '.edit-btn', function() {
        current_page = $(this).attr('data-page')
        $.ajax({
            url: "/admin/manage_products/store/" + $(this).attr('data-id'),
            method: "get",
            success: function(result) {
                let img = "{{ url('/image') }}"
                $("#product-id").val(result.ProductsID)
                $("#edit-product-name").val(result.product_name)
                $("#edit-product-price").val(result.price)
                $("#edit-product-category").val(result.categoryID)
                $("#edit-product-material").val(result.material)
                $("#edit-product-origin").val(result.origin)
                $("#edit-product-description").val(result.product_description)
                $("#edit-product-discount").val(result.salesID)
                $("#edit-display-product").attr('src', img + '/' + result.image)
            }
        })
    })
    $("#edit-btn").on('click', function() {
        $.ajax({
            url: "/admin/manage_products/edit",
            method: "get",
            data: {
                id: $("#product-id").val(),
                image: $("#edit-display-product").attr('src').split('/')[4],
                product_name: $("#edit-product-name").val(),
                price: $("#edit-product-price").val(),
                category: $("#edit-product-category").val(),
                material: $("#edit-product-material").val(),
                origin: $("#edit-product-origin").val(),
                product_description: $("#edit-product-description").val(),
                discount: $("#edit-product-discount").val(),
                page: current_page
            },
            success: function(result) {
                $("#product-table").html(result.response)
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                if (result.status == 1)
                    $('.toast').css('background-color', 'rgb(71, 201, 71)')
                else
                    $('.toast').css('background-color', 'rgb(239, 73, 73)')
            }
        })
    })
    $(document).on('click', '.delete-btn', function() {
        $.ajax({
            url: "/admin/manage_products/delete",
            method: "get",
            data: {
                id: $(this).attr('data-id'),
                page: $(this).attr('data-page')
            },
            success: function(result) {
                $("#product-table").html(result.response)
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                if (result.status == 1)
                    $('.toast').css('background-color', 'rgb(71, 201, 71)')
                else
                    $('.toast').css('background-color', 'rgb(239, 73, 73)')
            }
        })
    })
    $('#search_name').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $.ajax({
                url: "/admin/manage_products/search",
                method: "get",
                data: {
                    name: $(this).val(),
                    page: 1
                },
                success: function(result) {
                    $("#product-table").html(result)
                }
            })
        }
    });
    $(document).on('click', '.page-item', function() {
        current_page = $(this).text()
        $.ajax({
            url: "/admin/manage_products/paginate/" + $(this).text(),
            method: "get",
            success: function(result) {
                $("#product-table").html(result)
            }
        })
    })
    $("#export").on('click', () => {
        $.ajax({
            url: "/admin/manage_products/export",
            method: 'get',
            success: function(result) {
                JSONToCSVConvertor(result, "products_sheet", true)
            }
        })

    })
</script> --}}
