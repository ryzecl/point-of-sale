<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'customer_name' => $this->customer_name,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'discount' => $this->discount,
            'subtotal' => $this->subtotal,
            'tax' => $this->tax,
            'grand_total' => $this->grand_total,
            'status' => $this->status,
            'table_number' => $this->table_number,
            'payment_method' => $this->payment_method,
            'payment_amount' => $this->payment_amount,
            'change_amount' => $this->change_amount,
            'note' => $this->note,
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
