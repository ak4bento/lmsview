<?php

namespace App\Quiz;

use App\Grade;
use Validator;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{

    protected $dates = [
        'completed_at'
    ];

    public function grades()
    {
        return $this->morphMany( 'App\Grade', 'gradeable' );
    }

    public function teachableUser()
    {
        return $this->belongsTo( 'App\TeachableUser' );
    }

    public function answer( Collection $answer , $gradingMethod )
    {
        $answers = collect( json_decode( $this->answers ) );
        $question = collect( json_decode( $this->questions ) )->where( 'id', $answer[ 'questionId' ] )->first();
        
        // if ( $answers->where( 'questionId', $answer[ 'questionId' ] )->count() > 0 ) 
        //     return abort( 403, 'Re-answering Not Allowed' );
        
        if ( !$question ) return $this;

        // $currentAnswer = $answers->where( 'questionId', $answer[ 'questionId' ] )->first();
        
        $answerMethod = 'answer' . studly_case( str_replace( '-', ' ', $question->type ) );
        $newAnswers = $this->$answerMethod( $answer, $question , $gradingMethod );

        $key = array_search($newAnswers['questionId'], array_column($answers->toArray(), 'questionId'));
        
        $answers[$key] = $newAnswers;

        $this->answers = $answers->toJson();
        $this->save();
        return $this;
    }

    public function scoring( Collection $scores )
    {
        $answers = collect( json_decode( $this->answers) );
        $newAnswers = collect([]);
        foreach($answers as $answer) 
        {
            
            $answer->score = $scores->has($answer->questionId) ? 
                $scores[$answer->questionId] : (array_key_exists('score', $answer) ? $answer->score : 0);
            
            $newAnswers->push($answer);
        }
        $this->answers = $newAnswers->toJson();
        $this->save();

        return $this;
    }

    public function answerBoolean( Collection $answer, $question , $gradingMethod )
    {
        return $this->answerMultipleChoice( $answer, $question , $gradingMethod);
    }

    public function answerMultipleChoice( Collection $answer, $question , $gradingMethod )
    {
        $validator = Validator::make( $answer->all(), [
            'questionId' => 'required|size:8',
            'answerId' => 'required|size:8',
        ] );
        if ( $validator->fails() ) return null;

        $choiceItems = collect( $question->choiceItems );

        $key = array_search( $answer[ 'answerId' ], array_column($choiceItems->toArray(), 'id'));

        return [
            'questionId' => $answer[ 'questionId' ],
            'questionType' => $question->type,
            'score' => $choiceItems[$key]->isCorrect ? ($gradingMethod === 'weighted' ? $question->weight : 1) : 0 ,
            'answerId' => $answer[ 'answerId' ],
            'answeredAt' => \Carbon\Carbon::now(),
        ];
    }

    public function answerMultipleResponse( Collection $answer, $question )
    {
        $validator = Validator::make( $answer->all(), [
            'questionId' => 'required|size:8',
            'answers' => 'required|array',
        ] );
        if ( $validator->fails() ) return null;

        $correctAnswers = collect( $question->choiceItems )->filter( function( $choice ) {
            return $choice->isCorrect;
        } );
        $correctlyAnsweredCount = $correctAnswers->reduce( function ( $count, $correctAnswer ) use ( $answer ) {
            if ( collect( $answer[ 'answers' ] )->contains( $correctAnswer->id ) )
                return $count + 1;
            return $count;
        }, 0 );

        return [
            'questionId' => $answer[ 'questionId' ],
            'questionType' => $question->type,
            'score' => $correctAnswers->count() == $correctlyAnsweredCount ? 1 : 0,
            'answers' => $answer[ 'answers' ],
            'answeredAt' => \Carbon\Carbon::now(),
        ];
    }

    public function answerFillIn( Collection $answer, $question )
    {
        return $this->answerMultipleResponse( $answer, $question );
    }

    public function answerEssay( Collection $answer, $question )
    {
        $validator = Validator::make( $answer->all(), [
            'questionId' => 'required|size:8',
            'content' => 'required|string',
        ] );
        if ( $validator->fails() ) return null;

        return [
            'questionId' => $answer[ 'questionId' ],
            'questionType' => $question->type,
            'content' => $answer[ 'content' ],
            'answeredAt' => \Carbon\Carbon::now(),
        ];
    }

    public function complete()
    {
        $this->completed_at = \Carbon\Carbon::now();
        $this->save();

        if ( $this->isGradeCalculatable() ) {
            $grade = $this->grades()->first() ?: new Grade;
            $grade->grading_method = 'auto';
            $grade->grade = Grade::calculate( $this );
            $grade->comments = '';
            $grade->completed_at = $this->completed_at;

            $this->grades()->save( $grade );
        }

        return $this;
    }

    public function isAllowedToAnswer()
    {
        return $this->teachableUser->classroomUser->user_id == auth()->user()->id;
    }

    public function isGradeCalculatable()
    {
        $questions = collect( json_decode( $this->questions ) );
        $calculatable = true;
        $questions->each( function ( $question ) use ( $calculatable )
        {
            if ( !in_array( $question->type, [ 'multiple-choice', 'boolean', 'multiple-response' ] ) )
                $calculatable = false;
        } );
        return $calculatable;
    }

}
