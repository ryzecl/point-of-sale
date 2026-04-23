import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Banknote,
    Calculator,
    ShoppingCart,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { PaymentDistributionChart } from '@/components/charts/payment-distribution-chart';
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart';
import { TopItemsList } from '@/components/charts/top-items-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardChart } from '@/hooks/use-dashboard-chart';
import { dashboard } from '@/routes';

interface Stats {
    todayRevenue: number;
    ThisMonthRevenue: number;
    totalOrdersToday: number;
    averageRevenue: number;
    lowStockCount: number;
    outOfStockCount: number;
}

interface DashboardProps {
    stats: Stats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const chartHook = useDashboardChart();
    console.log('Dashboard Stats:', stats);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value || 0);
    };

    if (!stats) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <p className="text-muted-foreground">
                    No statistics available.
                </p>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Orders',
            value: (
                chartHook.data?.summary?.totalOrders ??
                stats.totalOrdersToday ??
                0
            ).toString(),
            icon: ShoppingCart,
            description: chartHook.data
                ? 'Orders in selected period'
                : 'Number of orders today',
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100/50 dark:bg-orange-500/10',
        },
        {
            title: chartHook.data ? 'Total Revenue' : "Today's Revenue",
            value: formatCurrency(
                chartHook.data?.summary?.totalRevenue ?? stats.todayRevenue,
            ),
            icon: Banknote,
            description: chartHook.data
                ? 'Revenue in selected period'
                : 'Total revenue collected today',
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-500/10',
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(stats.ThisMonthRevenue),
            icon: TrendingUp,
            description: 'Total revenue this month',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100/50 dark:bg-blue-500/10',
        },
        {
            title: 'Average Revenue',
            value: formatCurrency(
                chartHook.data?.summary?.avgOrderValue ?? stats.averageRevenue,
            ),
            icon: Calculator,
            description: chartHook.data
                ? 'Average in selected period'
                : 'Average revenue per order',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-500/10',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {stats.lowStockCount > 0 && (
                    <Alert className="border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
                        <AlertTriangle className="size-4 text-amber-600! dark:text-amber-400!" />
                        <AlertTitle className="font-bold">
                            Stok Hampir Habis!
                        </AlertTitle>
                        <AlertDescription className="text-amber-800/80 dark:text-amber-200/80">
                            Ada {stats.lowStockCount} item yang stoknya sudah
                            mencapai batas minimum. Segera cek inventaris.
                        </AlertDescription>
                    </Alert>
                )}
                {stats.outOfStockCount > 0 && (
                    <Alert className="border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950/20 dark:text-red-200">
                        <XCircle className="size-4 text-red-600! dark:text-red-400!" />
                        <AlertTitle className="font-bold">
                            Stok Habis!
                        </AlertTitle>
                        <AlertDescription className="text-red-800/80 dark:text-red-200/80">
                            Ada {stats.outOfStockCount} item yang stoknya
                            kosong. Segera isi kembali stok barang tersebut.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div
                                    className={`rounded-lg p-2 ${stat.bgColor}`}
                                >
                                    <stat.icon
                                        className={`size-5 ${stat.color}`}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <RevenueTrendChart
                        data={chartHook.data?.trendData ?? []}
                        period={chartHook.period}
                        onPeriodChange={chartHook.setPeriod}
                        loading={chartHook.loading}
                    />
                    <PaymentDistributionChart
                        data={chartHook.data?.paymentDistribution ?? []}
                        loading={chartHook.loading}
                    />
                    <TopItemsList
                        items={chartHook.data?.topItems ?? []}
                        loading={chartHook.loading}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
