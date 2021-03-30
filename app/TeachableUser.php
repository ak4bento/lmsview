<?php

namespace App;

use Carbon\Carbon;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TeachableUser extends Pivot implements HasMedia
{

    use HasMediaTrait;

    protected $dates = [
        'completed_at'
    ];

    public function classroomUser()
    {
        return $this->belongsTo( 'App\ClassroomUser' );
    }

    public function grades()
    {
        return $this->morphMany( 'App\Grade', 'gradeable' );
    }

    public function media()
    {
        return $this->morphMany( 'Spatie\MediaLibrary\Models\Media', 'model' );
    }

    public function quizAttempts()
    {
        return $this->hasMany( 'App\Quiz\QuizAttempt', 'teachable_user_id' )->orderBy( 'attempt', 'desc' );
    }

    public function teachable()
    {
        return $this->belongsTo( 'App\Teachable' );
    }

    public function complete( $completedAt = null )
    {
        if ( $this->completed_at != null )
            return $this;

        $this->completed_at = $completedAt ? Carbon::parse( $completedAt ) : Carbon::now();
        $this->save();

        return $this;
    }

}
