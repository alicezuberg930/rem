<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\Authentication;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ImportSlipController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\SupplierController;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
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

//Giao diện trang đăng nhập & đăng ký 
Route::get('/login_register', function () {
    return view('login_register.index');
});
Route::get('/admin_login', function () {
    return view('login_register.admin_index');
});
// Giao diện trang chủ
Route::get('/', [ProductController::class, 'indexPage'])->middleware('isLoggedIn');
// Giao diện trang giỏ hàng
Route::get('/cart', function () {
    return view('cart.index', ['cities' => Http::get('https://api.mysupership.vn/v1/partner/areas/province')]);
});
// Giao diện trang quên mật khẩu
Route::get('/reset_password', function () {
    return view("forget_password.reset_password");
});
// Giao diện trang thông tin cá nhân
Route::get('/personal_information/{user_id}', function ($user_id) {
    return view('user.personal_information', ['User' => User::find($user_id)]);
})->middleware('auth');
// Giao diện trang mật khẩu cá nhân
Route::get('/personal_password', function () {
    return view('user.user_password');
});
// Trang quản lý thống kê
Route::get('/admin/manage_statistic', function () {
    return view('admin.statistic_manager');
});
// Xử lý đăng nhập & đăng ký
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/logout', [AuthController::class, 'logout']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::get('/admin/logout', [AdminAuthController::class, 'logout']);
// Xử lý giỏ hàng
Route::get('/add_cart', [CartController::class, 'addCart']);
Route::get('/remove_cart', [CartController::class, 'removeCart']);
Route::get('/increase_incart', [CartController::class, 'increaseIncart']);
Route::get('/decrease_incart', [CartController::class, 'decreaseIncart']);
// Giao diện trang chi tiết sản phẩm
Route::get('/product_details/{id}', [ProductController::class, 'ProductDetailsPage']);
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
Route::get('/purchase_history/{user_id}', [OrdersController::class, 'getUserOrders']);
Route::get('/user_address', [AddressController::class, 'userAddressPage']);
//Lọc sản phẩm
Route::get('/search_product', [ProductController::class, 'searchProductHeader']);
Route::get('/filter/search', [ProductController::class, 'filterProducts']);
Route::get('/filter', [ProductController::class, 'filterPage']);
//Lấy lại mật khẩu
Route::post('/reset_password_request', [PasswordResetController::class, 'resetPasswordRequest']);
Route::get('/create_new_password/{selector}/{token}', [PasswordResetController::class, 'createNewPasswordPage']);
Route::post('/reset_password_handler', [PasswordResetController::class, 'resetPasswordHandler']);
//Quản lý đơn hàng khách
Route::get('/user/manage_orders', [OrdersController::class, 'manageOrderPage']);
Route::get('/user/manage_orders/update_order_status', [OrdersController::class, 'updateOrderStatus']);
Route::get('/user/manage_orders/search', [OrdersController::class, 'searchOrder']);
Route::get('/user/manage_orders/paginate/{current_page}/{type}/{user_id}', [OrdersController::class, 'orderReload']);
Route::get('/user/manage_orders/status/{current_page}/{type}/{user_id}', [OrdersController::class, 'orderReload']);
Route::get('/user/manage_orders/order_details/{order_id}', [OrdersController::class, 'getOrderDetails']);
//Quản lý thống kê
Route::get('/admin/manage_statistic/annual_income', [StatisticController::class, 'getAnnualIncome']);
Route::get('/admin/manage_statistic/annual_orders', [StatisticController::class, 'getAnnualOrders']);
Route::get('/admin/manage_statistic/product_statistic', [StatisticController::class, 'getHighestSoldProduct']);
//Quản lý sản phẩm
Route::get('/admin/manage_products', [ProductController::class, 'manageProductPage']);
Route::get('/admin/manage_products/add', [ProductController::class, 'addProduct']);
Route::post('/admin/manage_products/upload_file', [ProductController::class, 'uploadFile']);
Route::get('/admin/manage_products/edit', [ProductController::class, 'editProduct']);
Route::get('/admin/manage_products/store/{id}', [ProductController::class, 'getProductDetails']);
Route::get('/admin/manage_products/delete', [ProductController::class, 'deleteProduct']);
Route::get('/admin/manage_products/search', [ProductController::class, 'searchProduct']);
Route::get('/admin/manage_products/paginate/{current_page}', [ProductController::class, 'productReload']);
//Quản lý đơn hàng admin
Route::get('/admin/manage_orders', [OrdersController::class, 'manageOrderPage']);
Route::get('/admin/manage_orders/update_order_status', [OrdersController::class, 'updateOrderStatus']);
Route::get('/admin/manage_orders/search', [OrdersController::class, 'searchOrder']);
Route::get('/admin/manage_orders/paginate/{current_page}/{type}/{user_id}', [OrdersController::class, 'orderReload']);
Route::get('/admin/manage_orders/status/{current_page}/{type}/{user_id}', [OrdersController::class, 'orderReload']);
Route::get('/admin/manage_orders/order_details/{order_id}', [OrdersController::class, 'getOrderDetails']);
//Quản lý khách hàng
Route::get('/admin/manage_customers', [CustomerController::class, 'manageCustomerPage']);
Route::get('/admin/manage_customers/search', [CustomerController::class, 'searchCustomer']);
Route::get('/admin/manage_customers/paginate/{current_page}', [CustomerController::class, 'customerReload']);
//Quản lý thể loại
Route::get('/admin/manage_category', [CategoryController::class, 'manageCategoryPage']);
Route::get('/admin/manage_category/add', [CategoryController::class, 'addCategory']);
Route::get('/admin/manage_category/edit', [CategoryController::class, 'editCategory']);
Route::get('/admin/manage_category/delete', [CategoryController::class, 'deleteCategory']);
Route::get('/admin/manage_category/search', [CategoryController::class, 'searchCategory']);
Route::get('/admin/manage_category/paginate/{current_page}', [CategoryController::class, 'categoryReload']);
//Quản lý khuyến mãi
Route::get('/admin/manage_sales', [SalesController::class, 'manageSalePage']);
Route::get('/admin/manage_sales/add', [SalesController::class, 'addSale']);
Route::get('/admin/manage_sales/edit', [SalesController::class, 'editSale']);
Route::get('/admin/manage_sales/delete', [SalesController::class, 'deleteSale']);
Route::get('/admin/manage_sales/store', [SalesController::class, 'getSaleDetails']);
Route::get('/admin/manage_sales/search', [SalesController::class, 'searchSale']);
Route::get('/admin/manage_sales/paginate/{current_page}', [SalesController::class, 'saleReload']);
//Quản lý nhân viên
Route::get('/admin/manage_employees', [EmployeeController::class, 'manageEmployeePage']);
Route::get('/admin/manage_employees/add', [EmployeeController::class, 'addEmployee']);
Route::get('/admin/manage_employees/edit', [EmployeeController::class, 'editEmployee']);
Route::get('/admin/manage_employees/delete', [EmployeeController::class, 'deleteEmployee']);
Route::get('/admin/manage_employees/store', [EmployeeController::class, 'getEmployeeDetails']);
Route::get('/admin/manage_employees/search', [EmployeeController::class, 'searchEmployee']);
Route::get('/admin/manage_employees/paginate/{current_page}', [EmployeeController::class, 'EmployeeReload']);
//Quản lý nhà cung cấp
Route::get('/admin/manage_suppliers', [SupplierController::class, 'manageSupplierPage']);
Route::get('/admin/manage_suppliers/add', [SupplierController::class, 'addSupplier']);
Route::get('/admin/manage_suppliers/edit', [SupplierController::class, 'editSupplier']);
Route::get('/admin/manage_suppliers/delete', [SupplierController::class, 'deleteSupplier']);
Route::get('/admin/manage_suppliers/store', [SupplierController::class, 'getSupplierDetails']);
Route::get('/admin/manage_suppliers/search', [SupplierController::class, 'searchSupplier']);
Route::get('/admin/manage_suppliers/paginate/{current_page}', [SupplierController::class, 'supplierReload']);
// Quản lý phiếu nhập
Route::get('/admin/manage_import_slips', [ImportSlipController::class, 'manageImportSlipPage']);
Route::get('/admin/manage_import_slips/store/{id}', [ProductController::class, 'getProductDetails']);
Route::get('/admin/manage_import_slips/add', [ImportSlipController::class, 'addImportSlip']);
Route::get('/admin/manage_import_slips/search', [ImportSlipController::class, 'searchImportSlip']);
Route::get('/admin/manage_import_slips/paginate/{current_page}', [ImportSlipController::class, 'importSlipReload']);
Route::get('/admin/import_slip_details/{id}', [ImportSlipController::class, 'importSlipDetailPage']);
