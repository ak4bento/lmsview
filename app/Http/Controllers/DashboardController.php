<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\User;
use App\Subject;
use App\Teachable;
use App\Grade;
use App\Classroom;
use App\ClassroomUser;
use App\Quiz\Quiz;

use App\Transformers\DashboardTransformer;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $totalStudent = User::role('student')->count();
        $totalClassroom = Classroom::all()->count();

        switch($request->context) {
            case 'admin':
                $users = User::all()->count();
                $teacher = User::role('teacher')->count();
                $student = User::role('student')->count();
                $classroom = Classroom::all()->count();
                $subject = Subject::all()->count();
                
                $listClassrooms = Classroom::latest('start_at')->limit(3)->get();
                
                $resultQuizzes = $listQuizzes = Teachable::latest('available_at')->limit(3)->get();
                $listQuizzes = $listQuizzes->load('teachable');
                
                $listClassEnroll = ClassroomUser::orderBy('id')->get();
                $groupedByValue = $listClassEnroll->groupBy('classroom_id')->count();
                $countClassroomEnroll = $totalClassroom - $groupedByValue;

                $listClassMaterial = Teachable::orderBy('id')->get();
                $groupedByMaterial = $listClassMaterial->groupBy('classroom_id')->count();
                $countClassroomMaterial = $totalClassroom - $groupedByMaterial;

                $classPercentage = Classroom::whereDate('end_at', '>', Carbon::today())->count();
                $totalActiveClassroom = round( ( $classPercentage / $totalClassroom ) * 100 );

                $resultStudentNotStart = ClassroomUser::where('last_accessed_at', '=', NULL)->get();
                $listStudentNotStart = $resultStudentNotStart->groupBy('user_id')->count(); 
                $totalStudentNotStart = round( ( $listStudentNotStart / $totalClassroom ));

                $HighestScore = DB::table('classroom_user')
                    ->leftJoin('users', 'users.id', '=', 'classroom_user.user_id')
                    ->leftJoin('classrooms', 'classrooms.id', '=', 'classroom_user.classroom_id')
                    ->leftJoin('teachable_user', 'teachable_user.classroom_user_id', '=', 'classroom_user.id')
                    ->leftJoin('grades', 'grades.gradeable_id', '=', 'teachable_user.id')
                    ->select(
                        'users.id as user_id',
                        'users.name as student_name',     
                        'classrooms.id as classroom_id',
                        'classrooms.title as classroom_title',
                        'classroom_user.id as classroom_user_id',
                        'teachable_user.id as teachableUser_id',
                        'teachable_user.teachable_id as teachable_id',
                        'grades.gradeable_type as type_of_grade',
                        'grades.grade'
                        )
                    ->orderBy('grades.grade', 'DESC')
                    ->take(20)
                    ->get();
                
                $LowestScore = DB::table('classroom_user')
                    ->leftJoin('users', 'users.id', '=', 'classroom_user.user_id')
                    ->leftJoin('classrooms', 'classrooms.id', '=', 'classroom_user.classroom_id')
                    ->leftJoin('teachable_user', 'teachable_user.classroom_user_id', '=', 'classroom_user.id')
                    ->leftJoin('grades', 'grades.gradeable_id', '=', 'teachable_user.id')
                    ->select(
                        'users.id as user_id',
                        'users.name as student_name',     
                        'classrooms.id as classroom_id',
                        'classrooms.title as classroom_title',
                        'classrooms.title as classroom_title',
                        'classroom_user.id as classroom_user_id',
                        'teachable_user.id as id',
                        'teachable_user.teachable_id as teachable_id',
                        'grades.gradeable_type as type_of_grade',
                        'grades.grade'
                        )
                    ->orderBy('grades.grade', 'ASC')
                    ->whereNotNull('grades.grade')
                    ->having('grades.grade', '>', 10)
                    ->take(20)
                    ->get();
                
                $classroomUser = DB::table('classroom_user')
                    ->leftJoin('users', 'users.id', '=', 'classroom_user.user_id')
                    ->leftJoin('classrooms', 'classrooms.id', '=', 'classroom_user.classroom_id')
                    ->leftJoin('teachable_user', 'teachable_user.classroom_user_id', '=', 'classroom_user.id')
                    ->leftJoin('grades', 'grades.gradeable_id', '=', 'teachable_user.id')
                    ->select(
                        'users.id as user_id',
                        'users.name as student_name',     
                        'classrooms.id as classroom_id',
                        'classrooms.title as classroom_title',
                        'classrooms.title as classroom_title',
                        'classroom_user.id as classroom_user_id',
                        'teachable_user.id as id',
                        'teachable_user.teachable_id as teachable_id',
                        'grades.gradeable_type as type_of_grade',
                        'grades.grade'
                    );

                $classroomComplete = $classroomUser->orderBy('grades.grade', 'ASC')
                    ->whereNull('grades.grade')
                    ->get()
                    ->groupBy('classroom_id')
                    ->count('classrooms.id');

                $studentComplete = $classroomUser->orderBy('grades.grade', 'ASC')
                    ->whereNull('grades.grade')
                    ->get()
                    ->groupBy('user_id')
                    ->count('users.id');
                    
                $classroomNotComplete = round(100 - ( $classroomComplete / $totalClassroom) * 100 ) ;
                $classroomOnProgress =  $classroomComplete;
                $studentNotComplete = round( ( $studentComplete / $users) * 100 ); 
                    
                return [
                    "teacher" => $teacher,
                    "student" => $student,
                    "classroom" => $classroom,
                    "subject" => $subject,
                    "listClassrooms" => $listClassrooms,
                    "listQuizzes" => $listQuizzes,
                    "alertClassroomEnroll" => $countClassroomEnroll,
                    "alertClassroomMaterial" => $countClassroomMaterial,
                    "classroomStatus" => $totalActiveClassroom,
                    "studentStatusNotStart" => $totalStudentNotStart,
                    "studentHighScore" => $HighestScore,
                    "studentLeastScore" => $LowestScore,
                    "classroomComplete" => $classroomNotComplete,
                    "classroomProgress" => $classroomOnProgress,
                    "studentProgress" => $studentNotComplete,
                ];
                break;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::where( 'id', $id )->first();
        return $user->load(['classroomUsers.classroom.teachables.teachableUsers.grades.quizAttempts']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
