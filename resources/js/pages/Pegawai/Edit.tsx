import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';

interface PegawaiEditProps extends PageProps {
    user: User;
}

export default function PegawaiEdit({ user }: PegawaiEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'List Pegawai',
            href: '/dashboard/list-pegawai',
        },
        {
            title: 'Edit Pegawai',
            href: `/dashboard/list-pegawai/${user.id}/edit`,
        },
    ];

    const hasRelevantRole = (user: User) => {
        return (
            user.roles?.some((role) =>
                ['dosen', 'kajur', 'sekjur'].includes(role.role_name.trim()),
            ) ?? false
        );
    };

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        nip: user.dosen?.nip || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/list-pegawai/${user.id}`, {
            preserveScroll: true,
        });
    };

    const showNip = hasRelevantRole(user);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pegawai - ${user.name}`} />

            {/* Background hijau konsisten */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* Header atas */}
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                Edit Pegawai
                            </h1>
                            <p className="text-sm text-[#427452]/80">
                                Perbarui data pegawai di sistem Ardana.
                            </p>
                        </div>
                        <p className="text-xs md:text-sm text-[#427452]/70">
                            {user.email}
                        </p>
                    </div>

                    {/* Card form */}
                    <Card className="w-full rounded-2xl border border-[#73AD86]/40 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold text-[#427452]">
                                Informasi Pegawai
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Grid dua kolom di desktop */}
                                <div className="grid gap-4 md:grid-cols-2">
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
                                            value={user.email}
                                            disabled
                                            className="bg-neutral-100 text-slate-500"
                                        />
                                    </div>

                                    {showNip && (
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="nip"
                                                className="text-sm font-medium text-slate-700"
                                            >
                                                NIP
                                            </Label>
                                            <Input
                                                id="nip"
                                                value={data.nip}
                                                onChange={(e) =>
                                                    setData('nip', e.target.value)
                                                }
                                                className="bg-white"
                                            />
                                            <InputError message={errors.nip} />
                                        </div>
                                    )}

                                    <div className="space-y-2 md:col-span-1">
                                        <Label className="text-sm font-medium text-slate-700">
                                            Roles
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles?.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 capitalize"
                                                >
                                                    {role.role_name}
                                                </span>
                                            ))}
                                        </div>
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
