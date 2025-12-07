import StatusHistoryCard from '@/components/status-history-card'; // Import StatusHistoryCard
import SubmissionActionCard from '@/components/submission-action-card';
import SubmissionDetailView from '@/components/submission-detail-view';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PageProps,
    type StatusType,
    type Submisi,
} from '@/types';
import { Head } from '@inertiajs/react';

interface ReviewDetailProps extends PageProps {
    submisi: Submisi;
    availableStatuses: StatusType[];
}

export default function ReviewDetailPage({
    submisi,
    availableStatuses,
}: ReviewDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Review Submisi',
            href: '/dashboard/review',
        },
        {
            title: submisi.judul,
            href: `/dashboard/review/${submisi.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review - ${submisi.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4">
                <StatusHistoryCard submisi={submisi} />{' '}
                {/* Render StatusHistoryCard */}
                {/* Komponen Read-only untuk semua detail submisi */}
                <SubmissionDetailView submisi={submisi} />
                {/* Komponen Form Aksi (Validasi/Verifikasi/Persetujuan) */}
                <SubmissionActionCard
                    submisi={submisi}
                    availableStatuses={availableStatuses}
                />
            </div>
        </AppLayout>
    );
}
