<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class import_slip extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'supplier_id',
        'employee_id',
        'import_date',
        'total_price'
    ];
}
