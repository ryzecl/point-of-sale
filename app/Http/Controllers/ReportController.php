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

        if (empty($filters['start_date'])) {
            $filters['start_date'] = now()->format('Y-m-d');
            $filters['end_date'] = now()->format('Y-m-d');
        }

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
        $filters = $request->all();

        // Pastikan jika ada string kosong (''), kita anggap null agar logic default jalan
        $startDate = $request->filled('start_date') ? $request->start_date : null;
        $endDate = $request->filled('end_date') ? $request->end_date : null;

        // TAMBAHKAN LOGIKA PEMBERSIHAN INI
        $paymentMethod = $request->payment_method;
        if ($paymentMethod === 'null' || empty($paymentMethod)) {
            $paymentMethod = null;
        }

        if (!$startDate) {
            $startDate = now()->format('Y-m-d');
            $endDate = now()->format('Y-m-d');
        }

        // Masukkan kembali ke array filters untuk dikirim ke Export Class
        $filters['start_date'] = $startDate;
        $filters['end_date'] = $endDate;
        $filters['payment_method'] = $paymentMethod;

        Log::info("Export filters: ", $filters);

        $fileName = 'Sales_Report_' . now()->format('Ymd_His') . '.xlsx';

        return Excel::download(new SalesExport($filters, $this->reportService), $fileName);
    }
}
