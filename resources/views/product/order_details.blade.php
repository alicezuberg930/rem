<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> ZippoStore </title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.0/css/all.css">
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
</head>

<body style="background-color: rgb(223, 223, 223, 0.6)">
    <nav class="d-flex align-items-center justify-content-between bg-light">
        <div class="" style="margin-left: 1rem">
            <h4 class="m-0 font-weight-bold">Đơn hàng #1</h4>
            <p class="m-0">{{ date('d-m-Y h:i:s') }}</p>
        </div>
        <div>
            <button class="btn btn-sm bg-info text-light" style="margin-right: 1rem" onclick="window.print()">Xuất hóa
                đơn</button>
        </div>
    </nav>
    <div class="container-fluid mt-3">
        <div class="row">
            <div class="col-md-9">
                <div class="col-md-12 bg-light rounded shadow p-3">
                    <div>
                        <h5 class="">Sản phẩm đã đặt</h5>
                    </div>
                    <hr>
                    <div class="row mb-3">
                        <div class="col-sm-1 d-flex align-items-center">
                            <img src="{{ url('black-fire-logo.png') }}" width="70" height="70" />
                        </div>
                        <div class="col-sm-6 d-flex flex-column" style="justify-content:center">
                            <h5>Zippo Classic Candy Apple Red - 21063</h5>
                            <span>Ma san pham: 1</span>
                        </div>
                        <div class="col-sm-1 d-flex justify-content-center align-items-center">
                            <span class="" style="">2 cái</span>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <span class="" style="">500,000 VND</span>
                            <h6 class="m-0" style="">350,000 VND</h6>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <h6 class="m-0" style="">700,000 VND</h6>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-1 d-flex align-items-center">
                            <img src="{{ url('black-fire-logo.png') }}" width="70" height="70" />
                        </div>
                        <div class="col-sm-6 d-flex flex-column" style="justify-content:center">
                            <h5>Zippo Classic Candy Apple Red - 21063</h5>
                            <span>Ma san pham: 1</span>
                        </div>
                        <div class="col-sm-1 d-flex justify-content-center align-items-center">
                            <span class="" style="">2 cái</span>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <span class="" style="">500,000 VND</span>
                            <h6 class="m-0" style="">350,000 VND</h6>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <h6 class="m-0" style="">700,000 VND</h6>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-1 d-flex align-items-center">
                            <img src="{{ url('black-fire-logo.png') }}" width="70" height="70" />
                        </div>
                        <div class="col-sm-6 d-flex flex-column" style="justify-content:center">
                            <h5>Zippo Classic Candy Apple Red - 21063</h5>
                            <span>Ma san pham: 1</span>
                        </div>
                        <div class="col-sm-1 d-flex justify-content-center align-items-center">
                            <span class="" style="">2 cái</span>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <span class="" style="">500,000 VND</span>
                            <h6 class="m-0" style="">350,000 VND</h6>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <h6 class="m-0" style="">700,000 VND</h6>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-1 d-flex align-items-center">
                            <img src="{{ url('black-fire-logo.png') }}" width="70" height="70" />
                        </div>
                        <div class="col-sm-6 d-flex flex-column" style="justify-content:center">
                            <h5>Zippo Classic Candy Apple Red - 21063</h5>
                            <span>Ma san pham: 1</span>
                        </div>
                        <div class="col-sm-1 d-flex justify-content-center align-items-center">
                            <span class="" style="">2 cái</span>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <span class="" style="">500,000 VND</span>
                            <h6 class="m-0" style="">350,000 VND</h6>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <h6 class="m-0" style="">700,000 VND</h6>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-1 d-flex align-items-center">
                            <img src="" width="70" height="70" />
                        </div>
                        <div class="col-sm-6 d-flex flex-column" style="justify-content:center">
                            <h5>Zippo Classic Candy Apple Red - 21063</h5>
                            <span>Ma san pham: 1</span>
                        </div>
                        <div class="col-sm-1 d-flex justify-content-center align-items-center">
                            <span class="" style="">2 cái</span>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <span class="" style="">500,000 VND</span>
                            <h6 class="m-0" style="">350,000 VND</h6>
                        </div>
                        <div class="col-sm-2 d-flex justify-content-center flex-column align-items-center">
                            <h6 class="m-0" style="">700,000 VND</h6>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-8"></div>
                        <div class="col-sm-4 d-flex justify-content-center flex-column">
                            <div class="row">
                                <span class="col-sm-6" style="">Subtotal</span>
                                <h6 class="col-sm-6" style="text-align: end;">2,500,000 VND</h6>
                            </div>
                            <div class="row">
                                <span class="col-sm-6" style="">Shipping</span>
                                <h6 class="col-sm-6" style="text-align: end;">300,000 VND</h6>
                            </div>
                            <div class="row">
                                <span class="col-sm-6" style="">Tax</span>
                                <h6 class="col-sm-6" style="text-align: end;">0 VND</h6>
                            </div>
                            <hr class="m-1" />
                            <div class="row">
                                <span class="col-sm-6" style="">Total</span>
                                <h6 class="col-sm-6" style="text-align: end;">2,800,000 VND</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="col-md-12 bg-light rounded shadow p-3">
                    <div>
                        <h5 class="">Trang thai</h5>
                    </div>
                    <hr>
                    <div class="row d-flex justify-content-start align-items-center">
                        <div class="col-md-4 d-flex justify-content-center">
                            <img class="rounded-circle border border-primary" style="object-fit: contain"
                                width="50" height="50" src="{{ url('/icons/order-pending.png') }}" />
                        </div>
                        <div class="col-md-8">
                            <h6 class="m-0">
                                Chờ xác nhận
                                <i class="fa-solid fa-check bg-success rounded-circle text-light"></i>
                            </h6>
                            <span>10-11-2011</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="d-flex justify-content-center col-md-4">
                            <span style="height: 2rem; border-left: 2px dotted rgb(55, 148, 228)"></span>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-start align-items-center">
                        <div class="col-md-4 d-flex justify-content-center">
                            <img class="rounded-circle border border-primary" style="object-fit: contain"
                                width="50" height="50" src="{{ url('/icons/order-approved.png') }}" />
                        </div>
                        <div class="col-md-8">
                            <h6 class="m-0">
                                Đã xác nhận
                                <i class="fa-solid fa-check bg-success rounded-circle text-light"></i>
                            </h6>
                            <span>12-11-2011</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="d-flex justify-content-center col-md-4">
                            <span style="height: 2rem; border-left: 2px dotted rgb(55, 148, 228)"></span>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-start align-items-center">
                        <div class="col-md-4 d-flex justify-content-center">
                            <img class="rounded-circle border border-primary" style="object-fit: contain"
                                width="50" height="50" src="{{ url('/icons/shipping.png') }}" />
                        </div>
                        <div class="col-md-8">
                            <h6 class="m-0">Đang giao
                                <i class="fa-solid fa-check bg-success rounded-circle text-light"></i>
                            </h6>
                            <span>14-11-2011</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="d-flex justify-content-center col-md-4">
                            <span style="height: 2rem; border-left: 2px dotted black"></span>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-start align-items-center">
                        <div class="col-md-4 d-flex justify-content-center">
                            <img class="rounded-circle border" style="object-fit: contain" width="50"
                                height="50" src="{{ url('/icons/delivered.png') }}" />
                        </div>
                        <div class="col-md-8">
                            <h6 class="m-0">Đã giao</h6>
                            <span>16-11-2011</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="col-md-12 bg-light p-3 rounded shadow mb-3">
                    <div>
                        <h5 class="">Chi tiết khách hàng</h5>
                    </div>
                    <hr>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <i class="fa-regular fa-user"></i>
                            <span>Nguyễn Vĩnh Tiến</span>
                        </div>
                        <div class="col-md-6">
                            <span>Thành phố Hồ Chí Minh</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <i class="fa-solid fa-envelope"></i>
                            <span>tien23851@gmail.com</span>
                        </div>
                        <div class="col-md-6">
                            <span>Quận 5</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <i class="fa-solid fa-phone-flip"></i>
                            <span>0932430072</span>
                        </div>
                        <div class="col-md-6">
                            <span>Số 3410 Phạm Thế Hiển Phường 7 Quận 8 Hồ Chí Minh</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <i class="fa-solid fa-credit-card"></i>
                            <span>Thẻ tín dụng</span>
                        </div>
                        <div class="col-md-6">
                            <span>043587923498</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
