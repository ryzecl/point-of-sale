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
import { formatCurrency } from '@/lib/format-utils';

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
                        Payment Successful!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Transaction has been processed successfully.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center justify-center space-y-1 rounded-xl bg-muted/50 py-6">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Order Code
                        </span>
                        <span className="text-2xl font-black tracking-widest">
                            #{orderCode}
                        </span>
                    </div>

                    <div className="flex justify-between rounded-lg bg-muted/30 p-3 text-sm">
                        <span className="text-muted-foreground">Total Payment</span>
                        <span className="font-bold">
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button
                        onClick={handlePrintReceipt}
                        className="w-full font-bold"
                        variant="outline"
                    >
                        <Printer className="mr-2 size-4" />
                        Print Receipt
                    </Button>
                    <Button
                        className="w-full gap-2 rounded-xl"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        Finish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
