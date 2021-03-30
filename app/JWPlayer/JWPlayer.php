<?php

namespace App\JWPlayer;

class JWPlayer
{

  public static $BASE_API_URL = 'http://api.jwplatform.com/v1/';
  public static $BASE_CONTENT_URL = 'https://content.jwplatform.com';

  public static function getDefaultAPIParams() {
    return collect([
      [ 'key' => 'api_format', 'value' => 'json' ],
      [ 'key' => 'api_key', 'value'  => env( 'JWPLAYER_KEY', '' ) ],
      [ 'key' => 'api_nonce', 'value'  => rand( 10000000, 99999999 ) ],
      [ 'key' => 'api_timestamp', 'value'  => time() ],
    ]);
  }

  public static function getSignature( $params ) {
    return sha1( JWPlayer::intoQueryString( $params->sortBy( 'key' )->values() ) . env( 'JWPLAYER_SECRET', '' ) );
  }

  public static function intoQueryString( $params ) {
    return $params->reduce( function ( $string, $param ) {
      return $string . ( $string != '' ? '&' : '' ) . $param[ 'key' ] . '=' . $param[ 'value' ];
    }, '' );
  }

  public static function generateSignedUrl( $type, $params )
  {
    if ( !in_array( $type, [ 'video', 'library', 'api' ] ) )
      return abort( 500 );

    $function = 'generate' . studly_case( $type ) . 'Url';
    return JWPlayer::$function( $params );
  }

  public static function generateVideoUrl( $params )
  {
    $secret = env( 'JWPLAYER_SECRET', '' );
    $expires = round( ( time() + 3600 ) / 300 ) * 300;
    $path = 'manifests/' . $params[ 'id' ] . '.m3u8';
    $signature = md5( $path . ':' . $expires . ':' . $secret );

    return JWPlayer::$BASE_CONTENT_URL . '/' . $path . "?sig=" . $signature . "&exp=" . $expires;
  }

  public static function generateLibraryUrl( $params )
  {
    $secret = env( 'JWPLAYER_SECRET', '' );
    $expires = round( ( time() + 3600 ) / 300 ) * 300;
    $path = 'libraries/' . $params[ 'id' ] . '.js';
    $signature = md5( $path . ':' . $expires . ':' . $secret );

    return JWPlayer::$BASE_CONTENT_URL . '/' . $path . "?sig=" . $signature . "&exp=" . $expires;
  }

}
