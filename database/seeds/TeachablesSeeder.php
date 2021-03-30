<?php

use App\Quiz\Quiz;
use App\Resource;
use App\Classroom;
use App\Teachable;
use Faker\Factory;
use App\Assignment;
use App\Prerequisite;
use Illuminate\Database\Seeder;

class TeachablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'prerequisites' )->truncate();
        DB::table( 'teachables' )->truncate();
        DB::table( 'quizzes' )->truncate();
        DB::table( 'resources' )->truncate();
        DB::table( 'assignments' )->truncate();
        DB::table( 'media' )->whereIn( 'model_type', [ 'resource', 'assignment' ] )->delete();

        $classrooms = Classroom::all();
        $faker = Factory::create();
        $exampleFiles = collect([
            'jwvideo' => collect( json_decode( Storage::disk( 'database' )->get( 'data/ExampleJWVideos.json' ) ) ),
            'youtubevideo' => collect( json_decode( Storage::disk( 'database' )->get( 'data/ExampleYoutubeVideos.json' ) ) ),
            'documents' => collect( Storage::disk( 'local' )->files( 'example-files' ) )
        ]);

        /**
         * In the following iteration, we create teachables
         * and attach to each existing classroom
         */
        $classrooms->each( function ( $classroom ) use ( $faker, $exampleFiles ) {
            $teachableCount = rand( 5, 15 );
            $teachableTypes = collect([
                [ 'name' => 'quiz', 'class' => Quiz::class ],
                [ 'name' => 'resource', 'class' => Resource::class ],
                [ 'name' => 'assignment', 'class' => Assignment::class ],
            ]);

            $currentOrder = 1;
            $teacher = $classroom->teachers()->first();

            while( $currentOrder < $teachableCount ) {
                $type = $teachableTypes->random();
                $teachable = factory( $type['class'], 1 )->make()->first();

                if ( $type['name'] != 'quiz' ) {
                    switch ( $teachable->type ) {
                        case 'jwvideo':
                            $exampleVideo = $exampleFiles[ 'jwvideo' ]->random();
                            $teachable->title = $exampleVideo->title;
                            $teachable->data = json_encode([
                                'videoId' => $exampleVideo->videoId,
                                'playerId' => $exampleVideo->playerId,
                            ]);
                            break;
                        case 'youtubevideo':
                            $exampleVideo = $exampleFiles[ 'youtubevideo' ]->random();
                            $teachable->title = $exampleVideo->title;
                            $teachable->data = json_encode([
                                'videoId' => $exampleVideo->videoId,
                            ]);
                            break;
                        case 'audio':
                            $audioFilePath = collect( $exampleFiles[ 'documents' ] )
                                ->filter( function ( $file )
                                {
                                    return ends_with( $file, '.mp3' );
                                } )
                                ->first();
                            $teachable->addMedia( storage_path( 'app/' . $audioFilePath ) )
                                ->usingName( title_case( $faker->words( rand( 1, 7 ), true ) ) )
                                ->preservingOriginal()
                                ->toMediaCollection( 'audio' );
                    }

                    for( $i = 0; $i <= rand( 1, 5 ); $i++ )
                        $teachable->addMedia( storage_path( 'app/' . collect( $exampleFiles[ 'documents' ] )->random() ) )
                            ->usingName( title_case( $faker->words( rand( 1, 7 ), true ) ) )
                            ->preservingOriginal()
                            ->toMediaCollection( 'files' );
                }
                $teachable->created_by = $teacher->user->id;
                $teachable->created_at = $faker->dateTimeBetween( $classroom->created_at );
                $teachable->save();

                $classroom->teachables()->save( Teachable::make([
                    'classroom_id' => $classroom->id,
                    'teachable_type' => $type[ 'name' ],
                    'teachable_id' => $teachable->id,
                    'order' => $currentOrder,
                    'created_by' => $teacher->user->id,
                    'final_grade_weight' => 1,
                    'max_attempts_count' => $type[ 'name' ] == 'quiz' ? $faker->numberBetween( 0, 5 ) : 0,
                    'expires_at' => in_array( $type[ 'name' ], [ 'assignment', 'quiz' ] ) ?
                        $faker->dateTimeBetween( $teachable->created_at, '+6 months' ) : null,
                    'created_at' => $faker->dateTimeBetween( $teachable->created_at ),
                ]) );

                $currentOrder++;
            }
        } );

        /**
         * Now we make prerequisites for all quiz-type teachables
         * which requires all other teachable types in the
         * same classroom
         */
        $quizTeachables = Teachable::quizzes()->get();
        $quizTeachables->each( function ( $quizTeachable )
        {
            $classroom = $quizTeachable->classroom;
            $teacher = $classroom->teachers()->first();

            $quizzesInClassroom = $classroom->teachables()->quizzes()->get();
            $allOtherTeachablesInClassroom = $classroom->teachables()
                ->whereNotIn( 'id', $quizzesInClassroom->pluck( 'id' )->all() )
                ->with( 'teachable' )
                ->get();
            $allOtherTeachablesInClassroom = $allOtherTeachablesInClassroom->random( rand( 0, $allOtherTeachablesInClassroom->count() ) );

            $prerequisites = collect([]);
            $allOtherTeachablesInClassroom->each( function ( $teachable ) use ( $prerequisites, $teacher )
            {
                $prerequisites->push( Prerequisite::make([
                    'requirable_id' => $teachable->id,
                    'created_by' => $teacher->user->id,
                ]) );
            } );
            $quizTeachable->prerequisites()->saveMany( $prerequisites );
        } );
    }
}
