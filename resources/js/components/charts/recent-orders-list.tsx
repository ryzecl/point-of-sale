import { History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecentOrder } from '@/types/chart';

interface Props {
    orders: RecentOrder[];
    loading?: boolean;
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(v);

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'settlement':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200';
        case 'pending':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200';
        case 'cooked':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200';
        case 'served':
            return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200';
        case 'cancel':
            return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200';
        default:
            return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200';
    }
};

export function RecentOrdersList({ orders, loading }: Props) {
    return (
        <Card className="border-none shadow-md col-span-full lg:col-span-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <History className="size-5 text-muted-foreground" />
                    Recent Order Activities
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between animate-pulse">
                                <div className="space-y-2">
                                    <div className="h-4 w-32 rounded bg-muted" />
                                    <div className="h-3 w-20 rounded bg-muted" />
                                </div>
                                <div className="h-6 w-16 rounded bg-muted" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-muted-foreground">Belum ada aktivitas order.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                        {order.customer_name || `Order #${order.id}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.created_at} • {formatCurrency(order.grand_total)}
                                    </p>
                                </div>
                                <Badge className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
