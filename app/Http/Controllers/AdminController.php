<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\User;

class AdminController extends Controller
{
    public function index()
    {

    }

    public function create(Request $request)
    {
        $user = new User;
        $password = Hash::make(str_random(8));

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = $password;

        if ($user->save) {
            return [
                'status' => true ,
                'user' => $user
            ];
        } else {
            return [
                'status' => false ,
                'user' => []
            ];
        }
    }
}
