import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/format-utils';

interface OrderItem {
    id: number;
    order_code: string;
    customer_name: string;
    created_at: string;
    payment_method: string;
    grand_total: number;
    discount: number;
    user?: {
        name: string;
    };
}

interface PaginatedData {
    data: OrderItem[];
    links: any[];
    current_page: number;
}

interface ReportDataTableProps {
    orders: PaginatedData;
}

export default function ReportDataTable({ orders }: ReportDataTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[150px]">Order Code</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Cashier</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {order.order_code}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(order.created_at),
                                        'dd MMM yyyy HH:mm',
                                    )}
                                </TableCell>
                                <TableCell>
                                    {order.customer_name || 'Walk-in'}
                                </TableCell>
                                <TableCell>{order.user?.name || '-'}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {order.payment_method}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-red-500">
                                    {order.discount > 0
                                        ? `-${formatCurrency(order.discount)}`
                                        : '-'}
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {formatCurrency(order.grand_total)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Simple Pagination Info */}
            <div className="flex items-center justify-between border-t px-4 py-4 text-sm text-muted-foreground">
                <div>Showing page {orders.current_page}</div>
                <div className="flex gap-2">
                    {orders.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            className={`rounded-md border px-3 py-1 ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background hover:bg-muted'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
