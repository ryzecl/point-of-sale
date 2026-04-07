<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfflineOrderController extends Controller
{
    public function index()
    {
        $items = Item::with('category')->where('is_active', true)->orderBy('name')->get();
        $categories = Category::orderBy('cat_name')->get();

        return Inertia::render('cashier/Index', [
            'items' => $items,
            'categories' => $categories
        ]);
    }
}
