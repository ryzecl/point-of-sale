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
    const { hasRole } = usePermission();
    const isSuperAdmin = hasRole('super_admin');

    return (
        <>
            <Head title="Role Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns(isSuperAdmin, all_permissions)}
                    data={roles.data}
                    searchPlaceholder="Search roles..."
                    toolbar={<FormRole all_permissions={all_permissions} />}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Role Management', href: '/roles' }],
};
