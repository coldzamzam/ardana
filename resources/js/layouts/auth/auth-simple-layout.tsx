import React from 'react';

interface Props {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthSimpleLayout({ title, description, children }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-600 to-lime-200">
            <div className="max-w-md w-full px-4">
                <div className="relative bg-white rounded-[32px] shadow-2xl overflow-hidden">
                    
                    {/* Header putih + logo + title */}
                    <div className="bg-white py-6 flex flex-col items-center gap-2">
                        {/* Dummy logo */}
                        <div className="h-10 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-semibold text-emerald-700">
                            LOGO
                        </div>

                        {title && (
                            <h1 className="text-2xl font-semibold text-emerald-800">
                                {title}
                            </h1>
                        )}

                        {description && (
                            <p className="text-xs text-emerald-700/80 text-center max-w-xs">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Dekorasi “wave” kiri atas (opsional, biar mirip Figma) */}
                    <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/50 blur-3xl" />

                    {/* Body form */}
                    <div className="px-8 pb-8 pt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
