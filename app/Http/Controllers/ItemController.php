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
    protected ItemService $itemService;

    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 25);
        $query = Item::with('category');

        // Use service
        $query = $this->itemService->applyFilters($query, $request->all());
        
        $stats = [
            'totalItemStats' => Item::count(),
            'total' => (clone $query)->count(),
            'active' => (clone $query)->where('is_active', 1)->count(),
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
        $this->itemService->createItem($request->validated(), $request->file('img'));
        
        return back()->with('success', 'Item created!');
    }

    public function update(ItemStoreRequest $request, Item $item)
    {
        $this->itemService->updateItem($item, $request->validated(), $request->file('img'));
        
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
