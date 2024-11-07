<div class="sidebar z-20 flex-shrink-0 w-[270px] p-2 overflow-y-auto block text-center bg-gray-800">
    <div class="text-gray-100 text-xl">
        <div class="p-2.5 mt-1 flex items-center justify-between">
            <div class="flex items-center">
                <img src="{{ url('assets/black-fire-logo.png') }}" class="h-12 w-12">
                <h1 class="font-bold text-gray-200 text-sm ml-3">Cửa hàng</h1>
            </div>
            <x-bi-x-circle-fill class="w-5 h-5" onclick="openSidebar()" />
        </div>
        <div class="my-2 bg-gray-600 h-[1px]"></div>
    </div>
    <a class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white {{ request()->route()->uri == 'admin/manage_statistic' ? 'bg-blue-600' : '' }}"
        href="/admin/manage_statistic">
        <x-bi-bar-chart-line class="w-5 h-5" />
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Thống kê</span>
    </a>
    <a class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white {{ request()->route()->uri == 'admin/manage_products' ? 'bg-blue-600' : '' }}"
        href="/admin/manage_products">
        <x-bi-box-fill class="w-5 h-5" />
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Sản phẩm</span>
    </a>
    <div class="my-4 bg-gray-600 h-[1px]"></div>
    <div class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
        onclick="dropdown()">
        <x-bi-box-fill class="w-5 h-5" />
        <div class="flex justify-between w-full items-center">
            <span class="text-[15px] ml-4 text-gray-200 font-bold">Chatbox</span>
            <span class="text-sm" id="arrow">
                <x-bi-chevron-down class="w-5 h-5" />
            </span>
        </div>
    </div>
    <div class="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold" id="submenu">
        <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
            Social
        </h1>
        <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
            Personal
        </h1>
        <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
            Friends
        </h1>
    </div>
    <div class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
        <x-bi-box-fill class="w-5 h-5" />
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
    </div>
</div>

{{-- <div class="p-4" style="background-color: #251e3e;">
    <div class="col-md-12 d-flex align-items-center">
        <img src="{{ url('assets/black-fire-logo.png') }}" width="50" height="50" class="d-inline-block">
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
</div> --}}
