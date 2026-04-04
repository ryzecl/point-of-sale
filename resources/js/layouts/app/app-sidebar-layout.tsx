import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { flash } = usePage().props as any;
    // Gunakan useEffect agar toast muncul setiap kali nilai flash berubah
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success); // Panggil notif hijau
        }

        if (flash.error) {
            toast.error(flash.error); // Panggil notif merah
        }

        if (flash.warning) {
            toast.warning(flash.warning); // Panggil notif kuning
        }
    }, [flash]); // Dependen

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <Toaster position="top-right" richColors />
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
