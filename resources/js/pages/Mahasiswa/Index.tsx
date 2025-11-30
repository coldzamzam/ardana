import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mahasiswa',
        href: '/mahasiswa',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    prodi?: string;
};

type UserIndexProps = PageProps<{
    users: User[];
}>;

export default function UserIndex({ users: userList }: UserIndexProps) {
    const handleEdit = (id: number) => {
        router.visit(`/mahasiswa/${id}/edit`);
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
                                <TableHead className="text-center">Role</TableHead>
                                <TableHead className="text-center">Prodi</TableHead>
                                <TableHead className="w-[160px] text-center">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {userList.length > 0 ? (
                                userList.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="text-center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-center capitalize">
                                            {user.role}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {user.prodi ?? '-'}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-wrap items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-full px-4"
                                                    onClick={() =>
                                                        handleEdit(user.id)
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="rounded-full px-4"
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
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
