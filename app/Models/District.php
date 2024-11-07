<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $with = ["province"];

    public function province()
    {
        return $this->belongsTo('App\Models\Province', 'province_code', 'code');
    }
}
