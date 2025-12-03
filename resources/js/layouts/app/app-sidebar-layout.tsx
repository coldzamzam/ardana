import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import OnboardingModal from '@/components/onboarding-modal';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { onboarding, flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success('Success', {
                description: flash.success,
            });
        }
        if (flash.error) {
            toast.error('Error', {
                description: flash.error,
            });
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <Toaster richColors />
            {onboarding && <OnboardingModal role={onboarding} />}
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="overflow-x-hidden bg-[#BAEAC9] text-[#427452]"
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
