// role/columns.tsx
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { Role } from '@/types';
import FormRole from './components/FormRole';

export const columns = (
    canUpdate: boolean,
    canDelete: boolean,
    all_permissions: string[],
): ColumnDef<Role>[] => [
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
        accessorKey: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1 max-w-[400px]">
                {row.original.permissions?.map((p) => (
                    <span
                        key={p}
                        className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium"
                    >
                        {p.replace(/_/g, ' ')}
                    </span>
                ))}
            </div>
        ),
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
                    {canUpdate && <FormRole role={role} all_permissions={all_permissions} />}
                    {canDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="sm:max-w-sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Tunggu Dulu!
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah kamu yakin ingin menghapus role{' '}
                                        <b>{role.role_name}</b>? Data yang
                                        dihapus tidak dapat dikembalikan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    {/* 3. Panggil router.delete di tombol Action */}
                                    <AlertDialogAction
                                        onClick={() =>
                                            router.delete(`/roles/${role.id}`)
                                        }
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        Ya, Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            );
        },
    },
];
