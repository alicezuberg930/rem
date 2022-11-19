@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <div class="container-md p-0">
            <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                <div class="col-md-auto row">
                    <div class="col-md-auto">
                        <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                        <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng nhân viên
                            <span class="badge bg-danger" id="badge_tongdon">{{ $total }}</span>
                        </label>
                    </div>
                    <div class="col-md-auto">
                        <button type="submit" href="/admin/manage_category/add" class="btn btn-primary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#add-employee">Thêm nhân viên</button>
                    </div>
                </div>
                <div class="col-md-auto">
                    <div class="input-group">
                        <input type="text" class="form-control form-control-sm" placeholder="Tên nhân viên"
                            id="search_id">
                        <i class="fa-solid fa-magnifying-glass text-light p-2 bg-primary"></i>
                    </div>
                </div>
            </div>
            <div class="table-responsive" id="customer-table">
                @include('dynamic_layout.employee_reload')
            </div>
        </div>
    </div>

    <div class="modal fade" id="add-employee" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel2">Thêm nhân viên</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Tên</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="sale-name">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Email:</label>
                                    <input type="number" min="0" max="100" class="form-control"
                                        id="sale-percent">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Số điện thoại</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="sale-name">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Giới tính:</label>
                                    <select class="form-control" id="sale-end_date">
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Quyền:</label>
                                    <select class="form-control" id="sale-end_date">
                                        @foreach ($roles as $role)
                                            <option value="{{ $role->id }}">{{ $role->role_name }}</option>
                                        @endforeach
                                    </select>
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

    <div class="modal fade edit-modal" id="edit-employee" tabindex="-1" aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Sửa nhân viên</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Tên</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="sale-name">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Email:</label>
                                    <input type="number" min="0" max="100" class="form-control"
                                        id="sale-percent">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Số điện thoại</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="sale-name">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Giới tính:</label>
                                    <select class="form-control" id="sale-end_date">
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label class="form-label">Quyền:</label>
                                    <select class="form-control" id="sale-end_date">
                                        @foreach ($roles as $role)
                                            <option value="{{ $role->id }}">{{ $role->role_name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Thoát</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="edit-btn">Sửa</button>
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
