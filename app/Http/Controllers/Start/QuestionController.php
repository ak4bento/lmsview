<?php

namespace App\Http\Controllers\Start;

use App\Quiz\Question;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        return view( 'start.questions-create', [
            'quizzes' => \App\Quiz\Quiz::with([ 'createdBy'])->withCount([ 'questions' ])->orderBy('created_at', 'desc')->get()
        ] );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate( $request, [
            'question_type' => 'required|in:multiple-choice,boolean,multiple-response,fill-in,essay',
            'content' => 'required|string',
            'answers' => 'nullable|required_if:question_type,fill-in|array|min:1',
            'choices' => 'nullable|array',
            'choices.*.text' => 'required|string',
            'choices.*.is_correct' => 'boolean',
            'map_to.*' => 'exists:quizzes,id',
        ] );

        $question = new Question;
        $question->question_type = $request->question_type;
        $question->content = clean( $request->content );
        $question->answers = $request->answers ?: null;
        $question->created_by = auth()->user()->id;

        $question->save();
        $question->quizzes()->attach( $request->map_to );

        if ( $request->choices ) {
            $choices = collect([]);
            foreach( $request->choices as $choice ) {

                $newChoice = new \App\Quiz\QuestionChoiceItem;
                $newChoice->question_id = $question->id;
                $newChoice->choice_text = $choice['text'];
                $newChoice->is_correct = isset( $choice['is_correct'] ) ? $choice['is_correct'] : false;
                $newChoice->push( $choice );
            }
            $question->choiceItems()->saveMany( $choices );
        }

        return redirect(
            $request->action == 'continue' ?
            route( 'start.questions.create' ) . '?map_to=' . $quiz->id :
            route( 'start.quizzes.index' )
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Quiz\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Quiz\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Quiz\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Quiz\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function destroy(Question $question)
    {
        //
    }
}
