import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type DetailSubmisi } from '@/types';
import { Head } from '@inertiajs/react';
import DetailSubmisiView from '@/components/detail-submisi-view';

interface HistoryDetailProps extends PageProps {
    detailSubmisi: DetailSubmisi;
}

export default function HistoryDetailPage({ detailSubmisi }: HistoryDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Histori Pengajuan',
            href: '#', // No index page for general history, just direct links to detail
        },
        {
            title: detailSubmisi.id.substring(0, 10) + '...',
            href: `/dashboard/history/${detailSubmisi.id}`,
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Histori Pengajuan - ${detailSubmisi.id.substring(0, 10)}...`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4">
                <DetailSubmisiView detailSubmisi={detailSubmisi} />
            </div>
        </AppLayout>
    );
}
