import { CheckCircle, Printer, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
    orderCode: string;
    grandTotal: number;
}

export default function SuccessDialog({
    open,
    onClose,
    orderCode,
    grandTotal,
}: SuccessDialogProps) {
    const handlePrintReceipt = () => {
        // TODO: Implementasi cetak struk (bisa buka tab baru ke /orders/{code}/receipt)
        window.open(`/orders/${orderCode}/receipt`, '_blank');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="items-center text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        Pembayaran Berhasil!
                    </DialogTitle>
                    <DialogDescription>
                        Transaksi telah berhasil diproses.
                    </DialogDescription>
                </DialogHeader>

                {/* Detail Transaksi */}
                <div className="my-4 space-y-3 rounded-2xl bg-muted/30 p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            No. Transaksi
                        </span>
                        <span className="font-mono text-sm font-bold">
                            {orderCode}
                        </span>
                    </div>
                    <div className="border-t border-dashed border-muted" />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Grand Total
                        </span>
                        <span className="text-xl font-black text-primary">
                            Rp {grandTotal.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <DialogFooter className="flex flex-col gap-3 sm:flex-col">
                    <Button
                        className="w-full gap-2 rounded-xl"
                        variant="outline"
                        onClick={handlePrintReceipt}
                    >
                        <Printer className="h-4 w-4" />
                        Cetak Struk
                    </Button>
                    <Button
                        className="w-full gap-2 rounded-xl"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        Selesai
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
