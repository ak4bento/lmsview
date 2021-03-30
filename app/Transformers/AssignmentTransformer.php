<?php

namespace App\Transformers;

use App\Assignment;
use League\Fractal\TransformerAbstract;

class AssignmentTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'media'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Assignment $assignment )
    {
        return [
            'id' => $assignment->id,
            'title' => strlen( $assignment->title ) > 0 ? $assignment->title : null,
            'description' => $assignment->description,
        ];
    }

    public function includeMedia( Assignment $assignment )
    {
        return $this->collection( $assignment->media, new MediaTransformer );
    }

}
