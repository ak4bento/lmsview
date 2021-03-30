<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use App\JWPlayer\JWPlayer;
use Illuminate\Http\Request;

class JWPlayerController extends Controller
{

    public function links( Request $request ) {
        $this->validate( $request, [
            'videoId'  => 'required|string|size:8',
            'playerId'  => 'required|string|size:8',
        ] );

        $data = [
            'playerUrl' => JWPlayer::generateSignedUrl( 'library', [ 'id' => $request->playerId ] ),
            'videoUrl' => JWPlayer::generateSignedUrl( 'video', [ 'id' => $request->videoId ] ),
        ];

		return response()->json([ 'data' => $data ]);
    }

    public function index( Request $request ) {
        $params = JWPlayer::getDefaultAPIParams();
        $params->push( [ 'key' => 'search', 'value' => $request->term ] );
        $params->push( [ 'key' => 'tags', 'value' => env('JWPLAYER_TAGS', '' ) ] );
        $params->push( [ 'key' => 'api_signature', 'value' => JWPlayer::getSignature( $params ) ] );

        $client = new Client;
        $url = JWPlayer::$BASE_API_URL . 'videos/list?' . JWPlayer::intoQueryString( $params );
        try {
            $response = $client->get( $url );
            return response()->json( [ 'data' => json_decode( $response->getBody() )->videos ] );
        } catch ( \GuzzleHttp\Exception\ClientException $e ) {
            return response()->json( [ 'errors' => $e->getMessage() ], 500 );
        }
    }

}
