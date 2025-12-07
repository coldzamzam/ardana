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
        title: 'Pegawai',
        href: '/pegawai',
    },
];

type PegawaiIndexProps = PageProps<{
    users: User[];
}>;

export default function PegawaiIndex({ users: userList }: PegawaiIndexProps) {
    const handleRowClick = (userId: number) => {
        router.visit(`/dashboard/list-pegawai/${userId}/edit`);
    };

    const hasUsers = userList.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Pegawai" />

            {/* Background hijau konsisten */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    
                    {/* HEADER */}
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                List Pegawai
                            </h1>
                            <p className="text-sm text-[#427452]/80">
                                Kelola akun pegawai yang terdaftar di sistem Ardana.
                            </p>
                        </div>

                        {hasUsers && (
                            <p className="text-xs md:text-sm text-[#427452]/70">
                                Total: {userList.length} pegawai
                            </p>
                        )}
                    </div>

                    {/* CARD PUTIH TABEL */}
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
                                        Role
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {hasUsers ? (
                                    userList.map((user, index) => (
                                        <TableRow
                                            key={user.id}
                                            className="cursor-pointer transition-colors hover:bg-[#F5FFFA]"
                                            onClick={() => handleRowClick(user.id)}
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
                                            Belum ada pegawai yang terdaftar.
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
