<?php

use Faker\Generator as Faker;

$factory->define(App\Grade::class, function (Faker $faker) {
    $gradingMethods = [ 'manual', 'auto', 'auto-pending' ];
    $gradingMethod = $gradingMethods[ rand( 0, count( $gradingMethods ) - 1 ) ];
    $hasAutomaticGrades = in_array( $gradingMethod, [ 'auto', 'auto-pending' ] );

    $startedGradingAt = $faker->dateTimeBetween( '-6 months' );
    $hasBeenGraded = $faker->boolean || $hasAutomaticGrades;
    $grade = $hasBeenGraded ? $faker->randomFloat( 2, 50, 100 ) : 0;

    return [
        'grading_method' => $gradingMethod,
        'grade' => $grade,
        'comments' => $faker->boolean( 20 ) ? $faker->paragraph : '',
        'completed_at' =>
            $gradingMethod == 'auto' ? $startedGradingAt :
            ( $hasBeenGraded && $faker->boolean( 80 ) ? $faker->dateTimeBetween( $startedGradingAt ) : null ),

        'created_at' => $startedGradingAt,
        'updated_at' => $faker->dateTimeBetween( $startedGradingAt ),
    ];
});
