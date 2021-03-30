<?php

namespace App\Http\Controllers;

use App\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(isset($_GET['all'])) {
            return Subject::with(['category'])->orderBy('created_at','DESC')->get();
        } else {
            $subject = Subject::with(['category']);
            if($request->q) {
                $subject->where('title', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('code', 'LIKE', '%' . $request->q . '%');
            }
            return $subject->orderBy('created_at','DESC')->paginate(10);
        }
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
        $subject = new Subject;

        $subject->title = $request->title;
        $subject->code = $request->code;
        $subject->description = $request->description;
        $subject->created_by = auth()->user()->id;

        if($request->major) $subject->default_category_id = $request->major;

        if($subject->save()) {
            return [
                "subject" => $subject
            ];
        } else {
            return [
                "subject" => []
            ];
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Subject  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Subject $subject)
    {
        $subject->load(['category']);
        return $subject->toJSON();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function edit(Subject $subject)
    {
       //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Subject  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        $subject = Subject::find($id);
        $subject->title = $request->title;
        $subject->code = $request->code;
        $subject->description = $request->description;

        if($request->major) $subject->default_category_id = $request->major;

        if($subject->save()) {
            return [
                "subject" => $subject
            ];
        } else {
            return [
                "subject" => []
            ];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Subject  $subject
     * @return \Illuminate\Http\Response
     */
    public function destroy(Subject $subject)
    {
        //
    }
}
