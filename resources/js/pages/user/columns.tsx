// user/columns.tsx
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2, Eye } from 'lucide-react';
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
import type { User, Role } from '@/types';
import FormUser from './components/FormUser';

export const columns = (
    roles: Role[],
    isSuperAdmin: boolean,
): ColumnDef<User>[] => [
    {
        id: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1,
        meta: {
            className: 'w-10 text-center',
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
        meta: {
            className: 'capitalize',
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role.role_name',
        header: 'Role',
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
            const user = row.original;

            return (
                <div className="flex items-center justify-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => router.get(`/users/${user.id}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <FormUser user={user} roles={roles} />
                    {isSuperAdmin && (
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
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Do you really want to delete user{' '}
                                        <b>{user.name}</b>? This action cannot
                                        be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            router.delete(`/users/${user.id}`)
                                        }
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        Delete
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
