import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Package, PackageCheck, PackageX } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useFilter } from '@/hooks/use-filter';
import { cn } from '@/lib/utils';

import type { Category, Item } from '@/types';
import { columns } from './columns';
import FormItem from './components/FormItem';
import ItemFilter from './components/ItemFilter';

interface IndexProps {
    items: {
        data: Item[];
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
    categories: { data: Category[] };
    filters?: {
        search?: string;
        category_id?: string;
        min_price?: string;
        max_price?: string;
        stock_status?: string;
        is_active?: string;
        is_low_stock?: string;
        perPage?: string;
    };
    stats: {
        totalItemStats: number;
        total: number;
        active: number;
        inactive: number;
        low_stock: number;
    };
}

export default function Index({
    items,
    categories,
    stats,
    filters = {},
}: IndexProps) {
    const itemColumns = columns(categories.data);

    // Gunakan custom hook
    const { search, setSearch, handleReset, applyFilters } = useFilter({
        routeName: '/items',
        initialFilters: filters,
    });

    const handlePageChange = (page: number) => {
        router.get(
            '/items',
            { ...filters, page },
            { preserveState: true, replace: true },
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            '/items',
            { ...filters, perPage, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const toggleActive = () => {
        applyFilters({
            is_active: filters.is_active === '1' ? undefined : '1',
            is_low_stock: undefined,
        });
    };

    const toggleInactive = () => {
        applyFilters({
            is_active: filters.is_active === '0' ? undefined : '0',
            is_low_stock: undefined,
        });
    };

    const toggleLowStock = () => {
        applyFilters({
            is_low_stock: filters.is_low_stock === '1' ? undefined : '1',
            is_active: undefined,
        });
    };

    const clearStatusFilters = () => {
        applyFilters({ is_active: undefined, is_low_stock: undefined });
    };

    const isAllActive = !filters.is_active && !filters.is_low_stock;
    const isActiveActive = filters.is_active === '1';
    const isInactiveActive = filters.is_active === '0';
    const isLowStockActive = filters.is_low_stock === '1';

    const selectedCategory = categories.data.find(
        (c) => c.id.toString() === filters.category_id,
    );

    return (
        <>
            <Head title="Menu Management" />
            <div className="container mx-auto">
                <div className="grid grid-cols-2 gap-4 p-5 md:grid-cols-4">
                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-blue-50/50 shadow-sm transition-all hover:bg-blue-100/50 dark:bg-blue-950/20 dark:hover:bg-blue-900/30',
                            isAllActive
                                ? 'border-blue-500/50 ring-2 ring-blue-500/20'
                                : 'border-transparent',
                        )}
                        onClick={clearStatusFilters}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
                                Total Menu
                                {selectedCategory && (
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-blue-900/40">
                                        {selectedCategory.cat_name}
                                    </span>
                                )}
                            </CardTitle>
                            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All filtered items of{' '}
                                <span className="font-medium text-blue-900 dark:text-blue-300">
                                    {stats.totalItemStats}
                                </span>{' '}
                                Available
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-green-50/50 shadow-sm transition-all hover:bg-green-100/50 dark:bg-green-950/20 dark:hover:bg-green-900/30',
                            isActiveActive
                                ? 'border-green-500/50 ring-2 ring-green-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleActive}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                                Active Menu
                            </CardTitle>
                            <PackageCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {stats.active}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Available Menu
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-red-50/50 shadow-sm transition-all hover:bg-red-100/50 dark:bg-red-950/20 dark:hover:bg-red-900/30',
                            isInactiveActive
                                ? 'border-red-500/50 ring-2 ring-red-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleInactive}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                                Inactive Menu
                            </CardTitle>
                            <PackageX className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {stats.inactive}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Hidden from customers
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'cursor-pointer overflow-hidden border-2 bg-amber-50/50 shadow-sm transition-all hover:bg-amber-100/50 dark:bg-amber-950/20 dark:hover:bg-amber-900/30',
                            isLowStockActive
                                ? 'border-amber-500/50 ring-2 ring-amber-500/20'
                                : 'border-transparent',
                        )}
                        onClick={toggleLowStock}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                Low Stock
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                {stats.low_stock}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <DataTable
                    columns={itemColumns}
                    data={items.data}
                    searchPlaceholder="Search menu..."
                    searchValue={search}
                    onSearch={setSearch}
                    meta={items.meta}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    toolbar={
                        <>
                            <ItemFilter
                                categories={categories.data}
                                initialFilters={filters}
                                onFilter={applyFilters}
                                onReset={handleReset}
                            />
                            <FormItem categories={categories.data} />
                        </>
                    }
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Menu Management', href: '/items' }],
};
