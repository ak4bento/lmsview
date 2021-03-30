<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{

    public function classroom()
    {
        return $this->belongsTo( 'App\Classroom', 'discussable_id' );
    }

    public function discussable()
    {
        return $this->morphTo();
    }

    public function replies()
    {
        return $this->hasMany( 'App\Discussion', 'reply_to' );
    }

    public function replyTo()
    {
        return $this->belongsTo( 'App\Discussion', 'reply_to' );
    }

    public function user()
    {
        return $this->belongsTo( 'App\User' );
    }

    public function scopeClassrooms( $query )
    {
        return $query->where( 'discussable_type', 'App\Classroom' );
    }

    public function scopeRoot( $query )
    {
        return $query->whereNull( 'reply_to' );
    }

    public function getMessageAttribute($message)
    {
        return clean( $message );
    }

}
