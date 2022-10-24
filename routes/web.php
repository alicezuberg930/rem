<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ViewErrorBag;

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

Route::get('/loginregister', function () {
    return view('loginregister.index');
});

Route::get('/cart', function () {
    return view('cart.index');
});

Route::get('/filter', function () {
    return view('product.filter');
});

Route::get('/', [ProductController::class, 'indexPage']);
// Route::get('/cart', [ProductController::class, 'getCartProducts']);
//->middleware('isLoggedIn');
//đăng nhập & đăng ký
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
//giỏ hàng
Route::post('/add_cart', [ProductController::class, 'addCart'])->name('add_cart');
Route::get('/remove_cart', [ProductController::class, 'removeCart'])->name('remove_cart');
//chi tiết sản phẩm
Route::get('/product_details/{id}', [ProductController::class, 'getProductDetails'])->name('product_details');
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
