<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class product extends Model
{
    use HasFactory;
    protected $fillable = [
        "image",
        "name",
        "amount",
        "price",
        "category",
        "material",
        "origin",
        "description",
        "discount"
    ];
}
