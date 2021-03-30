<?php

namespace App\Transformers;

use App\Quiz\Question;
use League\Fractal\TransformerAbstract;

class QuestionTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'choiceItems'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Question $question )
    {
        return [
            'id' => $question->id ,
            'type' => studly_case( $question->question_type ),
            'scoringMethod' => studly_case( $question->scoring_method ),
            'content' => clean( $question->content ),
            'createdAt' => $question->created_at->toIso8601String(),
            'createdAtForHumans' => $question->created_at->diffForHumans(),
            'questionType' => $question->question_type
        ];
    }

    public function includeChoiceItems( Question $question )
    {
        if ( !in_array( $question->question_type, [ 'multiple-choice' ] ) )
            return null;

        return $this->collection( $question->choiceItems, new QuestionChoiceItemTransformer );
    }

}
