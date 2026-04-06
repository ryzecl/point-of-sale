import { Filter, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

interface ItemFilterProps {
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

export default function ItemFilter({
    categories,
    initialFilters,
    onFilter,
    onReset,
}: ItemFilterProps) {
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

    const activeFilterCount = Object.values(initialFilters).filter(Boolean).length;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Filter Menu</SheetTitle>
                    <SheetDescription>
                        Narrow down your menu items by category, price, or stock.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-6 py-6">
                    {/* Category Filter */}
                    <Field>
                        <Label>Category</Label>
                        <Select
                            value={filters.category_id || 'all'}
                            onValueChange={(val) =>
                                setFilters({ ...filters, category_id: val === 'all' ? undefined : val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.cat_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* Price Range */}
                    <div className="grid gap-2">
                        <Label>Price Range</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={filters.min_price || ''}
                                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={filters.max_price || ''}
                                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Stock Status */}
                    <Field>
                        <Label>Stock Status</Label>
                        <Select
                            value={filters.stock_status || 'all'}
                            onValueChange={(val) =>
                                setFilters({ ...filters, stock_status: val === 'all' ? undefined : val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <SheetFooter className="flex-row gap-2 sm:gap-0">
                    <Button variant="ghost" className="flex-1" onClick={handleReset}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                    <Button className="flex-1" onClick={handleApply}>
                        Apply Filters
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
