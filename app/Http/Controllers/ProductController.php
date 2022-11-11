<?php

namespace App\Http\Controllers;

use App\Models\category;
use App\Models\product;
use App\Models\sales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function addCart(Request $request)
    {
        $id = $request->input('id');
        $cart = session('cart');
        $product = product::where('products.id', '=', $id)
            ->leftjoin('sales', 'products.discount', '=', 'sales.id')
            ->get(['sales.percent', 'products.amount', 'products.image', 'products.name', 'products.price', 'products.origin', 'products.category']);

        if (isset($cart[$id])) {
            if ($cart[$id]['quantity'] < $product[0]->amount)
                $cart[$id]['quantity'] += 1;
            else
                return response()->json(['message' => "Vượt số lượng trong kho", 'status' => 0]);
        } else {
            $cart[$id] = [
                'id' => $id,
                'image' => $product[0]->image,
                'name' => $product[0]->name,
                'amount' => $product[0]->amount,
                'price' => $product[0]->price,
                'category' => $product[0]->category,
                'origin' => $product[0]->origin,
                'percent' => $product[0]->percent,
                'quantity' => 1
            ];
        }
        session()->put('cart', $cart);
        session()->save();
        return  response()->json(['message' => "Đã thêm vào giỏ hàng", 'status' => 1]);
    }

    public function removeCart(Request $request)
    {
        session()->pull('cart.' . $request->input('id'));
        session()->save();
        return response()->json(['message' => 'Đã xóa sản phẩm', 'id' => $request->input('id')]);
    }

    public function increaseIncart(Request $request)
    {

        $id = $request->input('id');
        $cart = session('cart');
        if ($cart[$id]['quantity'] < product::where('id', $id)->first()->amount) {
            $cart[$id]['quantity'] += 1;
            session()->put('cart', $cart);
            session()->save();
        } else
            return response()->json(['message' => "Vượt số lượng trong kho", 'status' => 0]);
    }

    public function decreaseIncart(Request $request)
    {
        $id = $request->input('id');
        $cart = session('cart');
        if ($cart[$id]['quantity'] > 0) {
            $cart[$id]['quantity'] -= 1;
            session()->put('cart', $cart);
            session()->save();
        } else
            return response()->json(['message' => "Số lượng không được dưới 0", 'status' => 0]);
    }

    public function getNewProducts()
    {
        $NewProducts = product::leftjoin('sales', 'products.discount', '=', 'sales.id')
            ->orderBy('products.created_at', 'desc')
            ->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);
        return $NewProducts;
    }

    public function getSaleProducts()
    {
        $SaleProducts = product::join('sales', 'products.discount', '=', 'sales.id')
            ->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);
        return $SaleProducts;
    }

    public function indexPage()
    {
        return view("index", ['NewProducts' => $this->getNewProducts(), 'SaleProducts' => $this->getSaleProducts()]);
    }

    public function searchPage()
    {
        return view("product.filter", [
            'Caterogies' => category::all(),
            'Materials' => product::select('material')->distinct()->get(),
            'Countries' => product::select('origin')->distinct()->get()
        ]);
    }

    public function getProductDetails($id)
    {
        $product = product::where('products.id', '=', $id)
            ->leftjoin('sales', 'products.id', '=', 'sales.id')
            ->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);;
        return view("product.details", ['product' => $product]);
    }

    public function filterProducts(Request $request)
    {
        $category = $request->input('Products');
        $country = $request->input('countries');
        $material = $request->input('materials');
        $firstprice = $request->input('firstprice') == NULL ? 0 : $request->input('firstprice');
        $lastprice = $request->input('lastprice') == NULL ? 9999999999 : $request->input('lastprice');
        $current_page = $request->input('page') == NULL ? 1 : $request->input('page');
        $sort = $request->input('sort') == NULL ? 'ASC' : $request->input('sort');
        $search = $request->input('search') == NULL ? "" : $request->input("search");
        $query = DB::table('products')
            ->leftjoin('sales', 'products.discount', '=', 'sales.id')
            ->whereIn('category', $category)
            ->whereIn('origin', $country)
            ->whereIn('material', $material)
            ->whereBetween('price', [$firstprice, $lastprice])
            ->where('name', 'like', '%' . $search . '%')
            ->orderBy('price', $sort);
        $paginate = $query->count();
        $products = $query->take(9)->skip(($current_page - 1) * 9)->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);
        return view('dynamic_layout.filter_reload', compact('products', 'paginate', 'current_page', 'sort'));
    }

    public function addProduct(Request $request)
    {
        // $generatedImageName = 'image_' . time() . '_' . $request->name . '.' . $request->image->extension();
        // $product = new product();
        // $product->image = 'image_' . time() . '_Zippo Classic Candy Apple Red - 21063.jpg';
        // $product->name = "Zippo Classic Candy Apple Red - 21063";
        // $product->amount = "18";
        // $product->price = "850000";
        // $product->category = "BẬT LỬA ZIPPO PHỔ THÔNG";
        // $product->material = "Đồng thau nguyên khối";
        // $product->origin = "Mỹ";
        // $product->description = "Zippo Candy Apple Red - 21063 dòng bật lửa zippo classics, với màu sắc nổi bật lớp sơn mờ màu đỏ đậm trên thiết kế Zippo thu hút sự chú ý của người sử dụng. Sử dụng chất liệu đồng thau để làm vỏ cho chiếc bật lửa Zippo, nhằm đem đến sử trải nghiệm vô cùng đặt biệt Zippo đã mang đến công nghệ sơ tĩnh điện độc đáo và phủ bóng làm cho chiếc Zippo thêm phầm sang trọng và độc đáo.";
        // return $product->save();
    }

    public function editProduct(Request $request, $id)
    {
        $product = product::find($id);
        if ($product->update($request->all()) > 0)
            return response()->json(['message' => 'Cập nhật dữ liệu thành công', 'state' => 1]);
        else
            return response()->json(['message' => 'Cập nhật dữ liệu thất bại', 'state' => 0]);
    }

    public function deleteProduct(Request $request)
    {
        $delete = product::find($request->input('id'))->delete();
        if ($delete > 0)
            return response()->json(['response' => $this->productReload($request->input('id')), 'message' => 'Xóa sản phẩm thành công', 'state' => 1]);
        else
            return response()->json(['message' => 'Xóa sản phẩm thất bại', 'state' => 0]);
    }

    public static function getProducts($current_page)
    {
        return product::take(5)->skip(($current_page - 1) * 5)->get();
    }

    public function searchProduct(Request $request)
    {
        session()->put('search', $request->input('name'));
        session()->save();
        return $this->productReload($request->input('page'));
    }

    public function productReload($current_page)
    {
        $Products = null;
        $total = 0;
        if (session()->has('search') && session()->get('search') != '') {
            $query = product::where('name', 'like', '%' . session()->get('search') . '%');
            $total = $query->count();
            $Products = $query->take(5)->skip(($current_page - 1) * 5)->get();
        } else {
            $Products = $this->getProducts($current_page);
            $total = product::all()->count();
        }
        return view('dynamic_layout.product_reload', ['Products' => $Products, 'total' => $total, 'currentpage' => $current_page])->render();
    }

    public function manageProductPage()
    {
        if (session()->has('search')) session()->forget("search");
        return view('admin.products_manager', ['Categories' => category::all(), 'Sales' => sales::all(), 'Products' => $this->getProducts(1), 'total' => product::all()->count(), 'currentpage' => 1]);
    }
}
