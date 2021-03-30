<?php

namespace App\Http\Controllers;

use App\JWPlayer\JWPlayer;
use Illuminate\Http\Request;

class UtilityController extends Controller
{

    public function redirectToExternalURI( Request $request ) {
        $this->validate( $request, [ 'to' => 'required|url' ]);
        return redirect( $request->to );
    }

}
