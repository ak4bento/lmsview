<?php

namespace App\Http\Controllers;

use Validator;
use App\Resource;
use App\Teachable;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $resource = Teachable::find($id)->teachable;
    
        return [
            "data" => $resource,
        ];
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make( $request->all(), [
            'title'                 => 'required|string',
            'description'           => 'required|string',
            'resourceType'          => 'required|in:jwvideo,youtubevide,audio,documents,url,linkvideo',
            'resourceTypeSettings'  => 'required|json',
            'resourceFile'          => 'required_if|resourceType, audio',
            'file'                  => 'file|max:51200',
        ] ); 

        if ( $validator->fails() ) return abort( 422, json_encode([ 'errors' => $validator->error() ]) );
        
        $resource = Resource::find($id);
        $resource->title = $request->title;
        $resource->description = $request->description;
        $resource->type = $request->resourceType;

        $data = json_decode( $request->resourceTypeSettings );

        switch ($request->resourceType) {
            case 'jwvideo':
                $data->playerId = env('JWPLAYER_PLAYER_KEY', '' );
                $resource->data = json_encode( $data );
                break;
            case 'youtubevideo':
            case 'url':
            case 'linkvideo':
                $resource->data = json_encode( $request->resourceTypeSettings );
                break;
            case 'audio':
                $resource->addMediaFromRequest( 'resourceFile' )->toMediaCollection( 'audio' );
                break;
        }
        
        if ($request->has('file')) {
            $resource->addMediaFromRequest('file')->toMediaCollection( 'files' );
        }
        
        if ($resource->save()) {
            return [
                "resource" => $resource,
            ];
        } else {
            return [
                "isSuccess" => false, 
            ];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
