<?php

namespace App;

use Validator;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;
use Illuminate\Support\Facades\DB;

class Resource extends Model implements HasMedia
{

    use HasMediaTrait, SoftDeletes;

    protected $primaryKey = 'id';
    public $incrementing = true;
    
    protected $dates = [
        'deleted_at'
    ];

    public function files()
    {
        return $this->morphMany( 'Spatie\MediaLibrary\Models\Media', 'model' )->where( 'collection_name', 'files' );
    }

    public static function makeFromTeachableRequest( $request ) {

        $validator = Validator::make( $request->all(), [
            'title'                 => 'required|string',
            'description'           => 'nullable|string',
            'resourceType'          => 'required|in:jwvideo,youtubevideo,audio,documents,url,linkvideo',
            'resourceTypeSettings'  => 'required|json',
            'resourceFile'          => 'required_if:resourceType,audio|max:51200',
            'files'                 => 'required_if:resourceType,documents',
            'files.*'               => 'file|max:51200',
        ] );
        if ( $validator->fails() ) return abort( 422, json_encode([ 
            'errors' => $validator->errors() ]) 
        );

        $data = json_decode( $request->resourceTypeSettings );

        if ( $request->resourceType == 'jwvideo' )
            $data->playerId = env( 'JWPLAYER_PLAYER_KEY', '' );

        $teachableItem = new Resource;
        $teachableItem->title = $request->title;
        $teachableItem->description = $request->description;
        $teachableItem->type = $request->resourceType;
        $teachableItem->data = json_encode( $data );

        $teachableItem->created_by = auth()->user()->id;
        $teachableItem->save();

        if ( $request->resourceType == 'audio' )
            $teachableItem->addMedia( $request->file( 'resourceFile' ) )->toMediaCollection( 'audio' );
        if ( $request->has( 'files' ) )
            $teachableItem->addMultipleMediaFromRequest([ 'files' ])->each( function( $file ) {
                $file->toMediaCollection( 'files' );
            } );
        
        //temporary solution, select based on data input to get id from teachable item
        return Resource::where([
            "title" => $teachableItem->title ,
            "description" => $teachableItem->description ,
            "type" => $teachableItem->type ,
            "data" => $teachableItem->data ,
            "created_by" => $teachableItem->created_by
        ])->first();
    }

}
