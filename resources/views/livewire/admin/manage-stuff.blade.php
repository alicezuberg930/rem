<div>
    {{-- @dd($products) --}}
    <form class="form" wire:submit.prevent="save">
        <div class="modal-body">
            <div class="row justify-content-center justify-content-around">
                <div class="col-md-5">
                    @if ($photo)
                        <div class="mb-3 w-full overflow-x-scroll whitespace-nowrap -mx-1 h-40 custom-scrollbar">
                            {{-- @foreach ($photos as $photo) --}}
                            <img class="inline-block object-cover rounded-sm mx-1 h-36 w-48"
                                src="{{ $photo->temporaryUrl() }}">
                            {{-- @endforeach --}}
                        </div>
                    @endif
                    <div class="col-md-auto">
                        <div class="input-group mb-3">
                            <input wire:model.defer="photo" type="file" class="form-control"
                                accept="image/png, image/jpg, image/jpeg" id="product-image">
                        </div>
                        <div wire:loading wire:target="photo">Uploading...</div>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-primary" data-dismiss="modal">Thêm</button>

        </div>
    </form>
</div>
