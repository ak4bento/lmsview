<?php

use App\Subject;
use App\Classroom;
use Carbon\Carbon;
use App\ClassroomUser;
use App\TeachingPeriod;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class ClassroomsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'classroom_user' )->truncate();
        DB::table( 'classrooms' )->truncate();
        DB::table( 'media' )->where( 'model_type', 'classroom' )->delete();
        DB::table( 'model_has_roles' )->where( 'model_type', 'classroomUser' )->delete();
        DB::table( 'teaching_periods' )->truncate();

        $admins = Role::findByName( 'admin' )->users;
        $teachers = Role::findByName( 'teacher' )->users;
        $students = Role::findByName( 'student' )->users;

        $teachingPeriodIsFirstSemester = Carbon::now()->gt( new Carbon( 'first day of July ' . date( 'Y' ) ) );
        $teachingPeriodStartsAt = new Carbon( 'first day of ' . ( $teachingPeriodIsFirstSemester ? 'July' : 'January' ) . date( 'Y' ) );
        $teachingPeriodEndsAt = new Carbon( 'last day of ' . ( $teachingPeriodIsFirstSemester ? 'December' : 'June' ) . date( 'Y' ) );
        $teachingPeriod = TeachingPeriod::create([
            'name' => $teachingPeriodStartsAt->format( 'Y' ) . '-' . ( $teachingPeriodIsFirstSemester ? 'ganjil' : 'genap' ),
            'starts_at' => $teachingPeriodStartsAt,
            'ends_at' => $teachingPeriodEndsAt,
            'created_by' => $admins->random()->id,
        ]);

        $faker = \Faker\Factory::create();
        $subjects = Subject::all();

        $subjects->each( function( $subject ) use ( $admins, $teachers, $students, $teachingPeriod, $faker ) {
            $isCustom = $faker->boolean(10);
            $numbering = $isCustom ? $faker->numberBetween(10, 99) : null;
            $classroom = Classroom::make([
                'teaching_period_id' => $teachingPeriod->id,
                'title' => $isCustom ? $subject->title . ' ' . $numbering : null,
                'code' => $isCustom ? $subject->code . $numbering  : null,
                'description' => $isCustom ? $faker->paragraph( rand( 3, 8 ) ) : null,
                'created_by' => $admins->random()->id,
                'created_at' => $faker->dateTimeThisYear(),
            ]);
            $subject->classrooms()->save($classroom);

            $teacher = $teachers->random();
            $classroomTeacher = ClassroomUser::create([ 'classroom_id' => $classroom->id, 'user_id' => $teacher->id ]);
            $classroomTeacher->assignRole( 'teacher' );

            $students = $students->random( rand( 30, 40 ) );
            $students->each( function ( $student ) use ( $classroom, $faker ) {
                $classroomUser = ClassroomUser::create([ 'classroom_id' => $classroom->id, 'user_id' => $student->id, 'last_accessed_at' => $faker->dateTimeThisMonth() ]);
                $classroomUser->assignRole( 'student' );
            } );

            $exampleFiles = collect( Storage::disk( 'local' )->files( 'example-files' ) );
            for ( $i = 0; $i < rand( 1, 5 ); $i++ ) {
                $classroom
                    ->addMedia( storage_path( 'app/' . $exampleFiles->random() ) )
                    ->usingName( title_case( $faker->words( rand( 1, 7 ), true ) ) )
                    ->preservingOriginal()
                    ->toMediaCollection( 'files' );
            }
        } );
    }
}
