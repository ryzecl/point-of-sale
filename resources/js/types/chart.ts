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

export interface ChartDataResponse {
    trendData: TrendDataPoint[];
    paymentDistribution: PaymentDistItem[];
    summary: ChartSummary;
    meta: ChartMeta;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';
