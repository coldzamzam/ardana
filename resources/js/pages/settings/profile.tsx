import { useForm, Head, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Transition } from '@headlessui/react';

import {
    type BreadcrumbItem,
    type User,
    type Role,
} from '@/types';
import { send } from '@/routes/verification';
import DeleteUser from '@/components/delete-user';
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
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit, update } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
    user,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    user: User & {
        roles: Role[];
        mahasiswa: { nim: string; prodi: string } | null;
        dosen: { nip: string } | null;
        profile_photo_url?: string | null; // tambahin field ini untuk TS
    };
}) {
    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
    } = useForm<{
        name: string;
        email: string;
        prodi: string;
        photo: File | null;
    }>({
        name: user.name,
        email: user.email,
        prodi: user.mahasiswa?.prodi || '',
        photo: null, // file foto profil
    });

    const hasRole = (roleName: string) => {
        return user.roles?.some((role) => role.role_name.trim() === roleName);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(update().url, {
            preserveScroll: true,
            // penting supaya Inertia kirim File sebagai FormData
            forceFormData: true,
        });
    };

    const prodiOptions = [
        'Teknik Informatika',
        'Teknik Multimedia Digital',
        'Teknik Multimedia Jaringan',
        'Teknik Konstruksi Jaringan',
    ];

    const mainRole = user.roles[0]?.role_name.trim() ?? 'User';
    const isMahasiswa = hasRole('mahasiswa');
    const isDosenLike = hasRole('dosen') || hasRole('sekjur') || hasRole('kajur');

    // URL foto profil untuk preview (kalau user baru upload, pakai URL lokal)
    const photoPreviewUrl =
        data.photo instanceof File
            ? URL.createObjectURL(data.photo)
            : user.profile_photo_url ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name ?? 'User',
              )}&background=73AD86&color=fff&size=200`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="flex flex-col gap-8">
                    {/* Card profil besar */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-4xl rounded-[32px] bg-white shadow-xl">
                            {/* Header card: avatar + info singkat */}
                            <div className="flex flex-col gap-6 border-b border-[#427452]/25 px-8 py-8 md:flex-row md:items-center">
                                {/* Avatar + upload */}
                                <div className="flex justify-center md:justify-start">
                                    <label className="relative cursor-pointer">
                                        <img
                                            src={photoPreviewUrl}
                                            alt={user.name}
                                            className="h-28 w-28 rounded-full object-cover shadow-md border-4 border-white"
                                        />

                                        {/* Tombol kecil di pojok avatar */}
                                        <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#427452] text-white shadow">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 7.5L12 3m0 0L7.5 7.5M12 3v13.5"
                                                />
                                            </svg>
                                        </div>

                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;
                                                setData('photo', file);
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Info text */}
                                <div className="flex-1 space-y-2 text-[#427452]">
                                    <h1 className="text-2xl font-bold">Profil</h1>

                                    <p className="text-lg font-semibold">{user.name}</p>

                                    <div className="space-y-1 text-sm">
                                        {isMahasiswa && user.mahasiswa && (
                                            <p>NIM: {user.mahasiswa.nim}</p>
                                        )}
                                        {isDosenLike && user.dosen && (
                                            <p>NIP: {user.dosen.nip}</p>
                                        )}
                                        <p>E-mail: {user.email}</p>
                                    </div>

                                    <div className="mt-2 inline-flex items-center rounded-full bg-[#73AD86] px-4 py-1 text-xs font-semibold capitalize text-white">
                                        {mainRole}
                                    </div>
                                </div>
                            </div>

                            {/* Bagian bawah: form detail */}
                            <form
                                onSubmit={submit}
                                className="space-y-6 px-8 py-8 text-[#427452]"
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Name */}
                                    <div className="space-y-1">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#F7FFF9]"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                            autoComplete="name"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.name}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium"
                                        >
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#F7FFF9]"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            required
                                            autoComplete="username"
                                            disabled={hasRole('mahasiswa')}
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.email}
                                        />
                                    </div>

                                    {/* NIM (Mahasiswa only) */}
                                    {isMahasiswa && user.mahasiswa && (
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="nim"
                                                className="text-sm font-medium"
                                            >
                                                NIM
                                            </Label>
                                            <Input
                                                id="nim"
                                                className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#E4F6EA]"
                                                value={user.mahasiswa.nim}
                                                disabled
                                            />
                                        </div>
                                    )}

                                    {/* Prodi (Mahasiswa only) */}
                                    {isMahasiswa && (
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">
                                                Prodi
                                            </Label>
                                            <Select
                                                name="prodi"
                                                value={data.prodi}
                                                onValueChange={(value) =>
                                                    setData('prodi', value)
                                                }
                                            >
                                                <SelectTrigger className="mt-1 rounded-lg border border-[#427452]/30 bg-[#F7FFF9]">
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
                                            <InputError
                                            className="mt-1"
                                            message={errors.prodi}
                                            />
                                        </div>
                                    )}

                                    {/* NIP (Dosen / Sekjur / Kajur only) */}
                                    {isDosenLike && user.dosen && (
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="nip"
                                                className="text-sm font-medium"
                                            >
                                                NIP
                                            </Label>
                                            <Input
                                                id="nip"
                                                className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#E4F6EA]"
                                                value={user.dosen.nip}
                                                disabled
                                            />
                                        </div>
                                    )}

                                    {/* Role Display */}
                                    <div className="space-y-1 md:col-span-2">
                                        <Label className="text-sm font-medium">Role</Label>
                                        <Input
                                            className="mt-1 w-full rounded-lg border border-[#427452]/30 bg-[#E4F6EA] capitalize"
                                            value={user.roles
                                                .map((role) => role.role_name.trim())
                                                .join(', ')}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Verifikasi email */}
                                {mustVerifyEmail &&
                                    user.email_verified_at === null && (
                                        <div className="text-sm text-neutral-600">
                                            <p>
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the verification
                                                    email.
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been sent to
                                                    your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {/* Tombol aksi */}
                                <div className="mt-4 flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="bg-[#427452] px-6 text-white hover:bg-[#365d44]"
                                    >
                                        Save
                                    </Button>
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">Saved</p>
                                    </Transition>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Delete account di bawah card */}
                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
