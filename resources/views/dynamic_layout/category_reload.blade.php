@if (sizeof($Categories) == 0)
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col" colspan="5" style="text-align: center;">Không có danh mục cần tìm</th>
            </tr>
        </thead>
    </table>
@else
    <table class="table align-middle table-hover table-sm">
        <thead class="table">
            <tr>
                <th scope="col">#</th>
                <th scope="col">Tên</th>
                <th scope="col" style="width:70%;">Mô tả</th>
                <th scope="col">Sửa</th>
                <th scope="col">Xóa</th>
            </tr>
        </thead>
        <tbody id="show-product">
            @foreach ($Categories as $Category)
                <tr>
                    <th scope="row">{{ $Category->id }}</th>
                    <th scope="row">{{ $Category->name }}</th>
                    <td>
                        {{ $Category->description }}
                    </td>
                    <td>
                        <button type="button" class="btn edit-btn text-warning" data-bs-toggle="modal"
                            data-bs-target="#edit-category" data-id="{{ $Category->id }}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td>
                        <button value="{{ $Category->id }}" class="delete-btn btn btn-sm text-danger" type="button"
                            data-id="{{ $Category->id }}">
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
