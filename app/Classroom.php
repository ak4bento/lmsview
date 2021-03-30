<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Classroom extends Model implements HasMedia
{

    use HasMediaTrait, Sluggable, SoftDeletes;

    protected $dates = [
        'deleted_at',
    ];

    protected $with = [
        'subject', 'teachingPeriod',
    ];

    public function sluggable()
    {
        return [ 'slug' => [ 'source' => [ 'code', 'title', 'teachingPeriod.name' ] ] ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function categories()
    {
        return $this->morphToMany( 'App\Category', 'categorizable' )->withTimestamps();
    }

    public function classroomUsers()
    {
        return $this->hasMany( 'App\ClassroomUser' );
    }

    public function createdBy() {
        return $this->belongsTo( 'App\User', 'created_by' );
    }

    public function discussions()
    {
        return $this->morphMany( 'App\Discussion', 'discussable' )->orderBy( 'created_at', 'desc' );
    }

    public function files()
    {
        return $this->morphMany( 'Spatie\MediaLibrary\Models\Media', 'model' )->where( 'collection_name', 'files' );
    }

    public function media()
    {
        return $this->morphMany( 'Spatie\MediaLibrary\Models\Media', 'model' );
    }

    public function selfClassroomUser()
    {   
        return $this->hasOne( 'App\ClassroomUser' )->where( 'user_id', auth()->user()->id );
    }

    public function students()
    {
        return $this->hasMany( 'App\ClassroomUser' )->role( 'student' );
    }

    public function subject()
    {
        return $this->belongsTo( 'App\Subject', 'subject_id', 'id' );
    }

    public function teachables()
    {
        return $this->hasMany( 'App\Teachable' )->available()->orderBy( 'order' );
    }

    public function teachers()
    {
        return $this->hasMany( 'App\ClassroomUser' )->role( 'teacher' );
    }

    public function teachingPeriod()
    {
        return $this->belongsTo( 'App\TeachingPeriod', 'teaching_period_id', 'id' );
    }

    public function getCodeAttribute($value)
    {
        return $value ?: $this->subject->code;
    }

    public function getDescriptionAttribute($value)
    {
        return $value ?: $this->subject->description;
    }

    public function getTitleAttribute($value)
    {
        return $value ?: $this->subject->title;
    }

    public function isParticipating()
    {
        return $this->selfClassroomUser !== null;
    }

    public function abortIfNotParticipating()
    {
        if ( !$this->isParticipating() ) return abort( 403, 'Unauthorized' );
    }

    public function getTotalStudentsAttribute()
    {
        return $this->hasMany('App\ClassroomUser')->role( 'student' )->count();

    }

}
