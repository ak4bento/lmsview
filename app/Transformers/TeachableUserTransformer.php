<?php

namespace App\Transformers;

use App\TeachableUser;
use League\Fractal\TransformerAbstract;

class TeachableUserTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'classroomUser', 'grade', 'media', 'quizAttempts', 'teachable'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( TeachableUser $teachableUser )
    {
        return [
            'id' => $teachableUser->id,
            'completedAt' => $teachableUser->completed_at ? $teachableUser->completed_at->toIso8601String() : null,
            'completedAtForHumans' => $teachableUser->completed_at ? $teachableUser->completed_at->diffForHumans() : null,
        ];
    }

    public function includeClassroomUser( TeachableUser $teachableUser )
    {
        return $this->item( $teachableUser->classroomUser, new ClassroomUserTransformer );
    }

    public function includeGrade( TeachableUser $teachableUser )
    {
        if ( $teachableUser->grades->count() == 0 )
            return null;
        return $this->item( $teachableUser->grades->first(), new GradeTransformer );
    }

    public function includeMedia( TeachableUser $teachableUser )
    {
        return $this->collection( $teachableUser->media, new MediaTransformer );
    }

    public function includeQuizAttempts( TeachableUser $teachableUser )
    {
        return $this->collection( $teachableUser->quizAttempts, new QuizAttemptTransformer );
    }

    public function includeTeachable( TeachableUser $teachableUser )
    {
        return $this->item( $teachableUser->teachable, new TeachableTransformer );
    }

}
