import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pegawai',
        href: '/pegawai',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type PegawaiIndexProps = PageProps<{
    users: User[];
}>;

export default function PegawaiIndex({ users: userList }: PegawaiIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Pegawai" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto rounded-xl p-4">
                <Heading
                    title="List Pegawai"
                    description="Manage pegawai accounts."
                />
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.length > 0 ? (
                                userList.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="w-1/24">{index + 1}</TableCell>
                                        <TableCell className="w-6/24">{user.name}</TableCell>
                                        <TableCell className="w-6/24">{user.email}</TableCell>
                                        <TableCell className="w-5/24 text-center">{user.role}</TableCell>
                                        <TableCell className="w-6/24 text-center md:space-x-1 space-y-1">
                                            <Button size="sm">Edit</Button>
                                            <Button size="sm">Hapus</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center"
                                    >
                                        No users found.
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
