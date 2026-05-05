import { usePage } from '@inertiajs/react';

import type { Auth } from '@/types/auth';

export function usePermission() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const hasRole = (role: string) => {
        return auth.roles.includes(role) || auth.roles.includes('super_admin');
    };

    const hasPermission = (permission: string) => {
        // Super admin bypass on frontend
        if (hasRole('super_admin')) {
            return true;
        }

        return auth.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions: string[]) => {
        if (hasRole('super_admin')) {
            return true;
        }

        return permissions.some((permission) => auth.permissions.includes(permission));
    };

    return { hasRole, hasPermission, hasAnyPermission };
}
