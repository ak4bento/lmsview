<?php

use App\Classroom;
use App\TeachableUser;
use Illuminate\Database\Seeder;

class TeachableUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'teachable_user' )->truncate();

        $classrooms = Classroom::all();
        $exampleFiles = collect( Storage::disk( 'local' )->files( 'example-files' ) );

        $classrooms->each( function ( $classroom ) use ( $exampleFiles ) {

            $students = $classroom->students;
            $teachables = $classroom->teachables;

            $teachables->each( function ( $teachable ) use ( $classroom, $students, $exampleFiles ) {
                $teachableUsers = collect([]);
                $students->random( rand( 0, $students->count() - 1 ) )->each( function ( $student ) use ( $teachable, $teachableUsers, $exampleFiles ) {
                    $faker = \Faker\Factory::create();
                    $completedAt = $faker->boolean( 75 ) ? $faker->dateTimeBetween( $teachable->created_at ) : null;
                    $teachableUser = TeachableUser::make([
                        'classroom_user_id' => $student->id,
                        'completed_at' => $completedAt
                    ]);
                    $teachableUsers->push( $teachableUser );

                    if ( $teachable->teachable_type == 'assignment' && $completedAt != null )
                        $teachableUser
                            ->addMedia( storage_path( 'app/' . $exampleFiles->random() ) )
                            ->usingName( title_case( $faker->words( rand( 1, 7 ), true ) ) )
                            ->preservingOriginal()
                            ->toMediaCollection( 'submission' );
                } );

                $teachable->teachableUsers()->saveMany( $teachableUsers );
            } );

        } );
    }
}
