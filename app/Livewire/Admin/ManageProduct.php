<?php

namespace App\Livewire\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use Livewire\Component;
use Livewire\WithFileUploads;
use Spatie\LivewireFilepond\WithFilePond;
use Livewire\WithPagination;

class ManageProduct extends Component
{
    use WithFileUploads, WithFilePond, WithPagination;

    protected $listeners = ['refreshPage' => '$refresh'];
    public $name = '';
    public $description;
    public $category_id;
    public $sale_id;
    public $origin;
    public $material;
    public $price = 0;
    public $amount = 0;
    public $photos = [];
    public $categories = [];
    public $sales = [];
    public $materials = [];
    public $product;
    public $active = true;
    public $search;
    public $perPage = 5;
    public $currentPhotos = [];

    public function mount()
    {
        $this->categories = Category::all();
        $this->sales = Sale::all();
        $this->materials = Product::select('material')->distinct()->get();
        $this->category_id = $this->categories[0]->id;
        $this->sale_id = $this->sales[0]->id;
        $this->material = $this->materials[0]->material;
    }

    public function render()
    {
        return view(
            'livewire.admin.manage_product',
            ["products" => Product::search(trim($this->search))->paginate($this->perPage)]
        );
    }

    public function refreshPage()
    {
        $this->render();
    }

    public function save()
    {
        try {
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
            $this->product = Product::create($data);
            
            foreach ($this->photos as $photo) {
                $this->product->addMedia($photo->getRealPath())->toMediaCollection('photos');
            }
            $this->dispatch("close-create-modal");
            $this->photos = null;
            $this->reset();
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    public function edit($id)
    {
        try {
            $this->product = Product::find($id);

            $this->amount = $this->product->amount;
            $this->name = $this->product->name;
            $this->description = $this->product->description;
            $this->category_id = $this->product->category_id;
            $this->sale_id = $this->product->sale_id;
            $this->origin = $this->product->origin;
            $this->material = $this->product->material;
            $this->price = $this->product->price;
            // if ($this->photos != null) {
            //     foreach ($this->product->getPhotosAttribute() as $attribute) {
            //         array_push($this->photos, new TemporaryUploadedFile($attribute["file_name"], "public"));
            //     }
            // }
            $this->dispatch("open-edit-modal");
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    public function update()
    {
        try {
            $this->product->update($this->all());
            if ($this->photos != null) {
                $this->product->clearMediaCollection("photos");
                foreach ($this->photos as $photo) {
                    $this->product->addMedia($photo->getRealPath())->toMediaCollection('photos');
                }
            }
            $this->product = null;
            $this->dispatch("close-edit-modal");
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $this->product = Product::find($id);
            $this->currentPhotos = $this->product->getPhotosAttribute();
            // dd($this->product);
            $this->dispatch("open-details-modal");
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }
}
