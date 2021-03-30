<?php

use App\Subject;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SubjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'subjects' )->truncate();

        $faker = \Faker\Factory::create();
        $admins = Role::findByName( 'admin' )->users;

        $exampleSubjects = collect( json_decode( Storage::disk( 'database' )->get( 'data/ExampleSubjects.json' ) ) );
        $exampleSubjects->each( function ( $exampleSubject ) use ( $faker, $admins ) {
            Subject::create([
                'title' => $exampleSubject->title,
                'code' => $exampleSubject->code,
                'description' => $faker->paragraph( rand( 3, 8 ) ),
                'created_by' => $admins->random()->id,
                'created_at' => $faker->dateTimeThisYear(),
            ]);
        } );
    }
}
