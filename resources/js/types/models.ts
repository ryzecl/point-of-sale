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
