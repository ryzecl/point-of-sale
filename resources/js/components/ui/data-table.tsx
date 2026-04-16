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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
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
    // Server-side pagination
    meta?: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
    };
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder,
    toolbar,
    onSearch,
    searchValue = '',
    meta,
    onPageChange,
    onPerPageChange,
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

    const handleSearchSubmit = () => {
        if (onSearch) onSearch(localSearch);
    };

    const handleReset = () => {
        if (onSearch) {
            setLocalSearch('');
            onSearch('');
        } else {
            setGlobalFilter('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <div className='p-5'>
            {/* Search Input & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder={searchPlaceholder ?? 'Search...'}
                            value={onSearch ? localSearch : globalFilter}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
                        />
                        {(onSearch ? localSearch : globalFilter) && (
                            <button
                                onClick={handleReset}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                type="button"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Reset search</span>
                            </button>
                        )}
                    </div>
                    <Button 
                        onClick={handleSearchSubmit} 
                        className="gap-2 shrink-0"
                        type="button"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                </div>

                {toolbar && (
                    <div className='flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0'>
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

            {/* Pagination & Metadata */}
            <div className="flex items-center justify-between py-4">
                <div className="flex-1 text-sm text-muted-foreground font-medium">
                    {meta ? (
                        <>
                            Showing <span className="text-foreground">{meta.from}</span> to <span className="text-foreground">{meta.to}</span> of <span className="text-foreground">{meta.total}</span> entries
                        </>
                    ) : (
                        `Total ${data.length} entries`
                    )}
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    {/* Rows per page */}
                    {onPerPageChange && meta && (
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={meta.per_page.toString()}
                                onValueChange={(value) => onPerPageChange(Number(value))}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={meta.per_page.toString()} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 25, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={pageSize.toString()}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Page Info & Nav */}
                    <div className="flex items-center space-x-2">
                        {meta ? (
                            <div className="flex items-center justify-center text-sm font-medium">
                                Page {meta.current_page} of {meta.last_page}
                            </div>
                        ) : null}

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-16 p-0"
                                onClick={() => {
                                    if (meta && onPageChange) {
                                        onPageChange(meta.current_page - 1);
                                    } else {
                                        table.previousPage();
                                    }
                                }}
                                disabled={meta ? meta.current_page === 1 : !table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-16 p-0"
                                onClick={() => {
                                    if (meta && onPageChange) {
                                        onPageChange(meta.current_page + 1);
                                    } else {
                                        table.nextPage();
                                    }
                                }}
                                disabled={meta ? meta.current_page === meta.last_page : !table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
