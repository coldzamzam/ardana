import React from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthLayout({
    title,
    description,
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#193422] via-[#4F8B61] to-[#cfe190] p-4">
            <div className="w-full max-w-md">
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
                    <div className="flex flex-col items-center bg-white pt-8 pb-4">
                        <img
                            src="/images/logo_sidana.png"
                            alt="Logo Aplikasi"
                            className="h-20 w-auto"
                        />
                    </div>

                    <div className="rounded-tl-[70px] bg-[#73AD86] px-8 pt-10 pb-10">
                        {title && (
                            <h1 className="mb-6 text-center text-3xl font-bold text-white">
                                {title}
                            </h1>
                        )}

                        {description && (
                            <p className="mb-6 text-center text-sm text-white/90">
                                {description}
                            </p>
                        )}

                        <div className="flex flex-col gap-5">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
