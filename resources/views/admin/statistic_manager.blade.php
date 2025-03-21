@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        {{-- <x-admin_header /> --}}
        @if (0)
            <h3>Bạn không có quyền thống kê</h3>
        @else
            <div class="row row-cols-1 row-cols-md-4 justify-content-between mt-2">
                <div class="col-md-4 text-white ">
                    <div class="card h-100 border-0">
                        <div class="card-body bg-primary">
                            <h2 class="card-title">Thống kê theo sản phẩm</h2>
                        </div>
                        <div class="card-footer rounded-0 bg-primary">
                            <select class="form-control product-stats">
                                <option selected hidden>Lựa chọn</option>
                                <option value="top-5-best">Top 5 sản phẩm bán nhiều nhất</option>
                                <option value="top-5-lowest">Các sản phẩm chưa bán được</option>
                                <option value="top-5-highest-gross">Top 5 sản phẩm bán lời nhất</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-white">
                    <div class="card h-100 border-0">
                        <div class="card-body bg-warning">
                            <h2 class="card-title">Thống kê theo danh thu</h2>
                        </div>
                        <div class="card-footer bg-warning rounded-0">
                            <select class="form-control annual-stats">
                                <option selected hidden>Chọn năm</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 text-white">
                    <div class="card h-100 border-0">
                        <div class="card-body bg-danger">
                            <h2 class="card-title">Thống kê theo đơn hàng</h2>
                        </div>
                        <div class="card-footer bg-danger rounded-0">
                            <select class="form-control orders-stats">
                                <option selected hidden>Chọn năm</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row row-md-12">
                <canvas id="myChart"></canvas>
            </div>
        @endif
    </div>
    <script src="{{ url('/chart.js/dist/chart.min.js') }}"></script>
    <script>
        let myChart
        let months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ]
        let income = []
        let order = []
        let product_name = []
        let sales = []
        $('.annual-stats').on('change', function() {
            if (myChart)
                myChart.destroy()
            $.ajax({
                url: "/admin/manage_statistic/annual_income",
                method: 'get',
                data: {
                    year: $(this).val()
                },
                success: function(result) {
                    console.log(result);
                    for (let i = 0; i < result.length; i++) {
                        income.push(result[i].total)
                    }
                    createChart(months, 'Doanh Thu', income)
                    income = []
                }
            })
        })

        $('.orders-stats').on('change', function() {
            if (myChart)
                myChart.destroy()
            $.ajax({
                url: "/admin/manage_statistic/annual_orders",
                method: 'get',
                data: {
                    year: $(this).val()
                },
                success: function(result) {
                    for (let i = 0; i < result.length; i++) {
                        order.push(result[i].receipts)
                    }
                    createChart(months, 'Số đơn', order)
                    order = []
                }
            })
        })

        $('.product-stats').on('change', function() {
            if (myChart)
                myChart.destroy()
            $.ajax({
                url: "/admin/manage_statistic/product_statistic",
                method: 'get',
                data: {
                    config: $(this).val()
                },
                success: function(result) {
                    result.forEach(r => {
                        product_name.push(r.product_name)
                        sales.push(r.total)
                    });
                    createChart(product_name, 'Đã bán', sales)
                    product_name = []
                    sales = []
                }
            })
        })

        function createChart(months, lable, result) {
            const data = {
                labels: months,
                datasets: [{
                    label: lable,
                    backgroundColor: ['rgb(11, 132, 165)'],
                    borderColor: 'rgb(11, 132, 165)',
                    data: result,
                }]
            };
            const config = {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };
            myChart = new Chart(
                document.getElementById('myChart').getContext('2d'),
                config
            );
        }
    </script>
@endsection
