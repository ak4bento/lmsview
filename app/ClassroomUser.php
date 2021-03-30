<?php

namespace App;

use Carbon\Carbon;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ClassroomUser extends Pivot
{
    use HasRoles, SoftDeletes;

    protected $guard_name = "web";

    protected $dates = [
        'deleted_at', 'last_accessed_at'
    ];

    public function classroom()
    {
        return $this->belongsTo( 'App\Classroom' );
    }

    public function teachableUsers()
    {
        return $this->hasMany( 'App\TeachableUser', 'classroom_user_id' );
    }

    public function user()
    {
        return $this->belongsTo( 'App\User' );
    }

    public function updateAccessedAt($customTime = null)
    {
        $this->last_accessed_at = $customTime ?: Carbon::now();
        $this->save();
        return $this;
    }

    public static function whereInMultiple(array $columns, $values)
    {
        $values = array_map(function (array $value) {
            return "('".implode($value, "', '")."')"; 
        }, $values);

        return static::query()->whereRaw(
            '('.implode($columns, ', ').') in ('.implode($values, ', ').')'
        );
    }

}
