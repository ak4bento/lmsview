<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{

    use SoftDeletes, Sluggable;

    protected $dates = [
        'deleted_at',
    ];

    public function category()
    {
        return $this->belongsTo( 'App\Category', 'default_category_id' );
    }

    public function sluggable()
    {
        return [ 'slug' => [ 'source' => [ 'code', 'title' ] ] ];
    }

    public function classrooms()
    {
        return $this->hasMany( 'App\Classroom' );
    }

}
