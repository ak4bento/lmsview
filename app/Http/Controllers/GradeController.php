<?php

namespace App\Http\Controllers;

use App\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
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
        $grade =new Grade;

        switch ($request->context) {
            case 'teachableUser':
                $grade->gradeable_id = $request->teachable;
                $grade->gradeable_type = 'teachableUser';
                $grade->grading_method = 'manual';
                $grade->grade = $request->score;
                $grade->comments = $request->feedback ? $request->feedback : "-";
                $grade->graded_by = auth()->user()->id;
                
                break;
            case 'quizAttempt':
                $grade->gradeable_id = $request->attempt;
                $grade->gradeable_type = 'quizAttempt';
                $grade->grading_method = 'manual';
                $grade->grade = $request->score;
                $grade->comments = $request->feedback ? $request->feedback : "-";
                $grade->graded_by = auth()->user()->id;
                break;
        }

        $grade->save();
        $grade->complete();

        return [
            'isSuccess' => true
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function show(Grade $grade)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function edit(Grade $grade)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Grade $grade)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Grade  $grade
     * @return \Illuminate\Http\Response
     */
    public function destroy(Grade $grade)
    {
        //
    }
}
