import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { register } from '@/routes';
import { type BreadcrumbItem } from '@/types';

interface Role {
    id: string;
    role_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Register User',
        href: '/dashboard/register',
    },
];

export default function Register({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(register().url, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register" />

            {/* Background hijau konsisten */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 items-center justify-center rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* Card putih di tengah */}
                    <div className="w-full max-w-5xl rounded-2xl border border-[#73AD86]/40 bg-white p-6 shadow-sm md:p-8">
                        {/* Header form */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-[#427452] md:text-3xl">
                                Buat Akun Baru
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Isi data berikut untuk mendaftarkan akun ke
                                sistem Ardana.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Form grid */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* NAME */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder="Nama lengkap"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="bg-white"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* EMAIL */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="bg-white"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* PASSWORD */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="bg-white"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="bg-white"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                {/* ROLE */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Role</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData('role_id', value)
                                        }
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    <span className="capitalize">
                                                        {role.role_name}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role_id} />
                                </div>
                            </div>

                            {/* BUTTON + link login */}
                            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <Button
                                    type="submit"
                                    tabIndex={5}
                                    disabled={processing}
                                    data-test="register-user-button"
                                    className="ml-auto flex items-center gap-2 rounded-md bg-[#427452] px-6 text-white hover:bg-[#365d42]"
                                >
                                    {processing && <Spinner />}
                                    Buat Akun
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
