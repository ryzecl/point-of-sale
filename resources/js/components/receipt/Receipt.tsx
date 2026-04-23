import { forwardRef } from 'react';
import { formatCurrency } from '@/lib/format-utils';
import type { OrderSuccessData } from '@/types';
import './receipt-print.css';

interface ReceiptProps {
    data: OrderSuccessData;
    storeName?: string;
    storeAddress?: string;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
    (
        {
            data,
            storeName = 'RYZE POS',
            storeAddress = 'Jl. Digital No. 101, Jakarta Pusat',
        },
        ref,
    ) => {
        const date = new Date(data.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <div ref={ref} className="receipt-container">
                {/* Header Toko */}
                <div className="receipt-header">
                    <h2 className="receipt-store-name">{storeName}</h2>
                    <p className="receipt-store-address">{storeAddress}</p>
                    <div className="receipt-divider-double" />
                </div>

                {/* Info Transaksi */}
                <div className="receipt-info text-[10px]">
                    <div className="receipt-row">
                        <span>No</span>
                        <span>#{data.orderCode}</span>
                    </div>
                    <div className="receipt-row">
                        <span>Date</span>
                        <span>
                            {formattedDate} {formattedTime}
                        </span>
                    </div>
                    <div className="receipt-row">
                        <span>Cashier</span>
                        <span>{data.cashierName}</span>
                    </div>
                    <div className="receipt-row">
                        <span>Customer</span>
                        <span>{data.customerName || 'Walk-in'}</span>
                    </div>
                    {data.tableNumber > 0 && (
                        <div className="receipt-row">
                            <span>Table</span>
                            <span>{data.tableNumber}</span>
                        </div>
                    )}
                </div>

                <div className="receipt-divider-dashed" />

                {/* Daftar Item */}
                <div className="receipt-items">
                    {data.items.map((item, idx) => (
                        <div key={idx} className="receipt-item">
                            <div className="receipt-item-name">{item.name}</div>
                            <div className="receipt-item-detail">
                                <span>
                                    {item.quantity} x{' '}
                                    {formatCurrency(item.price)}
                                </span>
                                <span>{formatCurrency(item.total)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="receipt-divider-dashed" />

                {/* Totals */}
                <div className="receipt-totals">
                    <div className="receipt-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(data.subtotal)}</span>
                    </div>
                    <div className="receipt-row">
                        <span>Tax (10%)</span>
                        <span>{formatCurrency(data.tax)}</span>
                    </div>
                    {data.discount > 0 && (
                        <div className="receipt-row">
                            <span>Discount</span>
                            <span>-{formatCurrency(data.discount)}</span>
                        </div>
                    )}
                    <div className="receipt-divider-single" />
                    <div className="receipt-row receipt-grand-total">
                        <span>TOTAL</span>
                        <span>{formatCurrency(data.grandTotal)}</span>
                    </div>
                </div>

                <div className="receipt-divider-dashed" />

                {/* Payment Info */}
                <div className="receipt-payment">
                    <div className="receipt-row">
                        <span>Payment</span>
                        <span className="receipt-uppercase">
                            {data.paymentMethod}
                        </span>
                    </div>
                    {data.paymentMethod === 'cash' && (
                        <>
                            <div className="receipt-row">
                                <span>Received</span>
                                <span>
                                    {formatCurrency(data.paymentAmount)}
                                </span>
                            </div>
                            <div className="receipt-row">
                                <span>Change</span>
                                <span>
                                    {formatCurrency(data.changeAmount)}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Note */}
                {data.note && (
                    <>
                        <div className="receipt-divider-dashed" />
                        <div className="receipt-note">
                            <span className="receipt-note-label">Note:</span>
                            <p>{data.note}</p>
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="receipt-divider-double" />
                <div className="receipt-footer">
                    <p>Thank you for your visit!</p>
                    <p className="receipt-powered">Powered by RYZE POS</p>
                </div>
            </div>
        );
    },
);

Receipt.displayName = 'Receipt';
export default Receipt;
