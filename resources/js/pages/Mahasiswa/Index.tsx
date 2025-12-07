import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type User } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mahasiswa',
        href: '/mahasiswa',
    },
];

type UserIndexProps = PageProps<{
    users: User[];
}>;

export default function UserIndex({ users: userList }: UserIndexProps) {
    const handleRowClick = (mahasiswaId: number) => {
        router.visit(`/dashboard/list-mahasiswa/${mahasiswaId}/edit`);
    };

    const hasUsers = userList.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Mahasiswa" />

            {/* Background hijau konsisten dengan TOR / LPJ / Notifikasi */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER */}
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                List Mahasiswa
                            </h1>
                            <p className="text-sm text-[#427452]/80">
                                Kelola akun mahasiswa yang terdaftar di sistem Ardana.
                            </p>
                        </div>

                        {hasUsers && (
                            <p className="text-xs md:text-sm text-[#427452]/70">
                                Total: {userList.length} mahasiswa
                            </p>
                        )}
                    </div>

                    {/* CARD PUTIH BERISI TABEL */}
                    <div className="mt-2 w-full rounded-2xl border border-[#73AD86]/40 bg-white p-4 md:p-6 shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px] text-center">
                                        No.
                                    </TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">
                                        NIM
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Prodi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {hasUsers ? (
                                    userList.map((user, index) => (
                                        <TableRow
                                            key={user.id}
                                            className="cursor-pointer transition-colors hover:bg-[#F5FFFA]"
                                            onClick={() =>
                                                user.mahasiswa &&
                                                handleRowClick(user.mahasiswa.id)
                                            }
                                        >
                                            <TableCell className="text-center text-sm">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="text-center text-sm">
                                                {user.mahasiswa?.nim ?? '-'}
                                            </TableCell>
                                            <TableCell className="text-center text-sm">
                                                {user.mahasiswa?.prodi ?? '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center text-xs text-muted-foreground"
                                        >
                                            Belum ada mahasiswa yang terdaftar.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
