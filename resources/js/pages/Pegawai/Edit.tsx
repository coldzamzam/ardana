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
        return user.roles?.some(role => ['dosen', 'kajur', 'sekjur'].includes(role.role_name.trim())) ?? false;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pegawai - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Edit Pegawai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                            
                            {hasRelevantRole(user) && (
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                    />
                                    <InputError message={errors.nip} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Roles</Label>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles?.map((role) => (
                                        <span
                                            key={role.id}
                                            className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                        >
                                            {role.role_name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
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
