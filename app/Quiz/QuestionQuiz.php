<?php

namespace App\Quiz;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Model;

class QuestionQuiz extends Pivot
{
    public function quiz()
    {
        return $this->belongsTo( 'App\Quiz\Quiz' );
    }

    public function question()
    {
        return $this->belongsTo( 'App\Quiz\Question' );
    }

}
