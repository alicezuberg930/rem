{{-- @dd($products) --}}
<form class="form" wire:submit.prevent="save">
    <div class="modal-body">
        <div class="row justify-content-center justify-content-around">
            <div class="col-md-5">
                @if ($photos)
                    <div class="mb-3 w-full overflow-x-scroll whitespace-nowrap -mx-1 h-40 custom-scrollbar">
                        @foreach ($photos as $photo)
                            <img class="inline-block object-cover rounded-sm mx-1 h-36 w-48"
                                src="{{ $photo->temporaryUrl() }}">
                        @endforeach
                    </div>
                @endif
                <div class="col-md-auto">
                    <div class="input-group mb-3">
                        <input wire:model.defer="photos" type="file" class="form-control"
                            accept="image/png, image/jpg, image/jpeg" id="product-image" multiple="multiple">
                    </div>
                    <div wire:loading wire:target="photos">Uploading...</div>
                </div>
                <div class="row col-md-auto">
                    <div class="col-md-12">
                        <div class="form-floating mb-3">
                            <input wire:model.defer="name" type="text" class="form-control">
                            <label for="floatingInput">Tên sản phẩm</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="col-md-auto">
                    <div class="mb-3">
                        <label class="form-label">Giới thiệu:</label>
                        <textarea wire:model.defer="description" class="form-control"></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Thể loại:</label>
                            <select wire:model.defer="category_id" class="form-select">
                                @foreach ($categories as $category)
                                    <option selected value="{{ $category->id }}">{{ $category->category_name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Giảm giá:</label>
                            <select wire:model.defer="sale_id" class="form-select">
                                @foreach ($sales as $sale)
                                    <option selected value="{{ $sale->id }}">
                                        {{ $sale->sale_name }}(-{{ $sale->percent }}%)</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                            <select wire:model.defer="origin" class="form-select">
                                <option checked value="Anh">Anh</option>
                                <option checked value="Mỹ">Mỹ</option>
                                <option checked value="Hàn">Hàn</option>
                                <option checked value="Nhật">Nhật</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="" class="form-label">Chất liệu:</label>
                            <select wire:model.defer="material" class="form-select">
                                @foreach ($materials as $material)
                                    <option selected value="{{ $material->material }}">{{ $material->material }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Giá:</label>
                            <input wire:model.defer="price" type="number" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="mb-3">
                            <label class="form-label">SL:</label>
                            <input wire:model.defer="amount" type="number" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="submit" class="btn btn-secondary" data-dismiss="modal">Thoát</button>
        <button type="submit" class="btn btn-primary" data-dismiss="modal">Thêm</button>
    </div>
</form>
