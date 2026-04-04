import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import type { Role } from '@/types';
import { columns } from './columns';
import FormRole from './components/FormRole';

interface IndexProps {
    roles: { data: Role[] };
}

export default function Index({ roles }: IndexProps) {
    return (
        <>
            <Head title="Role Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns}
                    data={roles.data}
                    searchPlaceholder="Search roles..."
                    toolbar={<FormRole />}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Role Management', href: '/roles' }],
};
