<?php

namespace App\Livewire\Admin;

use App\Models\Category;
use App\Models\Product;
use Livewire\Component;
use Livewire\WithFileUploads;

class ManageStuff extends Component
{
    use WithFileUploads;
    public $products = [];
    public $photo;

    public function mount()
    {
        $this->products = Product::all();
    }
    public function render()
    {
        return view('livewire.admin.manage-stuff');
    }

    public function save()
    {
        try {
            // dd($this->photo);
            $category = new Category();
            $category->addMediaFromString($this->photo->get())->usingFileName($this->photo->getFilename())->toMediaCollection('avatar');
            // $category->addMediaFromDisk('livewire-tmp/'.$this->photo->getFilename())->toMediaCollection('avatar');
            // $category->addMedia($this->photo->getRealPath())->usingName($this->photo->getClientOriginalName())->toMediaCollection('avatar');
            // $category->addMedia($this->photo)->toMediaCollection("avatar");
            $category->create(["category_name" => "erfr", "category_description" => "efouweur"]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
