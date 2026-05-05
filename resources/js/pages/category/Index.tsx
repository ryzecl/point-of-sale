import { Head } from '@inertiajs/react';
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/hooks/usePermission';
import type { Category } from '@/types';
import { columns } from './columns';
import FormCategory from './components/FormCategory';

interface IndexProps {
    categories: { data: Category[] };
}

export default function Index({ categories }: IndexProps) {
    const { hasPermission } = usePermission();
    const canCreate = hasPermission('category.create');
    const canUpdate = hasPermission('category.update');
    const canDelete = hasPermission('category.delete');

    return (
        <>
            <Head title="Category Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns(canUpdate, canDelete)}
                    data={categories.data}
                    searchPlaceholder="Search categories..."
                    toolbar={canCreate ? <FormCategory /> : undefined}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Category Management', href: '/categories' }],
};
