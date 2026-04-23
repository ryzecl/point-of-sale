<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

class ItemService
{
    /**
     * Menerapkan filter pada query Item.
     */
    public function applyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['category_id'] ?? null, fn($q, $id) => $q->where('category_id', $id))
            ->when($filters['min_price'] ?? null, fn($q, $price) => $q->where('price', '>=', $price))
            ->when($filters['max_price'] ?? null, fn($q, $price) => $q->where('price', '<=', $price))
            ->when($filters['stock_status'] ?? null, function ($q, $status) {
                if ($status === 'available') {
                    $q->where('stock', '>', 0);
                } elseif ($status === 'out_of_stock') {
                    $q->where('stock', '<=', 0);
                }
            })
            ->when($filters['is_low_stock'] ?? null, function ($q) {
                $q->whereColumn('stock', '<=', 'min_stock');
            })
            ->when(isset($filters['is_active']), function ($q) use ($filters) {
                $q->where('is_active', $filters['is_active']);
            });
    }

    /**
     * Get item statistics for dashboard/index.
     */
    public function getStats(): array
    {
        return [
            'totalItemStats' => Item::count(),
            'low_stock' => Item::whereColumn('stock', '<=', 'min_stock')->count(),
        ];
    }

    /**
     * Create a new item.
     */
    public function createItem(array $data, $image = null): Item
    {
        if ($image) {
            $data['img'] = $image->store('items', 'public');
        }

        return Item::create($data);
    }

    /**
     * Update an existing item.
     */
    public function updateItem(Item $item, array $data, $image = null): bool
    {
        if ($image) {
            // Delete old image
            if ($item->img && Storage::disk('public')->exists($item->img)) {
                Storage::disk('public')->delete($item->img);
            }
            $data['img'] = $image->store('items', 'public');
        }

        return $item->update($data);
    }
}
