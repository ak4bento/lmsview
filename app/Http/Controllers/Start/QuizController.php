<?php

namespace App\Http\Controllers\Start;

use App\Quiz\Quiz;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $quizzes = Quiz::with([ 'createdBy', 'teachables.classroom.subject' ])
            ->withCount([ 'questions' ])
            ->orderBy( 'created_at', 'desc' )
            ->paginate( 30 );
        return view( 'start.quizzes-index', [ 'quizzes' => $quizzes ] );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view( 'start.quizzes-create', [
            'classrooms' => \App\Classroom::with(['createdBy'])->withCount(['teachables'])->orderBy('created_at', 'desc')->get()
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
            'title' => 'required|string',
            'description' => 'nullable|string',
            'action' => 'required|in:list,add_questions',
            'map_to' => 'nullable',
            'map_to.*' => 'exists:classrooms,id',
            'map_to_pass_threshold' => 'required_with:map_to|numeric',
            'map_to_max_attempts' => 'integer|min:0',
        ] );

        $quiz = new Quiz;
        $quiz->grading_method = 'standard';
        $quiz->title = $request->title;
        $quiz->description = $request->description ? clean( $request->description ) : '';
        $quiz->created_by = auth()->user()->id;
        $quiz->save();

        foreach ( $request->map_to as $classroom ) {
            $teachable = new \App\Teachable;
            $teachable->classroom_id = $classroom;
            $teachable->teachable_type = 'quiz';
            $teachable->teachable_id = $quiz->id;
            $teachable->pass_threshold = $request->map_to_pass_threshold;
            $teachable->max_attempts_count = $request->map_to_max_attempts;
            $teachable->created_by = auth()->user()->id;
            $teachable->created_at = \Carbon\Carbon::now();
            $teachable->updated_at = \Carbon\Carbon::now();
            $teachable->order = \App\Teachable::whereClassroomId( $classroom )->max( 'order' ) + 1;

            $teachable->save();
        }

        return redirect( $request->action == 'add_questions' ?
            route( 'start.questions.create' ) . '?map_to=' . $quiz->id :
            route( 'start.quizzes.index' )
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Quiz\Quiz  $quiz
     * @return \Illuminate\Http\Response
     */
    public function show(Quiz $quiz)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Quiz\Quiz  $quiz
     * @return \Illuminate\Http\Response
     */
    public function edit(Quiz $quiz)
    {
        return view( 'start.quizzes-edit', [
            'quiz' => $quiz,
            'questions' => $quiz->questions,
            'mapToClassrooms' => \App\Classroom::whereNotIn('id', $quiz->teachables->pluck('classroom_id'))->with(['createdBy'])->withCount(['teachables'])->orderBy('created_at', 'desc')->get(),
            'unmapFromClassrooms' => \App\Classroom::whereIn('id', $quiz->teachables->pluck('classroom_id'))->with(['createdBy'])->withCount(['teachables'])->orderBy('created_at', 'desc')->get()
        ] );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Quiz\Quiz  $quiz
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Quiz $quiz)
    {
        $this->validate( $request, [
            'title' => 'required|string',
            'description' => 'nullable|string',
            'action' => 'required|in:list',
            'map_to' => 'nullable',
            'map_to.*' => 'exists:classrooms,id',
            'map_to_pass_threshold' => 'required_with:map_to|numeric',
            'map_to_max_attempts' => 'integer|min:0',
            'unmap_from' => 'nullable',
            'unmap_from.*' => 'exists:classrooms,id',
            'unmap_questions' => 'nullable',
            'unmap_questions.*' => 'exists:questions,id',
        ] );

        $quiz->grading_method = 'standard';
        $quiz->title = $request->title;
        $quiz->description = $request->description ? clean( $request->description ) : '';
        $quiz->save();

        if ( $request->unmap_from ) {
            \App\Teachable::whereIn( 'classroom_id', $request->unmap_from )
                ->whereTeachableType( 'quiz' )
                ->whereTeachableId( $quiz->id )
                ->delete();
        }

        if ( $request->unmap_questions ) {
            $quiz->questions()->detach( $request->unmap_questions );
        }

        if ( $request->map_to )
            foreach ( $request->map_to as $classroom ) {
                $teachable = new \App\Teachable;
                $teachable->classroom_id = $classroom;
                $teachable->teachable_type = 'quiz';
                $teachable->teachable_id = $quiz->id;
                $teachable->pass_threshold = $request->map_to_pass_threshold;
                $teachable->max_attempts_count = $request->map_to_max_attempts;
                $teachable->created_by = auth()->user()->id;
                $teachable->created_at = \Carbon\Carbon::now();
                $teachable->updated_at = \Carbon\Carbon::now();
                $teachable->order = \App\Teachable::whereClassroomId( $classroom )->max( 'order' ) + 1;
                $teachable->save();
            }

        return redirect( route( 'start.quizzes.index' ) );
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
