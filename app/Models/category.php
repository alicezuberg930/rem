<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Category extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    public $timestamps = false;

    protected $fillable = [
        "category_name",
        "category_description"
    ];

    // protected $appends = ['avatar'];

    // public function registerMediaCollections(): void
    // {
    //     $this->addMediaCollection('avatar')
    //         ->useFallbackUrl(asset('image/assets/') . '/black-fire-logo.png');
    // }

    // public function getAvatarAttribute()
    // {
    //     return $this->getFirstMediaUrl('avatar');
    // }
}
