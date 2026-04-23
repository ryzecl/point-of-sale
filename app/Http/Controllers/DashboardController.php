<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use App\Services\DashboardService;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => $this->dashboardService->getBasicStats(),
        ]);
    }

    public function chartData(Request $request): JsonResponse
    {
        $period = $request->input('period', 'daily');
        $date = Carbon::parse($request->input('date', today()));

        $analytics = $this->dashboardService->getChartAnalytics($period, $date);

        return response()->json($analytics);
    }
}
