<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class import_slip_details extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'import_slip_id',
        'product_id',
        'import_quantity',
        'import_price'
    ];
}
