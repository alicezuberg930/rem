<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> ZippoStore </title>
    <link rel="shortcut icon" type="image/png" href="{{ url('./icon.png') }}">
    <script src="{{ url('./jquery/dist/jquery.min.js') }}"></script>
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <script src="{{ url('./popper/dist/umd/popper.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./css/style.css') }}">
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
</head>

<body>
    <x-header />
    <div class="container-md shadow my-4" style="width: 80%">
        <div class='products my-3 row'>
            <div class="collapse show col-lg-3 col-md-12">
                <div class="d-flex align-items-center mt-3">
                    <button class="btn text-white fw-semibold rounded-pill px-4 rounded-0 w-100 bg-info"
                        type="button">BỘ LỌC SẢN PHẨM</button>
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
                                            value="{{ $category->name }}" name="category" id="category">
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
                                            value="" @checked(true) name="nongdo" id="nongdo">
                                        <label class="form-check-label" for="nongdo">
                                            Tất cả</label>
                                    </li>
                                    @foreach ($Materials as $Material)
                                        <li class="form-check">
                                            <input class="material-input form-check-input me-1" type="radio"
                                                value="{{ $Material->material }}" name="nongdo" id="nongdo">
                                            <label class="form-check-label"
                                                for="nongdo">{{ $Material->material }}</label>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="inputEmail3" class="col-sm-12 col-form-label fw-bold">Giá</label>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <input type="number" class="form-control" id="first-price" placeholder="0"
                                            value="">
                                    </div>
                                    <div class="col-sm-12">
                                        <input type="number" class="form-control" id="last-price"
                                            placeholder="999999999" value="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 col-lg-12 col-md-12 col-sm-12">
                            <div class="d-flex align-items-center col-lg-12 col-md-12 col-sm-12 ">
                                <select id="sort" class="form-select text-center col-lg-12 col-md-12 col-sm-12"
                                    aria-label="Default select example" style="width: 11rem">
                                    <option selected="" value="">-----Xếp theo giá------</option>
                                    <option value="ASC">Thấp đến cao</option>
                                    <option value="DESC">Cao đến thấp</option>
                                </select>
                            </div>
                        </div>
                        <div class="">
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <button name="btn-submit" type="button"
                                    class="btn-submit btn btn-outline-info w-100 rounded-pill" id="filter-btn">Lọc
                                    sản
                                    phẩm</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-lg-9" id="show-product">
                @include('dynamic_layout.filterview')
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />

    <script>
        $('#filter-btn').click(function() {
            let categories = []
            let countries = []
            let materials = [];
            let category = document.querySelectorAll('.input-category');
            let country = document.querySelectorAll('.input-country');
            let material = document.querySelectorAll('.material-input');
            let firstprice = document.getElementById('first-price').value;
            let lastprice = document.getElementById('last-price').value;
            let sort = document.getElementById('sort').value;
            if (category[0].checked) {
                for (let i = 1; i < category.length; i++) {
                    categories.push(category[i].value);
                }
            } else {
                for (let i = 1; i < category.length; i++) {
                    if (category[i].checked) {
                        categories.push(category[i].value);
                        break
                    }
                }
            }
            if (country[0].checked) {
                for (let i = 1; i < country.length; i++) {
                    countries.push(country[i].value);
                }
            } else {
                for (let i = 1; i < country.length; i++) {
                    if (country[i].checked) {
                        countries.push(country[i].value);
                        break
                    }
                }
            }
            if (material[0].checked) {
                for (let i = 1; i < material.length; i++) {
                    materials.push(material[i].value);
                }
            } else {
                for (let i = 1; i < material.length; i++) {
                    if (material[i].checked) {
                        materials.push(material[i].value);
                        break
                    }
                }
            }
            $.ajax({
                url: "/filter/search",
                method: "GET",
                data: {
                    "categories": categories,
                    "countries": countries,
                    "materials": materials,
                    "firstprice": firstprice,
                    "lastprice": lastprice,
                    "sort": sort
                },
                success: function(result) {
                    $("#show-product").html(result)
                }
            });
        })

        function phantrang(page) {
            let categories = []
            let countries = []
            let materials = [];
            let category = document.querySelectorAll('.input-category');
            let country = document.querySelectorAll('.input-country');
            let material = document.querySelectorAll('.material-input');
            let firstprice = document.getElementById('first-price').value;
            let lastprice = document.getElementById('last-price').value;
            let sort = document.getElementById('sort').value;
            if (category[0].checked) {
                for (let i = 1; i < category.length; i++) {
                    categories.push(category[i].value);
                }
            } else {
                for (let i = 1; i < category.length; i++) {
                    if (category[i].checked) {
                        categories.push(category[i].value);
                        break
                    }
                }
            }
            if (country[0].checked) {
                for (let i = 1; i < country.length; i++) {
                    countries.push(country[i].value);
                }
            } else {
                for (let i = 1; i < country.length; i++) {
                    if (country[i].checked) {
                        countries.push(country[i].value);
                        break
                    }
                }
            }
            if (material[0].checked) {
                for (let i = 1; i < material.length; i++) {
                    materials.push(material[i].value);
                }
            } else {
                for (let i = 1; i < material.length; i++) {
                    if (material[i].checked) {
                        materials.push(material[i].value);
                        break
                    }
                }
            }
            $.ajax({
                url: "/filter/paginate",
                method: "GET",
                data: {
                    "categories": categories,
                    "countries": countries,
                    "materials": materials,
                    "firstprice": firstprice,
                    "lastprice": lastprice,
                    "sort": sort,
                    "page": page
                },
                success: function(result) {
                    $("#show-product").html(result)
                }
            });
        }
    </script>
</body>

</html>
