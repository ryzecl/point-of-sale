/**
 * Memformat angka menjadi mata uang Rupiah (IDR)
 * Contoh: 50000 -> "Rp 50.000"
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Memformat angka dengan pemisah ribuan
 * Contoh: 1000000 -> "1.000.000"
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID').format(num);
}
