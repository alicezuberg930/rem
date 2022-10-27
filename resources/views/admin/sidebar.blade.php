<div class="col-md-3 col-lg-2 d-flex flex-column p-4 rounded-0" style="background-color: #251e3e;">
    <span class="fs-4 fw-bold text-white">Quản lý @php echo Route::currentRouteName(); @endphp</span>
    <hr class="bg-danger border-top border-3 border-white">
    {{-- <ul class="nav nav-pills flex-column">
      <li class="nav-item">
          <a class="nav-link @php echo Route::currentRouteName()=='statistic' ? 'link-light border border-white':'link-light' @endphp" href="{{route('statistic')}}">
              <i class="bi bi-bar-chart-line"> </i>Thống kê</a>
      </li>
      <li>
          <a class="nav-link @php echo Route::currentRouteName()=='products' || Route::currentRouteName()=='add-product' ? 'link-light border border-white':'link-light' @endphp" href="{{ route('products') }}">
              <i class="bi bi-cup-straw"> </i>Sản phẩm</a>
      </li>
      <li>
          <a class="nav-link @php echo Route::currentRouteName()=='orders' ? 'link-light border border-white':'link-light' @endphp" href="{{ route('orders') }}">
              <i class="bi bi-receipt"> </i>Đơn hàng</a>
      </li>
      <li>
          <a class="nav-link @php echo Route::currentRouteName()=='accounts' ? 'link-light border border-white':'link-light' @endphp" href="{{ route('accounts') }}">
              <i class="bi bi-file-earmark-person"> </i>Khách hàng</a>
      </li>
      <li>
          <a class="nav-link @php echo Route::currentRouteName()=='categories' || Route::currentRouteName()=='add-category' ? 'link-light border border-white':'link-light' @endphp" href="{{ route('categories') }}">
              <i class="bi bi-tags"> </i>Thể loại</a>
      </li>
      <li>
          <a class="nav-link @php echo Route::currentRouteName()=='brands' || Route::currentRouteName()=='add-brand' ? 'link-light border border-white':'link-light' @endphp" href="{{ route('brands') }}">
              <i class="bi bi-alipay"> </i>Thương hiệu</a>
      </li>
      <li>
          <a class="nav-link @php echo Route::currentRouteName()=='countries' || Route::currentRouteName()=='add-country'  ? 'link-light border border-white':'link-light' @endphp" href="{{ route('countries') }}">
              <i class="bi bi-globe2"> </i>Quốc gia</a>
      </li>
      <li>
          <a class="nav-link text-danger fs-semibold' @endphp" href="{{ route('home') }}">
              <i class="bi bi-arrow-bar-left"> </i> Quay lại cửa hàng</a>
      </li>
  </ul> --}}
    <ul class="nav nav-pills flex-column">
        <li class="nav-item">
            <a class="nav-link @php echo Route::currentRouteName()=='statistic' ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('statistic') }}">
                <i class="bi bi-bar-chart-line"> </i>Thống kê</a>
        </li>
        <li>
            <a class="nav-link @php echo Route::currentRouteName()=='products' || Route::currentRouteName()=='add-product' ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('products') }}">
                <i class="bi bi-cup-straw"> </i>Sản phẩm</a>
        </li>
        <li>
            <a class="nav-link @php echo Route::currentRouteName()=='orders' ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('orders') }}">
                <i class="bi bi-receipt"> </i>Đơn hàng</a>
        </li>
        <li>
            <a class="nav-link @php echo Route::currentRouteName()=='accounts' ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('accounts') }}">
                <i class="bi bi-file-earmark-person"> </i>Khách hàng</a>
        </li>
        <li>
            <a class="nav-link @php echo Route::currentRouteName()=='categories' || Route::currentRouteName()=='add-category' ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('categories') }}">
                <i class="bi bi-tags"> </i>Thể loại</a>
        </li>
        <li>
            <a class="nav-link @php echo Route::currentRouteName()=='brands' || Route::currentRouteName()=='add-brand' ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('brands') }}">
                <i class="bi bi-alipay"> </i>Thương hiệu</a>
        </li>
        <li>
            <a class="nav-link @php echo Route::currentRouteName()=='countries' || Route::currentRouteName()=='add-country'  ? 'link-light border border-white':'link-light' @endphp"
                href="{{ route('countries') }}">
                <i class="bi bi-globe2"> </i>Quốc gia</a>
        </li>
        <li>
            <a class="nav-link text-danger fs-semibold' @endphp" href="{{ route('home') }}">
                <i class="bi bi-arrow-bar-left"> </i> Quay lại cửa hàng</a>
        </li>
    </ul>
</div>
