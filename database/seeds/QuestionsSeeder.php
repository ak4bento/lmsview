<?php

use App\Quiz\Quiz;
use Illuminate\Database\Seeder;

class QuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table( 'question_choice_items' )->truncate();
        DB::table( 'question_quiz' )->truncate();
        DB::table( 'questions' )->truncate();

        $quizzes = Quiz::all();
        $questionsCount = $quizzes->count() * 10;

        $questions = factory( App\Quiz\Question::class, $questionsCount )->make();
        $questions->each( function ( $question ) use ( $quizzes ) {

            $forQuiz = $quizzes->random();
            if ( $forQuiz->teachables()->count() == 0 )
                return;

            $forClassroom = $forQuiz->teachables->random()->classroom;
            $question->created_by = $forClassroom->teachers->random()->id;
            $question->save();

            $forQuiz->questions()->attach( $question );

            switch ( $question->question_type ) {
                case 'multiple-choice':
                    $choices = factory( App\Quiz\QuestionChoiceItem::class, rand( 4, 5 ) )->make();
                    $choices->random()->is_correct = true;
                    $question->choiceItems()->saveMany( $choices );
                    break;
                case 'boolean':
                    $choices = collect([
                        App\Quiz\QuestionChoiceItem::make([ 'choice_text' => 'True' ]),
                        App\Quiz\QuestionChoiceItem::make([ 'choice_text' => 'False' ]),
                    ]);
                    $choices->random()->is_correct = true;
                    $question->choiceItems()->saveMany( $choices );
            }

        } );
    }
}
