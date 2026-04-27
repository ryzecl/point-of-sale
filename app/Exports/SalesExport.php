<?php

namespace App\Exports;

use App\Services\ReportService;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class SalesExport implements FromView, ShouldAutoSize
{
    use Exportable;

    public function __construct(protected array $filters, protected ReportService $service) {}

    public function view(): View


    {
        $orders = $this->service->buildQuery($this->filters)->get();
        // Log::info('Export count: ' . $orders->count());

        return view('exports.sales', [
            'orders' => $orders,
            'start_date' => $this->filters['start_date'] ?? null,
            'end_date' => $this->filters['end_date'] ?? null,
        ]);
    }
}
