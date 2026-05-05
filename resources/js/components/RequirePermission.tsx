import type { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface Props {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export default function RequirePermission({ permission, children, fallback = null }: Props) {
    const { hasPermission } = usePermission();

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
