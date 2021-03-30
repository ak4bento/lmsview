<?php

namespace App\Http\Controllers;

use Validator;
use App\Quiz\Quiz;
use App\Teachable;
use App\Quiz\QuizAttempt;
use Illuminate\Http\Request;
use App\Transformers\QuizAttemptTransformer;
use App\Transformers\QuestionSnapshotTransformer;

class QuizAttemptController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'context' => 'required|in:teachableUser,teachable',
            'teachableUser' => 'required_if:context,teachableUser|exists:teachable_user,id'
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        switch ($request->context) {
            case 'teachableUser':
                $quizAttempts = \App\TeachableUser::find( $request->teachableUser )->quizAttempts()->with(['grades'])->get();
        }

        return fractal()
            ->collection( $quizAttempts )
            ->transformWith( new QuizAttemptTransformer )
            ->parseIncludes([ 'grades', 'answers', 'questions', 'questions.choiceItems' ])
            ->respond();
    }

    /**
     * Attempt a quiz.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make( $request->all(), [
            'teachable' => 'required|exists:teachables,id'
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        $teachable = Teachable::findOrFail( $request->teachable );
        $forClassroom = $teachable->classroom;
        if ( !$forClassroom->isParticipating() )
            return abort( 403, 'Unauthorized' );
        $forClassroomUser = $teachable->classroom->classroomUsers()->whereUserId( auth()->user()->id )->firstOrFail();

        $forTeachableUser = $teachable->teachableUsers()->where( 'classroom_user_id', $forClassroomUser->id )->firstOrFail();
        $previousAttempts = $forTeachableUser->quizAttempts;

        $unfinishedAttempt = $previousAttempts->whereStrict( 'completed_at', null )->first();
        $quizAttempt = $unfinishedAttempt ?: new QuizAttempt;

        if ( !$unfinishedAttempt ) {
            $snapshot = Quiz::prepareSnapshot( $forTeachableUser->teachable->teachable->randomizeQuestions() );
            $quizAttempt->teachable_user_id = $forTeachableUser->id;
            $quizAttempt->questions = $snapshot['questions']->toJson();
            $quizAttempt->answers =  $snapshot['answers']->toJson();
        }
        $quizAttempt->attempt = $unfinishedAttempt ? $unfinishedAttempt->attempt : $previousAttempts->max( 'attempt' ) + 1;
        $quizAttempt->save();
        return $this->show( $quizAttempt );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\QuizAttempt  $quizAttempt
     * @return \Illuminate\Http\Response
     */
    public function show( QuizAttempt $quizAttempt )
    {
        return fractal()
            ->item( $quizAttempt )
            ->transformWith( new QuizAttemptTransformer )
            ->parseIncludes([ 'answers', 'questions', 'questions.choiceItems' ])
            ->respond();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\QuizAttempt  $quizAttempt
     * @return \Illuminate\Http\Response
     */
    public function update( Request $request, QuizAttempt $quizAttempt )
    {
        $validator = Validator::make( $request->all(), [
            'context' => 'required|in:answer,complete,scoring',
            'answer' => 'required_if:context,answer',
            'answer.questionId' => 'required_if:context,answer',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        switch ($request->context) {
            case 'answer':
                if ( !$quizAttempt->isAllowedToAnswer() )
                    return abort( 403, 'Unauthorized' );
                $quizAttempt = $quizAttempt->answer( collect( $request->answer ) , $quizAttempt->grading_method );
                break;
            case 'scoring':
                $quizAttempt = $quizAttempt->scoring( collect($request->scores) );
                break;
            case 'complete':
                $quizAttempt->complete();
                $quizAttempt->teachableUser->complete();
                return response()->json('success');
        }

        return $this->show( $quizAttempt );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\QuizAttempt  $quizAttempt
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuizAttempt $quizAttempt)
    {
        //
    }
}
