// categories/columns.tsx
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
import type { Category } from '@/types';
import FormCategory from './components/FormCategory';

export const columns = (isSuperAdmin: boolean): ColumnDef<Category>[] => [
    {
        id: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1,
        meta: {
            className: 'w-10 text-center',
        },
    },
    {
        accessorKey: 'cat_name',
        header: 'Category Name',
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
            const category = row.original;

            return (
                <div className="flex items-center justify-center gap-1">
                    <FormCategory category={category} />
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
                                        Tunggu Dulu!
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah kamu yakin ingin menghapus role{' '}
                                        <b>{category.cat_name}</b>? Data yang
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
                                            router.delete(
                                                `/categories/${category.id}`,
                                            )
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
