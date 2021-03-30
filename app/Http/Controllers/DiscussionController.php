<?php

namespace App\Http\Controllers;

use App\Classroom;
use App\Teachable;
use App\Discussion;
use Illuminate\Http\Request;
use App\Transformers\DiscussionTransformer;

class DiscussionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $this->validate( $request, [
            'context'   => 'required|in:classroom,teachable',
            'classroom' => 'required_if:context,classroom|exists:classrooms,slug',
            'teachable' => 'required_if:context,teachable|exists:teachables,id',
        ] );

        switch( $request->context ) {
            case 'teachable':
                $teachable = Teachable::findOrFail( $request->teachable );
                $classroom = $teachable->classroom;
                $discussions = $teachable->discussions()->root()->with( 'user', 'replies', 'replies.user' )->get();
                break;
            case 'classroom':
                $classroom = Classroom::where( 'slug', $request->classroom )->firstOrFail();
                $discussions = $classroom->discussions()->root()->with( 'user', 'replies', 'replies.user' )->get();
        }

        if ( isset( $classroom ) )
            if ( !$classroom->isParticipating() ) return abort( 403 );

        return fractal()
            ->collection( $discussions )
            ->transformWith( new DiscussionTransformer )
            ->parseIncludes([ 'user', 'replies', 'replies.user' ])
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
        $this->validate( $request, [
            'context'   => 'required|in:classroom,teachable',
            'message'   => 'required|string',
            'classroom' => 'required_if:context,classroom|exists:classrooms,slug',
            'teachable' => 'required_if:context,teachable|exists:teachables,id',
            'replyTo'   => 'nullable|exists:discussions,id'
        ] );

        switch( $request->context ) {
            case 'teachable':
                $discussable = Teachable::findOrFail( $request->teachable );
                $classroom = $discussable->classroom;
                $discussionsQuery = $discussable->discussions();
                break;
            case 'classroom':
                $discussable = Classroom::where( 'slug', $request->classroom )->firstOrFail();
                $classroom = $discussable;
                $discussionsQuery = $discussable->discussions();
        }

        if ( isset( $classroom ) ) {
            if ( !$classroom->isParticipating() )
                return abort( 403 );
            if ( $request->replyTo ) {
                if ( $discussable->discussions()->root()->where( 'id', $request->replyTo )->count() == 0 ) {
                    return abort( 403 );
                }
            }
        }

        $discussion = new Discussion;
        $discussion->message = clean( $request->message );
        $discussion->user_id = auth()->user()->id;
        $discussion->reply_to = $request->replyTo;

        $discussionsQuery->save( $discussion );
        return $this->index( $request );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Discussion  $discussion
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Discussion $discussion)
    {
        //
    }

}
