<?php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('roles')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{role_id}', 'update');
        Route::delete('/{role_id}', 'destroy');
    });
});

require __DIR__ . '/settings.php';
