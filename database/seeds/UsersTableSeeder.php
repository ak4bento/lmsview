<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'users' )->truncate();
        DB::table( 'model_has_roles' )->delete();
        DB::table( 'media' )->where( 'model_type', 'user' )->delete();

        $exampleAvatars = collect( Storage::disk( 'local' )->files( 'example-avatars' ) );
        collect( Storage::disk( 'public' )->allDirectories() )->each( function ( $directory )
        {
            Storage::disk( 'public' )->deleteDirectory( $directory );
        } );

        factory( \App\User::class, 500 )->create()->each( function ( $user ) use ( $exampleAvatars ) {
            $roleLottery = rand( 0, 20 );

            if ( $roleLottery == 0 )
                $user->assignRole([ 'super' ]);
            elseif ( $roleLottery < 2 )
                $user->assignRole([ 'admin' ]);
            elseif ( $roleLottery < 5 )
                $user->assignRole([ 'teacher' ]);
            else
                $user->assignRole([ 'student' ]);

            if ( rand( 0, 3 ) )
                $user->addMedia( storage_path( 'app/' . $exampleAvatars->random() ) )->preservingOriginal()->toMediaCollection( 'avatar', 'public' );
        } );
    }
}
