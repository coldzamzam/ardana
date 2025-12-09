import { Input } from '@/components/ui/input';
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
import { useMemo, useState } from 'react';

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
    const [search, setSearch] = useState('');

    const handleRowClick = (mahasiswaId: number) => {
        router.visit(`/dashboard/list-mahasiswa/${mahasiswaId}/edit`);
    };

    const hasUsers = userList.length > 0;

    const filteredUsers = useMemo(() => {
        // 1) Urutkan dulu A–Z berdasarkan nama
        const baseUsers = [...userList].sort((a, b) =>
            (a.name ?? '').localeCompare(b.name ?? '', 'id', {
                sensitivity: 'base',
            }),
        );

        // 2) Kalau tidak ada search, langsung kembalikan yang sudah di-sort
        if (!search.trim()) return baseUsers;

        // 3) Kalau ada search, filter di atas data yang sudah terurut
        const q = search.toLowerCase();

        return baseUsers.filter((user) => {
            const name = user.name?.toLowerCase() ?? '';
            const email = user.email?.toLowerCase() ?? '';
            const nim = user.mahasiswa?.nim?.toLowerCase() ?? '';
            const prodi = user.mahasiswa?.prodi?.toLowerCase() ?? '';

            return (
                name.includes(q) ||
                email.includes(q) ||
                nim.includes(q) ||
                prodi.includes(q)
            );
        });
    }, [search, userList]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Mahasiswa" />

            {/* Background hijau konsisten */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER + SEARCH + TOTAL (sejejer) */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Judul kiri */}
                        <div>
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                List Mahasiswa
                            </h1>
                        </div>

                        {/* Search di tengah */}
                        <div className="flex w-full justify-center md:flex-1">
                            <div className="w-full max-w-md md:mx-6">
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan nama, email, NIM, atau prodi..."
                                    className="h-9 rounded-md border-[#73AD86]/60 bg-white text-sm placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Total kanan */}
                        {hasUsers && (
                            <p className="text-xs text-[#427452]/70 md:text-right md:text-sm">
                                Total: {userList.length} mahasiswa
                            </p>
                        )}
                    </div>

                    {/* CARD PUTIH BERISI TABEL */}
                    <div className="mt-2 w-full rounded-2xl border border-[#73AD86]/40 bg-white p-4 shadow-sm md:p-6">
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
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <TableRow
                                            key={user.id}
                                            className="cursor-pointer transition-colors hover:bg-[#F5FFFA]"
                                            onClick={() =>
                                                user.mahasiswa &&
                                                handleRowClick(
                                                    user.mahasiswa.id,
                                                )
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
                                            {hasUsers
                                                ? 'Tidak ada mahasiswa yang cocok dengan pencarian.'
                                                : 'Belum ada mahasiswa yang terdaftar.'}
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
