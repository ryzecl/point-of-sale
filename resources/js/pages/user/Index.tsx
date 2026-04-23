import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { User, Role } from '@/types';
import { columns } from './columns';
import FormUser from './components/FormUser';

interface IndexProps {
    users: { data: User[] };
    roles: { data: Role[] };
}

export default function Index({ users, roles }: IndexProps) {
    const { auth } = usePage<any>().props;
    const isSuperAdmin = auth.user.role.role_name === 'superadmin';

    return (
        <>
            <Head title="User Management" />
            <div className="container mx-auto">
                <DataTable
                    columns={columns(roles.data, isSuperAdmin)}
                    data={users.data}
                    searchPlaceholder="Search users..."
                    toolbar={<FormUser roles={roles.data} />}
                />
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'User Management', href: '/users' }],
};
