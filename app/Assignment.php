<?php

namespace App;

use Validator;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Assignment extends Model implements HasMedia
{

    use HasMediaTrait, SoftDeletes;

    protected $dates = [
        'deleted_at'
    ];

    public function files()
    {
        return $this->morphMany( 'Spatie\MediaLibrary\Models\Media', 'model' )->where( 'collection_name', 'files' );
    }

    public static function makeFromTeachableRequest( $request )
    {
        $validator = Validator::make( $request->all(), [
            'title'         => 'required|string',
            'description'   => 'nullable|string',
        ] );
        if ( $validator->fails() ) return abort( 422, json_encode([ 'errors' => $validator->errors() ]) );

        $assignment = new Assignment;
        $assignment->title = $request->title;
        $assignment->description = $request->description;
        $assignment->created_by = auth()->user()->id;
        $assignment->save();

        return $assignment;
    }

}
