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

            {/* Background hijau lembut + card putih seperti halaman lain */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                Edit Mahasiswa
                            </h1>
                            <p className="text-sm text-[#427452]/80">
                                Perbarui data mahasiswa yang terdaftar di Ardana.
                            </p>
                        </div>
                        <p className="text-xs md:text-sm text-[#427452]/70">
                            {mahasiswa.user.email}
                        </p>
                    </div>

                    {/* Card form */}
                    <Card className="w-full rounded-2xl border border-[#73AD86]/40 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-[#427452]">
                                Informasi Mahasiswa
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Grid dua kolom di desktop */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Nama */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Nama
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="bg-white"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email (readonly) */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            disabled
                                            className="bg-neutral-100 text-slate-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* NIM */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="nim"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            NIM
                                        </Label>
                                        <Input
                                            id="nim"
                                            value={data.nim}
                                            onChange={(e) =>
                                                setData('nim', e.target.value)
                                            }
                                            className="bg-white"
                                        />
                                        <InputError message={errors.nim} />
                                    </div>

                                    {/* Prodi */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="prodi"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Prodi
                                        </Label>
                                        <Select
                                            name="prodi"
                                            value={data.prodi}
                                            onValueChange={(value) =>
                                                setData('prodi', value)
                                            }
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Pilih program studi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {prodiOptions.map((prodi) => (
                                                    <SelectItem
                                                        key={prodi}
                                                        value={prodi}
                                                    >
                                                        {prodi}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.prodi} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-[#427452] px-6 text-white hover:bg-[#365d42]"
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
