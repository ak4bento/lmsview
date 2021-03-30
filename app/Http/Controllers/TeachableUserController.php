<?php

namespace App\Http\Controllers;

use Validator;
use App\TeachableUser;
use Illuminate\Http\Request;
use App\Transformers\TeachableUserTransformer;

class TeachableUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'context' => 'required|in:classroomUser,teachable',
            'teachable' => 'required_if:context,teachable|exists:teachables,id',
            'classroomUser' => 'required_if:context,classroomUser|exists:classroom_user,id',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        $includes = [];
        switch( $request->context ) {
            case 'teachable':
                $includes = array_merge( $includes, [ 
                    'quizAttempts', 
                    'quizAttempts.questions', 
                    'quizAttempts.questions.choiceItems', 
                    'quizAttempts.answers', 
                    'quizAttempts.grade' ,
                    'classroomUser' , 
                ] );

                $teachableUsers = \App\Teachable::find( $request->teachable )->teachableUsers()->with([ 'quizAttempts', 'classroomUser' ])->get();
                break;
            case 'classroomUser':
                $includes = array_merge( $includes, [ 'teachable', 'teachable.teachableItem' ] );
                $teachableUsers = \App\ClassroomUser::find( $request->classroomUser )->teachableUsers()->with([ 'teachable', 'teachable.teachable' ])->get();
        }

        return fractal()
            ->collection( $teachableUsers )
            ->transformWith( new TeachableUserTransformer )
            ->parseIncludes( $includes )
            ->respond();       
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make( $request->all(), [
            'teachable' => 'required|exists:teachables,id',
            'classroom' => 'required|exists:classrooms,slug',
        ] );

        $classroom = \App\Classroom::where( 'slug', $request->classroom )->first();
        $participatingUser = $classroom->selfClassroomUser;
        if ( $participatingUser->hasRole('teacher') ) return abort( 403, 'Unauthorized' );
        if ( !$participatingUser ) return abort( 403, 'Unauthorized' );

        $teachable = $classroom->teachables()->findOrFail( $request->teachable );
        if ( $teachableUser = $participatingUser->teachableUsers()->where( 'teachable_id', $teachable->id )->first() )
            return $this->show( $teachableUser );

        $teachableUser = new TeachableUser;
        $teachableUser->teachable_id = $teachable->id;
        $teachableUser->classroom_user_id = $participatingUser->id;
        $teachableUser->save();

        return $this->show( $teachableUser );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\TeachableUser  $teachableUser
     * @return \Illuminate\Http\Response
     */
    public function show( TeachableUser $teachableUser )
    {
        $teachableUser->load(
            'media',
            'grades',
            'grades.gradedBy',
            'teachable.classroom',
            'teachable.createdBy',
            'teachable.teachable',
            'teachable.teachable.media'
        );
        
        return fractal()
            ->item( $teachableUser )
            ->transformWith( new TeachableUserTransformer )
            ->parseIncludes([
                'media',
                'teachable',
                'grade.gradedBy',
                'teachable.classroom',
                'teachable.createdBy',
                'teachable.teachableItem',
                'teachable.teachableItem.media',
            ])
            ->respond();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\TeachableUser  $teachableUser
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TeachableUser $teachableUser)
    {
        $teachableUser->load( 'teachable' );
        if ( !$teachableUser->teachable->classroom->isParticipating() )
            return abort( 403, 'Unauthorized' );

        $this->validate( $request, [
            'context' => 'required|in:completion,submission',
            'submissionFile' => 'required_if:context,submission|file|max:51200',
        ] );

        switch ( $request->context ) {
            case 'completion':
                if ( $teachableUser->teachable->teachable_type !== 'resource' )
                    return abort( 422 );
                $teachableUser->complete();
                break;
            case 'submission':
                if ( $teachableUser->teachable->teachable_type !== 'assignment' )
                    return abort( 422 );
                $teachableUser->clearMediaCollection( 'submission' );
                $teachableUser->addMedia( $request->submissionFile )->toMediaCollection( 'submission' );
                $teachableUser->complete();
                break;
        }

        return $this->show( $teachableUser );

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\TeachableUser  $teachableUser
     * @return \Illuminate\Http\Response
     */
    public function destroy(TeachableUser $teachableUser)
    {
        //
    }
}
