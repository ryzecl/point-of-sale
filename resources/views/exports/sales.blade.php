<table>
    <thead>
        <!-- TITLE -->
        <tr>
            <th colspan="8" style="font-size: 18pt; font-weight: bold; text-align: center; color: #1e40af;">
                LAPORAN PENJUALAN
            </th>
        </tr>


        <!-- PERIODE -->
        <tr>
            <th colspan="8" style="text-align: center; color: #64748b;">
                Periode: {{ !empty($start_date) ? \Carbon\Carbon::parse($start_date)->format('d M Y') : '-' }} s/d
                {{ !empty($end_date) ? \Carbon\Carbon::parse($end_date)->format('d M Y') : '-' }}
            </th>
        </tr>
        <tr>
            <th colspan="8" style="text-align: center; font-size: 8pt; color: #94a3b8;">
                Dicetak pada: {{ now()->format('d/m/Y H:i') }}
            </th>
        </tr>
        <!-- Baris Kosong -->
        <tr>
            <th colspan="8"></th>
        </tr>
        <!-- Header Tabel (Warna Biru Modern) -->
        <tr style="background-color: #1e40af; color: #ffffff;">
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 50px;">NO</th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 150px;">KODE TRANSAKSI
            </th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 150px;">KASIR</th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 150px;">CUSTOMER</th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 120px;">DISKON</th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 150px;">TOTAL HARGA</th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 150px;">TOTAL BAYAR</th>
            <th style="font-weight: bold; border: 2px solid #000000; text-align: center; width: 150px;">TANGGAL</th>
        </tr>
    </thead>

    <tbody>
        @php
            $totalDiskon = 0;
            $totalHarga = 0;
        @endphp
        @foreach ($orders as $index => $order)
            @php
                $totalDiskon += $order->discount;
                $totalHarga += $order->grand_total;
                // Warna belang-belang (Zebra)
                $bgColor = $index % 2 == 0 ? '#ffffff' : '#f1f5f9';
            @endphp
            <tr style="background-color: {{ $bgColor }};">
                <td style="border: 1px solid #cbd5e1; text-align: center;">{{ $index + 1 }}</td>
                <td style="border: 1px solid #cbd5e1;">{{ $order->order_code }}</td>
                <td style="border: 1px solid #cbd5e1;">{{ $order->user->name ?? 'System' }}</td>
                <td style="border: 1px solid #cbd5e1;">{{ $order->customer_name ?? 'Walk-in' }}</td>
                <td style="border: 1px solid #cbd5e1; text-align: right;">{{ $order->discount }}</td>
                <td style="border: 1px solid #cbd5e1; text-align: right;">{{ $order->grand_total }}</td>
                <td style="border: 1px solid #cbd5e1; text-align: right;">{{ $order->payment_amount }}</td>
                <td style="border: 1px solid #cbd5e1; text-align: center;">
                    {{ $order->created_at->format('d/m/Y H:i') }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <!-- Footer Total (Warna Hijau Lembut) -->
        <tr style="background-color: #dcfce7; font-weight: bold;">
            <td colspan="4" style="border: 2px solid #000000; text-align: center;">TOTAL KESELURUHAN</td>
            <td style="border: 2px solid #000000; text-align: right;">{{ $totalDiskon }}</td>
            <td style="border: 2px solid #000000; text-align: right;">{{ $totalHarga }}</td>
            <td colspan="2" style="border: 2px solid #000000; background-color: #f8fafc;"></td>
        </tr>
    </tfoot>
</table>
