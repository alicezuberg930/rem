<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Document</title>
</head>

<body>
    <nav class="d-flex align-items-center justify-content-between bg-light">
        <div class="" style="margin-left: 1rem">
            <h4 class="m-0 font-weight-bold">Mã phiếu nhập #{{ $ImportSlipDetails->import_slip_id }}</h4>
            <p class="m-0">{{ date('d-m-Y h:i:s', strtotime($ImportSlipDetails->import_date)) }}</p>
        </div>
        <div>
            <button class="btn btn-sm bg-info text-light" style="margin-right: 1rem" onclick="window.print()">Xuất phiếu nhập</button>
        </div>
    </nav>
    <div class="container mt-3">
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
                            <input type="text" class="form-control" name="product-name" id="product-name" required>
                            <label for="floatingInput">Tên sản phẩm</label>
                        </div>
                    </div>
                </div>1
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
                            <input type="number" class="form-control" value="10" id="product-amount"
                                name="product-amount" required>
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
                            <input type="number" class="form-control" value="1000000" id="product-price"
                                name="product-price" required>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
