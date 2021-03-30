<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{

    use Sluggable, SoftDeletes;

    protected $dates = [
        'deleted_at',
    ];

    public function sluggable()
    {
        return [ 'slug' => [ 'source' => 'name' ] ];
    }

    public function parent()
    {
        return $this->belongsTo( 'App\Category', 'parent_id' );
    }

    public function children()
    {
        return $this->hasMany( 'App\Category', 'parent_id' );
    }

}
