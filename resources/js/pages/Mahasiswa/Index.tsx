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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Mahasiswa" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-[#427452]">
                            List Mahasiswa
                        </h1>
                        <p className="text-sm text-[#427452]/80">
                            Kelola akun mahasiswa yang terdaftar di sistem Ardana.
                        </p>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="w-full rounded-3xl bg-white p-6 shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">No.</TableHead>
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center">NIM</TableHead>
                                <TableHead className="text-center">Prodi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {userList.length > 0 ? (
                                userList.map((user, index) => (
                                    <TableRow
                                        key={user.id}
                                        className="cursor-pointer hover:bg-gray-100 hover:text-gray-900"
                                        onClick={() =>
                                            user.mahasiswa && handleRowClick(user.mahasiswa.id)
                                        }
                                    >
                                        <TableCell className="text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-center">
                                            {user.mahasiswa?.nim ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
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
        </AppLayout>
    );
}
