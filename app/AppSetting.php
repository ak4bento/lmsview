<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{

    public $incrementing = false;
    public $timestamps = false;

    protected $keyType = 'string';

}
