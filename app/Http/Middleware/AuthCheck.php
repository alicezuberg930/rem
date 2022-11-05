<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class AuthCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (session()->has('UserID')) {
            $user = User::where('id', '=', session()->get("UserID"))->first();
            if ($user->remember_token != session()->get('token')) {
                session()->forget('UserID');
                return redirect('/')->with('invalid_token', 'Token không hợp lệ');
            }
        }
        return $next($request);
    }
}
