<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class InstallRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install roles and permissions into database';

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
        $this->info( 'Resetting tables' );
        DB::table( 'model_has_permissions' )->delete();
        DB::table( 'model_has_roles' )->delete();
        DB::table( 'role_has_permissions' )->delete();
        DB::table( 'permissions' )->delete();
        DB::table( 'roles' )->delete();
        app()['cache']->forget('spatie.permission.cache');

        $this->info( 'Installing roles' );
        Role::create([ 'name' => 'super' ]);
        Role::create([ 'name' => 'admin' ]);
        Role::create([ 'name' => 'teacher' ]);
        Role::create([ 'name' => 'student' ]);
    }
}
