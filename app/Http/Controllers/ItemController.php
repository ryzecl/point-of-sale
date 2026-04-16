<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemStoreRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ItemResource;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ItemService;

class ItemController extends Controller
{
    public function index(Request $request, ItemService $itemService)
    {
        $perPage = $request->query('perPage', 25);
        $query = Item::with('category');

        // Gunakan service
        $query = $itemService->applyFilters($query, $request->all());
        // Statistik juga menggunakan query yang sama (clone agar tidak merusak query utama)
        $stats = [
            'total' => (clone $query)->count(),
            'inactive' => (clone $query)->where('is_active', 0)->count(),
            'low_stock' => (clone $query)->whereColumn('stock', '<=', 'min_stock')->count(),
        ];

        // Statistics before pagination
        $stats = [
            'total' => (clone $query)->count(),
            'inactive' => (clone $query)->where('is_active', 0)->count(),
            'low_stock' => (clone $query)->whereColumn('stock', '<=', 'min_stock')->count(),
        ];

        $items = ItemResource::collection($query->paginate($request->perPage ?? $perPage)->withQueryString());
        $categories = CategoryResource::collection(Category::all());

        return Inertia::render('item/Index', [
            'items' => $items,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['search', 'category_id', 'min_price', 'max_price', 'stock_status', 'is_active', 'is_low_stock', 'perPage'])
        ]);
    }

    public function store(ItemStoreRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('img')) {
            $data['img'] = $request->file('img')->store('items', 'public');
        }
        Item::create($data);
        return back()->with('success', 'Item created!');
    }

    public function update(ItemStoreRequest $request, Item $item)
    {
        $data = $request->validated();
        // LOGIKA UPDATE GAMBAR:
        if ($request->hasFile('img')) {
            // 1. Hapus file lama jika ada
            if ($item->img && Storage::disk('public')->exists($item->img)) {
                Storage::disk('public')->delete($item->img);
            }
            // 2. Simpan file baru
            $data['img'] = $request->file('img')->store('items', 'public');
        } else {
            // Jika tidak ada gambar baru, jangan update kolom img (biarkan path lama tetap ada)
            unset($data['img']);
        }
        $item->update($data);
        return back()->with('success', 'Item updated successfully!');
    }

    public function show(Item $item)
    {
        return Inertia::render('item/Show', [
            'item' => new ItemResource($item->load('category')),
            'categories' => CategoryResource::collection(Category::all()),
        ]);
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return back()->with('success', 'Item deleted successfully');
    }
}
