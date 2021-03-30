<?php

namespace App;

use App\Quiz\QuizAttempt;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{

    protected $dates = [
        'completed_at'
    ];

    public function gradedBy()
    {
        return $this->belongsTo( 'App\User', 'graded_by' );
    }

    public function teachableUser()
    {
        return $this->belongsTo( 'App\TeachableUser' );
    }

    public static function calculate( QuizAttempt $quizAttempt )
    {
        $questions = collect( json_decode( $quizAttempt->questions ) );
        $answers = collect( json_decode( $quizAttempt->answers ) );

        $aggregate = $questions->reduce( function ( $aggregate, $question ) use ( $answers ) {
            $answer = $answers->filter( function ( $answer ) use ( $question ) {
                return $answer->questionId == $question->id;
            } )->first();
            if ( isset( $answer->score ) )
                return $aggregate + $answer->score;
            else {
                switch ( $question->type ) {
                    case 'multiple-choice':
                    case 'boolean':
                        $correctAnswer = collect( $question->choiceItems )->filter( function( $choice ) {
                            return $choice->isCorrect;
                        } )->first();
                        if ( !$correctAnswer ) return $aggregate;
                        if ( $correctAnswer->id == $answer->answerId )
                            return $aggregate + 1;
                        break;
                    case 'multiple-response':
                        $correctAnswers = collect( $question->choiceItems )->filter( function( $choice ) {
                            return $choice->isCorrect;
                        } );
                        $correctlyAnsweredCount = $correctAnswers->reduce( function ( $count, $correctAnswer ) use ( $answer ) {
                            if ( collect( $answer->answers )->contains( $correctAnswer->id ) )
                                return $count + 1;
                            return $count;
                        }, 0 );
                        if ( $correctAnswers->count() == $correctlyAnsweredCount )
                            return $aggregate + 1;
                        break;
                    case 'fill-in':
                        $correctAnswers = json_decode( $question->answers );
                        if ( count( $answer->answers ) != count( $correctAnswers ) )
                            return $aggregate;
                        $correctlyAnsweredCount = 0;
                        foreach ( $correctAnswers as $index => $correctAnswer ) {
                            if ( strtolower( $correctAnswer ) == strtolower( $answer->answers[ $index ] ) )
                                $correctlyAnsweredCount = $correctlyAnsweredCount + 1;
                        }
                        return $aggregate + ( $correctlyAnsweredCount / count( $correctAnswers ) );
                }
                return $aggregate;
            }
        }, 0 );
        return round( ( $aggregate / $questions->count() ) * 100, 2 );
    }

    public function complete( $completedAt = null )
    {
        if ( $this->completed_at != null )
            return $this;

        $this->completed_at = $completedAt ? \Carbon\Carbon::parse( $completedAt ) : \Carbon\Carbon::now();
        $this->save();

        return $this;
    }

}
