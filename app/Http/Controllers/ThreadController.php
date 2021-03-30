<?php

namespace App\Http\Controllers;

use Validator;
use App\Thread;
use Illuminate\Http\Request;
use App\Transformers\ThreadTransformer;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'context' => 'required|in:classroom',
            'classroom' => 'required_if:context,classroom|exists:classrooms,slug',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        $includes = [];
        switch ( $request->context ) {
            case 'classroom':
                $classroom = \App\Classroom::where( 'slug', $request->classroom )->first();
                if ( !$classroom->isParticipating() ) return abort( 403, 'Unauthorized' );

                $threads = $classroom->teachables()->with( 'discussions' )->get()->reduce( function ( $aggregate, $discussable ) {
                    return $aggregate->push( new Thread( $discussable ) );
                }, collect([]) );
                $includes = [ 'teachable' ];
        }

        return fractal()
            ->collection( $threads )
            ->transformWith( new ThreadTransformer )
            ->parseIncludes( $includes )
            ->respond();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

}
