import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import OnboardingModal from '@/components/onboarding-modal';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { onboarding } = usePage<SharedData>().props;

    return (
        <AppShell variant="sidebar">
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
