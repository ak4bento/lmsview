<?php

namespace App\Quiz;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Quiz extends Model implements HasMedia
{

    use HasMediaTrait, SoftDeletes;

    protected $dates = [
        'deleted_at'
    ];

    public function createdBy() {
        return $this->belongsTo( 'App\User', 'created_by' );
    }

    public function files()
    {
        return $this->morphMany( 'Spatie\MediaLibrary\Models\Media', 'model' )->where( 'collection_name', 'files' );
    }

    public function questions()
    {
        return $this->belongsToMany( 'App\Quiz\Question' )->withTimestamps();
    }

    public function teachables()
    {
        return $this->morphMany( 'App\Teachable', 'teachable' );
    }

    public function questionQuizzes()
    {
        return $this->hasMany( 'App\Quiz\QuestionQuiz' );
    }

    public function randomizeQuestions()
    {
        $questions = $this->questions()->with( 'choiceItems' )->get();
        $questions = $questions->map( function ( $question )
        {
            if ( $question->choiceItems->count() > 0 )
                $question->choiceItems = $question->choiceItems->shuffle();
            return $question;
        } );

        return $questions;
    }

    public static function prepareSnapshot( Collection $questions)
    {
        $questionSnapshots = collect([]);
        $answerSnapshots = collect([]);

        $questions->each( function ( $question ) use ( $questionSnapshots, $answerSnapshots )
        {

            $questionArray = [
                'id' => str_random( 8 ),
                'type' => $question->question_type,
                'scoringMethod' => $question->scoring_method,
                'content' => $question->content,
            ];

            $answerArray = [
                'questionId' => $questionArray['id']                
            ];

            if ( $question->choiceItems->count() > 0 ) {
                $questionArray[ 'choiceItems' ] = collect([]);
                $question->choiceItems->each( function ( $choiceItem ) use ( $questionArray ) {
                    $questionArray[ 'choiceItems' ]->push([
                        'id' => str_random( 8 ),
                        'choiceText' => $choiceItem->choice_text,
                        'isCorrect' => $choiceItem->is_correct,
                    ]);
                } );
            }
            
            if ( $question->answers != null )
                $questionArray[ 'answers' ] = $question->answers;

            $questionSnapshots->push( $questionArray );
            $answerSnapshots->push( $answerArray );
        } );

        return [
            "questions" => $questionSnapshots ,
            "answers" => $answerSnapshots
        ];
    }

}
