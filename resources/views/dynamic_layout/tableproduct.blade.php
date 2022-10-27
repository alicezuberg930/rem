<table class="table align-middle table-hover table-sm">
    <thead class="table">
        <tr>
            <th scope="col">#</th>
            <th scope="col">Mã</th>
            <th scope="col">Sản phẩm</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Giá</th>
            <th scope="col">Tổng</th>
            <th scope="col">Thao tác</th>
        </tr>
    </thead>
    <tbody id="show-product">
        <?php $stt = ($currentpage - 1) * 10; ?>
        @foreach ($productArray as $value)
            <tr>
                <th scope="row"><?php echo ++$stt; ?></th>
                <th scope="row"><?php echo $value['id']; ?></th>
                <td>
                    <div class="d-flex align-items-center">
                        <img class="img"
                            src="https://vinoteka.vn/assets/components/phpthumbof/cache/071801-1.3899b5ec6313090055de59b4621df17a.jpg"
                            width="68">
                        <span><?php echo $value['name']; ?></span>
                    </div>
                </td>
                <td><?php echo $value['quantity']; ?></td>
                <td><?php echo number_format($value['price']); ?></td>
                <td><?php echo number_format($value['price'] * $value['quantity']); ?></td>
                <td>
                    <button type="button" class="btn" data-bs-toggle="modal"
                        data-bs-target="#minhthu<?php echo $value['id']; ?>" id="<?php echo $value['id']; ?>">
                        <i class="bi bi-eye-fill text-primary"></i>
                    </button>
                    <button value="<?php echo $value['id']; ?>" class="delete-btn btn btn-sm bi bi-x-lg text-danger"
                        type="button" onclick="deleted({!! $value->id !!}, {!! $currentpage !!})">
                    </button>
                </td>
            </tr>
            <div class="modal fade" id="minhthu<?php echo $value['id']; ?>" tabindex="-1"
                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Sửa sản phẩm</h5>
                            <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row justify-content-center justify-content-around">
                                <div class="col-md-4">
                                    <div class="col-md-auto border" style="height: 24rem;">
                                        <img src="https://vinoteka.vn/assets/components/phpthumbof/cache/071801-1.3899b5ec6313090055de59b4621df17a.jpg"
                                            class="rounded mx-auto d-block m-5" alt="..." width="auto"
                                            height="200" style="object-fit: cover;">
                                    </div>
                                    <div class="col-md-auto">
                                        <div class="input-group mb-3">
                                            <input type="file" class="form-control">
                                            <button class="btn btn-outline-secondary" type="button">Upload</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="row col-md-auto">
                                        <div class="col-md-4">
                                            <div class="form-floating mb-3">
                                                <input type="text" class="form-control" disabled
                                                    value="<?php echo $value['id']; ?>">
                                                <label for="floatingInput">Mã sản phẩm</label>
                                            </div>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="form-floating mb-3">
                                                <input name="name-product-modal-<?php echo $value['id']; ?>"
                                                    id="name-product-modal-<?php echo $value['id']; ?>" class="form-control"
                                                    value="<?php echo $value['name']; ?>">
                                                <label for="floatingInput">Tên sản phẩm</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label">Giới thiệu:</label>
                                            <textarea id="desc-product-modal-<?php echo $value['id']; ?>" style="height: 180px" class="form-control"
                                                aria-label="With textarea"><?php echo $value['description']; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="exampleInputPassword1" class="form-label">Loại
                                                    rượu:</label>
                                                <select class="form-select"
                                                    id="category-product-modal-<?php echo $value['id']; ?>">
                                                    @foreach ($categoryArray as $item)
                                                        <option value="{!! $item->id !!}" {!! $item->id == $value->category ? 'selected' : '' !!}>
                                                            {!! $item->name !!}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-5">
                                            <div class="mb-3">
                                                <label for="exampleInputPassword1" class="form-label">Thương
                                                    hiệu:</label>
                                                <select class="form-select"
                                                    id="brand-product-modal-<?php echo $value['id']; ?>">
                                                    @foreach ($brandArray as $item)
                                                        <option value="{!! $item->id !!}" {!! $item->id == $value->brand ? 'selected' : '' !!}>
                                                            {!! $item->name !!}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                                                <select class="form-select"
                                                    id="country-product-modal-<?php echo $value['id']; ?>">
                                                    @foreach ($countryArray as $item)
                                                        <option value="{!! $item->id !!}"
                                                            {!! $item->id == $value->country ? 'selected' : '' !!}>{!! $item->name !!}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class=" mb-3">
                                                <label for="" class="form-label">Số lượng:</label>
                                                <input type="number" class="form-control"
                                                    id="quantity-product-modal-<?php echo $value['id']; ?>"
                                                    value="<?php echo $value['quantity']; ?>">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class=" mb-3">
                                                <label for="" class="form-label">Nồng độ:</label>
                                                <input type="number" class="form-control"
                                                    id="tone-product-modal-<?php echo $value['id']; ?>"
                                                    value="<?php echo $value['tone']; ?>">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class=" mb-3">
                                                <label for="" class="form-label">Năm:</label>
                                                <input type="number" class="form-control"
                                                    id="year-product-modal-<?php echo $value['id']; ?>"
                                                    value="<?php echo $value['year']; ?>">
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">Giá:</label>
                                                <input type="number" class="form-control"
                                                    id="price-product-modal-<?php echo $value['id']; ?>"
                                                    value="<?php echo $value['price']; ?>">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                onclick="edit(<?php echo $value['id']; ?>)">Sửa</button>
                        </div>

                    </div>
                </div>
            </div>
        @endforeach
    </tbody>
</table>
<nav aria-label="Page navigation example" class="col-md-12 my-3">
    <ul class="pagination pagination-sm justify-content-end" id="phantrang">
        @for ($i = 0; $i < ceil($pagin / 10); $i++)
            @if ($i == $currentpage - 1)
                <li class="page-item"><a class="page-link active">{!! $i + 1 !!}</a></li>
            @else
                <li class="page-item"><a class="page-link"
                        onclick="phantrang({!! $i + 1 !!})">{!! $i + 1 !!}</a></li>
            @endif
        @endfor
    </ul>
</nav>
