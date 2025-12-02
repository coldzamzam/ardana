import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { prodiOptions } from '@/lib/constants';
import { type BreadcrumbItem, type PageProps, type Mahasiswa } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';

interface MahasiswaEditProps extends PageProps {
    mahasiswa: Mahasiswa & {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function MahasiswaEdit({ mahasiswa }: MahasiswaEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'List Mahasiswa',
            href: '/dashboard/list-mahasiswa',
        },
        {
            title: 'Edit Mahasiswa',
            href: `/dashboard/list-mahasiswa/${mahasiswa.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: mahasiswa.user.name,
        email: mahasiswa.user.email,
        nim: mahasiswa.nim,
        prodi: mahasiswa.prodi,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/list-mahasiswa/${mahasiswa.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Mahasiswa - ${mahasiswa.user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-6">
                <Card className="">
                    <CardHeader>
                        <CardTitle>Edit Mahasiswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    disabled
                                    className="bg-gray-100"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="">
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                />
                                <InputError message={errors.nim} />
                            </div>

                            <div className="">
                                <Label htmlFor="prodi">Prodi</Label>
                                <Select
                                    name="prodi"
                                    required
                                    value={data.prodi}
                                    onValueChange={(value) => setData('prodi', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a program" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {prodiOptions.map((prodi) => (
                                            <SelectItem key={prodi} value={prodi}>
                                                {prodi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.prodi} />
                            </div>

                            <div className="mt-4 flex justify-start md:justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
