@if (sizeof($Import_slips) == 0)
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col" style="text-align: center;">Không có khuyến mãi cần tìm</th>
            </tr>
        </thead>
    </table>
@else
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col">Mã</th>
                <th scope="col">Tên nhà cung cấp</th>
                <th scope="col">Nhân viên nhập</th>
                <th scope="col">Ngày nhập</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Chi tiết</th>
            </tr>
        </thead>
        <tbody id="show-product">
            @foreach ($Import_slips as $Import_slip)
                <tr>
                    <th scope="row">{{ $Import_slip->id }}</th>
                    <th scope="row">{{ $Import_slip->supplier_name }}</th>
                    <th scope="row">{{ $Import_slip->username }}</th>
                    <td scope="row">{{ $Import_slip->import_date }}</td>
                    <td scope="row">{{ $Import_slip->total_price }}
                    </td>
                    <td>
                        <a class="btn btn-sm fa-solid fa-circle-exclamation text-primary"
                            href="/admin/import_slip_details/{{ $Import_slip->id }}"></a>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <nav aria-label="Page navigation example" class="col-md-12 my-3">
        <ul class="pagination pagination-sm justify-content-end" id="phantrang">
            @for ($i = 0; $i < ceil($total / 5); $i++)
                @if ($i == $currentpage - 1)
                    <li class="page-item"><a class="page-link active">{!! $i + 1 !!}</a></li>
                @else
                    <li class="page-item"><a class="page-link">{!! $i + 1 !!}</a></li>
                @endif
            @endfor
        </ul>
    </nav>
@endif
