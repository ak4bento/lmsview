<?php

namespace App\Console\Commands;

use Validator;
use App\AppSetting;
use Illuminate\Console\Command;

class ConfigureApp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:config';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Configure application settings';

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

        $settings = collect([
            [ 'key' => 'ORGANIZATION.NAME', 'label' => 'Organization Name', 'rules' => 'required' ],
            [ 'key' => 'ORGANIZATION.LOGO', 'label' => 'Organization Logo', 'rules' => 'nullable|url' ],
            [ 'key' => 'ORGANIZATION.ADDRESS', 'label' => 'Organization Address', 'rules' => 'nullable' ],
            [ 'key' => 'ORGANIZATION.PHONE', 'label' => 'Organization Phone Number', 'rules' => 'nullable' ],
            [ 'key' => 'ORGANIZATION.EMAIL', 'label' => 'Organization Email Address', 'rules' => 'nullable|email' ],
        ]);

        $this->line( 'Setting configuration values for LMS' );
        $newSettings = collect([]);

        $settings->each( function ( $setting ) use ( $newSettings ) {
            $newSetting = AppSetting::find( $setting['key'] );
            if ( !$newSetting ) {
                $newSetting = new AppSetting;
                $newSetting->id = $setting['key'];
                $newSetting->value = '';
            }
            $validator = Validator::make( [ 'value' => $newSetting->value ], [ 'value' => $setting[ 'rules' ] ] );
            $tries = 0;
            while( $tries == 0 || $validator->fails() ) {
                if ( $tries > 0 ) {
                    $this->error( str_replace( 'The value field', $setting[ 'label' ], $validator->errors()->first() ) );
                }
                $newValue = $this->ask( 'Set configuration for ' . $setting[ 'label' ] . ' [' . ( strlen( $newSetting->value ) > 0 ? $newSetting->value : 'not set' ) . ']' );
                $newSetting->value = strlen( trim( $newValue ) ) > 0 ? $newValue : $newSetting->value;
                $validator = Validator::make( [ 'value' => $newSetting->value ], [ 'value' => $setting[ 'rules' ] ] );
                $tries++;
            }

            $newSettings->push( $newSetting );
        } );

        $this->line( 'Please confirm changes to commit below:' );
        $newSettings->each( function ( $newSetting ) use ( $settings ) {
            $setting = $settings->where( 'key', $newSetting->id )->first();
            $this->line( ' ' . $setting[ 'label' ] . ': ' . ( strlen( $newSetting->value ) > 0 ? $newSetting->value : '[not set]' ) );
        } );
        $confirmed = $this->confirm( 'Confirm changes?' );
        if ( $confirmed )
            $newSettings->each( function ( $setting ) { $setting->save(); });
    }
}
