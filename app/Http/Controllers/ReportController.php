<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use App\Exports\SalesExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function __construct(protected ReportService $reportService) {}

    public function index(Request $request)
    {
        $filters = $request->only(['start_date', 'end_date', 'payment_method']);
        
        $query = $this->reportService->buildQuery($filters);
        $summary = $this->reportService->getSummary($filters);
        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('report/Index', [
            'filters' => $filters,
            'summary' => $summary,
            'orders'  => $orders,
        ]);
    }

    public function export(Request $request)
    {
        $filters = $request->only(['start_date', 'end_date', 'payment_method']);
        $fileName = 'Sales_Report_' . now()->format('Ymd_His') . '.xlsx';
        
        return Excel::download(new SalesExport($filters, $this->reportService), $fileName);
    }
}
