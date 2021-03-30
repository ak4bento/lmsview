<?php

namespace App\Http\Controllers;

use Validator;
use App\Assignment;
use App\Teachable;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $assignment = Teachable::find($id)->teachable;

        return [
            "data" => $assignment,
        ];

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make( $request->all(), [
            'title'         => 'required|string',
            'description'   => 'required|string',
        ] );

        if ( $validator->fails() ) return abort( 422, json_encode(['errors' => $validator->errors() ]) );
        
        $assignment = Assignment::find($id);
        $assignment->title         = $request->title;
        $assignment->description   = $request->description;
        $assignment->created_by    = auth()->user()->id;
        
        if ($assignment->save()) {
            return [
                // "isSucces" => true,
                "assignment" => $assignment,
            ];
        } else {
            return [
                "isSuccess" => false
            ];
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
