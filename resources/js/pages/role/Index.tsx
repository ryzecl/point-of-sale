import { Head, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import type { Role } from '@/types';
import { columns } from './columns';
import FormRole from './components/FormRole';

interface IndexProps {
    roles: { data: Role[] };
}

export default function Index({ roles }: IndexProps) {
    const { auth } = usePage<any>().props;
    const isSuperAdmin = auth.user.role.role_name === 'superadmin';

    return (
        <>
            <Head title="Role Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns(isSuperAdmin)}
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
