import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Hash,
    Printer,
    User,
    UserCircle,
    Utensils,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/format-utils';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

interface ShowProps {
    order: { data: Order };
}

export default function Show({ order: { data: order } }: ShowProps) {
    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'settlement':
            case 'served':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'pending':
            case 'cooked':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'cancel':
            case 'expire':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800';
        }
    };

    return (
        <>
            <Head title={`Order Detail - ${order.order_code}`} />
            <div className="container mx-auto space-y-6 p-5 pb-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link
                            href="/orders"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Orders
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Order {order.order_code}
                        </h1>
                        <div className="mt-1 flex items-center gap-2 font-medium text-muted-foreground">
                            <UserCircle className="h-4 w-4 text-primary" />
                            Customer:{' '}
                            <span className="text-foreground">
                                {order.customer_name}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="hidden md:flex"
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Print Receipt
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="overflow-hidden border-none shadow-md">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">
                                            Items Summary
                                        </CardTitle>
                                        <CardDescription>
                                            Detailed list of items in this order
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        className={cn(
                                            'border px-3 py-1 text-xs font-bold uppercase',
                                            getStatusVariant(order.status),
                                        )}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="pl-6">
                                                Item
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Qty
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Price
                                            </TableHead>
                                            <TableHead className="pr-6 text-right">
                                                Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.order_items?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="py-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                                                            <Utensils className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                                {item.item
                                                                    ?.name ||
                                                                    'Unknown Item'}
                                                            </div>
                                                            <div className="line-clamp-1 max-w-[200px] text-xs text-muted-foreground">
                                                                {item.item
                                                                    ?.description ||
                                                                    'No description'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatCurrency(item.price)}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right font-bold text-slate-900 dark:text-slate-100">
                                                    {formatCurrency(
                                                        item.total_price,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {order.note && (
                            <Card className="border-none bg-blue-50/30 shadow-sm dark:bg-blue-950/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                        Note
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 italic dark:text-slate-400">
                                        "{order.note}"
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="overflow-hidden border-none shadow-md">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <CardTitle className="text-lg">
                                    Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="group flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        Customer
                                    </div>
                                    <div className="text-sm font-bold text-foreground">
                                        {order.customer_name}
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <div className="group flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Hash className="h-4 w-4" />
                                        Order Code
                                    </div>
                                    <div className="text-sm font-bold tracking-wider text-primary">
                                        {order.order_code}
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Date
                                    </div>
                                    <div className="text-sm font-medium">
                                        {formatDateTime(order.created_at)}
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        Cashier
                                    </div>
                                    <div className="text-sm font-medium">
                                        {order.user?.name || 'System'}
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Utensils className="h-4 w-4" />
                                        Table Number
                                    </div>
                                    <div className="rounded bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">
                                        Table {order.table_number}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none bg-slate-900 text-slate-50 shadow-md dark:bg-slate-950">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-lg">
                                    Payment
                                    <CreditCard className="h-5 w-5 opacity-50" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm opacity-80">
                                    <span>Subtotal</span>
                                    <span>
                                        {formatCurrency(order.subtotal)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm opacity-80">
                                    <span>Tax (10%)</span>
                                    <span>{formatCurrency(order.tax)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex items-center justify-between text-sm text-red-400">
                                        <span>Discount</span>
                                        <span>
                                            -{formatCurrency(order.discount)}
                                        </span>
                                    </div>
                                )}
                                <Separator className="bg-slate-700" />
                                <div className="flex items-center justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-emerald-400">
                                        {formatCurrency(order.grand_total)}
                                    </span>
                                </div>

                                <div className="mt-6 space-y-3 border-t border-slate-700/50 pt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium tracking-tight uppercase opacity-70">
                                            {order.payment_method}
                                        </span>
                                        <span className="font-semibold uppercase">
                                            {formatCurrency(
                                                order.payment_amount,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium opacity-70">
                                            Change
                                        </span>
                                        <span className="font-semibold">
                                            {formatCurrency(
                                                order.change_amount,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center bg-white/5 py-4">
                                <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">
                                    Official Digital Receipt
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Order Management', href: '/orders' },
        { title: 'Detail', href: '' },
    ],
};
