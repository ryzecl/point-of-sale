import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/hooks/usePermission';
import type { Role } from '@/types';
import { columns } from './columns';
import FormRole from './components/FormRole';

interface IndexProps {
    roles: { data: Role[] };
    all_permissions: string[];
}

export default function Index({ roles, all_permissions }: IndexProps) {
    const { hasPermission } = usePermission();
    const canCreate = hasPermission('role.create');
    const canUpdate = hasPermission('role.update');
    const canDelete = hasPermission('role.delete');

    return (
        <>
            <Head title="Role Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns(canUpdate, canDelete, all_permissions)}
                    data={roles.data}
                    searchPlaceholder="Search roles..."
                    toolbar={canCreate ? <FormRole all_permissions={all_permissions} /> : undefined}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Role Management', href: '/roles' }],
};
