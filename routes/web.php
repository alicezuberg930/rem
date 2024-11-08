<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ImportSlipController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\SupplierController;
use App\Livewire\Admin\ManageProduct;
use App\Livewire\Admin\ManageStatistics;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Trang chủ 
Route::get('/', [ProductController::class, 'index'])->name("home");
// Trang giỏ hàng
Route::view("/cart", "cart.index")->name("cart");
// Trang chi tiết sản phẩm
Route::get('/product/{id}', [ProductController::class, 'show']);
// group buyer
Route::group(["prefix" => "buyer"], function () {
    // Trang quên mật khẩu
    Route::view("/forgot", "forget_password.reset_password");
    // Xử lý reset mật khẩu
    // Route::post("/reset/{token}", [AuthController::class, '']);
    // group middleware đã đăng nhập
    Route::group(["middleware" => "guest"], function () {
        // Trang đăng nhập
        Route::view("/login", "auth.login.index")->name("buyer.login");
        // Trang đăng ký 
        Route::view("/signup", "auth.signup.index")->name("buyer.signup");
        // Xử lý đăng nhập
        Route::post('/login', [AuthController::class, 'login'])->name("buyer.login");
        //  Xử lý đăng ký
        Route::post('/signup', [AuthController::class, 'signup'])->name("buyer.signup");
    });
});
// group middleware with basic auth 
Route::group(["middleware" => ["auth", "auth.session"]], function () {
    // Xử lý đăng xuất
    Route::get('/logout', [AuthController::class, 'logout']);
    // group seller
    Route::group(["middleware" => "auth.seller", "prefix" => "seller"], function () {
        // Trang đăng nhập seller
        Route::view("/login", "auth.login.index");
        // Trang đăng ký seller
        Route::view("/signup", "auth.seller.signup.index");
        // Trang đặt lại mật khẩu
        Route::view("/reset", "forget_password.reset_password");
        // Xử lý đăng nhập
        Route::post('/login', [AuthController::class, 'login']);
        //  Xử lý đăng ký
        Route::post('/register', [AuthController::class, 'register']);
    });
    // group user
    Route::group(["prefix" => "user"], function () {
        // Trang mật khẩu cá nhân
        Route::view("/password", "user.user_password");
        // Trang thông tin cá nhân
        Route::view('/profile', "user.personal_information");
    });
    // group admin + middleware admin
    Route::group(["middleware" => "auth.admin", "prefix" => "admin"], function () {
        // Trang quản lý thống kê
        Route::get('/statistics', ManageStatistics::class);
        // Trang quản lý sản phẩm
        Route::get('/products', ManageProduct::class);
        Route::get('/products/export', [ProductController::class, 'getHomePageProducts']);
    });
});









Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::get('/admin/logout', [AdminAuthController::class, 'logout']);
// Xử lý giỏ hàng
Route::get('/add_cart', [CartController::class, 'addCart']);
Route::get('/remove_cart', [CartController::class, 'removeCart']);
Route::get('/increase_incart', [CartController::class, 'increaseIncart']);
Route::get('/decrease_incart', [CartController::class, 'decreaseIncart']);
Route::get('/set_quantity', [CartController::class, 'setQuantity']);
Route::post('/review/post', [ReviewController::class, 'store']);
// Xử lý thánh toán
Route::get('/vnpay_return', [CheckoutController::class, 'paymentsResult']);
Route::post('/vnpay_payment', [CheckoutController::class, 'vnpayPayment']);
Route::post('/direct_payment', [CheckoutController::class, 'directPayment']);
//Lấy thông tin api thành phố quận huyện
Route::get('/cart/get_district', [CartController::class, 'getDistrict']);
Route::get('/cart/get_ward', [CartController::class, 'getWard']);
//Xác thực thông tin đăng ký
Route::get('/verification/{token}', [AuthController::class, 'verifyUser']);
//Thông tin cá nhân
Route::post('/edit_personal_info', [AuthController::class, 'editPersonalInfo']);
Route::post('/change_password', [AuthController::class, 'changePassword']);
Route::get('/purchase_history/{user_id}', [OrdersController::class, 'manageUserOrderPage']);
//Lọc sản phẩm
Route::get('/filter/search', [ProductController::class, 'filterProducts']);
Route::get('/filter', [ProductController::class, 'filterPage']);
//Lấy lại mật khẩu
Route::post('/reset_password_request', [PasswordResetController::class, 'resetPasswordRequest']);
Route::get('/create_new_password/{selector}/{token}', [PasswordResetController::class, 'createNewPasswordPage']);
Route::post('/reset_password_handler', [PasswordResetController::class, 'resetPasswordHandler']);
//Quản lý thống kê
Route::get('/admin/manage_statistic/annual_income', [StatisticController::class, 'getAnnualStats']);
Route::get('/admin/manage_statistic/annual_orders', [StatisticController::class, 'getAnnualStats']);
Route::get('/admin/manage_statistic/product_statistic', [StatisticController::class, 'getHighestSoldProduct']);
//Quản lý khách hàng
Route::get('/admin/manage_customers', [CustomerController::class, 'manageCustomerPage']);
Route::get('/admin/manage_customers/search', [CustomerController::class, 'searchCustomer']);
Route::get('/admin/manage_customers/paginate/{current_page}', [CustomerController::class, 'customerReload']);
Route::get('admin/manage_customers/export', [CustomerController::class, 'getAllCustomers']);
//Quản lý thể loại
Route::get('/admin/manage_category', [CategoryController::class, 'manageCategoryPage']);
Route::get('/admin/manage_category/add', [CategoryController::class, 'addCategory']);
Route::get('/admin/manage_category/edit', [CategoryController::class, 'editCategory']);
Route::get('/admin/manage_category/delete', [CategoryController::class, 'deleteCategory']);
Route::get('/admin/manage_category/search', [CategoryController::class, 'searchCategory']);
Route::get('/admin/manage_category/paginate/{current_page}', [CategoryController::class, 'categoryReload']);
Route::get('/admin/manage_category/export', [CategoryController::class, 'getAllCategory']);
//Quản lý khuyến mãi
Route::get('/admin/manage_sales', [SalesController::class, 'manageSalePage']);
Route::get('/admin/manage_sales/add', [SalesController::class, 'addSale']);
Route::get('/admin/manage_sales/edit', [SalesController::class, 'editSale']);
Route::get('/admin/manage_sales/delete', [SalesController::class, 'deleteSale']);
Route::get('/admin/manage_sales/store', [SalesController::class, 'getSaleDetails']);
Route::get('/admin/manage_sales/search', [SalesController::class, 'searchSale']);
Route::get('/admin/manage_sales/paginate/{current_page}', [SalesController::class, 'saleReload']);
Route::get('/admin/manage_sales/export', [SalesController::class, 'getAllSales']);
//Quản lý nhân viên
Route::get('/admin/manage_employees', [EmployeeController::class, 'manageEmployeePage']);
Route::get('/admin/manage_employees/add', [EmployeeController::class, 'addEmployee']);
Route::get('/admin/manage_employees/edit', [EmployeeController::class, 'editEmployee']);
Route::get('/admin/manage_employees/delete', [EmployeeController::class, 'deleteEmployee']);
Route::get('/admin/manage_employees/store', [EmployeeController::class, 'getEmployeeDetails']);
Route::get('/admin/manage_employees/search', [EmployeeController::class, 'searchEmployee']);
Route::get('/admin/manage_employees/paginate/{current_page}', [EmployeeController::class, 'EmployeeReload']);
Route::get('/admin/manage_employees/export', [EmployeeController::class, 'getAllEmployees']);
//Quản lý nhà cung cấp
Route::get('/admin/manage_suppliers', [SupplierController::class, 'manageSupplierPage']);
Route::get('/admin/manage_suppliers/add', [SupplierController::class, 'addSupplier']);
Route::get('/admin/manage_suppliers/edit', [SupplierController::class, 'editSupplier']);
Route::get('/admin/manage_suppliers/delete', [SupplierController::class, 'deleteSupplier']);
Route::get('/admin/manage_suppliers/store', [SupplierController::class, 'getSupplierDetails']);
Route::get('/admin/manage_suppliers/search', [SupplierController::class, 'searchSupplier']);
Route::get('/admin/manage_suppliers/paginate/{current_page}', [SupplierController::class, 'supplierReload']);
Route::get('/admin/manage_suppliers/export', [SupplierController::class, 'getAllSuppliers']);
// Quản lý phiếu nhập
Route::get('/admin/manage_import_slips', [ImportSlipController::class, 'manageImportSlipPage']);
Route::get('/admin/manage_import_slips/store/{id}', [ProductController::class, 'getProductDetails']);
Route::get('/admin/manage_import_slips/add', [ImportSlipController::class, 'addImportSlip']);
Route::get('/admin/manage_import_slips/search', [ImportSlipController::class, 'searchImportSlip']);
Route::get('/admin/manage_import_slips/paginate/{current_page}', [ImportSlipController::class, 'importSlipReload']);
Route::get('/admin/import_slip_details/{id}', [ImportSlipController::class, 'importSlipDetailPage']);
Route::get('/admin/manage_import_slips/export', [ImportSlipController::class, 'getAllImportSlips']);
// Quản lý giao hàng
Route::get('/admin/manage_shippings', [ShippingController::class, 'manageShippingPage']);
Route::get('/admin/manage_shippings/update_shipping_status', [ShippingController::class, 'updateShippingStatus']);
Route::get('/admin/manage_shippings/status', [ShippingController::class, 'shippingStatusAndPaginate']);
Route::get('/admin/manage_shippings/paginate', [ShippingController::class, 'shippingStatusAndPaginate']);
//Quản lý đơn hàng khách
Route::get('/user/manage_orders/update_order_status', [OrdersController::class, 'updateUserOrderStatus']);
Route::get('/user/manage_orders/search', [OrdersController::class, 'searchOrder']);
Route::get('/user/manage_orders/paginate/', [OrdersController::class, 'userOrderStatusAndPaginate']);
Route::get('/user/manage_orders/status/', [OrdersController::class, 'userOrderStatusAndPaginate']);
Route::get('/user/manage_orders/order_details/{order_id}', [OrdersController::class, 'getOrderDetails']);
//Quản lý đơn hàng admin
Route::get('/admin/manage_orders', [OrdersController::class, 'manageAdminOrderPage']);
Route::get('/admin/manage_orders/update_order_status', [OrdersController::class, 'updateAdminOrderStatus']);
Route::get('/admin/manage_orders/search', [OrdersController::class, 'searchOrder']);
Route::get('/admin/manage_orders/paginate/', [OrdersController::class, 'adminOrderStatusAndPaginate']);
Route::get('/admin/manage_orders/status/', [OrdersController::class, 'adminOrderStatusAndPaginate']);
Route::get('/admin/manage_orders/order_details/{order_id}', [OrdersController::class, 'getOrderDetails']);
Route::get('/admin/manage_orders/export', [OrdersController::class, 'getAllOrders']);
