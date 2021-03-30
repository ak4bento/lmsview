<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class QuestionAnswerTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( $questionAnswer )
    {
        $base = [
            'questionId' => $questionAnswer->questionId,
            'score' => array_key_exists('score', $questionAnswer) ? $questionAnswer->score : null ,
            'answeredAt' => array_key_exists('answeredAt', $questionAnswer) ? 
                \Carbon\Carbon::parse( $questionAnswer->answeredAt->date )->toIso8601String() : null,
        ];

        if (array_key_exists('questionType', $questionAnswer)) {
            switch( $questionAnswer->questionType ) {
                case 'multiple-choice':
                case 'boolean':
                    return array_merge( $base, [ 'answerId' => $questionAnswer->answerId ] );
                case 'multiple-response':
                case 'fill-in':
                    return array_merge( $base, [ 'answers' => $questionAnswer->answers ] );
                case 'essay':
                    return array_merge( $base, [ 'content' => $questionAnswer->content ] );
            }
        }
        
        return $base;
    }
}
