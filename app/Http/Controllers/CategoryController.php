<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryStoreRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $perPage = request()->query('perPage', 25);
        $query = Category::query();

        $categories = CategoryResource::collection($query->paginate($perPage));

        return Inertia::render('category/Index', [
            'categories' => $categories
        ]);
    }

    public function store(CategoryStoreRequest $request)
    {
        Category::create($request->all());
        return back()->with('success', 'Data saved successfully.');
    }

    public function update(CategoryStoreRequest $request, $category_id)
    {
        $category = Category::findOrFail($category_id);
        $category->update($request->all());
        return back()->with('success', 'Data change update successfully');
    }

    public function destroy($category_id)
    {
        $category = Category::findOrFail($category_id);
        $category->delete();

        return back()->with('success', 'Category deleted successfully');
    }
}
