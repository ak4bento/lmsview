<?php

namespace App\Http\Controllers;

use Validator;
use App\Teachable;
use App\Quiz\Quiz;
use Spatie\MediaLibrary\Models\Media;
use App\Resource;
use Illuminate\Http\Request;
use App\Transformers\TeachableTransformer;
use Illuminate\Support\Facades\DB;


class TeachableController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        $validator = Validator::make( $request->all(), [
            'classroom' => 'required|exists:classrooms,slug'
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        $classroom = \App\Classroom::where( 'slug', $request->classroom )->first();
        if ( !$classroom->isParticipating() )
            return abort( 403, 'Unauthorized' );

        if ($request->context === 'teachableStudent') {
            $resultTeachable = [];

            $teachables = $classroom->teachables()->with(
                array_merge(
                    [ 'createdBy', 'teachable' ],
                    $classroom->selfClassroomUser->hasRole( 'student' ) ?
                    [
                        'prerequisites',
                        'prerequisites.requirable',
                        'prerequisites.requirable.teachable'
                    ] : []
                )
            )->get();

            $classroomUser = \App\ClassroomUser::where([
                'classroom_id' => $classroom->id ,
                'user_id' => auth()->user()->id
            ])->first();

            $includes = array_merge(
                [ 'createdBy', 'teachableItem' ],
                $classroom->selfClassroomUser->hasRole( 'student' ) ?
                [
                    'prerequisites',
                    'teachableSelf',
                    'prerequisites.requirable.teachableItem',
                ] : []
            );

            $teachables = fractal()
                ->collection( $teachables )
                ->transformWith( new TeachableTransformer )
                ->parseIncludes( $includes )
                ->toArray();

            foreach ($teachables['data'] as $teachable) {
                $teachableUser = \App\TeachableUser::where([
                    'teachable_id' => $teachable['id'],
                    'classroom_user_id' => $classroomUser->id
                ])->first();

                $teachableSelf = null;

                if ($teachableUser) {
                    $teachableSelf =  [
                        'id' => $teachableUser->id,
                        'completedAt' => $teachableUser->completed_at ? $teachableUser->completed_at->toDateTimeString() : $teachableUser->completed_at ,
                        'completedAtForHumans' => $teachableUser->completed_at ? \Carbon\Carbon::parse($teachableUser->completed_at)->diffForHumans() : ""
                    ];
                }

                array_push($resultTeachable, (object) array_merge( $teachable, [
                    'teachableSelf' => $teachableSelf ? ['data' => $teachableSelf] : null
                ]));
            }

            return [
                'data' => $resultTeachable
            ];
        } else {
            $teachables = $classroom->teachables()->with(
                array_merge(
                    [ 'createdBy', 'teachable' ],
                    $classroom->selfClassroomUser->hasRole( 'student' ) ?
                    [
                        'selfTeachableUser',
                        'prerequisites',
                        'prerequisites.requirable',
                        'prerequisites.requirable.teachable'
                    ] : []
                )
            )->get();

            $includes = array_merge(
                [ 'createdBy', 'teachableItem' ],
                $classroom->selfClassroomUser->hasRole( 'student' ) ?
                [
                    'prerequisites',
                    'teachableSelf',
                    'prerequisites.requirable.teachableItem',
                ] : []
            );

            return fractal()
                ->collection( $teachables )
                ->transformWith( new TeachableTransformer )
                ->parseIncludes( $includes )
                ->respond();
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make( $request->all(), [
            'classroom'     => 'required|exists:classrooms,slug',
            'teachableType' => 'required|in:quiz,resource,assignment',
            'availableAt'   => 'nullable|date',
            // 'pass_threshold' => 'required|numeric|',
            'max_attempts' => 'integer|min:0|',
            'expiresAt'     => ( $request->teachableType == 'assignment' ? 'required' : 'nullable' ) . '|date',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );

        // get access classroom
        $forClassroom = \App\Classroom::where( 'slug', $request->classroom )->first();

        // only teacher authorized to create teachable
        $selfClassroomUser = $forClassroom->selfClassroomUser;
        if ( !$selfClassroomUser ) return abort( 403, 'Unauthorized' );
        if ( !$selfClassroomUser->hasRole( 'teacher' ) ) return abort( 403, 'Unauthorized' );

        switch( $request->teachableType ) {
            case 'resource': $teachableItem = \App\Resource::makeFromTeachableRequest( $request ); break;
            case 'assignment': $teachableItem = \App\Assignment::makeFromTeachableRequest( $request ); break;
            case 'quiz': $teachableItem = \App\Http\Controllers\QuizController::store( $request ); break;
        }

        $teachable = new Teachable;

        if ($request->teachableType === 'quiz') {
            $teachable->teachable_id = $teachableItem['quiz']->id; 
            $teachable->pass_threshold = $request->pass_threshold ?: 80;
            $teachable->max_attempts_count = $request->max_attempts_count ?: 1;
        } else {
            $teachable->teachable_id = $teachableItem->id;    
        }
        $teachable->teachable_type = $request->teachableType;
        $teachable->order = $forClassroom->teachables()->max( 'order' ) + 1;
        $teachable->available_at = $request->availableAt ?: null;
        $teachable->expires_at = $request->expiresAt ?: null;
        $teachable->created_by = auth()->user()->id;

        $forClassroom->teachables()->save( $teachable );
        return response()->json([ 'message' => 'ok', 'id' => $teachable->id ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Teachable  $teachable
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, Teachable $teachable)
    {
        if ( !$teachable->classroom->isParticipating() )
            return abort( 403, 'Unauthorized' );

            // result aimed to load single teachable 
            $teachable->load(
                'classroom.selfClassroomUser',
                'createdBy',
                'teachable',
                'teachable.media'
            );
    
           $result = fractal()
            ->item( $teachable )
            ->transformWith( new TeachableTransformer )
            ->parseIncludes([
                'classroom.self',
                'createdBy',
                'teachableItem',
                'teachableItem.media',
                ]);
            
            // statistik student who complete quiz
            $studentTeachables = \App\TeachableUser::where('teachable_id', $teachable->id )
                    ->with(['classroomUser.user'])
                    ->get();

        switch ($request->context) {
            case 'statistik':
                $query = [];
                foreach($studentTeachables as $student) {
                    $media = \Spatie\MediaLibrary\Models\Media::where([
                        'model_id' => $student->classroom_user_id,
                        'model_type' => 'teachableUser'
                    ])->first();

                    $grade = \App\Grade::where([
                        'gradeable_id' => $student->classroom_user_id, 
                    ])->first();
                    
                    if (!empty($media) && !empty($grade)) {
                        $query[] = [
                            "student" => $student,
                            "media" => $media,
                            "grade" => $grade,
                        ];
                    }
                }

                $totalStudentDone = count($query);
                $classroom = \App\Classroom::find($teachable->classroom_id);
                $totalStudent = $classroom->total_students;
                
                return [
                    "done" => $totalStudentDone,
                    "undone" => $classroom ? $totalStudent - $totalStudentDone : 0,
                ];

                break;

            default:
                return $result->respond();
                break;
        }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Teachable  $teachable
     * @return \Illuminate\Http\Response
     */
    public function update( Request $request, Teachable $teachable)
    {
        $validator = Validator::make( $request->all(), [
            'availableAt'   => 'nullable|date_format:Y-m-d H:i:s',
            'expiresAt'     => 'nullable|date_format:Y-m-d H:i:s',
        ] );
        if ( $validator->fails() ) return response()->json( [ 'errors' => $validator->errors() ], 422 );
        
        switch ($request->teachableType) {
            case 'quiz':
                $quiz = $teachable->teachable()->first();

                $request->validate([
                    'title'                => 'required|string',
                    'description'          => 'required|string',
                ]);

                $quiz->grading_method           = 'standard';
                $quiz->title                    = $request->title;
                $quiz->description              = $request->description;
                $quiz->save();
                
                $teachable->pass_threshold      = $request->pass_threshold;
                $teachable->max_attempts_count  = $request->max_attempts_count;
                break;
            case 'assignment':
                $assignment = $teachable->teachable()->first(); 

                $request->validate([
                    'title'                => 'required|string',
                    'description'          => 'required|string',
                ]);

                $assignment->title         = $request->title;
                $assignment->description   = $request->description ? clean( $request->description ) : '';
                $assignment->save();
                break;
            case 'resource':
                $resource = $teachable->teachable()->first();

                $request->validate([
                    'title'                 => 'required|string',
                    'description'           => 'required|string',
                    'resourceType'          => 'required|in:jwvideo,youtubevideo,audio,documents,url,linkvideo',
                    'resourceTypeSettings'  => 'required|json',
                ]);

                $resource->title            = $request->title;
                $resource->description      = $request->description;
                $resource->type             = $request->resourceType;

                switch ($request->resourceType) {
                    case 'jwvideo':
                        $data = json_decode( $request->resourceTypeSettings );
                        $data->playerId = env('JWPLAYER_PLAYER_KEY', '' );
                        $resource->data = json_encode( $data );
                        break;
                    case 'youtubevideo':
                    case 'url':
                    case 'linkvideo':
                        $resource->data = $request->resourceTypeSettings;
                        break;
                    case 'audio':
                        if ($request->old_files) {
                                $oldFile = json_decode($request->old_files);

                            foreach ($oldFile->data as $i) {
                                $media = Media::where('id', $i->id);
                                $media->forceDelete();
                            }   
                        }
                    
                        if($request->hasFile( 'resourceFile' )) {
                            $resource->addMedia($request->file('resourceFile'))->toMediaCollection( 'audio' );
                        }
                        break;
                }
                
                if ($request->file){
                    foreach($request->file('file') as $file) {
                        $resource->addMedia($file)->toMediaCollection( 'files' );
                    }
                }   
                $resource->save();  
                break;
            default:  
                // code
                break;
        }

        if ( $request->teachableType ) {
            if($request->has('availableAt')) { $teachable->available_at = $request->availableAt; }
            if($request->has('expiresAt')) { $teachable->expires_at = $request->expiresAt; }
        } else {
            if($request->has('availableAt')) {
                $teachable->available_at = $request->availableAt;
                $teachable->expires_at = $request->expiresAt;
            }

            if($request->has('expiresAt')) {
                $teachable->available_at = $request->availableAt;
                $teachable->expires_at = $request->expiresAt;
            }
        }

        $teachable->save();
        return $this->show( $request , $teachable);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Teachable  $teachable
     * @return \Illuminate\Http\Response
     */
    public function destroy(Teachable $teachable)
    {
        $delete = $teachable->delete();
        return [
            "isSuccess" => $delete,
        ];
    }
}
