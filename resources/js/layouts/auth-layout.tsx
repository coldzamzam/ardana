import React from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-500 to-lime-200">
            <div className="max-w-md w-full px-4">
                <div className="relative bg-white rounded-[32px] shadow-2xl overflow-hidden">
                    {/* Header putih + logo saja */}
                    <div className="bg-white py-6 flex flex-col items-center">
                        <div className="h-10 w-24 bg-white border-2 border-gray-900 rounded-md flex items-center justify-center text-xs font-bold text-gray-900">
                            LOGO
                        </div>
                    </div>

                    {/* Section hijau untuk title + form */}
                    <div className="bg-[#73AD86] rounded-t-[32px] px-8 pb-8 pt-6 -mt-4">
                        {title && (
                            <h1 className="text-2xl font-semibold text-white text-center mb-6">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-xs text-white/90 text-center mb-4">
                                {description}
                            </p>
                        )}
                        
                        {/* Form content */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}