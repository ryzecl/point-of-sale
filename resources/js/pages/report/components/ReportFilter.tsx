import { Search, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FilterParams {
    start_date: string;
    end_date: string;
    payment_method: string;
}

interface ReportFilterProps {
    params: FilterParams;
    onChange: (params: FilterParams) => void;
}

export default function ReportFilter({ params, onChange }: ReportFilterProps) {
    const [localParams, setLocalParams] = useState(params);

    useEffect(() => {
        setLocalParams(params);
    }, [params]);

    const handleApply = () => {
        onChange(localParams);
    };

    const handleReset = () => {
        const resetParams = {
            start_date: '',
            end_date: '',
            payment_method: '',
        };
        setLocalParams(resetParams);
        onChange(resetParams);
    };

    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
                <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                        type="date"
                        value={localParams.start_date}
                        onChange={(e) =>
                            setLocalParams({
                                ...localParams,
                                start_date: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                        type="date"
                        value={localParams.end_date}
                        onChange={(e) =>
                            setLocalParams({
                                ...localParams,
                                end_date: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                        value={localParams.payment_method || 'all'}
                        onValueChange={(val) =>
                            setLocalParams({
                                ...localParams,
                                payment_method: val === 'all' ? '' : val,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Methods" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Methods</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleApply} className="flex-1 gap-2">
                        <Search className="size-4" /> Filter
                    </Button>
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="gap-2"
                        title="Reset"
                    >
                        <RotateCcw className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
