<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

class ItemService
{
    /**
     * Menerapkan filter pada query Item.
     * Mengembalikan Builder sehingga bisa di-paginate, count, atau get di controller.
     */
    public function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            // Filter Search (Nama & Deskripsi)
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            // Filter Kategori
            ->when($filters['category_id'] ?? null, fn($q, $id) => $q->where('category_id', $id))
            // Filter Rentang Harga
            ->when($filters['min_price'] ?? null, fn($q, $price) => $q->where('price', '>=', $price))
            ->when($filters['max_price'] ?? null, fn($q, $price) => $q->where('price', '<=', $price))
            // Filter Status Stok
            ->when($filters['stock_status'] ?? null, function ($q, $status) {
                if ($status === 'available') {
                    $q->where('stock', '>', 0);
                } elseif ($status === 'out_of_stock') {
                    $q->where('stock', '<=', 0);
                }
            })
            // Filter Stok Tipis (Low Stock)
            ->when($filters['is_low_stock'] ?? null, function ($q) {
                $q->whereColumn('stock', '<=', 'min_stock');
            })
            // Filter Aktif/Tidak
            ->when(isset($filters['is_active']), function ($q) use ($filters) {
                $q->where('is_active', $filters['is_active']);
            });
    }
}
