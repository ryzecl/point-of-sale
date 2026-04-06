import { Head } from '@inertiajs/react';
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Item, Category } from '@/types';
import { columns } from './columns';
import FormItem from './components/FormItem';

interface IndexProps {
    items: { data: Item[] };
    categories: { data: Category[] };
}

export default function Index({ items, categories }: IndexProps) {
    const itemColumns = columns(categories.data);

    return (
        <>
            <Head title="Menu Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={itemColumns}
                    data={items.data}
                    searchPlaceholder="Search menu..."
                    toolbar={<FormItem categories={categories.data} />}
                />
            </div>
        </>
    );
}
