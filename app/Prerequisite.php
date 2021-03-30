<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Prerequisite extends Pivot
{

    protected $table = 'prerequisites';

    public function requirable()
    {
        return $this->belongsTo( 'App\Teachable', 'requirable_id' );
    }

    public function teachable()
    {
        return $this->belongsTo( 'App\Teachable' );
    }

    public function createdBy()
    {
        return $this->belongsTo( 'App\User', 'created_by' );
    }

}
