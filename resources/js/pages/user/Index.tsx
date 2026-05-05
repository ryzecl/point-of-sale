import { Head } from '@inertiajs/react';
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/hooks/usePermission';
import type { User, Role } from '@/types';
import { columns } from './columns';
import FormUser from './components/FormUser';

interface IndexProps {
    users: { data: User[] };
    roles: { data: Role[] };
}

export default function Index({ users, roles }: IndexProps) {
    const { hasPermission } = usePermission();
    const canCreate = hasPermission('user.create');
    const canUpdate = hasPermission('user.update');
    const canDelete = hasPermission('user.delete');

    return (
        <>
            <Head title="User Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns(roles.data, canUpdate, canDelete)}
                    data={users.data}
                    searchPlaceholder="Search users..."
                    toolbar={canCreate ? <FormUser roles={roles.data} /> : undefined}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'User Management', href: '/users' }],
};
