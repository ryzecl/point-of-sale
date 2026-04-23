<table>
    <thead>
        <tr>
            <th colspan="8" style="font-size: 16pt; font-weight: bold;">Laporan Penjualan</th>
        </tr>
        <tr>
            <th colspan="8" style="font-weight: bold;">
                Periode: {{ !empty($start_date) ? \Carbon\Carbon::parse($start_date)->format('d/m/Y') : '-' }} - {{ !empty($end_date) ? \Carbon\Carbon::parse($end_date)->format('d/m/Y') : '-' }}
            </th>
        </tr>
        <tr></tr> <!-- Empty row for spacing -->
        <tr style="background-color: #f3f4f6;">
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">No. Transaksi</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Kasir</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Customer</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Diskon</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Total Harga</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Total Bayar</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Kembalian</th>
            <th style="font-weight: bold; border: 1px solid #000000; text-align: center;">Tanggal</th>
        </tr>
    </thead>
    <tbody>
        @php
            $totalDiskon = 0;
            $totalHarga = 0;
        @endphp
        @foreach($orders as $order)
            @php
                $totalDiskon += $order->discount;
                $totalHarga += $order->grand_total;
            @endphp
            <tr>
                <td style="border: 1px solid #000000;">{{ $order->order_code }}</td>
                <td style="border: 1px solid #000000;">{{ $order->user->name ?? 'System' }}</td>
                <td style="border: 1px solid #000000;">{{ $order->customer_name ?? 'Walk-in' }}</td>
                <td style="border: 1px solid #000000; text-align: right;">Rp {{ number_format($order->discount, 0, ',', '.') }}</td>
                <td style="border: 1px solid #000000; text-align: right;">Rp {{ number_format($order->grand_total, 0, ',', '.') }}</td>
                <td style="border: 1px solid #000000; text-align: right;">Rp {{ number_format($order->payment_amount, 0, ',', '.') }}</td>
                <td style="border: 1px solid #000000; text-align: right;">Rp {{ number_format($order->change_amount, 0, ',', '.') }}</td>
                <td style="border: 1px solid #000000;">{{ $order->created_at->format('d/m/Y H:i') }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr style="background-color: #e5e7eb; font-weight: bold;">
            <td colspan="3" style="border: 1px solid #000000; text-align: center;">Total</td>
            <td style="border: 1px solid #000000; text-align: right;">Rp {{ number_format($totalDiskon, 0, ',', '.') }}</td>
            <td style="border: 1px solid #000000; text-align: right;">Rp {{ number_format($totalHarga, 0, ',', '.') }}</td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000;"></td>
        </tr>
    </tfoot>
</table>
