// user/columns.tsx
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, CheckCircle2, XCircle, Send, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatRelativeTime, formatDateTime } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/format-utils';
import type { Order, User } from '@/types';

export const columns = (user: User): ColumnDef<Order>[] => [
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
        accessorKey: 'customer_name',
        header: 'Cust Name',
        cell: ({ row }) => {
            const custName = row.original.customer_name || 'Kasir';

            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground capitalize">
                        {custName}
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
            } else if (status == 'settlement') {
                badgeClassName =
                    'bg-emerald-500 text-white hover:bg-emerald-600 border-none';
            } else if (status == 'cooked') {
                badgeClassName =
                    'bg-indigo-500 text-white hover:bg-indigo-600 border-none';
            } else if (status == 'served') {
                badgeClassName =
                    'bg-blue-500 text-white hover:bg-blue-600 border-none';
            } else {
                badgeVariant = 'default';
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
    {
        id: 'actions',
        header: 'Actions',
        meta: {
            className: 'w-40 text-center',
        },
        cell: ({ row }) => {
            const order = row.original;
            const role = user?.role?.role_name;

            const handleUpdateStatus = () => {
                router.post(`/orders/${order.id}/status`);
            };

            const handleCancel = () => {
                if (confirm('Yakin ingin membatalkan pesanan ini?')) {
                    router.post(`/orders/${order.id}/cancel`);
                }
            };

            return (
                <div className="flex items-center justify-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground transition-colors hover:text-primary"
                                    onClick={() =>
                                        router.get(`/orders/${order.id}`)
                                    }
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Detail Pesanan</TooltipContent>
                        </Tooltip>

                        {/* Logic Admin / Cashier */}
                        {(role === 'superadmin' ||
                            role === 'admin' ||
                            role === 'cashier') && (
                            <>
                                {order.status === 'pending' &&
                                    order.payment_method === 'cash' && (
                                        <>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                        onClick={
                                                            handleUpdateStatus
                                                        }
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Terima Pembayaran
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/5 hover:text-destructive"
                                                        onClick={handleCancel}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Batalkan Pesanan
                                                </TooltipContent>
                                            </Tooltip>
                                        </>
                                    )}

                                {order.status === 'cooked' && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                                onClick={handleUpdateStatus}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Sajikan Pesanan
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </>
                        )}

                        {/* Logic Chef */}
                        {role === 'chef' && order.status === 'settlement' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                        onClick={handleUpdateStatus}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Pesanan Siap</TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            );
        },
    },
];
