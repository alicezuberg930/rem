@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <x-admin_header />
        @if (!$authorize)
            <h3>Bạn không có quyền quản lý nhà cung cấp</h3>
        @else
            <div class="container-md p-0">
                <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                    <div class="col-md-auto row">
                        <div class="col-md-auto">
                            <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng nhà cung cấp
                                <span class="badge bg-danger" id="badge_tongdon">{{ $total }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <button type="submit" href="/admin/manage_category/add" class="btn btn-primary btn-sm"
                                data-bs-toggle="modal" data-bs-target="#add-supplier">Thêm nhà cung cấp</button>
                        </div>
                        <div class="col-md-auto">
                            <button class="btn btn-info btn-sm" id="export">Xuất Excel</button>
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
                <div class="table-responsive" id="supplier-table">
                    @include('dynamic_layout.supplier_reload')
                </div>
            </div>
        @endif
    </div>

    <div class="modal fade" id="add-supplier" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel2">Thêm nhà cung cấp</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="mb-3 row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Tên</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="supplier-name">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Địa chỉ:</label>
                                    <select name="city" class="form-control" aria-label="Default select example"
                                        id="supplier-address">
                                        @foreach ($cities['results'] as $city)
                                            <option value="{{ $city['name'] }}" data-id="{{ $city['code'] }}">
                                                {{ $city['name'] }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Số điện thoại</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="supplier-phone_number">
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

    <div class="modal fade edit-modal" id="edit-supplier" tabindex="-1" aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Sửa nhà cung cấp</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-labe="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="mb-3 row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Tên</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="edit-supplier-name">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Địa chỉ:</label>
                                    <select name="city" class="form-control" aria-label="Default select example"
                                        id="edit-supplier-address">
                                        @foreach ($cities['results'] as $city)
                                            <option value="{{ $city['name'] }}" data-id="{{ $city['code'] }}">
                                                {{ $city['name'] }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-2">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Mã</label>
                                    <div class="col-md-12">
                                        <input type="text" disabled class="form-control" id="supplier-id">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-10">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Số điện thoại</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="edit-supplier-phone_number">
                                    </div>
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
                url: "/admin/manage_suppliers/add",
                method: "get",
                data: {
                    supplier_name: $('#supplier-name').val(),
                    address: $('#supplier-address').val(),
                    phone_number: $("#supplier-phone_number").val(),
                    page: current_page
                },
                success: function(result) {
                    $("#supplier-table").html(result.response)
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
                url: "/admin/manage_suppliers/store",
                method: "get",
                data: {
                    id: $(this).attr('data-id'),
                },
                success: function(result) {
                    $("#supplier-id").val(result.id)
                    $("#edit-supplier-name").val(result.supplier_name)
                    $("#edit-supplier-address").val(result.address)
                    $("#edit-supplier-phone_number").val(result.phone_number)
                }
            })
        })
        $("#edit-btn").on('click', function() {
            $.ajax({
                url: "/admin/manage_suppliers/edit",
                method: "get",
                data: {
                    id: $("#supplier-id").val(),
                    supplier_name: $('#edit-supplier-name').val(),
                    address: $('#edit-supplier-address').val(),
                    phone_number: $("#edit-supplier-phone_number").val(),
                    page: current_page
                },
                success: function(result) {
                    $("#supplier-table").html(result.response)
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
                url: "/admin/manage_suppliers/delete",
                method: "get",
                data: {
                    id: id,
                    page: current_page
                },
                success: function(result) {
                    $("#supplier-table").html(result.response)
                    $('.toast').toast('show')
                    $('.toast-body').html(result.message)
                    if (result.status == 1)
                        $('.toast').css('background-color', 'rgb(71, 201, 71)')
                    else
                        $('.toast').css('background-color', 'rgb(239, 73, 73)')
                }
            })
        })
        // let pathname = document.URL
        $('#search_id').keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                $.ajax({
                    url: "/admin/manage_suppliers/search",
                    method: "get",
                    data: {
                        name: $(this).val(),
                        page: current_page
                    },
                    success: function(result) {
                        $("#supplier-table ").html(result)
                    }
                })
            }
        })
        $(document).on('click', '.page-item', function() {
            let page = $(this).text()
            // window.history.pushState("Update URL", "New Page", `${pathname}?page=${page}`)
            $.ajax({
                url: "/admin/manage_suppliers/paginate/" + page,
                method: "get",
                success: function(result) {
                    $("#supplier-table").html(result)
                }
            })
        })
        $("#export").on('click', () => {
            $.ajax({
                url: "/admin/manage_suppliers/export",
                method: 'get',
                success: function(result) {
                    JSONToCSVConvertor(result, "suppliers_sheet", true)
                }
            })
        })
    </script>
@endsection
