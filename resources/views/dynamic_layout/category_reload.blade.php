<div class="modal fade" id="themtheloai" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel2">Thêm thể loại</h5>
                <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                </button>
            </div>
            <div class="modal-body">
                <div class="row justify-content-center justify-content-around">
                    <div class="mb-3 row">
                        <label for="staticEmail" class="col-sm-2 col-form-label fw-semibold">Tên</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control-plaintext" id="name-category-add"
                                value="Thương hiệu A">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="inputPassword" class="col-sm-2 col-form-label fw-semibold">Mô tả</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" id="desc-category-add" placeholder="Mô tả gì đó" style="height: 10rem">Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.  Vang đỏ thường có màu đậm pha trộn giữa màu đỏ, đen và tím.  Quá trình làm rượu vang đỏ thì vỏ nho cũng được nghiền nát cùng với ruột để tạo ra nước ép rồi lên men thành rượu.</textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                    onclick="add({!! $currentpage !!})">Thêm</button>
            </div>
        </div>
    </div>
</div>
<table class="table align-middle table-hover table-sm">
    <thead class="table">
        <tr>
            <th scope="col">#</th>
            <th scope="col">Tên</th>
            <th scope="col" style="width:70%;">Mô tả</th>
            <th scope="col">Sửa</th>
            <th scope="col">Xóa</th>
        </tr>
    </thead>
    <tbody id="show-product">
        <?php $stt = ($currentpage - 1) * 15; ?>
        @foreach ($Categories as $Category)
            <tr>
                <th scope="row"> {{ ++$stt }} </th>
                <th scope="row">{{ $Category->name }}</th>
                <td>
                    {{ $Category->description }}
                </td>
                <td>
                    <button type="button" class="btn" data-bs-toggle="modal"
                        data-bs-target="#minhthu{{ $Category->id }}" id="{{ $Category->id }}">
                        <i class="bi bi-eye text-primary"> </i>
                    </button>
                </td>
                <td>
                    <button value="{{ $Category->id }}" class="delete-btn btn btn-sm bi bi-x-lg text-danger"
                        type="button" onclick="deleted({{ $Category->id }}}, {!! $currentpage !!})">
                    </button>
                </td>
            </tr>
            <div class="modal fade" id="minhthu{{ $Category->id }}" tabindex="-1" aria-labelledby="staticBackdropLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Sửa thương hiệu</h5>
                            <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row justify-content-center justify-content-around">
                                <div class="col-md-12">
                                    <div class="row col-md-auto">
                                        <div class="col-md-3">
                                            <div class="form-floating mb-3">
                                                <input type="text" class="form-control" disabled
                                                    value="{{ $Category->id }}">
                                                <label for="floatingInput">Mã</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                            <div class="form-floating mb-3">
                                                <input name="name-category-modal-{{ $Category->id }}"
                                                    id="name-category-modal-{{ $Category->id }}" class="form-control"
                                                    value="{{ $Category->name }}">
                                                <label for="floatingInput">Tên thương hiệu</label>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-floating mb-3">
                                                <textarea class="form-control desc" id="desc-category-modal-{{ $Category->id }}" placeholder="Mô tả gì đó"
                                                    style="height: 12rem">{{ $Category->description }}</textarea>
                                                <label for="floatingInput">Mô tả</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                onclick="edit({{ $Category->id }})">Sửa</button>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </tbody>
</table>
<nav aria-label="Page navigation example" class="col-md-12 my-3">
    <ul class="pagination pagination-sm justify-content-end" id="phantrang">
        @for ($i = 0; $i < ceil($pagin / 15); $i++)
            @if ($i == $currentpage - 1)
                <li class="page-item"><a class="page-link active">{!! $i + 1 !!}</a></li>
            @else
                <li class="page-item"><a class="page-link"
                        onclick="phantrang({!! $i + 1 !!})">{!! $i + 1 !!}</a></li>
            @endif
        @endfor
    </ul>
</nav>
