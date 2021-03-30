<?php

namespace App\Transformers;

use App\Prerequisite;
use League\Fractal\TransformerAbstract;

class PrerequisiteTransformer extends TransformerAbstract
{

    protected $defaultIncludes = [
        'requirable',
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Prerequisite $prerequisite )
    {
        return [
            'id' => $prerequisite->id,
        ];
    }

    public function includeRequirable( Prerequisite $prerequisite )
    {
        return $this->item( $prerequisite->requirable, new TeachableTransformer );
    }
}
