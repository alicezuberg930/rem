<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Lọc sản phẩm</title>
</head>

<body>
    <x-header />
    <div class="container-md shadow my-4">
        <div class='products my-3 row'>
            <div class="collapse show col-lg-3 col-md-12">
                <div class="d-flex align-items-center mt-3">
                    <button class="btn text-white fw-semibold rounded-pill px-4 rounded-0 w-100 bg-info" type="button">BỘ
                        LỌC SẢN PHẨM</button>
                </div>
                <form action="" method="GET" id="formOk">
                    <div class="card card-body rounded-0 border-0 text-dark">
                        <div class="mb-3">
                            <label for="inputEmail3" class="col-sm-12 col-form-label fw-bold">Danh Mục</label>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="form-check">
                                    <input class="input-category form-check-input me-1" type="radio" value=""
                                        name="category" @checked(true) id="category">
                                    <label class="form-check-label" for="category">Tất cả</label>
                                </div>
                                @foreach ($Caterogies as $category)
                                    <div class="form-check">
                                        <input class="input-category form-check-input me-1" type="radio"
                                            value="{{ $category->id }}" name="category" id="category">
                                        <label class="form-check-label" for="category">{{ $category->name }}</label>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="inputEmail3" class="col-sm-12 col-form-label fw-bold">Quốc gia</label>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="form-check">
                                    <input class="input-country form-check-input me-1" type="radio" value=""
                                        name="country" @checked(true) id="country">
                                    <label class="form-check-label" for="country">Tất cả</label>
                                </div>
                                <div class="form-check">
                                    <input class="input-country form-check-input me-1" type="radio" value="Hàn Quốc"
                                        name="country" id="country">
                                    <label class="form-check-label" for="country">Hàn Quốc</label>
                                </div>
                                <div class="form-check">
                                    <input class="input-country form-check-input me-1" type="radio" value="Nhật Bản"
                                        name="country" id="country">
                                    <label class="form-check-label" for="country">Nhật Bản</label>
                                </div>
                                <div class="form-check">
                                    <input class="input-country form-check-input me-1" type="radio" value="Mỹ"
                                        name="country" id="country">
                                    <label class="form-check-label" for="country">Mỹ</label>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="inputEmail3" class="col-sm-12 col-form-label fw-bold">Chất liệu</label>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <ul class="list-group">
                                    <li class="form-check">
                                        <input class="material-input form-check-input me-1" type="radio"
                                            value="" @checked(true) name="material" id="material">
                                        <label class="form-check-label" for="material">
                                            Tất cả</label>
                                    </li>
                                    @foreach ($Materials as $Material)
                                        <li class="form-check">
                                            <input class="material-input form-check-input me-1" type="radio"
                                                value="{{ $Material->material }}" name="material" id="material">
                                            <label class="form-check-label"
                                                for="material">{{ $Material->material }}</label>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="inputEmail3" class="col-sm-12 col-form-label fw-bold">Giá</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <input type="number" class="form-control" id="first-price" min="0"
                                        placeholder="Giá nhỏ nhất" value="0">
                                </div>
                                <div class="col-md-6">
                                    <input type="number" class="form-control" id="last-price" max="999999999"
                                        placeholder="Giá lớn nhất" value="999999999">
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex align-items-center col-lg-12 col-md-12 col-sm-12 ">
                                <select id="sort" class="form-select text-center w-100"
                                    aria-label="Default select example" style="width: 11rem">
                                    <option selected="" value="ASC">-----Xếp theo giá------</option>
                                    <option value="ASC">Thấp đến cao</option>
                                    <option value="DESC">Cao đến thấp</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <button name="btn-submit" type="button"
                                    class="btn-submit btn btn-outline-info w-100 rounded-pill" id="filter-btn">Lọc
                                    sản phẩm</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-lg-9" id="show-product">
                @include('dynamic_layout.filter_reload')
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />
</body>
<script src="{{ url('./js/addcart.js') }}"></script>
<script src="{{ url('./js/filter.js') }}"></script>

</html>
