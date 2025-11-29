import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="flex flex-col gap-8">
                    {/* Card utama */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-3xl rounded-[32px] bg-white px-8 py-8 text-[#427452] shadow-xl">
                            {/* Header di dalam card */}
                            <div className="mb-6 flex items-start gap-4 border-b border-[#427452]/15 pb-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#73AD86] text-white shadow-md">
                                    {/* icon palet sederhana */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M12 21a9 9 0 1 0-9-9 4 4 0 0 0 4 4h1a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3z" />
                                        <circle cx="7.5" cy="10.5" r=".9" />
                                        <circle cx="12" cy="7.5" r=".9" />
                                        <circle cx="16.5" cy="10.5" r=".9" />
                                        <circle cx="11.5" cy="14.5" r=".9" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-xl font-bold">
                                        Appearance settings
                                    </h1>
                                    <p className="text-sm text-[#427452]/80">
                                        Atur tema, mode gelap, dan tampilan
                                        dashboard sesuai preferensimu.
                                    </p>
                                </div>
                            </div>

                            {/* Konten tab */}
                            <div className="space-y-4">
                                {/* Heading kecil reuse komponen lama kalau mau */}
                                <HeadingSmall
                                    title="Tema & tampilan"
                                    description="Pilih kombinasi warna dan mode yang membuatmu paling nyaman."
                                />

                                <AppearanceTabs />
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
