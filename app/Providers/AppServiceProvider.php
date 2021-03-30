<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{

    const MORPH_MAP = [
        'user'          => 'App\User',
        'classroomUser' => 'App\ClassroomUser',

        'classroom'     => 'App\Classroom',
        'teachable'     => 'App\Teachable',
        'teachableUser' => 'App\TeachableUser',

        'quiz'          => 'App\Quiz\Quiz',
        'quizAttempt'   => 'App\Quiz\QuizAttempt',
        'resource'      => 'App\Resource',
        'assignment'    => 'App\Assignment',
    ];

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap( AppServiceProvider::MORPH_MAP );
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
