<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChangeRequest extends Model
{

    protected $dates = [
        'confirmed_at'
    ];

    public function user()
    {
        return $this->belongsTo( 'App\User' );
    }

    public function setInitiatorDataAttribute( $value )
    {
        $this->attributes[ 'initiator_data' ] = json_encode( $value );
    }

}
