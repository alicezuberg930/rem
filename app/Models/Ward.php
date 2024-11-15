<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    protected $with = ["district"];

    public function district()
    {
        return $this->belongsTo('App\Models\District', 'district_code', 'code');
    }
}
