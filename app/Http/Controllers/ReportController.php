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

    /**
     * Normalize & clean filters (DRY)
     */
    private function normalizeFilters(Request $request): array
    {
        $filters = $request->only(['start_date', 'end_date', 'payment_method']);

        // default hari ini
        if (empty($filters['start_date'])) {
            $filters['start_date'] = now()->format('Y-m-d');
            $filters['end_date'] = now()->format('Y-m-d');
        }

        // normalize payment method
        if (empty($filters['payment_method']) || $filters['payment_method'] === 'null') {
            $filters['payment_method'] = null;
        }

        return $filters;
    }


    public function index(Request $request)
    {
        $filters = $this->normalizeFilters($request);

        $report = $this->reportService->getReportData($filters);

        // pagination khusus (biar tidak ambil semua data)
        $orders = $this->reportService
            ->buildQuery($filters)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('report/Index', [
            'filters' => $filters,
            'summary' => [
                'totalTransactions' => $report['totalTransactions'],
                'totalRevenue' => $report['totalRevenue'],
                'totalDiscount' => $report['totalDiscount'],
                'averageTransaction' => $report['averageTransaction'],
            ],
            'charts' => [
                'peakHours' => $report['peakHours'],
                'paymentMethods' => $report['paymentMethods'],
                'paymentRevenue' => $report['paymentRevenue'],
                'dailyTrend' => $report['dailyTrend'],
            ],
            'orders' => $orders,
        ]);
    }

    public function export(Request $request)
    {
        $filters = $this->normalizeFilters($request);
        $fileName = 'Sales_Report_' . now()->format('Ymd_His') . '.xlsx';
        return Excel::download(
            new SalesExport($filters, $this->reportService),
            $fileName
        );
    }
}
