<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Teachable extends Model implements HasMedia
{

    use HasMediaTrait, SoftDeletes;

    protected $dates = [
        'available_at', 'expires_at', 'deleted_at'
    ];

    public function classroom()
    {
        return $this->belongsTo( 'App\Classroom' );
    }

    public function discussions()
    {
        return $this->morphMany( 'App\Discussion', 'discussable' );
    }

    public function prerequisites()
    {
        return $this->hasMany( 'App\Prerequisite' );
    }

    public function selfTeachableUser()
    {
        $selfClassroomUsers = auth()->user()->classroomUsers;
        return $this->hasOne( 'App\TeachableUser' )->whereIn( 'classroom_user_id', $selfClassroomUsers->pluck( 'id' ) );
    }

    public function teachable()
    {
        return $this->morphTo();
    }

    public function teachableUsers()
    {
        return $this->hasMany( 'App\TeachableUser' );
    }

    public function users()
    {
        return $this->belongsToMany( 'App\User', 'teachable_user' )->withTimestamps();
    }

    public function createdBy()
    {
        return $this->belongsTo( 'App\User', 'created_by' );
    }

    public function scopeAvailable($query)
    {
        // return $query
        //     ->where( function ( $query ) {
        //         $query->where( 'available_at', '<=', Carbon::now() )
        //             ->orWhereNull( 'available_at' );
        //     } );
    }

    public function scopeQuizzes($query)
    {
        return $query->where( 'teachable_type', 'quiz' );
    }

}
