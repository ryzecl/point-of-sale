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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('permission:dashboard.view');
    Route::get('dashboard/chart-data', [DashboardController::class, 'chartData'])->name('dashboard.chartData')->middleware('permission:dashboard.view');


    Route::prefix('roles')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:role.view');
        Route::post('/', 'store')->middleware('permission:role.create');
        Route::put('/{role_id}', 'update')->middleware('permission:role.update');
        Route::delete('/{role_id}', 'destroy')->middleware('permission:role.delete');
    });

    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index')->name('categories.index')->middleware('permission:category.view');
        Route::post('/', 'store')->name('categories.store')->middleware('permission:category.create');
        Route::put('/{category_id}', 'update')->name('categories.update')->middleware('permission:category.update');
        Route::delete('/{category_id}', 'destroy')->name('categories.destroy')->middleware('permission:category.delete');
    });

    Route::prefix('users')->middleware('permission:user.view')->controller(UserController::class)->group(function () {
        Route::get('/', 'index')->name('users.index');
        Route::post('/', 'store')->name('users.store')->middleware('permission:user.create');
        Route::get('/{user}', 'show')->name('users.show');
        Route::put('/{user}', 'update')->name('users.update')->middleware('permission:user.update');
        Route::delete('/{user}', 'destroy')->name('users.destroy')->middleware('permission:user.delete');
    });

    Route::prefix('items')->controller(ItemController::class)->group(function () {
        Route::get('/', 'index')->name('items.index')->middleware('permission:item.view');
        Route::post('/', 'store')->name('items.store')->middleware('permission:item.create');
        Route::get('/{item}', 'show')->name('items.show')->middleware('permission:item.view');
        Route::put('/{item}', 'update')->name('items.update')->middleware('permission:item.update');
        Route::delete('/{item}', 'destroy')->name('items.destroy')->middleware('permission:item.delete');
    });

    Route::prefix('cashier')->middleware('permission:pos.access')->controller(OfflineOrderController::class)->group(function () {
        Route::get('/', 'index')->name('cashier.index');
        Route::post('/', 'store')->name('cashier.store');
    });

    Route::prefix('orders')->middleware('permission:order.access')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index')->name('orders.index');
        Route::get('/{order}', 'show')->name('orders.show');
        Route::get('/{order}/receipt', 'receipt')->name('orders.receipt');
        Route::post('/{order}/status', 'updateStatus')->name('orders.updateStatus');
        Route::post('/{order}/cancel', 'cancel')->name('orders.cancel');
    });

    Route::prefix('reports')->middleware('permission:report.view')->controller(ReportController::class)->group(function () {
        Route::get('/sales', 'index')->name('reports.sales');
        Route::get('/export-sales', 'export')->name('reports.sales.export');
    });
});

require __DIR__ . '/settings.php';
