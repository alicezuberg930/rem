<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $hidden = ['media'];

    protected $appends = ['photos'];

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
        $this->addMediaCollection('photos');
    }

    public function getPhotosAttribute()
    {
        $medias = $this->getMedia('photos');
        $requiredAttributes = [];
        foreach ($medias as $media) {
            $attributes = [
                "original_url" => $media->getFullUrl(),
                "file_name" => $media->file_name,
                "size" => $media->size,
                "human_readable_size" => $media->humanReadableSize,
                "mime_type" => $media->mime_type,
            ];
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

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";
        $query->where(function ($query) use ($term) {
            $query->where("name", "like", $term);
        });
    }

    public function formatPrice()
    {
        return number_format($this->price, 0, '.');
    }
}
