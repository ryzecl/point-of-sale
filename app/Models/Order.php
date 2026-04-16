<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_code',
        'user_id',
        'discount',
        'subtotal',
        'tax',
        'grand_total',
        'status',
        'table_number',
        'payment_method',
        'payment_amount',
        'change_amount',
        'note',
        'snap_token',
        'midtrans_transaction_id',
    ];

    protected $casts = [
        'status' => OrderStatus::class,
    ];


    protected $dates = ['deleted_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
