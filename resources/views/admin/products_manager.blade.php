@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <div class="container-md p-0">
            <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                <div class="row col-md-auto">
                    <div class="col-md-auto">
                        <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                        <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng sản phẩm
                            <span class="badge bg-danger" id="total-count">{{ $total }}</span>
                        </label>
                    </div>
                    <div class="col-md-auto">
                        <button data-page="{{ $currentpage }}" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                            data-bs-target="#add-product">Thêm sản phẩm </button>
                    </div>
                </div>
                <div class="col-md-auto">
                    <div class="input-group">
                        <input type="text" class="form-control form-control-sm" value=""
                            placeholder="Nhập tên cần tìm" id="search_name">
                        <i class="fa-solid fa-magnifying-glass text-light p-2 bg-primary"></i>
                    </div>
                </div>
            </div>
            <div class="table-responsive" id="product-table">
                @include('dynamic_layout.product_reload')
            </div>
        </div>
    </div>

    <div class="modal fade bd-example-modal-lg" id="add-product" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Thêm sản phẩm</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="col-md-5">
                            <div class="col-md-auto mb-3 border" style="height: 20rem;">
                                <img src="https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg"
                                    id="display-product" class="rounded mx-auto d-block m-5" width="auto" height="200"
                                    style="object-fit: cover;">
                            </div>
                            <div class="col-md-auto">
                                <div class="input-group mb-3">
                                    <input type="file" class="form-control" id="product-image" name="product-image"
                                        required>
                                </div>
                            </div>
                            <div class="row col-md-auto">
                                <div class="col-md-12">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" name="product-name" id="product-name"
                                            required>
                                        <label for="floatingInput">Tên sản phẩm</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="col-md-auto">
                                <div class="mb-3">
                                    <label class="form-label">Giới thiệu:</label>
                                    <textarea style="height: 15rem" class="form-control" aria-label="With textarea" id="product-description"
                                        name="product-description" required></textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Thể loại:</label>
                                        <select class="form-select" id="product-category" name="product-category">
                                            @foreach ($Categories as $category)
                                                <option checked value="{{ $category->id }}">{{ $category->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3"><label for="exampleInputPassword1" class="form-label">Giảm
                                            giá:</label>
                                        <select class="form-select" id="product-discount" name="product-discount">
                                            @foreach ($Sales as $sale)
                                                <option selected value="{{ $sale->id }}">
                                                    {{ $sale->salename }} (-{{ $sale->percent }}%)</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                                        <select class="form-select" id="product-origin" name="product-origin">
                                            <option checked value="Anh">Anh</option>
                                            <option checked value="Mỹ">Mỹ</option>
                                            <option checked value="Hàn">Hàn</option>
                                            <option checked value="Nhật">Nhật</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Kho:</label>
                                        <input type="number" class="form-control" value="<?php echo rand(1, 99); ?>"
                                            id="product-amount" name="product-amount" required>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Chất liệu:</label>
                                        <select class="form-select" id="product-material" name="product-material">
                                            @foreach ($Materials as $Material)
                                                <option selected value="{{ $Material->material }}">
                                                    {{ $Material->material }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Giá:</label>
                                        <input type="number" class="form-control" value="<?php echo rand(500000, 36000000); ?>"
                                            id="product-price" name="product-price" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Thoát</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="add-btn">Thêm</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade bd-example-modal-lg" id="edit-product" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Sửa sản phẩm</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="col-md-5">
                            <div class="col-md-auto mb-3 border" style="height: 20rem;">
                                <img id="edit-display-product" src="" class="rounded mx-auto d-block m-5"
                                    width="auto" height="200" style="object-fit: cover;">
                            </div>
                            <div class="col-md-auto">
                                <div class="input-group mb-3">
                                    <input type="file" class="form-control" id="edit-product-image"
                                        name="edit-product-image" required>
                                </div>
                            </div>
                            <div class="row col-md-auto">
                                <div class="col-md-3">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" name="product-id" id="product-id"
                                            required>
                                        <label for="floatingInput">Mã</label>
                                    </div>
                                </div>
                                <div class="col-md-9">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" name="edit-product-name"
                                            id="edit-product-name" required>
                                        <label for="floatingInput">Tên sản phẩm</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="col-md-auto">
                                <div class="mb-3">
                                    <label class="form-label">Giới thiệu:</label>
                                    <textarea style="height: 15rem" class="form-control" aria-label="With textarea" id="edit-product-description"
                                        name="edit-product-description" required></textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Thể loại:</label>
                                        <select class="form-select" id="edit-product-category"
                                            name="edit-product-category">
                                            @foreach ($Categories as $category)
                                                <option checked value="{{ $category->id }}">{{ $category->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3"><label for="exampleInputPassword1" class="form-label">Giảm
                                            giá:</label>
                                        <select class="form-select" id="edit-product-discount"
                                            name="edit-product-discount">
                                            @foreach ($Sales as $sale)
                                                <option selected value="{{ $sale->id }}">
                                                    {{ $sale->salename }} (-{{ $sale->percent }}%)</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                                        <select class="form-select" id="edit-product-origin" name="edit-product-origin">
                                            <option checked value="Anh">Anh</option>
                                            <option checked value="Mỹ">Mỹ</option>
                                            <option checked value="Hàn Quốc">Hàn Quốc</option>
                                            <option checked value="Nhật">Nhật</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Kho:</label>
                                        <input type="number" class="form-control" value="<?php echo rand(1, 99); ?>"
                                            id="edit-product-amount" name="edit-product-amount" required>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Chất liệu:</label>
                                        <select class="form-select" id="edit-product-material"
                                            name="edit-product-material">
                                            @foreach ($Materials as $Material)
                                                <option selected value="{{ $Material->material }}">
                                                    {{ $Material->material }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Giá:</label>
                                        <input type="number" class="form-control" value="<?php echo rand(500000, 36000000); ?>"
                                            id="edit-product-price" name="edit-product-price" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Thoát</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="edit-btn">Sửa</button>
                </div>
            </div>
        </div>
    </div>
    <script>
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
                    name: $("#product-name").val(),
                    amount: $("#product-amount").val(),
                    price: $("#product-price").val(),
                    category: $("#product-category").val(),
                    material: $("#product-material").val(),
                    origin: $("#product-origin").val(),
                    description: $("#product-description").val(),
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
                url: "/admin/manage_products/store",
                method: "get",
                data: {
                    id: $(this).attr('data-id')
                },
                success: function(result) {
                    let img = "{{ url('/image') }}"
                    $("#product-id").val(result.id)
                    $("#edit-product-name").val(result.name)
                    $("#edit-product-amount").val(result.amount)
                    $("#edit-product-price").val(result.price)
                    $("#edit-product-category").val(result.category)
                    $("#edit-product-material").val(result.material)
                    $("#edit-product-origin").val(result.origin)
                    $("#edit-product-description").val(result.description)
                    $("#edit-product-discount").val(result.discount)
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
                    name: $("#edit-product-name").val(),
                    amount: $("#edit-product-amount").val(),
                    price: $("#edit-product-price").val(),
                    category: $("#edit-product-category").val(),
                    material: $("#edit-product-material").val(),
                    origin: $("#edit-product-origin").val(),
                    description: $("#edit-product-description").val(),
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
    </script>
@endsection
