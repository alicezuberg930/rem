<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImportSlipController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Livewire\Admin\ManageProduct;
use App\Livewire\Admin\ManageStatistics;
use App\Notifications\SMSNotification;
use Illuminate\Http\Request;
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
Route::get("/", [HomeController::class, "index"])->name("home");
// Trang giỏ hàng
Route::view("/cart", "cart.index")->name("cart");
// Trang chi tiết sản phẩm
Route::get("/product/{id}", [HomeController::class, "show"]);
// group buyer
Route::group(["prefix" => "buyer"], function () {
    // group middleware đã đăng nhập
    Route::group(["middleware" => "guest"], function () {
        // Trang đăng nhập
        Route::view("/login", "auth.login.index")->name("buyer.login");
        // Trang đăng ký 
        Route::view("/signup", "auth.signup.index")->name("buyer.signup");
        // Xử lý đăng nhập
        Route::post("/login", [AuthController::class, "login"])->name("buyer.login");
        //  Xử lý đăng ký
        Route::post("/signup", [AuthController::class, "signup"])->name("buyer.signup");
        // Trang quên mật khẩu
        Route::view("/password/forgot", "auth.password.forgot")->name("password.request");
        // Xử lý gửi token đến email
        Route::post("/password/forgot", [AuthController::class, "forgotPassword"])->middleware(['throttle:6,1'])->name("password.email");
        // Trang đặt lại mật khẩu
        Route::get("/password/reset/{token}", function ($token) {
            return view("auth.password.reset", ["token" => $token]);
        })->name("password.reset");
        // Xử lý reset mật khẩu
        Route::post("/password/reset", [AuthController::class, "resetPassword"])->name("password.update");
    });
});
// group middleware with basic auth 
Route::group(["middleware" => ["auth", "auth.session"]], function () {
    // Xử lý đăng xuất
    Route::get("/logout", [AuthController::class, "logout"]);
    // Trang xác thực email
    Route::view('/email/verify', "auth.verify")->name('verification.notice');
    // Xử lý xác thực email
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->name('verification.verify');
    // Xử lý gửi lại email xác thực
    Route::post('/email/verify/send', [AuthController::class, 'sendVerifyEmail'])->middleware(['throttle:6,1'])->name('verification.send');
    // Xử lý đăng bình luận đánh giá
    Route::post("/review/post", [ReviewController::class, "store"]);
    // group seller
    Route::group(["middleware" => "auth.seller", "prefix" => "seller"], function () {
        // Trang đăng ký seller
        Route::view("/signup", "auth.seller.signup.index");
        //  Xử lý đăng ký seller
        // Route::post("/register", [AuthController::class, "register"]);
    });
    // group user
    Route::group(["prefix" => "user"], function () {
        // Trang mật khẩu cá nhân
        Route::view("/password", "user.buyer.password");
        // Trang thông tin cá nhân
        Route::view("/profile", "user.buyer.profile")->name("user.profile");
        // Xử lý cập nhật thông tin cá nhân
        // Route::post("/avatar", [UserController::class, 'update'])->name("user.profile");

        Route::post("/password", [AuthController::class, "changePassword"]);
        // Trang đơn hàng của người dùng
        Route::get("/orders", [OrdersController::class, "manageUserOrderPage"]);
    });
    // group admin
    Route::group(["middleware" => "auth.admin", "prefix" => "admin"], function () {
        // Trang quản lý thống kê
        Route::get("/statistics", ManageStatistics::class);
        // Trang quản lý sản phẩm
        Route::get("/products", ManageProduct::class);
        Route::get("/products/export", [ProductController::class, "getHomePageProducts"]);
    });
});

// Route::get('/test', function (Request $request) {
//     try {
//         $request->user()->notify((new SMSNotification()));
//     } catch (\Throwable $th) {
//         dd($th->getMessage());
//     }
// });

// đống shit đang chờ được sửa :v
// Xử lý giỏ hàng
Route::get("/add_cart", [CartController::class, "addCart"]);
Route::get("/remove_cart", [CartController::class, "removeCart"]);
Route::get("/increase_incart", [CartController::class, "increaseIncart"]);
Route::get("/decrease_incart", [CartController::class, "decreaseIncart"]);
Route::get("/set_quantity", [CartController::class, "setQuantity"]);
// Xử lý thánh toán
Route::get("/vnpay_return", [CheckoutController::class, "paymentsResult"]);
Route::post("/vnpay_payment", [CheckoutController::class, "vnpayPayment"]);
Route::post("/direct_payment", [CheckoutController::class, "directPayment"]);
//Lấy thông tin api thành phố quận huyện
Route::get("/cart/get_district", [CartController::class, "getDistrict"]);
Route::get("/cart/get_ward", [CartController::class, "getWard"]);
//Lọc sản phẩm
Route::get("/filter/search", [ProductController::class, "filterProducts"]);
Route::get("/filter", [ProductController::class, "filterPage"]);
//Quản lý thống kê
Route::get("/admin/manage_statistic/annual_income", [StatisticController::class, "getAnnualStats"]);
Route::get("/admin/manage_statistic/annual_orders", [StatisticController::class, "getAnnualStats"]);
Route::get("/admin/manage_statistic/product_statistic", [StatisticController::class, "getHighestSoldProduct"]);
//Quản lý khách hàng
Route::get("/admin/manage_customers", [CustomerController::class, "manageCustomerPage"]);
Route::get("/admin/manage_customers/search", [CustomerController::class, "searchCustomer"]);
Route::get("/admin/manage_customers/paginate/{current_page}", [CustomerController::class, "customerReload"]);
Route::get("admin/manage_customers/export", [CustomerController::class, "getAllCustomers"]);
//Quản lý thể loại
Route::get("/admin/manage_category", [CategoryController::class, "manageCategoryPage"]);
Route::get("/admin/manage_category/add", [CategoryController::class, "addCategory"]);
Route::get("/admin/manage_category/edit", [CategoryController::class, "editCategory"]);
Route::get("/admin/manage_category/delete", [CategoryController::class, "deleteCategory"]);
Route::get("/admin/manage_category/search", [CategoryController::class, "searchCategory"]);
Route::get("/admin/manage_category/paginate/{current_page}", [CategoryController::class, "categoryReload"]);
Route::get("/admin/manage_category/export", [CategoryController::class, "getAllCategory"]);
//Quản lý khuyến mãi
Route::get("/admin/manage_sales", [SalesController::class, "manageSalePage"]);
Route::get("/admin/manage_sales/add", [SalesController::class, "addSale"]);
Route::get("/admin/manage_sales/edit", [SalesController::class, "editSale"]);
Route::get("/admin/manage_sales/delete", [SalesController::class, "deleteSale"]);
Route::get("/admin/manage_sales/store", [SalesController::class, "getSaleDetails"]);
Route::get("/admin/manage_sales/search", [SalesController::class, "searchSale"]);
Route::get("/admin/manage_sales/paginate/{current_page}", [SalesController::class, "saleReload"]);
Route::get("/admin/manage_sales/export", [SalesController::class, "getAllSales"]);
//Quản lý nhân viên
Route::get("/admin/manage_employees", [EmployeeController::class, "manageEmployeePage"]);
Route::get("/admin/manage_employees/add", [EmployeeController::class, "addEmployee"]);
Route::get("/admin/manage_employees/edit", [EmployeeController::class, "editEmployee"]);
Route::get("/admin/manage_employees/delete", [EmployeeController::class, "deleteEmployee"]);
Route::get("/admin/manage_employees/store", [EmployeeController::class, "getEmployeeDetails"]);
Route::get("/admin/manage_employees/search", [EmployeeController::class, "searchEmployee"]);
Route::get("/admin/manage_employees/paginate/{current_page}", [EmployeeController::class, "EmployeeReload"]);
Route::get("/admin/manage_employees/export", [EmployeeController::class, "getAllEmployees"]);
//Quản lý nhà cung cấp
Route::get("/admin/manage_suppliers", [SupplierController::class, "manageSupplierPage"]);
Route::get("/admin/manage_suppliers/add", [SupplierController::class, "addSupplier"]);
Route::get("/admin/manage_suppliers/edit", [SupplierController::class, "editSupplier"]);
Route::get("/admin/manage_suppliers/delete", [SupplierController::class, "deleteSupplier"]);
Route::get("/admin/manage_suppliers/store", [SupplierController::class, "getSupplierDetails"]);
Route::get("/admin/manage_suppliers/search", [SupplierController::class, "searchSupplier"]);
Route::get("/admin/manage_suppliers/paginate/{current_page}", [SupplierController::class, "supplierReload"]);
Route::get("/admin/manage_suppliers/export", [SupplierController::class, "getAllSuppliers"]);
// Quản lý phiếu nhập
Route::get("/admin/manage_import_slips", [ImportSlipController::class, "manageImportSlipPage"]);
Route::get("/admin/manage_import_slips/store/{id}", [ProductController::class, "getProductDetails"]);
Route::get("/admin/manage_import_slips/add", [ImportSlipController::class, "addImportSlip"]);
Route::get("/admin/manage_import_slips/search", [ImportSlipController::class, "searchImportSlip"]);
Route::get("/admin/manage_import_slips/paginate/{current_page}", [ImportSlipController::class, "importSlipReload"]);
Route::get("/admin/import_slip_details/{id}", [ImportSlipController::class, "importSlipDetailPage"]);
Route::get("/admin/manage_import_slips/export", [ImportSlipController::class, "getAllImportSlips"]);
// Quản lý giao hàng
Route::get("/admin/manage_shippings", [ShippingController::class, "manageShippingPage"]);
Route::get("/admin/manage_shippings/update_shipping_status", [ShippingController::class, "updateShippingStatus"]);
Route::get("/admin/manage_shippings/status", [ShippingController::class, "shippingStatusAndPaginate"]);
Route::get("/admin/manage_shippings/paginate", [ShippingController::class, "shippingStatusAndPaginate"]);
//Quản lý đơn hàng khách
Route::get("/user/manage_orders/update_order_status", [OrdersController::class, "updateUserOrderStatus"]);
Route::get("/user/manage_orders/search", [OrdersController::class, "searchOrder"]);
Route::get("/user/manage_orders/paginate/", [OrdersController::class, "userOrderStatusAndPaginate"]);
Route::get("/user/manage_orders/status/", [OrdersController::class, "userOrderStatusAndPaginate"]);
Route::get("/user/manage_orders/order_details/{order_id}", [OrdersController::class, "getOrderDetails"]);
//Quản lý đơn hàng admin
Route::get("/admin/manage_orders", [OrdersController::class, "manageAdminOrderPage"]);
Route::get("/admin/manage_orders/update_order_status", [OrdersController::class, "updateAdminOrderStatus"]);
Route::get("/admin/manage_orders/search", [OrdersController::class, "searchOrder"]);
Route::get("/admin/manage_orders/paginate/", [OrdersController::class, "adminOrderStatusAndPaginate"]);
Route::get("/admin/manage_orders/status/", [OrdersController::class, "adminOrderStatusAndPaginate"]);
Route::get("/admin/manage_orders/order_details/{order_id}", [OrdersController::class, "getOrderDetails"]);
Route::get("/admin/manage_orders/export", [OrdersController::class, "getAllOrders"]);
