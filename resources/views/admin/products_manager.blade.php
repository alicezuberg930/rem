@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <div class="container-md p-0">
            <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                <div class="row col-md-auto">
                    <div class="col-md-auto">
                        <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                        <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng sản phẩm
                            <span class="badge bg-danger" id="">{{ $total }}</span>
                        </label>
                    </div>
                    <div class="col-md-auto">
                        <a class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#add-product">Thêm
                            sản phẩm </a>
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
                                    id="img-product" class="rounded mx-auto d-block m-5" width="auto" height="200"
                                    style="object-fit: contain;">
                            </div>
                            <div class="col-md-auto">
                                <div class="input-group mb-3">
                                    <input type="file" class="form-control" id="input-image" name="input-image" required>
                                </div>
                            </div>
                            <div class="row col-md-auto">
                                <div class="col-md-12">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" name="name-product" id="name-product"
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
                                    <textarea style="height: 15rem" class="form-control" aria-label="With textarea" id="intro-product" name="intro-product"
                                        required>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Thể loại:</label>
                                        <select class="form-select" id="category-product" name="category-product">
                                            @foreach ($Categories as $category)
                                                <option checked value="{{ $category->id }}">{{ $category->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3"><label for="exampleInputPassword1" class="form-label">Giảm
                                            giá:</label>
                                        <select class="form-select" id="sales-product" name="sales-product">
                                            <option selected value="">Không giảm giá</option>
                                            @foreach ($Sales as $sale)
                                                <option value="{{ $sale->id }}">
                                                    {{ $sale->salename }} (-{{ $sale->percent }}%)</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                                        <select class="form-select" id="country-product" name="country-product">
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
                                        <label for="" class="form-label">Số lượng:</label>
                                        <input type="number" class="form-control" value="<?php echo rand(1, 99); ?>"
                                            id="number-product" name="number-product" required>
                                    </div>
                                </div>
                                <div class="col-md-9">
                                    <div class="mb-3">
                                        <label class="form-label">Giá:</label>
                                        <input type="number" class="form-control" value="<?php echo rand(500000, 36000000); ?>"
                                            id="price-product" name="price-product" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        $("#add-btn").on('click', function() {
            let name = $('#name-category-add').val();
            let description = $('#desc-category-add').val();
            $.ajax({
                url: "/admin/manage_products/add",
                method: "get",
                data: {
                    name: name,
                    description: description,
                    page: "{{ $currentpage }}"
                },
                success: function(result) {
                    $("#category-table").html(result.response)
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
            let id = $(this).attr('data-id')
            let name = $(this).parent().parent().children().eq(1).text()
            let description = $(this).parent().parent().children().eq(2).text().trim()
            $("#id-category-modal").val(id)
            $("#name-category-modal").val(name)
            $("#description-category-modal").val(description)
        })

        $("#edit-btn").on('click', function() {
            $.ajax({
                url: "/admin/manage_category/edit",
                method: "get",
                data: {
                    id: $("#id-category-modal").val(),
                    name: $("#name-category-modal").val(),
                    description: $("#description-category-modal").val(),
                    page: "{{ $currentpage }}"
                },
                success: function(result) {
                    $("#category-table").html(result.response)
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
            let id = $(this).attr('data-id')
            $.ajax({
                url: "/admin/manage_product/delete",
                method: "get",
                data: {
                    id: id,
                    page: "{{ $currentpage }}"
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
                        page: "{{ $currentpage }}"
                    },
                    success: function(result) {
                        $("#product-table").html(result)
                    }
                })
            }
        });

        $(document).on('click', '.page-item', function() {
            $.ajax({
                url: "/admin/manage_products/paginate/" + $(this).text(),
                method: "get",
                success: function(result) {
                    console.log(result);
                    $("#product-table").html(result)
                }
            })
        })
    </script>
@endsection




<div class="modal fade bd-example-modal-lg" id="edit-product" tabindex="-1" role="dialog"
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
                            <img src="https://vinoteka.vn/assets/components/phpthumbof/cache/071801-1.3899b5ec6313090055de59b4621df17a.jpg"
                                id="img-product" class="rounded mx-auto d-block m-5" alt="..." width="auto"
                                height="200" style="object-fit: contain;">
                        </div>
                        <div class="col-md-auto">
                            <div class="input-group mb-3">
                                <input type="file" class="form-control" id="iptIMG" name="iptIMG"
                                    onchange="uploadd()" required>
                            </div>
                        </div>
                        <div class="row col-md-auto">
                            <div class="col-md-4">
                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control" name="id-product" disabled required
                                        value="@php echo rand(1, 6554) @endphp" id="id-product">
                                    <label for="floatingInput">Mã sản phẩm</label>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" name="name-product" id="name-product"
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
                                <textarea style="height: 15rem" class="form-control" aria-label="With textarea" id="intro-product"
                                    name="intro-product" required>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</textarea>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label">Thể loại:</label>
                                    <select class="form-select" id="category-product" name="category-product">
                                        {{-- @foreach ($categoryArray as $item)
                                                            <option value="{!! $item['id'] !!}">{!! $item['name'] !!}
                                                            </option>
                                                        @endforeach --}}
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3"><label for="exampleInputPassword1" class="form-label">Giảm
                                        giá:</label>
                                    <select class="form-select" id="brand-product" name="brand-product">
                                        <option selected value="">Không giảm giá</option>
                                        @foreach ($Sales as $sale)
                                            <option value="{{ $sale->id }}">
                                                {{ $sale->salename }} (-{{ $sale->percent }}%)</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                                    <select class="form-select" id="country-product" name="country-product">
                                        {{-- @foreach ($countryArray as $item)
                                                            <option value="{!! $item['id'] !!}">{!! $item['name'] !!}
                                                            </option>
                                                        @endforeach --}}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="" class="form-label">Số lượng:</label>
                                    <input type="number" class="form-control" value="<?php echo rand(1, 99); ?>"
                                        id="number-product" name="number-product" required>
                                </div>
                            </div>
                            <div class="col-md-9">
                                <div class="mb-3">
                                    <label class="form-label">Giá:</label>
                                    <input type="number" class="form-control" value="<?php echo rand(500000, 36000000); ?>"
                                        id="price-product" name="price-product" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
