<?php

namespace App\Quiz;

use Illuminate\Database\Eloquent\Model;

class QuestionChoiceItem extends Model
{
    protected $fillable = [
        'choice_text', 'is_correct'
    ];

    public function question()
    {
        return $this->belongsTo( 'App\Quiz\Question' );
    }

}
