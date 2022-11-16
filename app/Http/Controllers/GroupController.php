<?php

namespace App\Http\Controllers;

use App\Models\group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function addGroup(Request $request)
    {
        $group = new group();
        $group->role_name = "customer";
        return $group->save();
    }
}
