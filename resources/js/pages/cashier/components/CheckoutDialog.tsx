import { Banknote, CreditCard, QrCode } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format-utils';
import type { CheckoutData } from '@/types';

interface CheckoutDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    cartLength: number;
    totalPembayaran: number;
    onOrderSubmit: (data: CheckoutData) => void;
}

export default function CheckoutDialog({
    open,
    setOpen,
    cartLength,
    totalPembayaran,
    onOrderSubmit,
}: CheckoutDialogProps) {
    // State lokal khusus untuk kelengkapan form Checkout saja
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
    const [tableNumber, setTableNumber] = useState<number | ''>('');
    const [note, setNote] = useState('');

    const kembalian =
        typeof paymentAmount === 'number' && paymentAmount >= totalPembayaran
            ? paymentAmount - totalPembayaran
            : 0;

    const handleProcess = () => {
        const finalPaymentAmount =
            paymentMethod === 'transfer'
                ? totalPembayaran
                : (paymentAmount as number);
        // Panggil fungsi persetujuan utama di Cashier (Index.tsx) dengan melempar data yang sudah diisi
        onOrderSubmit({
            customerName,
            paymentMethod,
            paymentAmount: finalPaymentAmount,
            tableNumber: tableNumber as number,
            note,
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);

                // ✅ RESET HANYA SAAT DIALOG BENAR-BENAR DITUTUP
                // Ini mencegah form kosong saat server sedang proses atau error.
                if (!nextOpen) {
                    setCustomerName('');
                    setPaymentAmount('');
                    setTableNumber('');
                    setNote('');
                    setPaymentMethod('cash');
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    className="w-full gap-3 rounded-2xl py-7 text-lg font-bold shadow-xl shadow-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30"
                    disabled={cartLength === 0}
                >
                    <CreditCard className="h-6 w-6" />
                    Proccess Payment ({cartLength})
                </Button>
            </DialogTrigger>

            {/* Form Dialog Popup */}
            <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-md md:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Payment Detail
                    </DialogTitle>
                    <DialogDescription>
                        Complete the details below to place your order.
                    </DialogDescription>
                </DialogHeader>

                {/* Ringkasan Belanja Mini */}
                <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">
                            Info Tagihan
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Subtotal + PPN 10%
                        </span>
                    </div>
                    <span className="text-2xl font-black text-primary">
                        {formatCurrency(totalPembayaran)}
                    </span>
                </div>

                {/* Baris Utama: Nama Pelanggan */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="customerName" className="font-bold">
                        Nama Pelanggan
                    </Label>
                    <Input
                        id="customerName"
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        autoComplete="off"
                        autoFocus
                        className="h-12 text-lg font-semibold"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>

                {/* Grid Input */}
                <div className="grid gap-4 py-2">
                    {/* Baris 1: No Table & Metode Pembayaran */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="table">No. Table</Label>
                            <Input
                                id="table"
                                type="number"
                                placeholder="Contoh: 12"
                                value={tableNumber}
                                onChange={(e) =>
                                    setTableNumber(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    )
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Metode Pembayaran</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Opsi Tunai (Cash) */}
                                <div
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`flex h-10 cursor-pointer items-center gap-3 rounded-xl border p-2 transition-all duration-200 hover:bg-primary/5 ${
                                        paymentMethod === 'cash'
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                            : 'border-muted bg-background text-muted-foreground'
                                    }`}
                                >
                                    <Banknote
                                        className={`h-4 w-4 ${paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'}`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${paymentMethod === 'cash' ? 'text-primary' : ''}`}
                                    >
                                        Tunai (Cash)
                                    </span>
                                </div>

                                {/* Opsi Transfer / QRIS */}
                                <div
                                    onClick={() => setPaymentMethod('transfer')}
                                    className={`flex h-10 cursor-pointer items-center gap-3 rounded-xl border p-2 transition-all duration-200 hover:bg-primary/5 ${
                                        paymentMethod === 'transfer'
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                            : 'border-muted bg-background text-muted-foreground'
                                    }`}
                                >
                                    <QrCode
                                        className={`h-4 w-4 ${paymentMethod === 'transfer' ? 'text-primary' : 'text-muted-foreground'}`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${paymentMethod === 'transfer' ? 'text-primary' : ''}`}
                                    >
                                        Bank / QRIS
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Baris 2: Jumlah Bayar & Kembalian */}
                    {paymentMethod === 'cash' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="payment">
                                    Jumlah Bayar Tertunai
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="font-semibold text-muted-foreground">
                                            Rp
                                        </span>
                                    </div>
                                    <Input
                                        id="payment"
                                        type="number"
                                        className="h-12 pl-9 text-lg font-bold"
                                        placeholder="0"
                                        value={paymentAmount}
                                        onChange={(e) =>
                                            setPaymentAmount(
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : '',
                                            )
                                        }
                                    />
                                </div>
                                {/* Tombol Cepat Uang Pas */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 h-7 w-max text-xs"
                                    onClick={() =>
                                        setPaymentAmount(totalPembayaran)
                                    }
                                >
                                    Uang Pas
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Kembalian</Label>
                                <div
                                    className={`flex h-12 items-center rounded-md border px-3 text-lg font-bold transition-colors ${kembalian > 0 ? 'border-green-500/20 bg-green-500/10 text-green-600' : 'bg-muted/50 text-muted-foreground'}`}
                                >
                                {formatCurrency(kembalian)}
                            </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'transfer' && (
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                💡 Anda akan diarahkan ke halaman pembayaran
                                Midtrans setelah menekan tombol di bawah.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="note">Catatan Khusus (Opsional)</Label>
                        <Textarea
                            id="note"
                            className="min-h-[100px]"
                            placeholder="Contoh: Pisah bon, tidak pakai bawang..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4 border-t pt-4">
                    {/* Logika Kunci Form (Disabled validation) */}
                    <Button
                        size="lg"
                        className="text-md h-12 w-full rounded-xl font-bold"
                        disabled={
                            customerName === '' ||
                            tableNumber === '' ||
                            (paymentMethod === 'cash' &&
                                (paymentAmount === '' ||
                                    paymentAmount < totalPembayaran))
                        }
                        onClick={handleProcess}
                    >
                        {paymentMethod === 'cash'
                            ? 'Selesaikan Pesanan'
                            : 'Lanjut ke Pembayaran'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
