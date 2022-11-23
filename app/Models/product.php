<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class product extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        "image",
        "product_name",
        "amount",
        "price",
        "category",
        "material",
        "origin",
        "product_description",
        "discount"
    ];
}
