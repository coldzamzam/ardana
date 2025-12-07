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
    };
    pageTitle: string;
}

export default function ReviewIndexPage({
    submissions,
    pageTitle,
}: ReviewIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: pageTitle, href: '/dashboard/review' },
    ];

    const hasSubmissions = submissions.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            {/* Background hijau seperti notifikasi */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                {/* Inner frame */}
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">

                    {/* HEADER */}
                    <div>
                        <h1 className="text-2xl font-semibold text-[#427452]">
                            {pageTitle}
                        </h1>
                        <p className="text-sm text-[#427452]/80">
                            Berikut adalah daftar submisi yang memerlukan review Anda.
                        </p>
                    </div>

                    {/* CARD PUTIH yang berisi tabel */}
                    <div className="mt-2 rounded-2xl border border-[#73AD86]/40 bg-white p-4 shadow-sm">

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Tanggal</TableHead>
                                    <TableHead className="text-center">Judul</TableHead>
                                    <TableHead className="text-center">Tipe</TableHead>
                                    <TableHead className="text-center">Jenis Kegiatan</TableHead>
                                    <TableHead className="text-center">Dibuat oleh</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {hasSubmissions ? (
                                    submissions.data.map((submisi) => (
                                        <TableRow key={submisi.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                {format(new Date(submisi.created_at), 'dd MMM yyyy')}
                                            </TableCell>

                                            {/* Link Judul */}
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/dashboard/review/${submisi.id}`}
                                                    className="text-[#427452] hover:underline"
                                                >
                                                    {submisi.judul}
                                                </Link>
                                            </TableCell>

                                            <TableCell className="uppercase tracking-wide text-xs font-semibold text-[#427452]">
                                                {submisi.type}
                                            </TableCell>

                                            <TableCell>
                                                {submisi.kegiatan_type?.nama}
                                            </TableCell>

                                            <TableCell>
                                                {submisi.created_by?.name}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-slate-600 py-6"
                                        >
                                            Tidak ada submisi yang perlu direview saat ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* TODO: Pagination */}
                </div>
            </div>
        </AppLayout>
    );
}
