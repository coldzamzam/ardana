import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    return (
        <AuthLayout title="Lupa Password">
            <Head title="Lupa Password" />

            <Form
                method="post"
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* NIM/NIP */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-white text-sm font-medium"
                                >
                                    NIM/NIP
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    className="rounded-xl border-none bg-white text-gray-900 placeholder:text-gray-400
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Baru */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-white text-sm font-medium"
                                >
                                    Password Baru
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    className="rounded-xl border-none bg-white text-gray-900 placeholder:text-gray-400
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Verifikasi Password Baru */}
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-white text-sm font-medium"
                                >
                                    Verifikasi Password Baru
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    tabIndex={3}
                                    className="rounded-xl border-none bg-white text-gray-900 placeholder:text-gray-400
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Tombol Reset */}
                            <Button
                                type="submit"
                                className="mt-2 w-full rounded-full bg-[#427452] hover:bg-[#355C45]
                                           text-white font-semibold
                                           shadow-lg"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Reset
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-xs font-medium text-white bg-white/20 border border-white/30 rounded-xl px-4 py-2">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}