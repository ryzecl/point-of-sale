import { router, Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import ReportDataTable from './components/ReportDataTable';
import ReportFilter from './components/ReportFilter';
import SummaryCards from './components/SummaryCards';

interface Props {
    filters: {
        start_date: string;
        end_date: string;
        payment_method: string;
    };
    summary: {
        totalSales: number;
        totalTransactions: number;
        totalDiscount: number;
        averageTransaction: number;
    };
    orders: any;
}

export default function Index({ filters, summary, orders }: Props) {
    const applyFilters = (newParams: any) => {
        router.get('/reports/sales', newParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Sales Report" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <FileText className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Sales Report
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Monitor and analyze your business performance
                            </p>
                        </div>
                    </div>

                    <a
                        href={`/reports/export-sales?${new URLSearchParams(filters as any).toString()}`}
                        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <Download className="size-4" /> Export to Excel
                    </a>
                </div>

                <ReportFilter params={filters} onChange={applyFilters} />

                <SummaryCards summary={summary} />

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Transaction History
                    </h2>
                    <ReportDataTable orders={orders} />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Sales Report', href: '/reports/sales/' }],
};
