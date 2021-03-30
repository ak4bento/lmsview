<?php

namespace App\Http\Controllers;

use Validator;
use App\Classroom;
use App\Resource;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\Models\Media;
use App\Transformers\MediaTransformer;
use App\Transformers\ClassroomFileTransformer;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $this->validate( $request, [
            'context' => 'required|in:classroom',
            'classroom' => 'required_if:context,classroom|exists:classrooms,slug',
            'collection' => 'nullable|string',
        ] );
        $includes = [];

        switch ( $request->context ) {
            case 'classroom':
                $classroom = Classroom::where( 'slug', $request->classroom )->firstOrFail();
                if ( !$classroom->isParticipating() ) return abort( 403 );
                $classroom->load( 'teachables' );
                $resources = $classroom->teachables->where( 'teachable_type', 'resource' );
                $assignments = $classroom->teachables->where( 'teachable_type', 'assignment' );

                $media =
                    Media::where( function ( $query ) use ( $classroom ) {
                        $query->where( 'model_type', 'classroom' )->where( 'model_id', $classroom->id );
                    } )->orWhere( function ( $query ) use ( $resources ) {
                        $query->where( 'model_type', 'resource' )->whereIn( 'model_id', $resources->map( function ( $resource ) {
                            return $resource->teachable_id;
                        } )->all() );
                    } )->orWhere( function ( $query ) use ( $assignments ) {
                        $query->where( 'model_type', 'assignment' )->whereIn( 'model_id', $assignments->map( function ( $assignment ) {
                            return $assignment->teachable_id;
                        } )->all() );
                    } )->with( 'model' )->get();
                $includes = [ 'model' ];
                break;
        }

        return fractal()
            ->collection( $media )
            ->transformWith( new MediaTransformer )
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
            'context'       => 'required|in:classroom',
            'classroom'     => 'required_if:context,classroom|exists:classrooms,slug',
            'collection'    => 'nullable|string',
            'files'         => 'required',
            'files.*'       => 'file|max:51200',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        switch( $request->context ) {
            case 'classroom':
                $forModel = \App\Classroom::whereSlug( $request->classroom )->first();
                $uploader = $forModel->selfClassroomUser;
                if ( !$uploader ) return abort( 403, 'Unauthorized' );
                if ( !$uploader->hasRole( 'teacher' ) ) return abort( 403, 'Unauthorized' );
                break;
        }

        $forModel->addMultipleMediaFromRequest([ 'files' ])->each( function( $file ) use ( $request ) {
            $file->toMediaCollection( $request->collection ?: 'files' );
        } );
        return $this->index( $request );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Spatie\MediaLibrary\Models\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $media = Media::where('collection_name', 'files')->get();
        return $media;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Spatie\MediaLibrary\Models\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Media $media)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Spatie\MediaLibrary\Models\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $media = Media::find($id);
        $media->forceDelete();
    }
}
