<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
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
    return view('cart.index');
});
//Giao diện trang quản lý
Route::get('/admin/form_qly_sanpham', function () {
    return view("admin.form_qly_sanpham");
});
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
Route::post('/add_cart', [ProductController::class, 'addCart'])->name('add_cart');
Route::get('/remove_cart', [ProductController::class, 'removeCart'])->name('remove_cart');
Route::get('/increase_incart', [ProductController::class, 'increaseIncart'])->name('increase_incart');
Route::get('/decrease_incart', [ProductController::class, 'decreaseIncart'])->name('decrease_incart');
//chi tiết sản phẩm
Route::get('/product_detail/{id}', [ProductController::class, 'getProductDetails'])->name('product_details');
//CRUD sản phẩm
Route::get('/add_product', [ProductController::class, 'addProduct']);
Route::get('/edit_product/{id}', [ProductController::class, 'editProduct']);
Route::get('/delete_product/{id}', [ProductController::class, 'deleteProduct']);
//CRUD danh mục
Route::get('/add_category', [CategoryController::class, 'addCategory']);
Route::get('/edit_category/{id}', [CategoryController::class, 'editCategory']);
Route::get('/delete_category/{id}', [CategoryController::class, 'deleteCategory']);
//CRUD khuyến mãi
Route::get('/add_sale', [SalesController::class, 'addSale']);
Route::get('/edit_sale/{id}', [ProductController::class, 'editSale']);
Route::get('/delete_sale/{id}', [ProductController::class, 'deleteSale']);
//Thánh toán
Route::get('/vnpay/vnpay_return', [CheckoutController::class, 'paymentsResult']);
Route::post('/vnpay/vnpay_payment', [CheckoutController::class, 'vnpayPayment']);
//Lấy thông tin api
Route::get('/cart/get_district', [CartController::class, 'getDistrict'])->name('getDistrict');
Route::get('/cart/get_ward', [CartController::class, 'getWard'])->name('getWard');
//Xác thực thông tin đăng ký
Route::get('/verification/{token}', [AuthController::class, 'verifyUser']);
//Lọc sản phẩm
Route::get('/filter/search', [ProductController::class, 'filterProducts']);
Route::get('/filter', [ProductController::class, 'searchPage']);
//Quản lý thống kê
Route::get('/admin/manage_statistic', [CategoryController::class, 'manageCategoryPage']);
Route::get('/admin/age_category/add', [CategoryController::class, 'addCategory']);
Route::get('/admin/age_category/edit', [CategoryController::class, 'editCategory']);
Route::get('/admin/age_category/delete', [CategoryController::class, 'deleteCategory']);
//Quản lý sản phẩm
Route::get('/admin/manage_products', [CategoryController::class, 'manageCategoryPage']);
Route::get('/admin/age_category/add', [CategoryController::class, 'addCategory']);
Route::get('/admin/age_category/edit', [CategoryController::class, 'editCategory']);
Route::get('/admin/age_category/delete', [CategoryController::class, 'deleteCategory']);
//Quản lý đơn hàng
Route::get('/admin/manage_orders', [OrdersController::class, 'manageOrderPage']);
Route::get('/admin/manage_orders/update_order_status', [OrdersController::class, 'updateOrderStatus']);
Route::get('/admin/manage_orders/order_details', [OrdersController::class, 'getOrderDetails']);
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
//Quản lý giảm giá
Route::get('/admin/manage_sales', [CategoryController::class, 'manageCategoryPage']);
Route::get('/admin/age_category/add', [CategoryController::class, 'addCategory']);
Route::get('/admin/age_category/edit', [CategoryController::class, 'editCategory']);
Route::get('/admin/age_category/delete', [CategoryController::class, 'deleteCategory']);
//Lấy lại mật khẩu
Route::post('/reset_password_request', [PasswordResetController::class, 'resetPasswordRequest']);
Route::get('/create_new_password/{selector}/{token}', [PasswordResetController::class, 'createNewPasswordPage']);
Route::post('/reset_password_handler', [PasswordResetController::class, 'resetPasswordHandler']);
