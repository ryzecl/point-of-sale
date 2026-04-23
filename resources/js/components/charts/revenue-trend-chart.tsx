import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PeriodType, TrendDataPoint } from '@/types/chart';

interface Props {
    data: TrendDataPoint[];
    period: PeriodType;
    onPeriodChange: (p: PeriodType) => void;
    loading?: boolean;
}

const PERIODS: { value: PeriodType; label: string }[] = [
    { value: 'daily', label: 'Hari Ini' },
    { value: 'weekly', label: 'Minggu Ini' },
    { value: 'monthly', label: 'Bulan Ini' },
    { value: 'yearly', label: 'Tahun Ini' },
];

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('id-ID', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(v);

export function RevenueTrendChart({
    data,
    period,
    onPeriodChange,
    loading,
}: Props) {
    return (
        <Card className="border-none shadow-md col-span-full lg:col-span-8">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">
                    Tren Pendapatan & Pesanan
                </CardTitle>
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => onPeriodChange(p.value)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                period === p.value
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                    {period === 'custom' && (
                        <div className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm">
                            Kustom
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex h-[350px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart
                            data={data}
                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient
                                    id="gradientRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-revenue)"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--color-revenue)"
                                        stopOpacity={0.02}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-muted"
                            />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 12 }}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                yAxisId="revenue"
                                tickFormatter={formatCurrency}
                                tick={{ fontSize: 11 }}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                yAxisId="orders"
                                orientation="right"
                                tick={{ fontSize: 11 }}
                                className="fill-muted-foreground"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                }}
                                formatter={((value: any, name: any) => [
                                    name === 'revenue'
                                        ? new Intl.NumberFormat('id-ID', {
                                              style: 'currency',
                                              currency: 'IDR',
                                              minimumFractionDigits: 0,
                                          }).format(value as number)
                                        : value,
                                    name === 'revenue'
                                        ? 'Pendapatan'
                                        : 'Pesanan',
                                ]) as any}
                            />
                            <Area
                                yAxisId="revenue"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                fill="url(#gradientRevenue)"
                                strokeWidth={2}
                                style={
                                    {
                                        '--color-revenue': '#10b981',
                                    } as React.CSSProperties
                                }
                            />
                            <Bar
                                yAxisId="orders"
                                dataKey="orders"
                                fill="#6366f1"
                                opacity={0.6}
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
