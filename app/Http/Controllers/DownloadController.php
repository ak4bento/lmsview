<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\MediaLibrary\Models\Media;

class DownloadController extends Controller
{

    public function index( Request $request, Media $media )
    {
        switch ( $media->model_type ) {
            case 'classroom':
                if ( !$media->model->isParticipating() ) abort( 403, 'Unauthorized' );
                break;
        }

        return $request->inBrowser ?
            response()->file( $media->getPath() ) :
            response()->download( $media->getPath() );
    }

}
