@if (sizeof($Employees) == 0)
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col" style="text-align: center;">Không có nhân viên cần tìm</th>
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
                <th scope="col">Quyền</th>
                <th scope="col">Sửa</th>
                <th scope="col">Xóa</th>
            </tr>
        </thead>
        <tbody id="show-employee">
            @foreach ($Employees as $Employee)
                <tr>
                    <td scope="row">{{ $Employee->eid }}</td>
                    <td scope="row">{{ $Employee->username }}</td>
                    <td scope="row">{{ $Employee->phonenumber }}</td>
                    <td scope="row">{{ $Employee->email }}</td>
                    <td scope="row">{{ $Employee->gender }}</td>
                    <td scope="row">{{ $Employee->role_name }}</td>
                    <td>
                        <button type="button" class="btn edit-btn text-warning" data-bs-toggle="modal"
                            data-bs-target="#edit-employee" data-id="{{ $Employee->eid }}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td>
                        <button value="{{ $Employee->eid }}" class="delete-btn btn btn-sm text-danger" type="button"
                            data-id="{{ $Employee->eid }}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
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
