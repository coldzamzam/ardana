import { useForm, Head, Link, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Transition } from '@headlessui/react';

import { type BreadcrumbItem, type SharedData, type User, type Role } from '@/types';
import { send } from '@/routes/verification';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
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
    user: User & { roles: Role[], mahasiswa: { nim: string, prodi: string }, dosen: { nip: string } };
}) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        prodi: user.mahasiswa?.prodi || '',
    });

    const hasRole = (roleName: string) => {
        return user.roles?.some((role) => role.role_name.trim() === roleName);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(update().url, {
            preserveScroll: true,
        });
    };

    const prodiOptions = [
        'Teknik Informatika',
        'Teknik Multimedia Digital',
        'Teknik Multimedia Jaringan',
        'Teknik Konstruksi Jaringan',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your profile information."
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                disabled={hasRole('mahasiswa')}
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {/* NIM (Mahasiswa only) */}
                        {hasRole('mahasiswa') && user.mahasiswa && (
                            <div className="grid gap-2">
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim"
                                    className="mt-1 block w-full"
                                    value={user.mahasiswa.nim}
                                    disabled
                                />
                            </div>
                        )}

                        {/* Prodi (Mahasiswa only) */}
                        {hasRole('mahasiswa') && (
                             <div className="grid gap-2">
                                <Label>Prodi</Label>
                                <Select
                                    name="prodi"
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
                        )}

                        {/* NIP (Dosen only) */}
                        {(hasRole('dosen') || hasRole('sekjur') || hasRole('kajur')) && user.dosen && (
                            <div className="grid gap-2">
                                <Label htmlFor="nip">NIP</Label>
                                <Input
                                    id="nip"
                                    className="mt-1 block w-full"
                                    value={user.dosen.nip}
                                    disabled
                                />
                            </div>
                        )}

                        {/* Role Display */}
                        <div className="grid gap-2">
                            <Label>Role</Label>
                            <Input
                                className="mt-1 block w-full capitalize"
                                value={user.roles.map(role => role.role_name.trim()).join(', ')}
                                disabled
                            />
                        </div>


                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} data-test="update-profile-button">
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
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
