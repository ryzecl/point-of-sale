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

export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role?: Role;
    created_at: string;
    updated_at: string;
}
