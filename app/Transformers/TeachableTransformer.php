<?php

namespace App\Transformers;

use App\Thread;
use App\Teachable;
use League\Fractal\TransformerAbstract;

class TeachableTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'thread',
        'classroom',
        'createdBy',
        'discussions',
        'prerequisites',
        'teachableItem',
        'teachableSelf',
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Teachable $teachable )
    {
        $currentDateTime = \Carbon\Carbon::now()->setTimezone('UTC')->toDateTimeString();
        
        //set language for timestamp
        \Carbon\Carbon::setLocale('id');
        $createdAt = \Carbon\Carbon::parse($teachable->created_at);

        return [
            'id' => $teachable->id,
            'type' => $teachable->teachable_type,
            'order' => $teachable->order,
            'availableAt' => optional( $teachable->available_at )->toIso8601String(),
            'expiresAt' => optional( $teachable->expires_at )->toIso8601String(),
            'expiresAtForHumans' => \Carbon\Carbon::parse($teachable->expires_at)->diffForHumans(),
            'finalGradeWeight' => $teachable->final_grade_weight,
            'maxAttempts' => $teachable->max_attempts_count,
            'createdAt' => $teachable->created_at->toIso8601String(),
            'createdAtForHumans' => $createdAt->diffForHumans(),
            'isOpen' => 
                (
                    !empty($teachable->expires_at) &&
                    !empty($teachable->available_at) &&
                    $teachable->available_at->lte($currentDateTime) &&
                    $teachable->expires_at->gte($currentDateTime)
                )  || (
                    !$teachable->expires_at &&
                    $teachable->available_at &&
                    $teachable->available_at->lte($currentDateTime)
                ) || (
                    !$teachable->available_at &&
                    $teachable->expires_at &&
                    $teachable->expires_at->gte($currentDateTime)
                )
        ];
    }

    public function includeClassroom( Teachable $teachable )
    {
        return $this->item( $teachable->classroom, new ClassroomTransformer );
    }

    public function includeCreatedBy( Teachable $teachable )
    {
        return $this->item( $teachable->createdBy, new UserTransformer );
    }

    public function includeDiscussions( Teachable $teachable )
    {
        return $this->collection( $teachable->discussions, new DiscussionTransformer );
    }

    public function includePrerequisites( Teachable $teachable )
    {
        return $this->collection( $teachable->prerequisites, new PrerequisiteTransformer );
    }

    public function includeThread( Teachable $teachable )
    {
        if ( $teachable->discussions->count() > 0 )
            return $this->item( new Thread( 'App\Teachable', $teachable ), new ClassroomThreadTransformer );

        return null;
    }

    public function includeTeachableItem( Teachable $teachable )
    {
        $transformers = [
            'quiz' => new QuizTransformer,
            'resource' => new ResourceTransformer,
            'assignment' => new AssignmentTransformer,
        ];
        return $this->item( $teachable->teachable, $transformers[ $teachable->teachable_type ] );
    }

    public function includeTeachableSelf( Teachable $teachable )
    {
        if ( !$teachable->selfTeachableUser )
            return null;

        return $this->item( $teachable->selfTeachableUser, new TeachableUserTransformer );
    }

}
