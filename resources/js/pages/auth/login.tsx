import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Login">
            <Head title="Login" />

            <Form
                {...AuthenticatedSessionController.store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* NIM/NIP */}
                            <div className="grid gap-2">
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="NIM/NIP"
                                    className="rounded-xl border-none bg-white text-gray-900 placeholder:text-gray-500
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="rounded-xl border-none bg-white text-gray-900 placeholder:text-gray-500
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-center space-x-2 text-xs">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-white bg-transparent
                                               data-[state=checked]:bg-white
                                               data-[state=checked]:text-[#73AD86]"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-white font-medium"
                                >
                                    Ingatkan Saya
                                </Label>
                            </div>

                            {/* Lupa Password - kanan bawah */}
                            {canResetPassword && (
                                <div className="flex justify-end -mt-4">
                                    <TextLink
                                        href={request()}
                                        className="text-white text-xs font-medium underline"
                                        tabIndex={5}
                                    >
                                        Lupa Password?
                                    </TextLink>
                                </div>
                            )}

                            {/* Tombol Login */}
                            <Button
                                type="submit"
                                className="mt-2 w-full bg-[#427452] hover:bg-[#355C45]
                                           text-white font-semibold
                                           shadow-lg"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Login
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