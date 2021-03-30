<?php

use Faker\Generator as Faker;

$factory->define( App\Assignment::class, function ( Faker $faker ) {
    return [
        'title' => title_case( $faker->words( rand( 1, 7 ), true ) ),
        'description' => $faker->paragraph,
    ];
});
$factory->define( App\Quiz\Quiz::class, function ( Faker $faker ) {
    return [
        'grading_method' => collect([ 'standard', 'weighted' ])->random(),
        'title' => title_case( $faker->words( rand( 1, 7 ), true ) ),
        'description' => $faker->paragraph,
    ];
});
$factory->define( App\Resource::class, function ( Faker $faker ) {
    $type = collect([ 'url', 'jwvideo', 'youtubevideo', 'audio', 'documents' ])->random();
    switch ($type) {
        case 'url': $data = [ 'url' => $faker->url ]; break;
        case 'html': $data = [ 'htmlContent' => $faker->randomHtml( 2, 3 ) ]; break;
        default: $data = [];
    }
    return [
        'title' => title_case( $faker->words( rand( 1, 7 ), true ) ),
        'description' => $faker->paragraph,
        'type' => $type,
        'data' => json_encode( $data ),
    ];
});
