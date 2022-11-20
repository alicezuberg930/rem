<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class supplier extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'supplier_name',
        'address',
        'phone_number'
    ];
}
