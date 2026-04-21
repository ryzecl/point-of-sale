<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Pastikan user sudah login
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Cek apakah user memiliki salah satu role yang diizinkan
        if (!$request->user()->hasRole($roles)) {
            // Jika request via AJAX/Inertia, kembalikan response 403
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized Access.'], 403);
            }
            
            // Default 403
            abort(403, 'Unauthorized Access.');
        }

        return $next($request);
    }
}
