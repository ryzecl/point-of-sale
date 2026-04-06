<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Logika menampilkan URL Gambar
        $imageUrl = $this->img;

        // Jika ada isi 'img' tapi bukan URL (berarti itu path di storage)
        if ($this->img && !filter_var($this->img, FILTER_VALIDATE_URL)) {
            $imageUrl = Storage::url($this->img);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'min_stock' => $this->min_stock,
            'category_id' => $this->category_id,
            'category' => [
                'id' => $this->category?->id,
                'cat_name' => $this->category?->cat_name,
            ],
            'img' => $imageUrl,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
