<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;

class QuestionChoiceItemSnapshotTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( $qci )
    {
        return [
            'id' => $qci->id,
            'choiceText' => $qci->choiceText,
            'isCorrect' => (bool) $qci->isCorrect,
        ];
    }
}
