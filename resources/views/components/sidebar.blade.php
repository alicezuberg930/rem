<div class="col-md-3 col-lg-2 d-flex flex-column p-4 rounded-0" style="background-color: #251e3e;">
    <div class="col-md-12 d-flex align-items-center">
        <img src="{{ url('black-fire-logo.png') }}" width="50" height="50" class="d-inline-block">
        <span class="fs-5 fw-bold text-white text-align-center">Trang quản lý</span>
    </div>
    <hr class="bg-danger border-top border-3 border-white">
    <ul class="nav nav-pills flex-column">
        <li class="nav-item">
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_statistic' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_statistic">
                <i class="fa-solid fa-chart-column"></i> Thống kê
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_products' || request()->route()->uri=='admin/add-product' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_products">
                <i class="fa-solid fa-box-open"></i> Sản phẩm
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_orders' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_orders">
                <i class="fa-solid fa-file-invoice"></i> Đơn hàng
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_category' || request()->route()->uri=='admin/add-category' ? 'link-light border border-white text-info' : 'link-light' @endphp"
                href="/admin/manage_category">
                <i class="fa-solid fa-layer-group"></i> Danh mục
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_sales' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_sales">
                <i class="fa-solid fa-tags"></i> Giảm giá
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_customers' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_customers">
                <i class="fa-regular fa-user"></i> Khách hàng
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_employees' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_employees">
                <i class="fa-solid fa-user-gear"></i> Nhân viên
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_suppliers' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_suppliers">
                <i class="fa-solid fa-boxes-packing"></i> Nhà cung cấp
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_import_slips' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_import_slips">
                <i class="fa-solid fa-file-import"></i> Phiếu nhập
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_shippings' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_shippings">
                <i class="fa-solid fa-dolly"></i> Giao hàng
            </a>
        </li>
    </ul>
</div>
