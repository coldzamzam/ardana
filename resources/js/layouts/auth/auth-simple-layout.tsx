import React from 'react';

interface Props {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthSimpleLayout({
    title,
    description,
    children,
}: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-600 to-lime-200">
            <div className="w-full max-w-md px-4">
                <div className="relative overflow-hidden rounded-[32px] bg-white shadow-2xl">
                    {/* Header putih + logo + title */}
                    <div className="flex flex-col items-center gap-2 bg-white py-6">
                        {/* Dummy logo */}
                        <div className="flex h-10 w-24 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                            LOGO
                        </div>

                        {title && (
                            <h1 className="text-2xl font-semibold text-emerald-800">
                                {title}
                            </h1>
                        )}

                        {description && (
                            <p className="max-w-xs text-center text-xs text-emerald-700/80">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Dekorasi “wave” kiri atas (opsional, biar mirip Figma) */}
                    <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/50 blur-3xl" />

                    {/* Body form */}
                    <div className="px-8 pt-4 pb-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
