<div class="col-md-3 col-lg-2 d-flex flex-column p-4 rounded-0" style="background-color: #251e3e;">
    <span class="fs-4 fw-bold text-white text-align-center">Trang quản lý</span>
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
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_accounts' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_accounts">
                <i class="fa-regular fa-user"></i> Khách hàng
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_category' || request()->route()->uri=='admin/add-category' ? 'link-light border border-white text-info' : 'link-light' @endphp"
                href="/admin/manage_category">
                <i class="fa-solid fa-layer-group"></i> Thể loại
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_sales' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_sales">
                <i class="fa-solid fa-tags"></i> Giảm giá
            </a>
        </li>
        <li>
            <a class="nav-link text-danger fs-semibold" href="/">
                <i class="fa-solid fa-circle-left"></i> Quay lại trang chủ
            </a>
        </li>
    </ul>
</div>