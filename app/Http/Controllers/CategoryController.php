<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryStoreRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $perPage = $request->integer('perPage', 25);

        $query = Category::query();

        return Inertia::render('category/Index', [
            'categories' => CategoryResource::collection($query->paginate($perPage))
        ]);
    }

    public function store(CategoryStoreRequest $request)
    {
        $this->categoryService->createCategory($request->all());
        return back()->with('success', 'Data saved successfully.');
    }

    public function update(CategoryStoreRequest $request, $category_id)
    {
        $this->categoryService->updateCategory($category_id, $request->all());
        return back()->with('success', 'Data change update successfully');
    }

    public function destroy($category_id)
    {
        $this->categoryService->deleteCategory($category_id);

        return back()->with('success', 'Category deleted successfully');
    }
}
