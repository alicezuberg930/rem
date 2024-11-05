<span class="absolute text-white text-3xl cursor-pointer h-12 w-12" onclick="openSidebar()">
    <i class="bi bi-filter-left bg-gray-800 px-2 rounded-md"></i>
</span>
<div class="sidebar z-20 flex-shrink-0 w-[270px] p-2 overflow-y-auto block text-center bg-gray-800">
    <div class="text-gray-100 text-xl">
        <div class="p-2.5 mt-1 flex items-center justify-between">
            <div class="flex items-center">
                <img src="{{ url('assets/black-fire-logo.png') }}" class="h-12 w-12">
                <h1 class="font-bold text-gray-200 text-sm ml-3">Cửa hàng</h1>
            </div>
            <i class="bi bi-x cursor-pointer" onclick="openSidebar()"></i>
        </div>
        <div class="my-2 bg-gray-600 h-[1px]"></div>
    </div>
    <div class="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white">
        <i class="bi bi-search text-sm"></i>
        <input type="text" placeholder="Search" class="text-[15px] ml-4 w-full bg-transparent focus:outline-none" />
    </div>
    <div class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
        <i class="bi bi-house-door-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
    </div>
    <div class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
        <i class="bi bi-bookmark-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Bookmark</span>
    </div>
    <div class="my-4 bg-gray-600 h-[1px]"></div>
    <div class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
        onclick="dropdown()">
        <i class="bi bi-chat-left-text-fill"></i>
        <div class="flex justify-between w-full items-center">
            <span class="text-[15px] ml-4 text-gray-200 font-bold">Chatbox</span>
            <span class="text-sm rotate-180" id="arrow">
                <i class="bi bi-chevron-down"></i>
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
        <i class="bi bi-box-arrow-in-right"></i>
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
