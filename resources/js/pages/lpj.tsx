import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LPJ',
        href: '/lpj',
    },
];

export default function LpjPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LPJ" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Halaman LPJ</h1>
                <p>This is a placeholder for the LPJ page.</p>
            </div>
        </AppLayout>
    );
}
