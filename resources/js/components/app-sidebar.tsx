import { Link } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardPen,
    FolderGit2,
    LayoutGrid,
    NotepadText,
    ShoppingCart,
    Tags,
    ShieldUser,
    Users,
    ChartLine,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/usePermission';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permissions: ['dashboard.view'],
    },
    {
        title: 'Cashier',
        href: '/cashier',
        icon: ShoppingCart,
        permissions: ['pos.access'],
    },
    {
        title: 'Order',
        href: '/orders',
        icon: ClipboardPen,
        permissions: ['order.access'],
    },
    {
        title: 'Menu',
        href: '/items',
        icon: NotepadText,
        permissions: ['item.view'],
    },
    {
        title: 'Category',
        href: '/categories',
        icon: Tags,
        permissions: ['category.view'],
    },
    {
        title: 'Role',
        href: '/roles',
        icon: ShieldUser,
        permissions: ['role.view'],
    },
    {
        title: 'User',
        href: '/users',
        icon: Users,
        permissions: ['user.view'],
    },
    {
        title: 'Sales Report',
        href: '/reports/sales',
        icon: ChartLine,
        permissions: ['report.view'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { hasRole, hasAnyPermission } = usePermission();

    const filteredNavItems = mainNavItems.filter((item) => {
        if (!item.roles && !item.permissions) {
            return true;
        }

        const roleMatch = item.roles ? item.roles.some((role) => hasRole(role)) : false;
        const permissionMatch = item.permissions ? hasAnyPermission(item.permissions) : false;

        return roleMatch || permissionMatch;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
