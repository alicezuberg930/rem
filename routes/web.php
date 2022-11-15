<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StatisticController;
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
Route::get('/loginregister', function () {
    return view('login_register.index');
});
// Giao diện trang giỏ hàng
Route::get('/cart', function () {
    return view('cart.index', ['cities' => Http::get('https://api.mysupership.vn/v1/partner/areas/province')]);
});
//Giao diện trang quản lý
// Route::get('/admin', function () {
//     return view("admin.");
// });
// Giao diện trang quên mật khẩu
Route::get('/reset_password', function () {
    return view("forget_password.reset_password");
});
// Giao diện trang chủ
Route::get('/', [ProductController::class, 'indexPage'])->middleware('isLoggedIn');
//đăng nhập & đăng ký
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
//giỏ hàng
Route::get('/add_cart', [CartController::class, 'addCart'])->name('add_cart');
Route::get('/remove_cart', [CartController::class, 'removeCart'])->name('remove_cart');
Route::get('/increase_incart', [CartController::class, 'increaseIncart'])->name('increase_incart');
Route::get('/decrease_incart', [CartController::class, 'decreaseIncart'])->name('decrease_incart');
//chi tiết sản phẩm
Route::get('/product_details/{id}', [ProductController::class, 'ProductDetailsPage'])->name('product_details');
//Thánh toán
Route::get('/vnpay/vnpay_return', [CheckoutController::class, 'paymentsResult']);
Route::post('/vnpay/vnpay_payment', [CheckoutController::class, 'vnpayPayment']);
Route::post('/direct_payment', [CheckoutController::class, 'directPayment']);
//Lấy thông tin api
Route::get('/cart/get_district', [CartController::class, 'getDistrict'])->name('getDistrict');
Route::get('/cart/get_ward', [CartController::class, 'getWard'])->name('getWard');
//Xác thực thông tin đăng ký
Route::get('/verification/{token}', [AuthController::class, 'verifyUser']);
//Thông tin cá nhân
Route::get('/personal_information/{user_id}', [AuthController::class, 'getCurrentUserInfo']);
Route::post('/edit_personal_info', [AuthController::class, 'editPersonalInfo']);
Route::get('/purchase_history/{user_id}', [OrdersController::class, 'getUserOrders']);
Route::get('/user_address', [AddressController::class, 'userAddressPage']);
//Lọc sản phẩm
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
Route::get('/user/manage_orders/order_details/{$order_id}', [OrdersController::class, 'getOrderDetails']);
//Quản lý thống kê
Route::get('/admin/manage_statistic', [StatisticController::class, 'manageStatisticPage']);
//Quản lý sản phẩm
Route::get('/admin/manage_products', [ProductController::class, 'manageProductPage']);
Route::get('/admin/manage_products/add', [ProductController::class, 'addProduct']);
Route::post('/admin/manage_products/upload_file', [ProductController::class, 'uploadFile']);
Route::get('/admin/manage_products/edit', [ProductController::class, 'editProduct']);
Route::get('/admin/manage_products/store', [ProductController::class, 'getProductDetails']);
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
Route::get('/admin/manage_accounts', [CategoryController::class, 'manageCategoryPage']);
Route::get('/admin/age_category/add', [CategoryController::class, 'addCategory']);
Route::get('/admin/age_category/edit', [CategoryController::class, 'editCategory']);
Route::get('/admin/age_category/delete', [CategoryController::class, 'deleteCategory']);
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
Route::get('/admin/manage_sales/store', [SalesController::class, 'getSaleDetails']);
Route::get('/admin/manage_sales/delete', [SalesController::class, 'deleteSale']);
Route::get('/admin/manage_sales/search', [SalesController::class, 'searchSale']);
Route::get('/admin/manage_sales/paginate/{current_page}', [SalesController::class, 'saleReload']);

Route::get('/aaaa', function () {
    // Mail::send("email_templates.order_template", ['a' => 'efhbvwiu'], function ($email) {
    //     $email->subject('Thông báo đăng ký');
    //     $email->to('tien23851@gmail.com', "name");
    // });
    return view("email_templates.order_template");
});
