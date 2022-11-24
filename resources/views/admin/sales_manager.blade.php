@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <x-admin_header />
        @if (!$authorize)
            <h3>Bạn không có quyền quản lý khuyến mãi</h3>
        @else
            <div class="container-md p-0">
                <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                    <div class="col-md-auto row">
                        <div class="col-md-auto">
                            <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                            <label class="btn btn-outline-primary btn-sm" for="btnradio1">Tổng khuyến mãi
                                <span class="badge bg-danger" id="badge_tongdon">{{ $total }}</span>
                            </label>
                        </div>
                        <div class="col-md-auto">
                            <button type="submit" href="/admin/manage_category/add" class="btn btn-primary btn-sm"
                                data-bs-toggle="modal" data-bs-target="#add-modal">Thêm khuyến mãi</button>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <div class="input-group">
                            <input type="text" class="form-control form-control-sm" placeholder="Tên khuyến mãi"
                                id="search_name">
                            <i class="fa-solid fa-magnifying-glass text-light p-2 bg-primary"></i>
                        </div>
                    </div>
                </div>
                <div class="table-responsive" id="sales-table">
                    @include('dynamic_layout.sale_reload')
                </div>
            </div>
        @endif
    </div>

    <div class="modal fade" id="add-modal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel2">Thêm khuyến mãi</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="mb-3 row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Tên</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="sale-name">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Phần trăm:</label>
                                    <input type="number" min="0" max="100" class="form-control"
                                        id="sale-percent">
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label class="form-label">Ngày kết thúc:</label>
                                    <input type="date" class="form-control" id="sale-end_date">
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

    <div class="modal fade edit-modal" id="edit-sales" tabindex="-1" aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Sửa khuyến mãi</h5>
                    <button type="lbutton" class="btn-close" data-bs-dismiss="modal" aria-labe="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center justify-content-around">
                        <div class="mb-3 row">
                            <div class="col-md-2">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Mã</label>
                                    <div class="col-md-12">
                                        <input type="text" disabled class="form-control" id="sale-id">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-10">
                                <div class="mb-3">
                                    <label for="staticEmail" class="form-label fw-semibold">Tên</label>
                                    <div class="col-md-12">
                                        <input type="text" class="form-control" id="edit-sale-name">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">Phần trăm:</label>
                                    <input type="number" min="0" max="100" class="form-control"
                                        id="edit-sale-percent">
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label class="form-label">Ngày kết thúc:</label>
                                    <input type="date" class="form-control" id="edit-sale-end_date">
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
        let current_page = 1
        $("#add-btn").on('click', function() {
            $.ajax({
                url: "/admin/manage_sales/add",
                method: "get",
                data: {
                    sale_name: $('#sale-name').val(),
                    percent: $('#sale-percent').val(),
                    end_date: $('#sale-end_date').val(),
                    page: current_page
                },
                success: function(result) {
                    $("#sales-table").html(result.response)
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
                url: "/admin/manage_sales/store",
                method: "get",
                data: {
                    id: $(this).attr('data-id'),
                },
                success: function(result) {
                    $("#sale-id").val(result.id)
                    $("#edit-sale-name").val(result.sale_name)
                    $("#edit-sale-percent").val(result.percent)
                    $("#edit-sale-end_date").val(result.end_date)
                }
            })
        })
        $("#edit-btn").on('click', function() {
            $.ajax({
                url: "/admin/manage_sales/edit",
                method: "get",
                data: {
                    id: $("#sale-id").val(),
                    sale_name: $('#edit-sale-name').val(),
                    percent: $('#edit-sale-percent').val(),
                    end_date: $('#edit-sale-end_date').val(),
                    page: current_page
                },
                success: function(result) {
                    $("#sales-table").html(result.response)
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
                url: "/admin/manage_sales/delete",
                method: "get",
                data: {
                    id: $(this).attr('data-id'),
                    page: current_page,
                },
                success: function(result) {
                    $("#sales-table").html(result.response)
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
                    url: "/admin/manage_sales/search",
                    method: "get",
                    data: {
                        name: $(this).val(),
                        page: 1
                    },
                    success: function(result) {
                        $("#sales-table").html(result)
                    }
                })
            }
        });
        $(document).on('click', '.page-item', function() {
            current_page = $(this).text()
            $.ajax({
                url: "/admin/manage_sales/paginate/" + $(this).text(),
                method: "get",
                success: function(result) {
                    console.log(result);
                    $("#sales-table").html(result)
                }
            })
        })
    </script>
@endsection
