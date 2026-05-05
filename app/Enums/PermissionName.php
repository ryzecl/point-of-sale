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
    case ITEM_VIEW = 'item.view';
    case ITEM_CREATE = 'item.create';
    case ITEM_UPDATE = 'item.update';
    case ITEM_DELETE = 'item.delete';

    // Category Module
    case CATEGORY_VIEW = 'category.view';
    case CATEGORY_CREATE = 'category.create';
    case CATEGORY_UPDATE = 'category.update';
    case CATEGORY_DELETE = 'category.delete';

    // Role Module
    case ROLE_VIEW = 'role.view';
    case ROLE_CREATE = 'role.create';
    case ROLE_UPDATE = 'role.update';
    case ROLE_DELETE = 'role.delete';
    
    // Report Module
    case REPORT_VIEW = 'report.view';
}
