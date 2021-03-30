<?php

namespace App\Transformers;

use App\Quiz\QuestionChoiceItem;
use League\Fractal\TransformerAbstract;

class QuestionChoiceItemTransformer extends TransformerAbstract
{
    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( QuestionChoiceItem $qci )
    {
        return [
            'choiceText' => $qci->choice_text,
        ];
    }
}
