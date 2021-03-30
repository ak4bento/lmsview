<?php

namespace App\Http\Middleware;
use Closure;
use Auth;

class Pageview
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $pageview = new \App\Pageview;

            $pageview->path = url()->full();
            $pageview->user_id = auth()->user()->id;
            $pageview->save();
        }

        return $next($request);
    }
}
