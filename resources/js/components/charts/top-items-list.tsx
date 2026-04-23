import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TopItem } from '@/types/chart';

interface Props {
    items: TopItem[];
    loading?: boolean;
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(v);

export function TopItemsList({ items, loading }: Props) {
    return (
        <Card className="col-span-full border-none shadow-md lg:col-span-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Top Selling Items
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex animate-pulse items-center gap-4"
                            >
                                <div className="h-12 w-12 rounded-lg bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 rounded bg-muted" />
                                    <div className="h-3 w-1/4 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        No sales data available.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="group flex items-center justify-between rounded-xl p-2 transition-all hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                        {item.img ? (
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-bold text-muted-foreground">
                                                IMG
                                            </span>
                                        )}
                                        <div className="absolute top-0 left-0 rounded-br-lg bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                                            #{index + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {item.total_qty} sold
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">
                                        {formatCurrency(item.total_revenue)}
                                    </p>
                                    <Badge
                                        variant="secondary"
                                        className="mt-1 text-[10px] font-medium"
                                    >
                                        Revenue
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
