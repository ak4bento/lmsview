<?php

namespace App\Http\Controllers;

use Validator;
use App\ClassroomUser;
use Illuminate\Http\Request;
use App\Transformers\ClassroomUserTransformer;

class ClassroomUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'context'   => 'required|in:classroom,teachable',
            'classroom' => 'required_if:context,classroom|exists:classrooms,slug',
            'teachable' => 'required_if:context,teachable|exists:teachables,id',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        $includes = [ 'user' ];
        switch ( $request->context ) {
            case 'classroom':
                $classroom = \App\Classroom::where( 'slug', $request->classroom )
                    ->with( 'classroomUsers', 'classroomUsers.roles', 'classroomUsers.user.media' )
                    ->first();
                if (
                    !$classroom->isParticipating()
                    || !$classroom->selfClassroomUser->hasRole( 'teacher' )
                ) return abort( 403, 'Unauthorized' );

                $classroomUsers = $classroom->classroomUsers;
                break;
            case 'teachable':
                $classroomUsers = \App\Teachable::find( $request->teachable )->classroom
                    ->students()->with([ 'roles', 'user', 'user.media' ])->get();
                break;
        }

        return fractal()
            ->collection( $classroomUsers )
            ->transformWith( new ClassroomUserTransformer )
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ClassroomUser  $classroomUser
     * @return \Illuminate\Http\Response
     */
    public function show(ClassroomUser $classroomUser)
    {
        if ( !$classroomUser->classroom->isParticipating() )
            return abort( 403, 'Unauthorized' );
        if ( !$classroomUser->classroom->selfClassroomUser->hasRole( 'teacher' ) )
            return abort( 403, 'Unauthorized' );

        $classroomUser->load( 'classroom', 'classroom.teachables', 'user', 'teachableUsers' );

        return fractal()
            ->item( $classroomUser )
            ->transformWith( new ClassroomUserTransformer )
            ->parseIncludes([ 'classroom', 'classroom.teachables' , 'user', 'teachableUsers' ])
            ->respond();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ClassroomUser  $classroomUser
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ClassroomUser $classroomUser)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ClassroomUser  $classroomUser
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClassroomUser $classroomUser)
    {
        //
    }
}
