<?php

namespace App\Http\Middleware;

use Closure;

class RedirectToHTTPS
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
        if ( starts_with( env( 'APP_URL', '' ), 'https://' ) && !$request->secure() )
            return redirect( str_replace_first( 'http://', 'https://', $request->fullUrl() ) );
        return $next($request);
    }
}
