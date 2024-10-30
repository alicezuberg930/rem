<?php

namespace App\Livewire\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use Livewire\Component;
use Livewire\WithFileUploads;
// use Spatie\MediaLibraryPro\Livewire\Concerns\WithMedia;

class ManageProduct extends Component
{
    use WithFileUploads;

    public $name = '';
    public $description = '';
    public $category_id;
    public $sale_id;
    public $origin;
    public $material;
    public $price;
    public $amount;
    public $photos = [];
    public $categories = [];
    public $sales = [];
    public $materials = [];
    public $products = [];
    public $product;

    public function mount()
    {
        $this->product = new Product();
        $this->categories = Category::all();
        $this->sales = Sale::all();
        $this->products = Product::select('*')->get();
        $this->materials = Product::select('material')->distinct()->get();
        // 'total' => Product::all()->count(),
        // 'currentpage' => 1,
        $this->category_id = $this->categories[0]->id;
        $this->sale_id = $this->sales[0]->id;
        $this->material = $this->materials[0]->material;
    }

    public function render()
    {
        return view('livewire.admin.manage_product');
    }

    public function save()
    {
        try {
            // dd($this->photos[0]->getClientOriginalName());
            // dd($this->photos[0]->getRealPath());
            $data = $this->validate([
                'amount' => 'required',
                'name' => 'required|max:255',
                'description' => 'required',
                'category_id' => 'required',
                'sale_id' => 'required',
                'origin' => 'required',
                'material' => 'required',
                'price' => 'required',
                'photos.*' => 'required|mimes:jpeg,jpg,png|max:1024',
            ]);
            $this->product->create($data);

            foreach ($this->photos as $photo) {
                // $product->addMediaFromString($photo->get())->usingFileName($photo->getFilename())->toMediaCollection('medias');
                // $this->product->addMedia($photo->getRealPath())->usingName($photo->getClientOriginalName())->toMediaCollection('medias');
                $this->product->addMediaFromDisk('livewire-tmp/' . $photo->getFilename())->toMediaCollection("medias");
            }
            $this->name = '';
            // $this->reset();
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }
}
