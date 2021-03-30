<?php

namespace App\Http\Controllers;

use App\TeachingPeriod;
use Illuminate\Http\Request;

class TeachingPeriodController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {   
        if ($request->context == 'semester') {
            $user = auth()->user();
            if ($user->detail) {
                $detail = json_decode($user->detail);
                if (!isset($detail->teachingPeriod)) return [ "data" => []];
                $teachingPeriod = TeachingPeriod::where('id', $detail->teachingPeriod)->firstOrFail();

                $teachingPeriods = [];
                $listTeachingPeriod  = TeachingPeriod::where('id', '>=', $teachingPeriod->id)->get();
                $userHasClassroomTeachingPeriod = TeachingPeriod::where('id', '>=', $teachingPeriod->id)
                    ->whereHas('classroomUserStudent', function($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                    ->get();
                
                foreach ($listTeachingPeriod as $data) {
                    array_push($teachingPeriods, $data);
                    if (
                        $userHasClassroomTeachingPeriod[count($userHasClassroomTeachingPeriod)-1]->id ==
                        $data->id
                    ) break;
                }

                return [ "data" => $teachingPeriods ];
            } 
            
            return [ "data" => []];
        } else {
            $teachingPeriod = TeachingPeriod::orderBy('created_at','DESC');

                if ($request->page === "all") {
                    $userTeachingPeriod = $teachingPeriod->get();

                    return [
                        "data" => $userTeachingPeriod,
                    ];
                } else {
                    return $teachingPeriod->where('name', 'like', '%' . $request->q . '%')->paginate(10);
                }

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
        $teachingPeriod = new TeachingPeriod;

        $teachingPeriod->name = $request->name;
        $teachingPeriod->starts_at = $request->startDate;
        $teachingPeriod->ends_at = $request->endDate;
        $teachingPeriod->created_by = auth()->user()->id;

        if($teachingPeriod->save()) {
            return [
                "teachingPeriod" => $teachingPeriod
            ];
        } else {
            return [
                "teachingPeriod" => []
            ];
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\TeachingPeriod  $teachingPeriod
     * @return \Illuminate\Http\Response
     */
    public function show(TeachingPeriod $teachingPeriod)
    {
        return [
            "data" => $teachingPeriod
        ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\TeachingPeriod  $teachingPeriod
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TeachingPeriod $teachingPeriod)
    {
        $teachingPeriod->name = $request->name;
        $teachingPeriod->starts_at = $request->startDate;
        $teachingPeriod->ends_at = $request->endDate;

        return [
            "data" => $teachingPeriod->save() ? $teachingPeriod : null
        ];
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\TeachingPeriod  $teachingPeriod
     * @return \Illuminate\Http\Response
     */
    public function destroy(TeachingPeriod $teachingPeriod)
    {
        //
    }
}
