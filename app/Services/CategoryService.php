<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    /**
     * Create a new category.
     */
    public function createCategory(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Update an existing category.
     */
    public function updateCategory($category_id, array $data): Category
    {
        $category = Category::findOrFail($category_id);
        $category->update($data);
        return $category;
    }

    /**
     * Delete a category.
     */
    public function deleteCategory($category_id): bool
    {
        $category = Category::findOrFail($category_id);
        return $category->delete();
    }
}
