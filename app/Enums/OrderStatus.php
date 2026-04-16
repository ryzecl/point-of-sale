<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case SETTLEMENT = 'settlement';
    case CANCEL = 'cancel';
    case EXPIRE = 'expire';
    case COOKED = 'cooked';
    case SERVED = 'served';
}
