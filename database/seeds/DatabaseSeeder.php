<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        collect( Storage::disk( 'media' )->allDirectories() )->each( function ( $directory )
        {
            Storage::disk( 'media' )->deleteDirectory( $directory );
        } );

        $this->call( UsersTableSeeder::class );
        $this->call( SubjectsSeeder::class );
        $this->call( ClassroomsSeeder::class );
        $this->call( TeachablesSeeder::class );
        $this->call( TeachableUserSeeder::class );
        $this->call( DiscussionsSeeder::class );
        $this->call( CategoriesSeeder::class );
        $this->call( GradesSeeder::class );
        $this->call( QuestionsSeeder::class );
    }

}
