<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
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

    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index')->name('categories.index');
        Route::post('/', 'store')->name('categories.store');
        Route::put('/{category_id}', 'update')->name('categories.update');
        Route::delete('/{category_id}', 'destroy')->name('categories.destroy');
    });

    Route::prefix('users')->controller(UserController::class)->group(function () {
        Route::get('/', 'index')->name('users.index');
        Route::post('/', 'store')->name('users.store');
        Route::put('/{user}', 'update')->name('users.update');
        Route::delete('/{user}', 'destroy')->name('users.destroy');
    });
});

require __DIR__ . '/settings.php';
