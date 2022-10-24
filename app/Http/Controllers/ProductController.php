<?php

namespace App\Http\Controllers;

use App\Models\product;
use Illuminate\Cache\Repository;
use Illuminate\Http\Request;
use PDO;

class ProductController extends Controller
{
    public function addCart(Request $request)
    {
        $id = $request->input('id');
        $cart = session('cart');
        $product = product::where('products.id', '=', $id)
            ->leftjoin('sales', 'products.discount', '=', 'sales.id')
            ->get(['sales.percent', 'products.amount', 'products.image', 'products.name', 'products.price', 'products.origin', 'products.category']);;
        // @dd($product);
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

    public function getCartProducts()
    {
    }

    public function getNewProducts()
    {
        $NewProducts = product::leftjoin('sales', 'products.id', '=', 'sales.id')
            ->orderBy('products.created_at', 'desc')
            ->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);
        return $NewProducts;
    }

    public function getSaleProducts()
    {
        $SaleProducts = product::join('sales', 'products.id', '=', 'sales.id')
            ->orderBy('sales.created_at', 'desc')
            ->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);
        return $SaleProducts;
    }

    public function indexPage()
    {
        return view("index", ['NewProducts' => $this->getNewProducts(), 'SaleProducts' => $this->getSaleProducts()]);
    }

    public function getProductDetails($id)
    {
        $product = product::where('id', '=', $id)
            ->join('sales', 'products.id', '=', 'sales.id')
            ->get(['products.id as ProductsID', 'sales.id as SaleID', 'products.created_at', 'products.updated_at', 'products.image', 'products.name', 'products.price', 'products.origin', 'sales.percent']);;
        return view("product.details", ['product' => $product]);
    }

    public function filterProducts(Request $request)
    {
        $categories = $request->input('categories') == NULL;
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
        $data = $request->all();
        if ($product->update($data) > 0)
            return response()->json(['message' => 'Cập nhật dữ liệu thành công', 'state' => 1]);
        else
            return response()->json(['message' => 'Cập nhật dữ liệu thất bại', 'state' => 0]);
    }

    public function deleteProduct($id)
    {
        $delete = product::find($id)->delete();
        if ($delete > 0)
            return response()->json(['message' => 'Xóa dữ liệu thành công', 'state' => 1]);
        else
            return response()->json(['message' => 'Xóa dữ liệu thất bại', 'state' => 0]);
    }
}
