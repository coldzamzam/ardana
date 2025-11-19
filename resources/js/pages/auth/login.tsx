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
import { FcGoogle } from "react-icons/fc";

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout
            title="Log in to your account"
        >
            <Head title="Log in" />

            <div className="flex flex-col gap-4">
                <Button
                    className="w-full bg-[#427452] hover:bg-[#355C45] text-white font-semibold"
                    asChild
                >
                    <a 
                        href={'/auth/google/redirect'} 
                        className="flex items-center justify-center gap-2" 
                    >
                        <FcGoogle className="w-8 h-8" />
                        
                        <span className="text-md">Sign in with Google</span>
                    </a>
                </Button>
            </div>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/80" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-white/80 bg-[#73AD86]">
                        Or continue with
                    </span>
                </div>
            </div>

            <Form
                {...AuthenticatedSessionController.store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="border-none bg-white text-gray-900 placeholder:text-gray-500
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="border-none bg-white text-gray-900 placeholder:text-gray-500
                                               focus-visible:ring-2 focus-visible:ring-white/50"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-white bg-transparent
                                                    data-[state=checked]:bg-white
                                                    data-[state=checked]:text-[#73AD86]"
                                    />
                                    <Label htmlFor="remember" className="text-white text-sm">Remember me</Label>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-sm text-white hover:underline"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-[#427452] hover:bg-[#355C45]
                                           text-white font-semibold"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        {/* <div className="text-center text-sm">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div> */}
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