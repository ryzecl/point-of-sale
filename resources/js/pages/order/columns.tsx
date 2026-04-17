// user/columns.tsx
// import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
// import { Trash2, Eye } from 'lucide-react';
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatDateTime } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/format-utils';
import type { Order } from '@/types';

export const columns = (): ColumnDef<Order>[] => [
    {
        id: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1,
        meta: {
            className: 'w-10 text-center',
        },
    },
    {
        accessorKey: 'order_code',
        header: 'Order Code',
    },
    {
        accessorKey: 'user.name',
        header: 'Name',
        cell: ({ row }) => {
            const order = row.original;

            const userName = (order as any).user?.name || 'Kasir';

            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground capitalize">
                        {userName}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'grand_total',
        header: 'Total',
        cell: ({ row }) => {
            return (
                <span className="font-bold text-primary">
                    {formatCurrency(Number(row.original.grand_total))}
                </span>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            let badgeVariant:
                | 'default'
                | 'destructive'
                | 'outline'
                | 'secondary' = 'default';
            let badgeClassName = '';

            if (status == 'cancel') {
                badgeVariant = 'destructive';
            } else if (status == 'pending') {
                badgeClassName =
                    'bg-amber-500 text-white hover:bg-amber-600 border-none';
            } else {
                badgeVariant = 'default';
                badgeClassName =
                    'bg-green-500 text-white hover:bg-green-600 border-none';
            }

            return (
                <Badge variant={badgeVariant} className={badgeClassName}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'table_number',
        header: 'No. Table',
        meta: {
            className: 'w-10 text-center',
        },
    },
    {
        accessorKey: 'payment_method',
        header: 'Payment Method',
        meta: {
            className: 'capitalize',
        },
    },
    {
        accessorKey: 'note',
        header: 'Note',
        cell: ({ row }) => {
            const note = row.original.note;

            return note || '-';
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = row.original.created_at;

            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                        {formatRelativeTime(date)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {formatDateTime(date)}
                    </span>
                </div>
            );
        },
    },
    // {
    //     id: 'actions',
    //     header: 'Actions',
    //     meta: {
    //         className: 'w-32 text-center',
    //     },
    //     cell: ({ row }) => {
    //         const item = row.original;

    //         return (
    //             <div className="flex items-center justify-center gap-1">
    //                 <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="h-8 w-8 text-muted-foreground transition-colors hover:text-primary"
    //                     onClick={() => router.get(`/items/${item.id}`)}
    //                 >
    //                     <Eye className="h-4 w-4" />
    //                 </Button>
    //                 <AlertDialog>
    //                     <AlertDialogTrigger asChild>
    //                         <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             className="h-8 w-8 text-muted-foreground hover:text-destructive"
    //                         >
    //                             <Trash2 className="h-4 w-4" />
    //                         </Button>
    //                     </AlertDialogTrigger>
    //                     <AlertDialogContent className="sm:max-w-sm">
    //                         <AlertDialogHeader>
    //                             <AlertDialogTitle>
    //                                 Are you sure?
    //                             </AlertDialogTitle>
    //                             <AlertDialogDescription>
    //                                 Do you really want to delete item{' '}
    //                                 <b>{item.name}</b>? This action cannot be
    //                                 undone.
    //                             </AlertDialogDescription>
    //                         </AlertDialogHeader>
    //                         <AlertDialogFooter>
    //                             <AlertDialogCancel>Cancel</AlertDialogCancel>
    //                             <AlertDialogAction
    //                                 onClick={() =>
    //                                     router.delete(`/items/${item.id}`)
    //                                 }
    //                                 className="bg-destructive text-white hover:bg-destructive/90"
    //                             >
    //                                 Delete
    //                             </AlertDialogAction>
    //                         </AlertDialogFooter>
    //                     </AlertDialogContent>
    //                 </AlertDialog>
    //             </div>
    //         );
    //     },
    // },
];
