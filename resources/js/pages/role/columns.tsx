// role/columns.tsx
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Role } from '@/types';
import FormRole from './components/FormRole';

export const columns: ColumnDef<Role>[] = [
    {
        id: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1,
        meta: {
            className: 'w-10 text-center',
        },
    },
    {
        accessorKey: 'role_name',
        header: 'Role Name',
        meta: {
            className: 'capitalize',
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        meta: {
            className: 'capitalize',
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        meta: {
            className: 'w-32 text-center',
        },
        cell: ({ row }) => {
            const role = row.original;

            return (
                <div className="flex items-center justify-center gap-1">
                    <FormRole role={role} />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => router.delete(`/roles/${role.id}`)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
