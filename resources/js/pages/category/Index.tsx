import { Head } from '@inertiajs/react';
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { Category } from '@/types';
import { columns } from './columns';
import FormCategory from './components/FormCategory';

interface IndexProps {
    categories: { data: Category[] };
}

export default function Index({ categories }: IndexProps) {
    return (
        <>
            <Head title="Category Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns}
                    data={categories.data}
                    searchPlaceholder="Search categories..."
                    toolbar={<FormCategory />}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Category Management', href: '/categories' }],
};
