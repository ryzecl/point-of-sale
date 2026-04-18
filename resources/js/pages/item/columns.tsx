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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format-utils';
import type { Item, Category } from '@/types';
import FormItem from './components/FormItem';

export const columns = (categories: Category[]): ColumnDef<Item>[] => [
    {
        id: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1,
        meta: {
            className: 'w-10 text-center',
        },
    },
    {
        accessorKey: 'img',
        header: 'Image',
        cell: ({ row }) => {
            const item = row.original;
            // Generate URL inisial sebagai cadangan jika gambar utama kosong atau error
            const initialUrl = `https://ui-avatars.com/api/?name=${urlencode(item.name)}&background=random&color=fff`;

            return (
                <div className="flex items-center justify-center">
                    <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted">
                        <img
                            src={item.img || initialUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            // Jika gambar di storage tidak ditemukan/error, ganti ke inisial
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = initialUrl;
                            }}
                        />
                    </div>
                </div>
            );
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
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const description = row.getValue('description') as string;

            return (
                <div
                    className="max-w-[150px] truncate md:max-w-[200px] lg:max-w-[300px]"
                    title={description}
                >
                    {description || '-'}
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            return (
                <span className="font-bold text-primary">
                    {formatCurrency(Number(row.original.price))}
                </span>
            );
        },
    },
    {
        accessorKey: 'category.cat_name',
        header: 'Category',
        meta: {
            className: 'capitalize',
        },
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => {
            const stock = row.original.stock;
            const minStock = row.original.min_stock;

            let badgeVariant:
                | 'default'
                | 'destructive'
                | 'outline'
                | 'secondary' = 'default';
            let badgeClassName = '';

            if (stock <= 0) {
                badgeVariant = 'destructive';
            } else if (stock <= minStock) {
                badgeClassName =
                    'bg-amber-500 text-white hover:bg-amber-600 border-none';
            } else {
                badgeVariant = 'default';
                badgeClassName =
                    'bg-green-500 text-white hover:bg-green-600 border-none';
            }

            return (
                <Badge variant={badgeVariant} className={badgeClassName}>
                    {stock} / {minStock}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.original.is_active;

            return (
                <Badge
                    variant={isActive ? 'default' : 'destructive'}
                    className={
                        isActive
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : ''
                    }
                >
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        meta: {
            className: 'w-32 text-center',
        },
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex items-center justify-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground transition-colors hover:text-primary"
                        onClick={() => router.get(`/items/${item.id}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <FormItem item={item} categories={categories} />
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
                                    Do you really want to delete item{' '}
                                    <b>{item.name}</b>? This action cannot be
                                    undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() =>
                                        router.delete(`/items/${item.id}`)
                                    }
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];

function urlencode(str: string) {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        (c) => '%' + c.charCodeAt(0).toString(16),
    );
}
