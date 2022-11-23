@if (sizeof($Customers) == 0)
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col" style="text-align: center;">Không có khách hàng cần tìm</th>
            </tr>
        </thead>
    </table>
@else
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Email</th>
                <th scope="col">Giới tính</th>
            </tr>
        </thead>
        <tbody id="show-customer">
            @foreach ($Customers as $Customer)
                <tr>
                    <td scope="row">{{ $Customer->id }}</td>
                    <td scope="row">{{ $Customer->username }}</td>
                    <td scope="row">{{ $Customer->phonenumber }}</td>
                    <td scope="row">{{ $Customer->email }}</td>
                    <td scope="row">{{ $Customer->gender }}</td>
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
