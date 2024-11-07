<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, InteractsWithMedia;

    protected $fillable = [
        'username',
        'email',
        'password',
        'phonenumber',
        'gender',
        'remember_token',
        'role_as',
        "email_verified_at"
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['avatar'];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function reviews()
    {
        return $this->hasMany('App\Models\Review', 'user_id', 'id');
    }

    public function getAvatarAttribute()
    {
        return $this->getFirstMediaUrl("avatar");
    }

    // public function getJWTIdentifier()
    // {
    //     return $this->getKey();
    // }

    // public function getJWTCustomClaims()
    // {
    //     return [];
    // }
}
