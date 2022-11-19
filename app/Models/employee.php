<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class employee extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'username',
        'phonenumber',
        'email',
        'gender',
        'password',
        'role_as'
    ];
}
