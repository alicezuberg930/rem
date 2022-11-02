<div class="col-md-3 col-lg-2 d-flex flex-column p-4 rounded-0" style="background-color: #251e3e;">
    <span class="fs-4 fw-bold text-white text-align-center">Trang quản lý</span>
    <hr class="bg-danger border-top border-3 border-white">
    <ul class="nav nav-pills flex-column">
        <li class="nav-item">
            <a class="nav-link @php echo request()->route()->uri=='admin/statistic' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/statistic">
                <i class="bi bi-bar-chart-line"></i>Thống kê
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/products' || request()->route()->uri=='admin/add-product' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_products">
                <i class="bi bi-cup-straw"></i>Sản phẩm
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/orders' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_orders">
                <i class="bi bi-receipt">
                </i>Đơn hàng
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/accounts' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_accounts">
                <i class="bi bi-file-earmark-person"></i>
                Khách hàng
            </a>
        </li>
        <li>
            <a class="nav-link @php echo request()->route()->uri=='admin/manage_category' || request()->route()->uri=='admin/add-category' ? 'link-light border border-white text-info' : 'link-light' @endphp"
                href="/admin/manage_category">
                <i class="bi bi-tags"></i>
                Thể loại
            </a>
        </li>
        <li>
            <a class="nav-link  @php echo request()->route()->uri=='admin/manage_sales' ? 'link-light border border-white text-info':'link-light' @endphp"
                href="/admin/manage_sales">
                <i class="bi bi-arrow-bar-left"></i>
                Giảm giá
            </a>
        </li>
        <li>
            <a class="nav-link text-danger fs-semibold" href="/">
                <i class="bi bi-arrow-bar-left"></i>
                Quay lại cửa hàng
            </a>
        </li>
    </ul>
</div>
