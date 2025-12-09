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
        title: 'Pegawai',
        href: '/pegawai',
    },
];

type PegawaiIndexProps = PageProps<{
    users: User[];
}>;

export default function PegawaiIndex({ users: userList }: PegawaiIndexProps) {
    const [search, setSearch] = useState('');

    const handleRowClick = (userId: number) => {
        router.visit(`/dashboard/list-pegawai/${userId}/edit`);
    };

    const hasUsers = userList.length > 0;

    const filteredUsers = useMemo(() => {
        // 1. Urutkan berdasarkan nama A–Z
        const sortedUsers = [...userList].sort((a, b) =>
            (a.name ?? '').localeCompare(b.name ?? '', 'id', {
                sensitivity: 'base',
            }),
        );

        // 2. Jika search kosong → return hasil sorting
        if (!search.trim()) return sortedUsers;

        // 3. Lakukan filter
        const q = search.toLowerCase();

        return sortedUsers.filter((user) => {
            const name = user.name?.toLowerCase() ?? '';
            const email = user.email?.toLowerCase() ?? '';
            const roles =
                user.roles?.map((r) => r.role_name.toLowerCase()).join(' ') ??
                '';

            return name.includes(q) || email.includes(q) || roles.includes(q);
        });
    }, [search, userList]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Pegawai" />

            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER + SEARCH + TOTAL (sejejer) */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Judul kiri */}
                        <h1 className="text-2xl font-semibold text-[#427452]">
                            List Pegawai
                        </h1>

                        {/* Search tengah */}
                        <div className="flex w-full justify-center md:flex-1">
                            <div className="w-full max-w-md md:mx-6">
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan nama, email, atau role..."
                                    className="h-9 rounded-md border-[#73AD86]/60 bg-white text-sm placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Total kanan */}
                        {hasUsers && (
                            <p className="text-xs text-[#427452]/70 md:text-right md:text-sm">
                                Total: {userList.length} pegawai
                            </p>
                        )}
                    </div>

                    {/* CARD PUTIH TABEL */}
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
                                        Role
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
                                                handleRowClick(user.id)
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
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {user.roles?.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 capitalize"
                                                        >
                                                            {role.role_name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-xs text-muted-foreground"
                                        >
                                            {hasUsers
                                                ? 'Tidak ada pegawai yang cocok dengan pencarian.'
                                                : 'Belum ada pegawai yang terdaftar.'}
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
