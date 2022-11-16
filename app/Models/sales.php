<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class sales extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'salename',
        'percent',
        'end_date'
    ];
}
