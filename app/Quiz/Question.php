<?php

namespace App\Quiz;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{

    public function choiceItems()
    {
        return $this->hasMany( 'App\Quiz\QuestionChoiceItem' , 'question_id', 'id');
    }

    public function createdBy() {
        return $this->belongsTo( 'App\User', 'created_by' );
    }

    public function quizzes()
    {
        return $this->belongsToMany( 'App\Quiz\Quiz' )->withTimestamps();
    }

    public function questionQuizzes()
    {
        return $this->hasMany( 'App\Quiz\QuestionQuiz' );
    }

}
