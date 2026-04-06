import { useEffect, useState } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    searchPlaceholder?: string;
    toolbar?: React.ReactNode;
    onSearch?: (value: string) => void;
    searchValue?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder,
    toolbar,
    onSearch,
    searchValue = '',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [localSearch, setLocalSearch] = useState(searchValue);

    // Debounce effect for server-side search
    useEffect(() => {
        if (!onSearch) return;

        const timer = setTimeout(() => {
            if (localSearch !== searchValue) {
                onSearch(localSearch);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, onSearch, searchValue]);

    // Sync local search when searchValue prop changes (e.g. from URL)
    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        state: { sorting, globalFilter: onSearch ? '' : globalFilter },
    });

    const handleSearchChange = (value: string) => {
        if (onSearch) {
            setLocalSearch(value);
        } else {
            setGlobalFilter(value);
        }
    };

    return (
        <div className='p-5'>
            {/* Search Input */}
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder={searchPlaceholder ?? 'Search...'}
                    value={onSearch ? localSearch : globalFilter}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="max-w-sm"
                />

                {toolbar && (
                    <div className='flex items-center gap-2'>
                        {toolbar}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={
                                            (header.column.columnDef.meta as any)
                                                ?.className
                                        }
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                (cell.column.columnDef.meta as any)
                                                    ?.className
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
