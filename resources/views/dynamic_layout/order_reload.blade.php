<table class="table table-hover table-sm">
    <thead class="table table-striped table-sm">
        <tr>
            <th scope="col">Mã đơn</th>
            <th scope="col">Ngày đặt</th>
            <th scope="col">Ngày xác nhận</th>
            <th scope="col">Tổng tiền</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Thao tác</th>
        </tr>
    </thead>
    <tbody id="order-table">
        <?php date_default_timezone_set('Asia/Ho_Chi_Minh'); ?>
        @foreach ($Orders as $order)
            <tr>
                <th>{{ $order->id }}</th>
                <td>{{ date_format(new DateTime($order->created_at), 'd/m/Y h:i:s') }}</td>
                <td>{{ $order->date_checked == null ? '' : date('d/m/Y h:i:s', strtotime($order->date_checked)) }}
                </td>
                <td>{{ number_format($order->total_price) }} VND</td>
                <td>
                    <span>
                        @if ($order->status == 0)
                            Chờ xác nhận
                        @elseif($order->status == 1)
                            Đã xác nhận
                        @else
                            Đã hủy
                        @endif
                    </span>
                </td>
                <td>
                    @if ($order->status == 0)
                        <button
                            class="@if (isset($user_id)) d-none @endif btn btn-sm fa-regular fa-circle-check text-success checked-btn"
                            data-id="{{ $order->id }}" data-status="1"></button>
                        <button class="btn btn-sm fa-solid fa-circle-xmark text-danger checked-btn"
                            data-id="{{ $order->id }}" data-status="2"
                            data-user_id="{{ isset($user_id) ? $user_id : -1 }}"></button>
                    @endif
                    <a class="btn btn-sm fa-solid fa-circle-exclamation text-primary"
                        href="/admin/manage_orders/order_details/{{ $order->id }}"></a>

                </td>
            </tr>
        @endforeach
    </tbody>
</table>
<nav aria-label="Page navigation example" class="col-md-12 my-3">
    <ul class="pagination pagination-sm justify-content-end" id="phantrang">
        <?php $total = 0;
        if (session()->get('type') == -1) {
            $total = $Quantity['Total'];
        } elseif (session()->get('type') == 0) {
            $total = $Quantity['Waiting'];
        } elseif (session()->get('type') == 1) {
            $total = $Quantity['Approved'];
        } else {
            $total = $Quantity['Canceled'];
        } ?>
        @for ($i = 0; $i < ceil($total / 5); $i++)
            @if ($i == $currentpage - 1)
                <li class="page-item"><a class="page-link active">{{ $i + 1 }}</a></li>
            @else
                <li class="page-item"><a class="page-link">{{ $i + 1 }}</a></li>
            @endif
        @endfor
    </ul>
</nav>
