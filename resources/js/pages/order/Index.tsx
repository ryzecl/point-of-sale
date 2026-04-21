import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChefHat,
    Clock,
    ShoppingBag,
    Truck,
    XCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { DataTable } from '@/components/ui/data-table';
import { useFilter } from '@/hooks/use-filter';

import { cn } from '@/lib/utils';

import type { Order } from '@/types';
import { columns } from './columns';
import OrderFilter from './components/OrderFilter';

interface IndexProps {
    orders: {
        data: Order[];
        links: any;
        meta: {
            current_page: number;
            last_page: number;
            from: number;
            to: number;
            total: number;
            per_page: number;
        };
    };
    filters?: {
        search?: string;
        status?: string;
        perPage?: string;
        date_from?: string;
        date_to?: string;
        payment_method?: string;
    };
    stats: {
        totalOrderStats: number;
        total: number;
        pending: number;
        settlement: number;
        cooked: number;
        served: number;
        cancel: number;
    };
}

export default function Index({ orders, filters = {}, stats }: IndexProps) {
    const { auth } = usePage<any>().props;
    // Gunakan custom hook
    const { search, setSearch, applyFilters } = useFilter({
        routeName: '/orders',
        initialFilters: filters,
    });

    const handlePageChange = (page: number) => {
        router.get(
            '/orders',
            { ...filters, page },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            '/orders',
            { ...filters, perPage, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const togglePending = () => {
        applyFilters({
            status: filters.status === 'pending' ? undefined : 'pending',
        });
    };

    const toggleSettlement = () => {
        applyFilters({
            status: filters.status === 'settlement' ? undefined : 'settlement',
        });
    };

    const toggleCooked = () => {
        applyFilters({
            status: filters.status === 'cooked' ? undefined : 'cooked',
        });
    };

    const toggleServed = () => {
        applyFilters({
            status: filters.status === 'served' ? undefined : 'served',
        });
    };

    const toggleCancel = () => {
        applyFilters({
            status:
                filters.status === 'cancel,expire'
                    ? undefined
                    : 'cancel,expire',
        });
    };

    const handleReset = () => {
        applyFilters({
            status: undefined,
            date_from: undefined,
            date_to: undefined,
            payment_method: undefined,
        });
    };

    const isAllActive = !filters.status;
    const isPendingActive = filters.status === 'pending';
    const isSettlementActive = filters.status === 'settlement';
    const isCookedActive = filters.status === 'cooked';
    const isServedActive = filters.status === 'served';
    const isCancelActive = filters.status === 'cancel,expire';

    return (
        <>
            <Head title="Order Management" />
            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-4 p-5 md:grid-cols-6">
                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-blue-50/50 shadow-sm transition-all hover:bg-blue-100/50 dark:bg-blue-950/20 dark:hover:bg-blue-900/30',
                            isAllActive
                                ? 'border-blue-500/50 ring-2 ring-blue-500/20'
                                : 'border-transparent',
                        )}
                        onClick={handleReset}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Total Orders
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Overall filtered transactions of{' '}
                                <span className="font-medium text-blue-900 dark:text-blue-300">
                                    {stats.totalOrderStats}
                                </span>{' '}
                                Available
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-green-50/50 shadow-sm transition-all hover:bg-green-100/50 dark:bg-green-950/20 dark:hover:bg-green-900/30',
                            isSettlementActive
                                ? 'border-green-500/50 ring-2 ring-green-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleSettlement}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                                Settled
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {stats.settlement}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Payment confirmed
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-amber-50/50 shadow-sm transition-all hover:bg-amber-100/50 dark:bg-amber-950/20 dark:hover:bg-amber-900/30',
                            isPendingActive
                                ? 'border-amber-500/50 ring-2 ring-amber-500/20'
                                : 'border-transparent',
                        )}
                        onClick={togglePending}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                Pending
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                {stats.pending}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Waiting for pay
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-indigo-50/50 shadow-sm transition-all hover:bg-indigo-100/50 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30',
                            isCookedActive
                                ? 'border-indigo-500/50 ring-2 ring-indigo-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleCooked}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                Cooked
                            </CardTitle>
                            <ChefHat className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                {stats.cooked}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ready from kitchen
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-emerald-50/50 shadow-sm transition-all hover:bg-emerald-100/50 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30',
                            isServedActive
                                ? 'border-emerald-500/50 ring-2 ring-emerald-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleServed}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                Served
                            </CardTitle>
                            <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                {stats.served}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Delivered to table
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-red-50/50 shadow-sm transition-all hover:bg-red-100/50 dark:bg-red-950/20 dark:hover:bg-red-900/30',
                            isCancelActive
                                ? 'border-red-500/50 ring-2 ring-red-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleCancel}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                                Cancelled
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {stats.cancel}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Failed or expired
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <DataTable
                    columns={columns(auth.user)}
                    data={orders.data}
                    searchPlaceholder="Search order code..."
                    searchValue={search}
                    onSearch={setSearch}
                    meta={orders.meta}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    toolbar={
                        <>
                            <OrderFilter
                                initialFilters={filters}
                                onFilter={applyFilters}
                                onReset={handleReset}
                            />
                        </>
                    }
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Order Management', href: '/orders' }],
};
