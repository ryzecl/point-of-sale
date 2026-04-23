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

export interface RecentOrder {
    id: number;
    customer_name: string | null;
    grand_total: number;
    status: string;
    created_at: string;
}

export interface ChartDataResponse {
    trendData: TrendDataPoint[];
    paymentDistribution: PaymentDistItem[];
    topItems: TopItem[];
    recentOrders: RecentOrder[];
    summary: ChartSummary;
    meta: ChartMeta;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
