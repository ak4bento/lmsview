<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Transformers\UserTransformer;
use App\Transformers\ClassroomUserTransformer;

use App\User;
use App\teachable;
use App\Grade;
use App\Categorizable;
use App\Classroom;
use App\ClassroomUser;
use App\ModelHasRole;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * @case    studentAssignment       
     *          list student who are complete, not complete, and not checked (grade)
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        switch ($request->context) {
            case 'studentsNotInClassroom':
            case 'teachersNotInClassroom':
                $classroom = Classroom::where('slug', $request->classroom)->firstOrFail();
                
                $users = User::role($request->context == 'studentsNotInClassroom' ? 'student' : 'teacher')
                    ->with(['categorizable.category'])
                    ->whereNOTIn('id', function($query) use ($classroom){
                        $query->select('user_id')
                            ->from('classroom_user')
                            ->where('classroom_id', $classroom->id)
                            ->whereNull('deleted_at');
                    })
                    ->where('username', 'like', '%' . $request->q . '%')
                    ->orderBy('created_at','DESC')
                    ->get()
                    ->toJSON();
                break;
            case 'studentAssignment':  
                $teachable = \App\Teachable::where('id', $request->teachable)->first();
                
                $students = \App\Classroom::where('id', $teachable->classroom_id)
                    ->first()
                    ->students()
                    ->with(['teachableUsers' => function($query) use ($request) {
                        $query->where('teachable_id', $request->teachable);
                    }, 'teachableUsers.media', 'teachableUsers.grades', 'user'])
                    ->get(); 

                    $includes = [ 'teachableUsers.media', 'user', 'teachableUsers.grade' ];
                // return $students;
                
                return fractal()
                ->collection( $students )
                ->transformWith( new ClassroomUserTransformer )
                ->parseIncludes( $includes )
                ->respond();
            default:
                $users = User::with(['categorizable.category']);
                
                if ($request->q) {
                   $users->where('name', 'like', '%' . $request->q . '%');
                   $users->orWhere('username', 'like', '%' . $request->q . '%');
                   $users->orWhere('email', 'like', '%' . $request->q . '%');
                }

                $users = $users->role($request->context)->orderBy('created_at','DESC')->paginate(10);
                break;
        }
        return $users;
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
                $roleName = substr($request->context, 0, -1); //will be result as a teacher or student
                $role = DB::table('roles')->where('name', $roleName )->first();

                $classroom_user = [];
                $assignClassroom = json_decode($request->assignClassroom);
                $user = json_decode($request->user);
                $date =  date('Y-m-d H:i:s');

                $classroomUserData = [];
                foreach ($assignClassroom as &$classroom_id) {
                    array_push($classroom_user, [
                        'classroom_id' => $classroom_id,
                        'user_id' => $user,
                        'created_at' => $date,
                        'updated_at' => $date
                    ]);
                    array_push($classroomUserData, [$classroom_id, $user]);     
                }
                
                if (ClassroomUser::insert($classroom_user)) {
                    $listClassroomUser = ClassroomUser::whereInMultiple(['classroom_id', 'user_id'], $classroomUserData)
                        ->get();
                    $arrListClassroomUser = [];

                    foreach($listClassroomUser as &$data) {
                        array_push($arrListClassroomUser, [
                            'role_id' => $role->id,
                            'model_type' => 'classroomUser',
                            'model_id' => $data->id
                        ]);
                    }

                    if(ModelHasRole::insert($arrListClassroomUser)){
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
                $user = new User;
                $user->email = $request->email;
                $user->name = $request->name;
                $user->password = Hash::make($request->password ?: 12345678);
                $detail = [ 'birthdate' => $request->birthdate ];
                if ($request->context === 'student') {
                    $detail['nim'] = $request->nim;
                    $detail['teachingPeriod'] = $request->teachingPeriod;
                } else {
                    $detail['nip'] = $request->nip;
                }
                $user->detail = json_encode($detail);

                if ($user->save()) {
                    $user->assignRole($request->context);
                    $user->category()->attach($request->major);
                    return [
                        'user' => $user
                    ];
                } else {
                    return [
                        'user' => false
                    ];
                }
                break;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, User $user)
    {
        $includes = [];
        switch( auth()->user()->roles->first()->name ) {
            case 'super':
            case 'admin':
                $user->load(['categorizable.category.parent']);
                array_push($includes,"category");
                break;
        }

        return fractal()
            ->item( $user )
            ->transformWith( new UserTransformer )
            ->parseIncludes( $includes )
            ->respond();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        switch ($request->context) {
            default:
                $categorizable = Categorizable::where([
                    'categorizable_type' => $request->context ,
                    'categorizable_id' => $user->id
                    ])->first();
                
                if (!$categorizable) {
                    $categorizable = new Categorizable;
                    $categorizable->categorizable_id = $user->id;
                    $categorizable->categorizable_type = $request->context;
                }
                
                $user->email = $request->email ?: null;
                $user->name = $request->name;

                if ($request->password) 
                    $user->password = Hash::make($request->password ?: 12345678);

                $categorizable->category_id = $request->major;
                
                if ($request->context === 'student') {
                    $user->detail = json_encode([
                        'nim' => $request->nim,
                        'birthdate' => $request->birthdate,
                        'teachingPeriod' => $request->teachingPeriod,
                    ]);
                } else {
                    $user->detail = json_encode([
                        'nip' => $request->nip,
                        'birthdate' => $request->birthdate,
                    ]);
                }

                if ($user->save()) {
                    $categorizable->save();
                    return [
                        'user' => $user
                    ];
                } else {
                    return [
                        'user' => false
                    ];
                }
            break;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        switch ($request->context) {
            case 'classroom':
                ModelHasRole::where(['model_id' => $request->user, 'model_type' => 'classroomUser'])->delete();
                ClassroomUser::where('id', $request->user)->delete();
            default:
                # code...
                break;
        }

        return [
            "isSuccess" => true
        ];
    }

    /**
     * Display a listing of classroom that user asigned in it
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function classrooms(Request $request)
    {       
        $user = User::where('id', $request->id);
        $pointedUser = $user->first();

        // if ($request->q) {
        switch ($request->context) {
            case 'students': $classroomHasBeenAssigned =$pointedUser->students(); break;
            case 'teachers': $classroomHasBeenAssigned =$pointedUser->teachers()->with('classroom'); break;
        }
        // } else {
        //     switch ($request->context) {
        //         case 'students': $classroomHasBeenAssigned = $pointedUser->students()->with('classroom'); break;
        //         case 'teachers': $classroomHasBeenAssigned = $pointedUser->teachers()->with('classroom'); break;
        //     }
        // }

        if ($request->q) {
            $classroomHasBeenAssigned->whereHas('classroom.subject', function($query) use ($request) {
                $query->where('title', 'like', '%' . $request->q . '%');
            });
        }

        return $classroomHasBeenAssigned->with('classroom')->orderBy('created_at', 'DESC')->paginate(10);
    }
}
