import React from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center 
                        bg-gradient-to-tr from-[#193422] via-[#4F8B61] to-[#cfe190] 
                        p-4">
            <div className="max-w-md w-full">
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                    
                    <div className="bg-white pt-8 pb-4 flex flex-col items-center">

                    <img 
                        src="/images/logo_sidana.png" 
                        alt="Logo Aplikasi" 
                        className="h-20 w-auto"
                    />
                    </div>

                    <div className="bg-[#73AD86] rounded-tl-[70px] px-8 pb-10 pt-10">
                        
                        {title && (
                            <h1 className="text-3xl font-bold text-white text-center mb-6">
                                {title}
                            </h1>
                        )}

                        {description && (
                            <p className="text-sm text-white/90 text-center mb-6">
                                {description}
                            </p>
                        )}
                        
                        <div className="flex flex-col gap-5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}