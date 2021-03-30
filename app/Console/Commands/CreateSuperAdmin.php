<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;

class CreateSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:super';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a super administrator';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info( 'Creating new super administrator..' );
        $prompts = [
            'username' => 'Username [random]',
            'name' => 'Full Name [Super Administrator]',
            'email' => 'Email Address (optional)',
            'password' => 'Password (at least 8 characters) [random]',
        ];

        $user = new User;

        $user->username = $this->ask( $prompts[ 'username' ] );
        if ( strlen( $user->username ) == 0 )
            $user->username = str_random( 8 );

        while( strlen( $user->username ) > 0 && User::where( 'username', $user->username )->count() > 0 ) {
            $this->error( 'This username is already taken.' );
            $user->username = $this->ask( $prompts[ 'username' ] );
            if ( strlen( $user->username ) == 0 )
                $user->username = str_random( 8 );
        }

        $user->name = $this->ask( $prompts[ 'name' ] );
        if ( strlen( $user->name ) == 0 )
            $user->name = 'Super Administrator';

        $user->email = $this->ask( $prompts[ 'email' ] );
        while( strlen( $user->email ) > 0 && User::where( 'email', $user->email )->count() > 0 ) {
            $this->error( 'This email address is already taken.' );
            $user->email = $this->ask( $prompts[ 'email' ] );
        }
        if ( strlen( $user->email ) == 0 )
            $user->email = null;

        $passwordIsRandom = false;
        $user->password = $this->secret( $prompts[ 'password' ] );
        if ( strlen( $user->password ) == 0 ) {
            $user->password = str_random( 8 );
            $passwordIsRandom = true;
        }

        while( strlen( $user->password ) < 8 ) {
            $this->error( 'Please provide a minimum of 8 characters.' );
            $user->password = $this->ask( $prompts[ 'password' ] );
            if ( strlen( $user->password ) == 0 ) {
                $user->password = str_random( 8 );
                $passwordIsRandom = true;
            }
        }
        $passwordPlainText = $user->password;
        $user->password = bcrypt( $user->password );

        $this->info( 'Please review before confirming:' );
        $this->line( '  Username: ' . $user->username );
        $this->line( '  Full Name: ' . $user->name );
        $this->line( '  Email Address: ' . ( !$user->email ? '[Not set]' : $user->email ) );
        $this->line( '  Password: ' . ( $passwordIsRandom ? $passwordPlainText : '[User-defined password]' ) );
        $this->line( '' );

        $confirmed = $this->confirm( 'Create this user as super administrator?' );
        if ( $confirmed ) {
            $user->save();
            $user->assignRole( 'super' );
            $this->info( 'Super administrator user saved!' );
        }
    }
}
