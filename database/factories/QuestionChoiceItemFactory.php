<?php

use Faker\Generator as Faker;

$factory->define(App\Quiz\QuestionChoiceItem::class, function (Faker $faker) {
    return [
        'choice_text' => $faker->sentence,
    ];
});
