import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout title="Log in to your account">
            <Head title="Log in" />

            <div className="flex flex-col gap-4">
                <Button
                    className="w-full bg-[#427452] font-semibold text-white hover:bg-[#355C45]"
                    asChild
                >
                    <a
                        href={'/auth/google/redirect'}
                        className="flex items-center justify-center gap-2"
                    >
                        <FcGoogle className="h-8 w-8" />
                        <span className="text-md">Sign in with Google</span>
                    </a>
                </Button>
            </div>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/80" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#73AD86] px-2 text-white/80">
                        Or continue with
                    </span>
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="email@example.com"
                            className="border-none bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white/50"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            className="border-none bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white/50"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData('remember', !!checked)
                                }
                                tabIndex={3}
                                className="border-white bg-transparent data-[state=checked]:bg-white data-[state=checked]:text-[#73AD86]"
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm text-white"
                            >
                                Remember me
                            </Label>
                        </div>

                        {canResetPassword && (
                            <TextLink
                                href={'/forgot-password'}
                                className="text-sm text-white hover:underline"
                                tabIndex={5}
                            >
                                Forgot password?
                            </TextLink>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full bg-[#427452] font-semibold text-white hover:bg-[#355C45]"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner />}
                        Log in
                    </Button>
                </div>
            </form>

            {status && (
                <div className="mt-4 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-center text-xs font-medium text-white">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
