<?php

use Faker\Generator as Faker;

$factory->define(App\Quiz\Question::class, function (Faker $faker) {
    $questionTypes = collect([ 'multiple-choice', 'boolean' ]);
    return [
        'question_type' => $questionTypes->random(),
        'content' => $faker->paragraph
    ];
});
