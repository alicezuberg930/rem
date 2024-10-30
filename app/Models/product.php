<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    // protected $hidden = ['media'];

    protected $appends = ['medias'];

    protected $fillable = [
        "name",
        "description",
        "category_id",
        "sale_id",
        "origin",
        "material",
        "price",
        "amount"
    ];

    protected $with = ['category', 'sale'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('medias');
    }

    public function getMediasAttribute()
    {
        $medias = $this->getMedia('medias');
        $requiredAttributes = [];
        foreach ($medias as $media) {
            $attributes = array(
                "original_url" => $media->getFullUrl(),
                "file_name" => $media->file_name,
                "size" => $media->size,
                "human_readable_size" => $media->human_readable_size,
                "mime_type" => $media->mime_type,
            );
            array_push($requiredAttributes, $attributes);
        }
        return $requiredAttributes;
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category', 'category_id', 'id');
    }

    public function sale()
    {
        return $this->belongsTo('App\Models\Sale', 'sale_id', 'id');
    }
}
