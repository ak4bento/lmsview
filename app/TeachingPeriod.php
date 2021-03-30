<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeachingPeriod extends Model
{
    protected $appends = ['classroom_count', 'student_count', 'teacher_count'];
    public function classrooms() {
        return $this->hasMany('App\Classroom');
    }

    public function getClassroomCountAttribute() {
        return $this->classrooms()->count();
    }

    public function classroomUserTeacher()
    {
        return $this->hasManyThrough('App\ClassroomUser', 'App\Classroom')->role('teacher');
    }

    public function classroomUserStudent()
    {
        return $this->hasManyThrough('App\ClassroomUser', 'App\Classroom')->role('student');
    }

    public function getStudentCountAttribute() {
        return $this->classroomUserStudent()->count();  
    }

    public function getTeacherCountAttribute() {
        return $this->classroomUserTeacher()->count();   
    }
}
