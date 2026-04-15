import {
    Filter,
    RotateCcw,
    Layers,
    BadgeDollarSign,
    ClipboardList,
} from 'lucide-react';
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
import type { Category } from '@/types';

interface PosFilterProps {
    categories: Category[];
    initialFilters: {
        category_id?: string;
        min_price?: string;
        max_price?: string;
        stock_status?: string;
    };
    onFilter: (filters: any) => void;
    onReset: () => void;
}

export default function PosFilter({
    categories,
    initialFilters,
    onFilter,
    onReset,
}: PosFilterProps) {
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
                    <Filter className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:flex">Filter</span>
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-xl">Filter Menu</SheetTitle>
                    <SheetDescription className="text-sm">
                        Narrow down your menu items by category, price, or
                        stock.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-8">
                        {/* Category Filter */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2 text-sm font-semibold opacity-80">
                                <Layers className="h-4 w-4" />
                                Category
                            </Label>
                            <Select
                                value={filters.category_id || 'all'}
                                onValueChange={(val) =>
                                    setFilters({
                                        ...filters,
                                        category_id:
                                            val === 'all' ? undefined : val,
                                    })
                                }
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                        >
                                            {cat.cat_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Price Range */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2 text-sm font-semibold opacity-80">
                                <BadgeDollarSign className="h-4 w-4" />
                                Price Range
                            </Label>
                            <div className="grid grid-cols-2 items-center gap-3">
                                <div className="space-y-1.5">
                                    <span className="ml-1 text-[10px] font-medium text-muted-foreground uppercase">
                                        Min Price
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="h-11"
                                        value={filters.min_price || ''}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                min_price: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="ml-1 text-[10px] font-medium text-muted-foreground uppercase">
                                        Max Price
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        className="h-11"
                                        value={filters.max_price || ''}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                max_price: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Stock Status */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2 text-sm font-semibold opacity-80">
                                <ClipboardList className="h-4 w-4" />
                                Stock Status
                            </Label>
                            <Select
                                value={filters.stock_status || 'all'}
                                onValueChange={(val) =>
                                    setFilters({
                                        ...filters,
                                        stock_status:
                                            val === 'all' ? undefined : val,
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
                                    <SelectItem value="available">
                                        Available (Stock &gt; 0)
                                    </SelectItem>
                                    <SelectItem value="out_of_stock">
                                        Out of Stock
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
