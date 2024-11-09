<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements HasMedia, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, InteractsWithMedia, CanResetPassword;

    public static $roles = ["SELLER" => 1, "BUYER" => 2, "ADMIN" => 3,];

    protected $fillable = [
        'username',
        'email',
        'password',
        'phone',
        'gender',
        'remember_token',
        'role_id',
        "email_verified_at"
    ];

    protected $hidden = ['password', 'remember_token',];

    protected $appends = ['avatar'];

    protected $casts = ['email_verified_at' => 'datetime',];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->useFallbackPath(public_path('/assets/default_avatar.jpg'));
    }

    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }

    public function reviews()
    {
        return $this->hasMany('App\Models\Review', 'user_id', 'id');
    }

    public function getAvatarAttribute()
    {
        return $this->getFirstMediaUrl('avatar');
    }
}
