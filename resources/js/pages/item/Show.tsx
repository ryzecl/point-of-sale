import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Package,
    Tag,
    Layers,
    Info,
    History,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import type { Item } from '@/types';

interface ShowProps {
    item: { data: Item };
}

export default function Show({ item }: ShowProps) {
    const itemData = item.data;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const createdAt = itemData.created_at
        ? new Date(itemData.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '-';

    const updatedAt = itemData.updated_at
        ? new Date(itemData.updated_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '-';

    const initialUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(itemData.name)}&background=random&color=fff&size=512`;

    return (
        <>
            <Head title={`Item Detail - ${itemData.name}`} />
            <div className="container mx-auto max-w-4xl space-y-6 p-5 pt-6 pb-12 text-foreground">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/items">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0 shadow-sm transition-all hover:bg-muted"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                Item Detail
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Product info for {itemData.name}.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {itemData.is_active ? (
                            <Badge className="flex items-center gap-1.5 border-green-200 bg-green-100 px-3 py-1 text-green-700 shadow-sm hover:bg-green-100">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Active
                            </Badge>
                        ) : (
                            <Badge
                                variant="destructive"
                                className="flex items-center gap-1.5 px-3 py-1 shadow-sm"
                            >
                                <XCircle className="h-3.5 w-3.5" /> Inactive
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
                    {/* Visual & Summary Column (KIRI) */}
                    <div className="space-y-6">
                        <Card className="group relative overflow-hidden border shadow-md">
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <img
                                    src={itemData.img || initialUrl}
                                    alt={itemData.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            initialUrl;
                                    }}
                                />
                                {!itemData.is_active && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 p-4 backdrop-blur-[2px]">
                                        <Badge
                                            variant="outline"
                                            className="border-foreground/20 bg-background/80 px-4 py-2 font-bold tracking-wider text-foreground uppercase shadow-lg"
                                        >
                                            Unavailable
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6 text-center">
                                <div className="mb-4 flex justify-center">
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-primary"
                                    >
                                        <Layers className="h-3.5 w-3.5" />{' '}
                                        {itemData.category?.cat_name ||
                                            'Uncategorized'}
                                    </Badge>
                                </div>
                                <h2 className="text-2xl leading-tight font-bold text-foreground capitalize">
                                    {itemData.name}
                                </h2>
                                <p className="mt-3 text-3xl font-black tracking-tight text-primary">
                                    {formatCurrency(itemData.price)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Specifications & Inventory Column (KANAN) */}
                    <div className="space-y-6">
                        {/* Specifications */}
                        <Card className="flex flex-col overflow-hidden border border-muted/60 shadow-md">
                            <CardHeader className="border-b bg-muted/10 pb-5">
                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                    <Info className="h-5 w-5 text-primary" />
                                    Product Specifications
                                </CardTitle>
                                <CardDescription>
                                    Detailed record of the item attributes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow p-0">
                                <dl className="divide-y divide-muted/30">
                                    <div className="group grid gap-2 px-6 py-5 transition-colors hover:bg-muted/5 sm:grid-cols-3">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Tag className="h-4 w-4 text-muted-foreground/60 transition-colors" />{' '}
                                            Item Name
                                        </dt>
                                        <dd className="text-sm font-semibold text-foreground capitalize sm:col-span-2">
                                            {itemData.name}
                                        </dd>
                                    </div>
                                    <div className="group grid gap-2 px-6 py-5 transition-colors hover:bg-muted/5 sm:grid-cols-3">
                                        <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Layers className="h-4 w-4 text-muted-foreground/60 transition-colors" />{' '}
                                            Category
                                        </dt>
                                        <dd className="text-sm font-semibold text-foreground capitalize sm:col-span-2">
                                            {itemData.category?.cat_name ||
                                                'N/A'}
                                        </dd>
                                    </div>
                                    <div className="group grid gap-2 bg-muted/10 px-6 py-6 transition-colors hover:bg-muted/5">
                                        <dt className="flex items-center gap-2 text-sm font-bold text-foreground">
                                            <Info className="h-4 w-4 text-primary" />{' '}
                                            Product Description
                                        </dt>
                                        <dd className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80 italic">
                                            {itemData.description ||
                                                'No description provided.'}
                                        </dd>
                                    </div>
                                    <div className="group grid gap-2 px-6 py-4 transition-colors hover:bg-muted/5 sm:grid-cols-3">
                                        <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <History className="h-3.5 w-3.5 text-muted-foreground/60" />{' '}
                                            Date Added
                                        </dt>
                                        <dd className="text-xs font-medium text-foreground sm:col-span-2">
                                            {createdAt}
                                        </dd>
                                    </div>
                                    <div className="group grid gap-2 border-b-0 px-6 py-4 transition-colors hover:bg-muted/5 sm:grid-cols-3">
                                        <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />{' '}
                                            Last Updated
                                        </dt>
                                        <dd className="text-xs font-medium text-muted-foreground sm:col-span-2">
                                            {updatedAt}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>

                        {/* Inventory Status (Now on the Right) */}
                        <Card className="overflow-hidden border border-primary/20 bg-muted/20 shadow-sm">
                            <CardHeader className="border-b bg-muted/40 py-4 pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <Package className="h-4 w-4 text-primary" />{' '}
                                    Inventory Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-5">
                                <div className="flex items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                                    <span className="text-sm text-muted-foreground">
                                        Available Stock
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-lg font-bold ${itemData.stock <= itemData.min_stock ? 'text-destructive' : 'text-foreground'}`}
                                        >
                                            {itemData.stock}
                                        </span>
                                        {itemData.stock <=
                                            itemData.min_stock && (
                                            <AlertTriangle className="h-4 w-4 animate-pulse text-destructive" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-2">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Info className="h-3 w-3" /> Min. Stock
                                        Alert
                                    </span>
                                    <span className="text-xs font-semibold text-foreground">
                                        {itemData.min_stock} units
                                    </span>
                                </div>
                                {itemData.stock <= itemData.min_stock && (
                                    <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                                        <p className="text-[10px] leading-relaxed font-medium text-destructive italic">
                                            * Stock below threshold. Restock
                                            required.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Item Management', href: '/items' },
        { title: 'Item Detail', href: '#' },
    ],
};
