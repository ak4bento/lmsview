<?php

namespace App\Http\Controllers;

use Validator;
use App\Quiz\Quiz;
use Illuminate\Http\Request;

use App\Transformers\QuizTransformer;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @Route url rest\quizzes?id={id}
     * @param App\Quiz $quiz
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, Quiz $quiz)
    {
        $quiz = Quiz::whereHas('teachables', function ($query) use ($request) {
                $query->where('id', $request->id);
            })
            ->with(['createdBy','questions', 'teachables'])
            ->withCount([ 'questions' ])
            ->orderBy( 'created_at', 'desc' )
            ->get();
        
        // return [
        //     "data" => $quiz
        // ];

        return fractal()
            ->collection( $quiz )
            ->transformWith( new QuizTransformer )
            ->parseIncludes([ 'questions', 'teachables', 'createdBy' ])
            ->respond();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public static function store(Request $request)
    {
        $validator = Validator::make( $request->all(), [
                'title' => 'required|string',
                'description' => 'nullable|string',
            ] );
            if ( $validator->fails() ) return abort( 422, json_encode([ 'error' => $validator->errors() ]) );

            $quiz = new Quiz;
            $quiz->grading_method = 'standard';
            $quiz->title = $request->title;
            $quiz->description = $request->description ? clean( $request->description ) : '';
            $quiz->created_by = auth()->user()->id;

            if ( $quiz->save() ) {
                return [
                    "quiz" => $quiz
                ];
            } else {
                return [
                    "quiz" => []
                ];
            }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Quiz\Quiz  $quiz
     * @return \Illuminate\Http\Response
     */
    public function show( Quiz $quiz, Request $request )
    {
       
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Quiz\Quiz  $id
     * @return \Illuminate\Http\Response
     */
    public static function update(Request $request)
    {
        $validator = Validator::make( $request->all(), [
            'title' => 'required|string',
            'description' => 'nullable|string',
        ]);

        if ( $validator->fails() ) return abort( 422, json_encode([ 'error' => $validator->errors() ]) );
        
        // $quiz = Quiz::where($request->id)->first(); 
        $quiz->grading_method = 'standard';
        $quiz->title = $request->title;
        $quiz->description = $request->description ? clean( $request->description ) : '';
        
        $quiz->save();
        return $quiz;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Quiz\Quiz  $quiz
     * @return \Illuminate\Http\Response
     */
    public function destroy(Quiz $quiz)
    {
        //
    }
}
