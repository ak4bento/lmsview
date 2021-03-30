<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use Illuminate\Support\Facades\Hash;

class RegisterUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create 
        {--E|email= : Email address of the user} 
        {--N|name= : The user\'s full name} 
        {--U|username= : The user\'s username} 
        {--P|password= : The assigned password for the user (leave blank to generate random password)} 
        {--R|role= : The user\'s roles}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to create user';

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
        $user = new User;
        // $categorizable = new Categorizable;
        // $categorizable_type = 'student';

        if (!$this->option('name'))
            return $this->error('Please supply user name with --name option');
        if (!in_array($this->option('role'), ['super', 'admin', 'teacher', 'student']))
            return $this->error('Invalid role');
        if (!$this->option('username'))
            return $this->error('Please supply username with --username option');
        
        $this->line('Creating new user');

        if (User::where('username', $this->option('username'))->count() != 0)
            return $this->error('The specified username already exists. Aborting.');

        if ($this->option('email')) {
            if (User::where('email', $this->option('email'))->count() != 0)
                return $this->error('The specified email already exists. Aborting.');
        }

        if (!$this->option('email'))
            $user->email = $this->option('email');

        $user->name = $this->option('name');
        $user->username = $this->option('username');

        $password = $this->option('password') ?: str_random(8);
        $this->line('Generated password: ' . $password);
        $user->password =  Hash::make($password);

        // $categorizable->category_id = $request->major;
        // $user->detail = json_encode([
        //     'birthdate' => $request->birthdate,
        //     'nim' => $request->nim,
        // ]);

        if ($user->save()) {
            $user->assignRole($this->option('role'));
            // $categorizable->categorizable_id = $user->id;
            // $categorizable->categorizable_type = $categorizable_type;
            // $categorizable->save();
            $this->info('User created successfully');
        } else {
            $this->info('Fail create user');
        }
        
    }
}
