import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PaymentDistItem } from '@/types/chart';

interface Props {
    data: PaymentDistItem[];
    loading?: boolean;
}

const COLORS: Record<string, string> = {
    cash: '#10b981', // emerald-500
    transfer: '#6366f1', // indigo-500
};

const LABELS: Record<string, string> = {
    cash: 'Cash',
    transfer: 'Transfer',
};

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(v);

export function PaymentDistributionChart({ data, loading }: Props) {
    const total = data.reduce((sum, d) => sum + d.count, 0);

    return (
        <Card className="col-span-full border-none shadow-md lg:col-span-4">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Payment Methods
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex h-[250px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex h-[250px] flex-col items-center justify-center p-4 text-center">
                        <div className="mb-2 rounded-full bg-muted p-3">
                            <span className="text-xs font-semibold text-muted-foreground">
                                Empty
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            No transaction data for this period.
                        </p>
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="total"
                                    nameKey="method"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    strokeWidth={0}
                                >
                                    {data.map((entry) => (
                                        <Cell
                                            key={entry.method}
                                            fill={
                                                COLORS[entry.method] ??
                                                '#94a3b8'
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={
                                        ((value: any) =>
                                            formatCurrency(
                                                value as number,
                                            )) as any
                                    }
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-3">
                            {data.map((item) => {
                                const pct =
                                    total > 0
                                        ? ((item.count / total) * 100).toFixed(
                                              1,
                                          )
                                        : '0';

                                return (
                                    <div
                                        key={item.method}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[item.method],
                                                }}
                                            />
                                            <span className="text-sm font-medium">
                                                {LABELS[item.method] ??
                                                    item.method}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold">
                                                {pct}%
                                            </span>
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                ({item.count} trx)
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
