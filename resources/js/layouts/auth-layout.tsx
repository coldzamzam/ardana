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
            {/* Animations */}
            <style>{`
                @keyframes cardEnter {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.96);
                        box-shadow: 0 0 0 rgba(0,0,0,0);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        box-shadow: 0 30px 80px rgba(0,0,0,0.25);
                    }
                }

                @keyframes fadeDown {
                    0% {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes panelUp {
                    0% {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .auth-card {
                    animation: cardEnter .7s cubic-bezier(.22,1,.36,1) both;
                }

                .auth-logo {
                    animation: fadeDown .6s ease-out .15s both;
                }

                .auth-panel {
                    animation: panelUp .6s ease-out .25s both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .auth-card,
                    .auth-logo,
                    .auth-panel {
                        animation: none !important;
                    }
                }
            `}</style>

            <div className="w-full max-w-md">
                {/* CARD */}
                <div className="auth-card relative overflow-hidden rounded-3xl bg-white shadow-2xl">
                    {/* HEADER / LOGO */}
                    <div className="auth-logo flex flex-col items-center bg-white pt-8 pb-4">
                        <img
                            src="/images/logo_sidana.png"
                            alt="Logo Aplikasi"
                            className="h-20 w-auto"
                        />
                    </div>

                    {/* CONTENT PANEL */}
                    <div className="auth-panel rounded-tl-[70px] bg-[#73AD86] px-8 pt-10 pb-10">
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
