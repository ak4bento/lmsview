<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class QuestionSnapshotTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'choiceItems'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( $question )
    {
        $base = [
            'id' => $question->id,
            'type' => studly_case( $question->type ),
            'typeLabel' => title_case( str_replace( '-', ' ', $question->type ) ),
            'scoringMethod' => studly_case( $question->scoringMethod ),
            'content' =>  $question->content,
        ];
        if ( isset( $question->answers ) )
            $base[ 'answerCount' ] = count( json_decode( $question->answers ) );

        return $base;
    }

    public function includeChoiceItems( $question )
    {
        if ( isset( $question->choiceItems ) )
            return $this->collection( $question->choiceItems, new QuestionChoiceItemSnapshotTransformer );
        return null;
    }

}
