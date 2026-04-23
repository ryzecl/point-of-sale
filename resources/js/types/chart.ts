export interface TrendDataPoint {
    label: string;
    revenue: number;
    orders: number;
}

export interface PaymentDistItem {
    method: string;
    total: number;
    count: number;
}

export interface ChartSummary {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
}

export interface ChartMeta {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    date: string;
    rangeStart: string;
    rangeEnd: string;
}

export interface TopItem {
    name: string;
    img: string | null;
    total_qty: number;
    total_revenue: number;
}

export interface ChartDataResponse {
    trendData: TrendDataPoint[];
    paymentDistribution: PaymentDistItem[];
    topItems: TopItem[];
    summary: ChartSummary;
    meta: ChartMeta;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';
