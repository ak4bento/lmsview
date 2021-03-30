<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

use Auth;
use App\User;
use Curl;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    //for sso
    // public function login() {
    //     $gakkenURL = env('GAKKEN_URL');
    //     $lmsURL =  env('APP_URL');
    //     return redirect(
    //         $gakkenURL . '/login?appredirect=' . urlencode($lmsURL) 
    //     );
    // }
    
    public function doSSO(Request $request) 
    {
        $response = Curl::to(env('GAKKEN_URL') . "/callback/auth/" . $request->token)
            ->withData( array( 'sso_key' => env('SSO_KEY') ) )
            ->returnResponseObject()
            ->post();

        $auth_user = json_decode($response->content);

        if (!$auth_user->user) 
            return redirect(env('GAKKEN_URL'));

        $user = User::where('email', $auth_user->user->email)->first();

        if (!$user) 
            return redirect(env('GAKKEN_URL'));

        if (Auth::loginUsingId($user->id)) {
            return redirect('/');
        } else {
            return redirect(env('GAKKEN_URL'));
        }
    }

    public function username()
    {
        return 'username';
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();

        if ( $request->wantsJson() )
            return response()->json( 'success' );

        // return redirect(env('GAKKEN_URL') . '/logout');
    }

}
