<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Document</title>
</head>

<body class="bg-light">
    <div class="container m-auto mt-2">
        <div class="card p-4 shadow container">
            <div class="header clearfix">
                <h2 class="text-muted">Chi tiết phiếu nhập</h2>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Mã phiếu nhập:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">#{{ number_format($ImportSlipDetails->import_slip_id) }}</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Ngày nhập kho:</label>
                <div class="col-md-6">
                    <span
                        class="form-control-plaintext">{{ date('d-m-Y h:i:s', strtotime($ImportSlipDetails->import_date)) }}</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Giá nhập kho:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">{{ number_format($ImportSlipDetails->import_price) }} đ</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Số lượng nhập kho:</label>
                <div class="col-md-6">
                    <div class="text-wrap form-control-plaintext">{{ $ImportSlipDetails->import_quantity }}</div>
                </div>
            </div>
            <div class="header clearfix">
                <h2 class="text-muted">Thông tin sản phẩm</h2>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Ảnh sản phẩm:</label>
                <div class="col-md-6">
                    <img src="{{ url("/image/$ImportSlipDetails->image") }}" class="rounded d-block" width="auto"
                        height="160" style="object-fit: cover;">
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Tên sản phẩm:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">{{ $ImportSlipDetails->product_name }}</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Quốc gia:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">{{ $ImportSlipDetails->origin }}</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Thể loại:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">{{ $ImportSlipDetails->category_name }}</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Chất liệu:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">{{ $ImportSlipDetails->material }}</span>
                </div>
            </div>
            <div class="mb-2 row">
                <label for="staticEmail" class="col-md-6 col-form-label fw-semibold">Giá bán:</label>
                <div class="col-md-6">
                    <span class="form-control-plaintext">{{ number_format($ImportSlipDetails->price) }} đ</span>
                </div>
            </div>
            <button class="btn btn-primary rounded-pill" onclick="window.print()">In phiếu nhập</button>
        </div>
    </div>
</body>

</html>
