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

            {/* Animations (pure CSS) */}
            <style>{`
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translate3d(0, 14px, 0); }
                    100% { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes shine {
                    0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
                    15% { opacity: .45; }
                    45% { opacity: 0; }
                    100% { transform: translateX(240%) skewX(-18deg); opacity: 0; }
                }
                @keyframes softPulse {
                    0%, 100% { opacity: .8; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.02); }
                }

                .enter-1 { animation: fadeUp .65s ease-out both; }
                .enter-2 { animation: fadeUp .65s ease-out .10s both; }
                .enter-3 { animation: fadeUp .65s ease-out .20s both; }
                .enter-4 { animation: fadeUp .65s ease-out .30s both; }
                .enter-5 { animation: fadeUp .65s ease-out .40s both; }
                .enter-6 { animation: fadeUp .65s ease-out .50s both; }

                .divider-pulse { animation: softPulse 2.6s ease-in-out infinite; }

                .btn-shine { position: relative; overflow: hidden; }
                .btn-shine::after{
                    content:"";
                    position:absolute;
                    inset:-2px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
                    width: 45%;
                    transform: translateX(-120%) skewX(-18deg);
                    opacity: 0;
                    pointer-events:none;
                }
                .btn-shine:hover::after{
                    animation: shine 1.25s ease-out;
                }

                /* Optional: micro interaction for inputs */
                .input-pop { transition: transform .18s ease, box-shadow .18s ease; }
                .input-pop:focus { transform: translateY(-1px); }

                @media (prefers-reduced-motion: reduce) {
                    .enter-1,.enter-2,.enter-3,.enter-4,.enter-5,.enter-6,
                    .divider-pulse,
                    .btn-shine::after { animation: none !important; }
                    .input-pop { transition: none !important; }
                }
            `}</style>

            <div className="enter-1 flex flex-col gap-4">
                <Button
                    className="btn-shine w-full bg-[#427452] font-semibold text-white hover:bg-[#355C45]"
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

            <div className="enter-2 relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/80" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="divider-pulse rounded-full bg-[#73AD86] px-3 py-1 text-white/85">
                        Or continue with
                    </span>
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="enter-3 grid gap-2">
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
                            className="input-pop border-none bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white/50"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="enter-4 grid gap-2">
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
                            className="input-pop border-none bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white/50"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="enter-5 flex items-center justify-between">
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
                        className="btn-shine enter-6 mt-4 w-full bg-[#427452] font-semibold text-white hover:bg-[#355C45]"
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
                <div
                    className="mt-4 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-center text-xs font-medium text-white"
                    style={{ animation: 'fadeIn .5s ease-out both' }}
                >
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
