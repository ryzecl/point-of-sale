<?php

namespace App\Exports;

use App\Services\ReportService;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithStyles; // Tambahkan ini
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet; // Tambahkan ini

class SalesExport implements FromView, ShouldAutoSize, WithTitle, WithColumnFormatting, WithStyles
{
    protected $data;
    protected $filters;

    public function __construct(array $filters, ReportService $service)
    {
        $this->filters = $filters;
        $this->data = $service->getReportData($filters);
    }

    public function title(): string
    {
        return 'Laporan Penjualan';
    }

    public function view(): View
    {
        return view('exports.sales', [
            'orders' => $this->data['orders'],
            'start_date' => $this->filters['start_date'] ?? null,
            'end_date' => $this->filters['end_date'] ?? null,
        ]);
    }

    public function columnFormats(): array
    {
        return [
            'E' => '"Rp "#,##0',
            'F' => '"Rp "#,##0',
            'G' => '"Rp "#,##0',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // 1. Styling untuk Header Tabel (Baris 5)
        $sheet->getStyle('A5:H5')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1E40AF'], // Biru Navy
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],
        ]);

        // 2. Berikan border ke seluruh data tabel
        $lastRow = count($this->data['orders']) + 5;
        $sheet->getStyle('A5:H' . ($lastRow + 1))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        // 3. Styling untuk Footer (Total)
        $footerRow = $lastRow + 1;
        $sheet->getStyle('A' . $footerRow . ':H' . $footerRow)->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'DCFCE7'], // Hijau Muda
            ],
        ]);

        // 4. Perataan Tengah untuk kolom NO dan TANGGAL
        $sheet->getStyle('A6:A' . $lastRow)->getAlignment()->setHorizontal('center');
        $sheet->getStyle('H6:H' . $lastRow)->getAlignment()->setHorizontal('center');
    }
}
