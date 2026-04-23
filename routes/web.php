<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OfflineOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/chart-data', [DashboardController::class, 'chartData'])->name('dashboard.chartData');


    Route::prefix('roles')->middleware('role:superadmin,admin')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{role_id}', 'update');
        Route::delete('/{role_id}', 'destroy')->middleware('role:superadmin');
    });

    Route::prefix('categories')->middleware('role:superadmin,admin')->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index')->name('categories.index');
        Route::post('/', 'store')->name('categories.store');
        Route::put('/{category_id}', 'update')->name('categories.update');
        Route::delete('/{category_id}', 'destroy')->name('categories.destroy')->middleware('role:superadmin');
    });

    Route::prefix('users')->middleware('role:superadmin,admin')->controller(UserController::class)->group(function () {
        Route::get('/', 'index')->name('users.index');
        Route::post('/', 'store')->name('users.store');
        Route::get('/{user}', 'show')->name('users.show');
        Route::put('/{user}', 'update')->name('users.update');
        Route::delete('/{user}', 'destroy')->name('users.destroy')->middleware('role:superadmin');
    });

    Route::prefix('items')->middleware('role:superadmin,admin,cashier,chef')->controller(ItemController::class)->group(function () {
        Route::get('/', 'index')->name('items.index');
        Route::post('/', 'store')->name('items.store');
        Route::get('/{item}', 'show')->name('items.show');
        Route::put('/{item}', 'update')->name('items.update');
        Route::delete('/{item}', 'destroy')->name('items.destroy')->middleware('role:superadmin');
    });

    Route::prefix('cashier')->middleware('role:superadmin,admin,cashier')->controller(OfflineOrderController::class)->group(function () {
        Route::get('/', 'index')->name('cashier.index');
        Route::post('/', 'store')->name('cashier.store');
    });

    Route::prefix('orders')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index')->name('orders.index');
        Route::get('/{order}', 'show')->name('orders.show');
        Route::get('/{order}/receipt', 'receipt')->name('orders.receipt');
        Route::post('/{order}/status', 'updateStatus')->name('orders.updateStatus');
        Route::post('/{order}/cancel', 'cancel')->name('orders.cancel');
    });

    Route::prefix('reports')->controller(ReportController::class)->group(function () {
        Route::get('/sales', 'index')->name('reports.sales');
        Route::get('/export-sales', 'export')->name('reports.sales.export');
    });
});

require __DIR__ . '/settings.php';
