<?php

namespace App\Transformers;

use App\ClassroomUser;
use League\Fractal\TransformerAbstract;

class ClassroomUserTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'teachableUsers', 'user', 'classroom'
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( ClassroomUser $classroomUser )
    {
        return [
            'id' => $classroomUser->id,
            'role' => $classroomUser->roles->first()->name,
            'lastAccessedAt' => $classroomUser->last_accessed_at ? $classroomUser->last_accessed_at->toIso8601String() : null,
            'lastAccessedAtForHumans' => $classroomUser->last_accessed_at ? $classroomUser->last_accessed_at->diffForHumans() : null,
            'joinedAt' => $classroomUser->created_at ? $classroomUser->created_at->toIso8601String() : null,
            'joinedAtForHumans' => $classroomUser->created_at ? $classroomUser->created_at->diffForHumans() : null,

        ];
    }

    public function includeClassroom( ClassroomUser $classroomUser )
    {
        return $this->item( $classroomUser->classroom, new ClassroomTransformer );
    }

    public function includeTeachableUsers( ClassroomUser $classroomUser )
    {
        return $this->collection( $classroomUser->teachableUsers, new TeachableUserTransformer );
    }

    public function includeUser( ClassroomUser $classroomUser )
    {
        return $this->item( $classroomUser->user, new UserTransformer );
    }
}
