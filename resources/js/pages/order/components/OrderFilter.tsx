import { Filter, RotateCcw, Calendar, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

interface OrderFilterProps {
    initialFilters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        payment_method?: string;
    };
    onFilter: (filters: any) => void;
    onReset: () => void;
}

export default function OrderFilter({
    initialFilters,
    onFilter,
    onReset,
}: OrderFilterProps) {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    const handleApply = () => {
        onFilter(filters);
        setOpen(false);
    };

    const handleReset = () => {
        setFilters({});
        onReset();
        setOpen(false);
    };

    const activeFilterCount =
        Object.values(initialFilters).filter(Boolean).length;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative h-9 px-4 lg:px-5">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-xl">Filter Order</SheetTitle>
                    <SheetDescription className="text-sm">
                        Narrow down your orders by status or creation date.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-8">
                        {/* Status Filter */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2 text-sm font-semibold opacity-80">
                                <Tag className="h-4 w-4" />
                                Order Status
                            </Label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(val) =>
                                    setFilters({
                                        ...filters,
                                        status: val === 'all' ? undefined : val,
                                    })
                                }
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="settlement">
                                        Settled
                                    </SelectItem>
                                    <SelectItem value="cooked">
                                        Cooked
                                    </SelectItem>
                                    <SelectItem value="served">
                                        Served
                                    </SelectItem>
                                    <SelectItem value="cancel">
                                        Cancelled
                                    </SelectItem>
                                    <SelectItem value="expire">
                                        Expired
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Payment_method */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2 text-sm font-semibold opacity-80">
                                <Tag className="h-4 w-4" />
                                Payment Method
                            </Label>
                            <Select
                                value={filters.payment_method || 'all'}
                                onValueChange={(val) =>
                                    setFilters({
                                        ...filters,
                                        payment_method:
                                            val === 'all' ? undefined : val,
                                    })
                                }
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="All Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="transfer">
                                        Transfer
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Date Range */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2 text-sm font-semibold opacity-80">
                                <Calendar className="h-4 w-4" />
                                Creation Date
                            </Label>
                            <div className="grid grid-cols-2 items-center gap-3">
                                <div className="space-y-1.5">
                                    <span className="ml-1 text-[10px] font-medium text-muted-foreground uppercase">
                                        From
                                    </span>
                                    <Input
                                        type="date"
                                        className="h-11"
                                        value={filters.date_from || ''}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                date_from: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="ml-1 text-[10px] font-medium text-muted-foreground uppercase">
                                        To
                                    </span>
                                    <Input
                                        type="date"
                                        className="h-11"
                                        value={filters.date_to || ''}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                date_to: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-auto border-t bg-muted/20 p-6">
                    <div className="flex w-full gap-3">
                        <Button
                            variant="outline"
                            className="h-11 flex-1"
                            onClick={handleReset}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                        <Button
                            className="h-11 flex-1 shadow-md"
                            onClick={handleApply}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
