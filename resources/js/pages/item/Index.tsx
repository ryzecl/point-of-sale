import { Head, router } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import type { Item, Category } from '@/types';
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
        perPage?: string;
    };
}

export default function Index({ items, categories, filters = {} }: IndexProps) {
    const itemColumns = columns(categories.data);

    const handleSearch = (value: string) => {
        router.get(
            '/items',
            { ...filters, search: value, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handleFilter = (newFilters: any) => {
        router.get(
            '/items',
            { ...filters, ...newFilters, page: 1 },
            { preserveState: true, replace: true },
        );
    };

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

    const handleReset = () => {
        router.get('/items', {}, { replace: true });
    };

    return (
        <>
            <Head title="Menu Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={itemColumns}
                    data={items.data}
                    searchPlaceholder="Search menu..."
                    searchValue={filters.search}
                    onSearch={handleSearch}
                    meta={items.meta}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    toolbar={
                        <>
                            <ItemFilter
                                categories={categories.data}
                                initialFilters={filters}
                                onFilter={handleFilter}
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
