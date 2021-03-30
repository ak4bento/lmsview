<?php

namespace App\Http\Controllers;

use App\ChangeRequest;
use Illuminate\Http\Request;

class ChangeRequestController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate( $request, [
            'context' => 'required|in:email',
            'email' => 'required_if:context,email|email|unique:users'
        ] );

        $changeRequest = new ChangeRequest;
        $confirmationCode = str_random( 32 );
        $changeRequest->context = $request->context;
        $changeRequest->confirmation_code = bcrypt( $confirmationCode );
        $changeRequest->initiator_data = [
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
        ];

        auth()->user()->changeRequests()->save( $changeRequest );

        switch ($request->context) {
            case 'email':
                // Send email here
                break;
        }

        return response()->json([ 'message' => 'Change request has been stored.' ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $confirmationCode
     * @return \Illuminate\Http\Response
     */
    public function show( $confirmationCode )
    {
        //
    }

}
