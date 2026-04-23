import { Link, usePage } from '@inertiajs/react';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['superadmin', 'admin', 'cashier', 'chef', 'internship'],
    },
    {
        title: 'Cashier',
        href: '/cashier',
        icon: ShoppingCart,
        roles: ['superadmin', 'admin', 'cashier'],
    },
    {
        title: 'Order',
        href: '/orders',
        icon: ClipboardPen,
        roles: ['superadmin', 'admin', 'cashier', 'chef'],
    },
    {
        title: 'Menu',
        href: '/items',
        icon: NotepadText,
        roles: ['superadmin', 'admin', 'cashier', 'chef'],
    },
    {
        title: 'Category',
        href: '/categories',
        icon: Tags,
        roles: ['superadmin', 'admin'],
    },
    {
        title: 'Role',
        href: '/roles',
        icon: ShieldUser,
        roles: ['superadmin', 'admin'],
    },
    {
        title: 'User',
        href: '/users',
        icon: Users,
        roles: ['superadmin', 'admin'],
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
    const { auth } = usePage<any>().props;
    const userRole = auth.user.role.role_name;

    const filteredNavItems = mainNavItems.filter((item) => {
        if (!item.roles) {
            return true;
        }

        return item.roles.includes(userRole);
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
