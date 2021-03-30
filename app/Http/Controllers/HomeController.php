<?php

namespace App\Http\Controllers;

use App\AppSetting;
use Illuminate\Http\Request;
use App\Transformers\UserTransformer;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view( 'layouts.app', [
            'context' => auth()->user()->hasRole( 'admin' ) || auth()->user()->hasRole( 'super' ) ? 'admin' : 'user',
            'config' => AppSetting::all()->toArray(),
            'user' => fractal()->item( auth()->user() )->transformWith( new UserTransformer )->toArray()[ 'data' ],
        ] );
    }
}
