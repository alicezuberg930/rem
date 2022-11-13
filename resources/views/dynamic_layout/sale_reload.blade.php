@if (sizeof($Sales) == 0)
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
                <th scope="col">Tên</th>
                <th scope="col">Phần trăm</th>
                <th scope="col">Ngày kết thúc</th>
                <th scope="col">Sửa</th>
                <th scope="col">Xóa</th>
            </tr>
        </thead>
        <tbody id="show-product">
            @foreach ($Sales as $Sale)
                <tr>
                    <th scope="row">{{ $Sale->id }}</th>
                    <th scope="row">{{ $Sale->salename }}</th>
                    <td scope="row">{{ $Sale->percent }}</td>
                    <td scope="row">{{ $Sale->end_date == null ? '' : date('d-m-Y', strtotime($Sale->end_date)) }}
                    </td>
                    <td>
                        <button type="button" class="btn edit-btn text-warning" data-bs-toggle="modal"
                            data-bs-target="#edit-sales" data-id="{{ $Sale->id }}" data-page="{{ $currentpage }}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td>
                        <button class="delete-btn btn btn-sm text-danger" type="button" data-id="{{ $Sale->id }}"
                            data-page="{{ $currentpage }}">
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
