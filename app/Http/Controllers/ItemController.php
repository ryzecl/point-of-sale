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

class ItemController extends Controller
{
    public function index()
    {
        $perPage = request()->query('perPage', 25);
        $query = Item::with('category');

        $items = ItemResource::collection($query->paginate($perPage));
        $categories = CategoryResource::collection(Category::all());

        return Inertia::render('item/Index', [
            'items' => $items,
            'categories' => $categories
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
        ]);
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return back()->with('success', 'Item deleted successfully');
    }
}
