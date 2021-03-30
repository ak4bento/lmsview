<?php

namespace App\Http\Controllers;

use Validator;
use App\Teachable;
use App\Quiz\Question;
use App\Quiz\Quiz;
use App\Quiz\QuestionQuiz;
use App\Quiz\QuestionChoiceItem;
use App\Transformers\QuestionTransformer;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

class QuestionController extends Controller
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
     * @respond for test
     *      "question" => $question,
     *      "questionQuiz" => $questionquizzes,
     *      "choiceItems" => $choices,
     */
    public function store( Request $request )
    {
        $validator = Validator::make( $request->all() , [
            'content' => 'required|string',
            'answer' => 'nullable|required_if:question_type, fill-in|array|min:1',
            // 'choices' => 'required_if:question_type, multiple-choice|required_if:question_type, boolean|required_if:question_type, multiple-response|' . ( $request->questionType == 'multiple-response' ? 'array|min:1' : 'array:max:1' ),
            // 'choices.*.choice_text' => 'required|string',
            // 'choices.*.is_correct' => 'boolean',
        ]);
        if ( $validator->fails() ) return abort( 422, json_encode([ 'errors' => $validator->errors() ]) );

        $question = new Question;
        $question->question_type = $request->question_type;
        $question->content = $request->content ;
        $question->answers = $request->answers ?: null;
        $question->created_by = auth()->user()->id;

        if ( $question->save() ) {
            $quiz = Quiz::whereHas('teachables', function ($query) use ($request) {
                $query->where('id', $request->id);
            })->first(); 

            $question->quizzes()->attach( $quiz->id );
            if($request->choices) {

                $newChoices = [];
                $choices = json_decode($request->choices);
                foreach( $choices as $choice ) {
                    $newChoice = new QuestionChoiceItem;
                    $newChoice->choice_text = $choice->choice_text;
                    $newChoice->is_correct = isset( $choice->is_correct ) ? $choice->is_correct : false;
                    array_push($newChoices, $newChoice );
                }

                $question->choiceItems()->saveMany($newChoices);
            }
                    
            return [
                "question" => $question,
            ];
            
        } 
    }

    /**
     * Display the specified resource.
     *
     * @Route url rest\questions\{id}
     * @param  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $question = Question::with( [ 'choiceItems' ] )->findOrFail($id);
        return [
            "data" => $question
        ];
    }
    

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Quiz\Question $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @respond for test
     *      "question" => $question,
     *      "choiceItems" => $choices,
     */
    public function update(Question $question, Request $request)
    {
        $validator = Validator::make( $request->all() , [
            'content' => 'required|string',
            'answer' => 'nullable|required_if:question_type, fill-in|array|min:1',
            'choices.*.choice_text' => 'required|string',
            'choices.*.is_correct' => 'boolean',
        ]);
        if ( $validator->fails() ) return abort( 422, json_encode([ 'errors' => $validator->errors() ]) );
        
        $question->question_type = $request->question_type;
        $question->content = $request->content ;
        $question->answers = $request->answers ?: null;

        if ( $question->save() ) {

            if ($request->choices) {
                $choices = json_decode($request->choices);
                $availableChoices = collect([]);
                $newChoices = collect([]);

                foreach ($choices as $choice) {
                    if (isset($choice->id)) {

                        $updateChoice = QuestionChoiceItem::where('id', $choice->id)->first();
                        $updateChoice->choice_text = $choice->choice_text;
                        $updateChoice->is_correct = isset( $choice->is_correct ) ? $choice->is_correct : false;
                        $updateChoice->save();

                        $availableChoices->push($choice->id);
                    } else {
                        $newChoice = new QuestionChoiceItem;
                        $newChoice->choice_text = $choice->choice_text;
                        $newChoice->is_correct = isset( $choice->is_correct ) ? $choice->is_correct : false;
                        $newChoices->push( $newChoice );
                    }   
                }

                QuestionChoiceItem::whereNotIn('id', $availableChoices)->where('question_id', $question->id)->delete();
                $question->choiceItems()->saveMany($newChoices);

                return [
                    "choice" => $choices,
                ];
    
            } 

            return [
                "question" => $question,
            ];

        } else {
            return ["isSuccess" => false ];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @route rest/questions/{id}
     * @param  \App\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Question $question)
    {
        switch ($request->context) {
            case 'teacher':
                $choiceItems = $question->choiceItems()->delete();
                $question->delete();
                break;
            default:
                // code...
                break;
        }

        return [
            "isSuccess" => true,
        ];
    }
}
