<?php

namespace App\Transformers;

use App\Quiz\QuizAttempt;
use League\Fractal\TransformerAbstract;

class QuizAttemptTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'questions', 'answers', 'grade'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( QuizAttempt $attempt )
    {
        return [
            'id' => $attempt->id,
            'attempt' => $attempt->attempt,
            'grading_method' => $attempt->grading_method,
            'gradePreview' => count($attempt->grades) ? $attempt->grades[0] : [],
            'completedAt' => $attempt->completed_at ? $attempt->completed_at->toIso8601String() : null,
            'completedAtForHumans' => $attempt->completed_at ? $attempt->completed_at->diffForHumans() : null,
            'createdAt' => $attempt->created_at ? $attempt->created_at->toIso8601String() : null,
            'createdAtForHumans' => $attempt->created_at ? $attempt->created_at->diffForHumans() : null,
        ];
    }

    public function includeAnswers( QuizAttempt $attempt )
    {
        $answers = collect( json_decode( $attempt->answers ) );
        return $this->collection( $answers, new QuestionAnswerTransformer );
    }

    public function includeGrade( QuizAttempt $attempt )
    {
        if ( $attempt->grades->count() == 0 )
            return null;
        return $this->item( $attempt->grades->first(), new GradeTransformer );
    }

    public function includeQuestions( QuizAttempt $attempt )
    {
        $questions = collect( json_decode( $attempt->questions ) );
        return $this->collection( $questions, new QuestionSnapshotTransformer );
    }

}
