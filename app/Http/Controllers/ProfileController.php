<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Transformers\UserTransformer;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return fractal()
            ->item( auth()->user() )
            ->transformWith( new UserTransformer )
            ->respond();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $profile = auth()->user();

        if ( $request->avatar ) {
            $this->validate( $request, [ 'avatar' => 'required|image|max:2048' ] );
            // $profile->clearMediaCollection( 'avatar' );
            // $profile->addMedia( $request->avatar )->toMediaCollection( 'avatar', 'public' );
            $profile->clearMediaCollection( 'avatar' );
            $profile->addMedia( $request->file('avatar') )->toMediaCollection( 'avatar', 'public' );
            return $this->index();
        }

        if ( $request->password ) {
            $this->validate( $request, [ 'password' => 'string|min:8', 'passwordConfirmation' => 'same:password' ] );
            $profile->password = bcrypt( $request->password );
            $profile->save();
            return $this->index();
        }

        $this->validate( $request, [
            'name'  => 'required|string',
            'username' => 'required|string|unique:users,username,' . auth()->user()->id,
        ] );

        $profile->name = $request->name;
        $profile->username = $request->username;

        $profile->save();

        return $this->index();
    }

}
