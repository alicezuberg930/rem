@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <div class="container-md p-0">
            <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                <div class="col-md-auto row">
                    <div class="col-md-auto">
                        <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                        <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng phiếu nhập
                            <span class="badge bg-danger" id="badge_tongdon">{{ $total }}</span>
                        </label>
                    </div>
                    <div class="col-md-auto">
                        <button type="submit" href="/admin/manage_category/add" class="btn btn-primary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#add-supplier">Thêm phiếu nhập</button>
                    </div>
                </div>
                <div class="col-md-auto">
                    <div class="input-group">
                        <input type="text" class="form-control form-control-sm" placeholder="Tên nhà cung cấp"
                            id="search_id">
                        <i class="fa-solid fa-magnifying-glass text-light p-2 bg-primary"></i>
                    </div>
                </div>
            </div>
            <div class="table-responsive" id="import-slip-table">
                @include('dynamic_layout.import_slip_reload')
            </div>
        </div>
    </div>

    <div class="modal fade" id="add-supplier" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel2">Thêm phiếu nhập</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="col-md-5">
                            <div class="col-md-auto mb-3 border" style="height: 20rem;">
                                <img src="https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg"
                                    id="display-product" class="rounded mx-auto d-block m-5" width="auto" height="200"
                                    style="object-fit: cover;">
                            </div>
                            <div class="row col-md-auto">
                                <div class="col-md-12">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" name="product-name" disabled
                                            id="product-name" required>
                                        <label for="floatingInput">Tên sản phẩm</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row col-md-auto">
                                <div class="col-md-12">
                                    <div class="form-floating mb-3">
                                        <select class="form-select" id="import-product">
                                            @foreach ($Products as $Product)
                                                <option checked value="{{ $Product->id }}">{{ $Product->name }}</option>
                                            @endforeach
                                        </select>
                                        <label for="floatingInput">Chọn sản phẩm cần nhập</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="col-md-auto">
                                <div class="mb-3">
                                    <label class="form-label">Giới thiệu:</label>
                                    <textarea disabled style="height: 10rem" class="form-control" aria-label="With textarea" id="product-description"
                                        name="product-description" required></textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Thể loại:</label>
                                        <input disabled class="form-select" id="product-category" name="product-category">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3"><label for="exampleInputPassword1" class="form-label">Giảm
                                            giá:</label>
                                        <input disabled class="form-select" id="product-discount" name="product-discount">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Quốc gia:</label>
                                        <input disabled class="form-select" id="product-origin" name="product-origin">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Chất liệu:</label>
                                        <input disabled class="form-select" id="product-material"
                                            name="product-material">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Giá bán:</label>
                                        <input disabled type="number" class="form-control" id="product-price"
                                            name="product-price" required>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Số lượng nhập kho:</label>
                                        <input type="number" class="form-control" value="10" id="product-amount"
                                            name="product-amount" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="" class="form-label">Giá nhập kho:</label>
                                        <input type="number" class="form-control" value="1000000"
                                            id="import-slips-price" name="import-slips-price" required>
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

    <script>
        let current_page = 1
        $("#add-btn").on('click', function() {
            $.ajax({
                url: "/admin/manage_category/add",
                method: "get",
                data: {
                    name: $('#name-category-add').val(),
                    description: $('#desc-category-add').val(),
                    page: current_page
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
        $("#import-product").on('change', function() {
            
        })
        $("#edit-btn").on('click', function() {
            $.ajax({
                url: "/admin/manage_category/edit",
                method: "get",
                data: {
                    id: $("#id-category-modal").val(),
                    name: $("#name-category-modal").val(),
                    description: $("#description-category-modal").val(),
                    page: current_page
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
                url: "/admin/manage_category/delete",
                method: "get",
                data: {
                    id: id,
                    page: current_page
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
        $('#search_id').keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                $.ajax({
                    url: "/admin/manage_category/search",
                    method: "get",
                    data: {
                        name: $(this).val(),
                        page: 1
                    },
                    success: function(result) {
                        $("#category-table").html(result)
                    }
                })
            }
        });
        $(document).on('click', '.page-item', function() {
            current_page = $(this).text()
            $.ajax({
                url: "/admin/manage_category/paginate/" + $(this).text(),
                method: "get",
                success: function(result) {
                    console.log(result);
                    $("#category-table").html(result)
                }
            })
        })
    </script>
@endsection
