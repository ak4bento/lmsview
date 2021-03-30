<?php

namespace App\Transformers;

use App\Grade;
use League\Fractal\TransformerAbstract;

class GradeTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'gradedBy'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Grade $grade )
    {
        return [
            'grade' => $grade->grade,
            'comments' => $grade->comments,
            'completedAt' => $grade->completed_at ? $grade->completed_at->toIso8601String() : null,
            'completedAtForHumans' => $grade->completed_at ? $grade->completed_at->diffForHumans() : null,
            'createdAt' => $grade->created_at ? $grade->created_at->toIso8601String() : null,
            'createdAtForHumans' => $grade->created_at ? $grade->created_at->diffForHumans() : null,
        ];
    }

    public function includeGradedBy( Grade $grade )
    {
        if ( $grade->gradedBy == null )
            return null;
        return $this->item( $grade->gradedBy, new UserTransformer );
    }
}
