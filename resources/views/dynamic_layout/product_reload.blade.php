@if (sizeof($Products) == 0)
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col" style="text-align: center;">Không có sản phẩm cần tìm</th>
            </tr>
        </thead>
    </table>
@else
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col">Mã</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Giá</th>
                <th scope="col">Chất liệu</th>
                <th scope="col">Xuất xứ</th>
                <th scope="col">Sửa</th>
                <th scope="col">Xóa</th>
            </tr>
        </thead>
        <tbody id="show-product">
            @foreach ($Products as $Product)
                <tr>
                    <th scope="row">{{ $Product->id }}</th>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="{{ url('image/' . $Product->image) }}" height="70">
                            <span>{{ $Product->name }}</span>
                        </div>
                    </td>
                    <td>{{ $Product->amount }}</td>
                    <td>{{ number_format($Product->price) }}</td>
                    <td>{{ $Product->material }}</td>
                    <td>{{ $Product->origin }}</td>
                    <td>
                        <button type="button" class="btn edit-btn text-warning" data-bs-toggle="modal"
                            data-bs-target="#edit-product" data-page="{{ $currentpage }}"
                            data-id="{{ $Product->id }}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td>
                        <button value="{{ $Product->id }}" class="delete-btn btn btn-sm text-danger" type="button"
                            data-id="{{ $Product->id }}" data-page="{{ $currentpage }}">
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
                    <li class="page-item"><a class="page-link active">{{ $i + 1 }}</a></li>
                @else
                    <li class="page-item"><a class="page-link">{{ $i + 1 }}</a></li>
                @endif
            @endfor
        </ul>
    </nav>
@endif
