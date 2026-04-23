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
        <Card className="border-none shadow-md col-span-full lg:col-span-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Menu Terlaris
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-12 w-12 rounded-lg bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-1/3 bg-muted rounded" />
                                    <div className="h-3 w-1/4 bg-muted rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        Tidak ada data penjualan.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between group transition-all hover:bg-muted/50 p-2 rounded-xl"
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
                                        <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
                                            #{index + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {item.total_qty} terjual
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">
                                        {formatCurrency(item.total_revenue)}
                                    </p>
                                    <Badge variant="secondary" className="text-[10px] font-medium mt-1">
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
