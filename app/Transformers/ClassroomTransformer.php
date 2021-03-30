<?php

namespace App\Transformers;

use App\Classroom;
use League\Fractal\TransformerAbstract;

class ClassroomTransformer extends TransformerAbstract
{

    protected $availableIncludes = [
        'self',
        'files',
        'teachers',
        'categories',
        'teachables',
        'discussions',
    ];

    /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform( Classroom $classroom )
    {
        $category = $classroom->categories->first();
        return [
            'slug' => $classroom->slug,
            'code' => $classroom->code,
            'subject_id' => $classroom->subject_id,
            'title' => $classroom->title,
            'teaching_period_id' => $classroom->teaching_period_id ,
            'description' => $classroom->description,
            'studentsCount' => $classroom->students_count,
            'major' => $category ? $category->id : null ,
            'faculty' => $category ? $category->parent->id : null ,

            'createdAt' => $classroom->created_at ? $classroom->created_at->toIso8601String() : null,
            'createdAtForHumans' => $classroom->created_at ? $classroom->created_at->diffForHumans() : null,
            'start_at' => $classroom->start_at ,
            'end_at' => $classroom->end_at
        ];
    }

    public function includeCategories( Classroom $classroom )
    {
        return $this->collection( $classroom->categories, new CategoryTransformer );
    }

    public function includeDiscussions( Classroom $classroom )
    {
        return $this->collection( $classroom->discussions, new DiscussionTransformer );
    }

    public function includeSelf( Classroom $classroom )
    {
        // prevent error when classroom user is empty
        if ($classroom->selfClassroomUser) return $this->item( $classroom->selfClassroomUser, new ClassroomUserTransformer );
        else return null;
    }

    public function includeTeachers( Classroom $classroom )
    {
        return $this->collection( $classroom->teachers, new ClassroomUserTransformer );
    }

    public function includeTeachables( Classroom $classroom )
    {
        return $this->collection( $classroom->teachables, new TeachableTransformer );
    }

    public function includeFiles( Classroom $classroom )
    {
        return $this->collection( $classroom->files, new MediaTransformer );
    }
}
