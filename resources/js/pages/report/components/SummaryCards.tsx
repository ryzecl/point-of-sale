import { CreditCard, DollarSign, Percent, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format-utils';

interface SummaryData {
    totalRevenue: number;
    totalTransactions: number;
    totalDiscount: number;
    averageTransaction: number;
}

interface SummaryCardsProps {
    summary: SummaryData;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
    const cards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(summary.totalRevenue),
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Transactions',
            value: summary.totalTransactions.toLocaleString(),
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Total Discount',
            value: formatCurrency(summary.totalDiscount),
            icon: Percent,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
        {
            title: 'Avg. Transaction',
            value: formatCurrency(summary.averageTransaction),
            icon: CreditCard,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <Card key={idx} className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={`rounded-full p-2 ${card.bg}`}>
                            <card.icon className={`size-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
