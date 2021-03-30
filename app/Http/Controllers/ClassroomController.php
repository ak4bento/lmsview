<?php

namespace App\Http\Controllers;

use App\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Transformers\ClassroomTransformer;
use App\User;
use App\TeachingPeriod;
use App\ClassroomUser;
use App\ModelHasRole;
use App\Teachable;
use App\Categorizable;

class ClassroomController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $includes = [];
        switch( auth()->user()->roles->first()->name ) {
            case 'super':
            case 'admin':                
                // if ($request->context === 'studentsHasClassrooms' || $request->context === 'teachersHasClassrooms') {
                //     $user = User::where('id', $request->id)->first();
                    
                //     return Classroom::whereNotIn( 'id', function($query) use ($user) {
                //         $query->select('classroom_id')
                //             ->from('classroom_user')
                //             ->where('user_id', $user->id)
                //             ->where('deleted_at', null);
                //         })->where('title', 'LIKE', '%' . $request->q . '%')->get();
                    
                // } else {
                //     $model = Classroom::with('teachingPeriod')->withCount('students');

                //     if ($request->q) {
                //         $model->where('title', 'like', '%' . $request->q . '%');
                //         $model->orWhere('code', 'like', '%' . $request->q . '%');
                //         $model->orWhereHas('subject', function ($q) use ($request) {
                //             $q->where('title', 'like', '%' . $request->q . '%');
                //         });
                //     }

                //     return $model->orderBy('created_at', 'DESC')->paginate(10);
                // }
            case 'teacher':
                $classrooms = auth()->user()->classrooms()
                    // selfClassroomUser should be not empty
                    ->has('selfClassroomUser')
                    ->with([
                        'teachers',
                        'categories',
                        'teachers.user',
                        'teachers.roles',
                        'selfClassroomUser',
                        'selfClassroomUser.roles',
                    ])
                    // ->orderBy(DB::raw('TIMESTAMPDIFF( MINUTE, start_at, NOW() )'))
                    // ->orderBy('title', 'desc')
                    ->orderBy(DB::raw('SIGN(TIMESTAMPDIFF ( MINUTE, start_at, ADDTIME(NOW(), "8:00:00") )), ABS(TIMESTAMPDIFF ( MINUTE, start_at, ADDTIME(NOW(), "8:00:00") ))'))
                    ->withCount([ 'students' ])
                    ->get();
                $includes = array_merge( $includes, [ 'self', 'teachers', 'categories', 'teachers.user' ] );
                break;
            case 'student':
                // $user = auth()->user();
                // $teachingPeriod = TeachingPeriod::with(['classrooms' => function($query) use ($user) {
                //     $query->whereHas('classroomUsers',
                //         function($query) use ($user) {
                //             $query->where('user_id',$user->id);
                //         }
                //     );
                // }])->whereHas('classroomUserStudent',
                //     function($query) use ($user) {
                //         $query->where('user_id',$user->id);
                //     }
                // ); 
                
                // switch ($request->key) {
                //     case '2019-Ganjil':
                //         return $teachingPeriod->where('name', '2019-Ganjil')->get();
                //         break;
                //     case '2018-genap':
                //         return $teachingPeriod->where('name', '2018-genap')->get();
                //         break;
                //     case '2018-ganjil':
                //         return $teachingPeriod->where('name', '2018-ganjil')->get();
                //         break;
                //     default:
                //         return $teachingPeriod;
                //         break;
                // }
                // break;
                $classrooms = auth()->user()->classrooms()
                    ->with([
                        'teachers',
                        'categories',
                        'teachers.user',
                        'teachers.roles',
                        'selfClassroomUser',
                        'selfClassroomUser.roles',
                    ]);

                    // ->orderBy(DB::raw('TIMESTAMPDIFF( MINUTE, start_at, NOW() )'))
                    // ->orderBy('title', 'desc')
                if ($request->teaching_period) {
                    $classrooms->whereHas('teachingPeriod', function($query) use ($request) {
                        $query->where('name', $request->teaching_period);
                    });
                };

                $classrooms = $classrooms->orderBy(DB::raw('SIGN(TIMESTAMPDIFF ( MINUTE, start_at, ADDTIME(NOW(), "8:00:00") )), ABS(TIMESTAMPDIFF ( MINUTE, start_at, ADDTIME(NOW(), "8:00:00") ))'))
                    ->withCount([ 'students' ])
                    ->get();
                $includes = array_merge( $includes, [ 'self', 'teachers', 'categories', 'teachers.user' ] );
                break;
        }

        return fractal()
            ->collection( $classrooms )
            ->transformWith( new ClassroomTransformer )
            ->parseIncludes( $includes )
            ->respond();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        switch ($request->context) {
            case 'students':
            case 'teachers':
                $userStudent = DB::table('roles')->where('name', 'student')->first();
                $roleStudent = $userStudent->id;
                $userTeacher = DB::table('roles')->where('name', 'teacher')->first();
                $roleTeacher = $userTeacher->id;
                
                $users = [];
                $userCLassroomAndId = [];
                $assignUser = json_decode($request->assignUser);
                $classroom = Classroom::where('slug', $request->classroom)->first();
                $date =  date('Y-m-d H:i:s');

                foreach ($assignUser as &$user_id) {
                    array_push($users, [
                        'classroom_id' => $classroom->id ,
                        'user_id' => $user_id ,
                        'created_at' => $date,
                        'updated_at' => $date
                    ]);
                    array_push($userCLassroomAndId, [$classroom->id , $user_id]);
                };

                if (ClassroomUser::insert($users)) {
                    $listClassroomUser = ClassroomUser::whereInMultiple(['classroom_id', 'user_id'], $userCLassroomAndId)->get();
                    $arrListClassroomUser = [];

                    foreach($listClassroomUser as &$data) {
                        array_push($arrListClassroomUser, [
                            'role_id' => $request->context === 'students' ? $roleStudent : $roleTeacher,
                            'model_type' => 'classroomUser' ,
                            'model_id' => $data->id
                        ]);
                    }
                    
                    if(ModelHasRole::insert($arrListClassroomUser)) {
                        return [
                            "isSuccess" => true
                        ];
                    } else {
                        return [
                            "isSuccess" => false
                        ];
                    }
                } 
                break;
            default:
                $classroom = new Classroom;

                $classroom->title = $request->title;
                $classroom->code = $request->code;
                $classroom->description = $request->description;
                $classroom->subject_id = $request->subject;
                $classroom->teaching_period_id = $request->teachingPeriod;
                $classroom->created_by = auth()->user()->id;
                $classroom->start_at = $request->starttime;
                $classroom->end_at  = $request->endtime;

                if($classroom->save()) {
                    if ($request->major && $request->major > 0) {
                        // $categorizable = new Categorizable;

                        // $categorizable->category_id = $request->major;
                        // $categorizable->categorizable_type = 'classroom';
                        // $categorizable->categorizable_id = $classroom->id;

                        // $categorizable->save();

                        $classroom->categories()->attach( $request->major );
                        //attach claroom cateogries
                    }

                    return [
                        "classroom" => $classroom
                    ];
                } else {
                    return [
                        "classroom" => []
                    ];
                }
                break;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Classroom  $classroom
     * @return \Illuminate\Http\Response
     */
    public function show( Classroom $classroom, Request $request )
    {
        $includes = [];
        switch( auth()->user()->roles->first()->name ) {
            case 'super':
            case 'admin':
                $includes = array_merge( $includes, [ 'categories.parent' ] );
                break;
            case 'teacher':
            case 'student':
                $selfClassroomUser = $classroom->selfClassroomUser;
                if ( !$selfClassroomUser ) return abort( 403 );
                $selfClassroomUser->updateAccessedAt();
                $includes = array_merge( $includes, [ 'self', 'teachers', 'categories', 'teachers.user' ] );
        }


        return fractal()
            ->item( $classroom )
            ->transformWith( new ClassroomTransformer )
            ->parseIncludes( $includes )
            ->respond();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Classroom  $classroom
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $slug)
    {
        $classroom = Classroom::where('slug','=',$slug)->first();
        $classroom->title = $request->title;
        $classroom->code = $request->code;
        $classroom->slug = null;
        $classroom->description = $request->description;
        $classroom->subject_id = $request->subject;
        $classroom->teaching_period_id = $request->teachingPeriod;
        $classroom->created_by = auth()->user()->id;
        $classroom->start_at = $request->starttime;
        $classroom->end_at = $request->endtime;
        $request->major_id = $request->major;
        if ( $classroom->save() ) {
            return [
                "isSuccess" => true,
            ];
        } else {
            return [
                "data" => [],
            ];
        }
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Classroom  $classroom
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Classroom $classroom)
    {
        switch ($request->context) {
            case 'user':
                ModelHasRole::where('model_id', $request->id)->where('model_type', 'classroomUser')->delete();
                // TeachableUser::where(['classroom_user_id' , $request->id, ])->delete();
                ClassroomUser::where('id', $request->id)->delete();
                break;

            default:
                # code...
                break;
        }

        return [
            "isSuccess" => true ,
        ];
    }

    public function users(Request $request)
    {
        // $data =;
        switch ($request->context) {
            case 'students':
                $data =  Classroom::whereSlug($request->slug)
                    ->first()
                    ->students();
                break;
            case 'teachers':
                $data =  Classroom::whereSlug($request->slug)
                    ->first()
                    ->teachers();
                break;
        }

        if($request->q) {
            $data
                ->whereHas('user', function ($query) use ($request) {
                    $query->where('name', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('username', 'LIKE', '%' . $request->q . '%');
                })
                ->with('user.categorizable.category');
            
        } else {
            $data->with('user.categorizable.category');
        }

        return $data
            // ->teachers()
            ->orderBy('created_at', 'DESC')
            ->paginate(10);
    }
}
