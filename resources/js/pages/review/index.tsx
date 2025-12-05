import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type Submisi } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface ReviewIndexProps extends PageProps {
    submissions: {
        data: Submisi[];
        // Inertia pagination object props
    };
    pageTitle: string;
}

export default function ReviewIndexPage({ submissions, pageTitle }: ReviewIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: pageTitle,
            href: '/dashboard/review',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="w-full">
                    <h1 className="text-2xl font-semibold text-[#427452]">
                        {pageTitle}
                    </h1>
                    <p className="text-sm text-[#427452]/80">
                        Berikut adalah daftar submisi yang memerlukan review Anda.
                    </p>
                </div>

                <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Jenis Kegiatan</TableHead>
                                <TableHead>Dibuat oleh</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.data.length > 0 ? (
                                submissions.data.map((submisi) => (
                                    <TableRow key={submisi.id}>
                                        <TableCell>
                                            {format(new Date(submisi.created_at), 'dd MMM yyyy')}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/dashboard/review/${submisi.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {submisi.judul}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{submisi.type}</TableCell>
                                        <TableCell>{submisi.kegiatan_type?.nama}</TableCell>
                                        <TableCell>{submisi.created_by?.name}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        Tidak ada submisi yang perlu direview saat ini.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* TODO: Add Pagination links */}
            </div>
        </AppLayout>
    );
}
