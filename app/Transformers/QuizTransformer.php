<?php

namespace App\Transformers;

use App\Quiz\Quiz;
use App\Teachable;
use League\Fractal\TransformerAbstract;

class QuizTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'questions' ,
        'teachables'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Quiz $quiz )
    {
        return [
            'grading_method' => studly_case( $quiz->grading_method ),
            'title' => strlen( $quiz->title ) > 0 ? $quiz->title : null,
            'description' => $quiz->description,
        ];
    }

    public function includeQuestions( Quiz $quiz )
    {
        return $this->collection( $quiz->questions, new QuestionTransformer );
    }

    public function includeTeachables( Quiz $quiz )
    {
        return $this->collection( $quiz->teachables, new TeachableTransformer);
    }
}
