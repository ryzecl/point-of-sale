import { CheckCircle, Printer, X } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import Receipt from '@/components/receipt/Receipt';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { OrderSuccessData } from '@/types';

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
    data: OrderSuccessData;
}

export default function SuccessDialog({
    open,
    onClose,
    data,
}: SuccessDialogProps) {
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: `Receipt-${data.orderCode}`,
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-md">
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

                {/* Receipt Preview (scrollable) */}
                <div className="max-h-[350px] overflow-y-auto rounded-xl border-2 border-muted bg-white p-2 shadow-inner">
                    <Receipt ref={receiptRef} data={data} />
                </div>

                <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
                    <Button
                        onClick={() => handlePrint()}
                        className="w-full gap-2 rounded-xl font-bold"
                        variant="outline"
                        size="lg"
                    >
                        <Printer className="size-4" />
                        Print Receipt
                    </Button>
                    <Button
                        className="w-full gap-2 rounded-xl font-bold"
                        onClick={onClose}
                        size="lg"
                    >
                        <X className="h-4 w-4" />
                        Finish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
