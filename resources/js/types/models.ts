import type { User } from './auth';
export interface Role {
    id: number;
    role_name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface Category {
    id: number;
    cat_name: string;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    min_stock: number;
    category_id: number;
    category?: Category;
    img?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface Order {
    id: number;
    order_code: string;
    customer_name: string;
    user_id: number;
    discount: number;
    subtotal: number;
    tax: number;
    grand_total: number;
    status: string;
    table_number: number;
    payment_method: string;
    payment_amount: number;
    change_amount: number;
    note: string;
    snap_token?: string;
    midtrans_transaction_id?: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    user?: User;
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    item_id: number;
    item?: Item;
    quantity: number;
    price: number;
    tax: number;
    total_price: number;
    created_at: string;
    updated_at: string;
}

export interface CheckoutData {
    customerName: string;
    paymentMethod: string;
    paymentAmount: number;
    tableNumber: number;
    note: string;
}

export interface OrderSuccessData {
    orderCode: string;
    grandTotal: number;
    snapToken?: string;
    message: string;
}
