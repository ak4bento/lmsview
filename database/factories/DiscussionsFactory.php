<?php

use Faker\Generator as Faker;

$factory->define(App\Discussion::class, function (Faker $faker) {
    return [
        'message' => $faker->paragraph( rand( 1, 15 ) ),
    ];
});
