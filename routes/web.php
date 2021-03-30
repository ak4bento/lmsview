<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

// Route::name('login')->get('login', 'Auth\LoginController@login');
// Route::name('logout')->get('logout', 'Auth\LoginController@logout');
// Route::name('logout')->post('logout', 'Auth\LoginController@logout');
// Route::get('/auth/sso/{token}', 'Auth\LoginController@doSSO');

Route::group([ 'middleware' => 'auth' ], function () {

    Route::group([ 'prefix' => 'start', 'middleware' => 'role:admin' ], function () {
        Route::resource( 'quizzes', 'Start\QuizController' )->names([
            'index' => 'start.quizzes.index',
            'create' => 'start.quizzes.create',
            'store' => 'start.quizzes.store',
            'show' => 'start.quizzes.show',
            'edit' => 'start.quizzes.edit',
            'update' => 'start.quizzes.update',
            'destroy' => 'start.quizzes.destroy',
        ]);
        Route::resource( 'questions', 'Start\QuestionController' )->names([
            'index' => 'start.questions.index',
            'create' => 'start.questions.create',
            'store' => 'start.questions.store',
            'show' => 'start.questions.show',
            'edit' => 'start.questions.edit',
            'update' => 'start.questions.update',
            'destroy' => 'start.questions.destroy',
        ]);
    });

    Route::group([ 'prefix' => 'rest' ], function () {

        Route::resource( '/media', 'MediaController' )->only([ 'index', 'store', 'destroy', 'show']);
        Route::resource( '/threads', 'ThreadController' )->only([ 'index' ]);
        Route::resource( '/profile', 'ProfileController' )->only([ 'index', 'store' ]);
        Route::resource( '/category', 'CategoryController' )->only(['index', 'show', 'store', 'update', 'destroy']);
        Route::resource( '/classrooms', 'ClassroomController' )->only([ 'index', 'show', 'update' ]);
        Route::resource( '/assignment', 'AssignmentController' )->only([ 'show', 'update' ]);
        Route::resource( '/resource', 'ResourceController' )->only([ 'show', 'update' ]);
        Route::resource( '/teachables', 'TeachableController' )->only([ 'index', 'store', 'show', 'update', 'destroy' ]);
        Route::resource( '/discussions', 'DiscussionController' )->only([ 'index', 'store' ]);
        Route::resource( '/quizzes', 'QuizController')->only(['index', 'update', 'store']);
        Route::resource( '/questions', 'QuestionController')->only(['show', 'update', 'store']);
        Route::resource( '/quiz-attempts', 'QuizAttemptController' )->only([ 'index', 'store', 'update' ]);
        Route::resource( '/change-request', 'ChangeRequestController' )->only([ 'store', 'show' ]);
        Route::resource( '/classroom-users', 'ClassroomUserController' )->only([ 'index', 'show' ]);
        Route::resource( '/teachable-users', 'TeachableUserController' )->only([ 'index', 'store', 'show', 'update' ]);
        Route::resource( '/users', 'UserController' )->only([ 'index', 'destroy', 'show' ]);
        Route::resource( '/grades', 'GradeController' )->only([ 'store' ]);
        Route::resource( '/dashboard', 'DashboardController')->only([ 'index', 'show' ]);
        Route::resource('/teaching-period', 'TeachingPeriodController')->only([ 'index', 'show' ]);
        Route::get( '/jw-player/videos', 'JWPlayerController@index' );
        Route::get( '/jw-player/signed-links', 'JWPlayerController@links' );
    } );

    Route::get( '/download/{media}', 'DownloadController@index' );
    Route::get( '/external', 'UtilityController@redirectToExternalURI' );

    Route::group([ 'prefix' => 'api' ], function () {
        Route::resource('/teaching-period', 'TeachingPeriodController');
        Route::resource('/subject', 'SubjectController');
        Route::resource('/quiz', 'QuizController');
        Route::resource('/question', 'QuestionController');
        Route::resource('/assignment', 'AssignmentController');
        Route::resource('/resource', 'ResourceController');
        Route::resource('/user', 'UserController');
        Route::get('/user/{id}/{context}', 'UserController@classrooms');
        Route::resource('/classroom', 'ClassroomController');
        Route::get('/classroom/{slug}/{context}', 'ClassroomController@users');
    });

    Route::get( '/{route}', 'HomeController@index' )->where( 'route', '.*' );

} );

