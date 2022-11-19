@extends('admin.adminpage')
@section('body_manager')
    @dd($Statisic)
    <div class="col-md-9 col-lg-10">
        <div class="row row-cols-2 row-cols-md-4 justify-content-between mt-2">
            <div class="col-md-4 text-white ">
                <div class="card h-100 border-0">
                    <div class="card-body bg-primary">
                        <h2 class="card-title">2</h2>
                        <p class="card-text">Sản phẩm</p>
                    </div>
                    <div class="card-footer rounded-0 bg-primary">
                        <a class="text-white" href="">Danh sách sản phẩm</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 text-white">
                <div class="card h-100 border-0">
                    <div class="card-body bg-warning">
                        <h2 class="card-title">4</h2>
                        <p class="card-text">Tài khoản</p>
                    </div>
                    <div class="card-footer bg-warning rounded-0">
                        <a class="text-white" href="">Danh sách tài khoản</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 text-white">
                <div class="card h-100 border-0">
                    <div class="card-body bg-danger">
                        <h2 class="card-title">12</h2>
                        <p class="card-text">Đơn hàng</p>
                    </div>
                    <div class="card-footer bg-danger rounded-0">
                        <a class="text-white" href="">Danh sách đơn hàng</a>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <canvas id="myChart"></canvas>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const labels = [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12',
        ];
        const data = {
            labels: labels,
            datasets: [{
                    label: 'Doanh thu',
                    backgroundColor: 'rgb(11, 132, 165)',
                    borderColor: 'rgb(11, 132, 165)',
                    data: [0, 100, 50, 20, 200, 300, 450, 90, 100, 300, 400, 500],
                },
                {
                    label: 'Đơn hàng',
                    backgroundColor: 'rgb(246, 200, 95)',
                    borderColor: 'rgb(246, 200, 95)',
                    data: [0, 20, 10, 9, 56, 30, 74, 85, 27, 33, 65, 210],
                }
            ]
        };
        const config = {
            type: 'line',
            data: data,
            options: {}
        };
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    </script>
@endsection
