<?php
namespace App\Enums;

enum PermissionName: string
{
    // Dashboard
    case DASHBOARD_VIEW = 'dashboard.view';

    // User Module
    case USER_VIEW = 'user.view';
    case USER_CREATE = 'user.create';
    case USER_UPDATE = 'user.update';
    case USER_DELETE = 'user.delete';
    
    // POS Module
    case POS_ACCESS = 'pos.access';
    
    // Order Module
    case ORDER_ACCESS = 'order.access';

    // Menu/Item Module
    case ITEM_ACCESS = 'item.access';

    // Category Module
    case CATEGORY_ACCESS = 'category.access';

    // Role Module
    case ROLE_ACCESS = 'role.access';
    
    // Report Module
    case REPORT_VIEW = 'report.view';
}
