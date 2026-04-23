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
                    Process Payment ({cartLength})
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-md md:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Payment Details
                    </DialogTitle>
                    <DialogDescription>
                        Complete the details below to place your order.
                    </DialogDescription>
                </DialogHeader>

                {/* Billing Info */}
                <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">
                            Billing Info
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Subtotal + Tax 10%
                        </span>
                    </div>
                    <span className="text-2xl font-black text-primary">
                        {formatCurrency(totalPembayaran)}
                    </span>
                </div>

                {/* Customer Name */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="customerName" className="font-bold">
                        Customer Name
                    </Label>
                    <Input
                        id="customerName"
                        type="text"
                        placeholder="e.g. John Doe"
                        autoComplete="off"
                        autoFocus
                        className="h-12 text-lg font-semibold"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>

                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Table Number */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="table">Table No.</Label>
                            <Input
                                id="table"
                                type="number"
                                placeholder="e.g. 12"
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
                        {/* Payment Method */}
                        <div className="flex flex-col gap-2">
                            <Label>Payment Method</Label>
                            <div className="grid grid-cols-2 gap-3">
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
                                        Cash
                                    </span>
                                </div>

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

                    {/* Cash Payment Details */}
                    {paymentMethod === 'cash' && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="payment">Amount Received</Label>
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 h-7 w-max text-xs"
                                    onClick={() =>
                                        setPaymentAmount(totalPembayaran)
                                    }
                                >
                                    Exact Amount
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Change</Label>
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
                                💡 You will be redirected to the payment page
                                after clicking the button below.
                            </p>
                        </div>
                    )}

                    {/* Note */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="note">Special Note (Optional)</Label>
                        <Textarea
                            id="note"
                            className="min-h-[100px]"
                            placeholder="e.g. No onions, separate billing..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4 border-t pt-4">
                    <Button
                        size="lg"
                        className="text-md h-12 w-full rounded-xl font-bold"
                        disabled={
                            customerName === '' ||
                            (paymentMethod === 'cash' &&
                                (paymentAmount === '' ||
                                    paymentAmount < totalPembayaran))
                        }
                        onClick={handleProcess}
                    >
                        {paymentMethod === 'cash'
                            ? 'Complete Order'
                            : 'Proceed to Payment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
