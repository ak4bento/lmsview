<?php

namespace App;

use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements HasMedia
{
    use HasMediaTrait, HasRoles, Notifiable, Sluggable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function changeRequests()
    {
        return $this->hasMany( 'App\ChangeRequest' );
    }

    public function classrooms()
    {
        return $this->belongsToMany( 'App\Classroom' );
    }

    public function categorizable()
    {
        return $this->belongsTo( 'App\Categorizable' , 'id', 'categorizable_id');
    }

    public function category()
    {
        return $this->morphToMany('App\Category', 'categorizable');
    }
    
    public function classroomUsers()
    {
        return $this->hasMany( 'App\ClassroomUser' );
    }

    public function students()
    {
        return $this->hasMany( 'App\ClassroomUser' )->role('student');
    }

    public function teachers()
    {
        return $this->hasMany( 'App\ClassroomUser' )->role('teacher');
    }

    public function getInitialsAttribute()
    {
        return implode( '', collect( explode( '-', str_slug( $this->name ) ) )
            ->map( function ( $nameFragment, $index ) {
                return $index < 2 ? strtoupper( substr( $nameFragment, 0, 1 ) ) : '';
            } )
            ->toArray()
        );
    }

    public function sluggable()
    {
        return [ 'username' => [ 'source' => [ 'name' ] , 'separator' => '.' ] ];
    }

}
