import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/dashboard/settings/password', // sesuaikan kalau kamu pakai typed route
    },
];

export default function PasswordSettings() {
    const {
        data,
        setData,
        put,
        errors,
        processing,

        reset,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put('/dashboard/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'password', 'password_confirmation');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="flex flex-col gap-8">
                    {/* Card besar untuk ubah password */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-3xl rounded-[32px] bg-white shadow-xl">
                            {/* Header card */}
                            <div className="flex items-center gap-4 border-b border-[#427452]/20 px-8 py-6 text-[#427452]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#73AD86] text-white shadow-md">
                                    {/* icon gembok sederhana (bisa diganti lucide-react) */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">
                                        Update password
                                    </h1>
                                    <p className="text-sm text-[#427452]/80">
                                        Pastikan akunmu menggunakan kata sandi
                                        yang kuat dan aman.
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={submit}
                                className="space-y-6 px-8 py-8 text-[#427452]"
                            >
                                <div className="space-y-4">
                                    {/* Current password */}
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="current_password"
                                            className="text-sm font-medium"
                                        >
                                            Current password
                                        </Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#F7FFF9]"
                                            value={data.current_password}
                                            onChange={(e) =>
                                                setData(
                                                    'current_password',
                                                    e.target.value,
                                                )
                                            }
                                            autoComplete="current-password"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.current_password}
                                        />
                                    </div>

                                    {/* New password */}
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium"
                                        >
                                            New password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#F7FFF9]"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            autoComplete="new-password"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.password}
                                        />
                                    </div>

                                    {/* Confirm password */}
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm font-medium"
                                        >
                                            Confirm password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#F7FFF9]"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            autoComplete="new-password"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Tombol aksi */}
                                <div className="mt-4 flex items-center gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#427452] px-6 text-white hover:bg-[#365d44]"
                                    >
                                        Save password
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
