import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type Faq,
    type KegiatanType,
    type PageProps,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Layers, Settings } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/dashboard/admin',
    },
];

function Index({
    faqs = [],
    kegiatanTypes = [],
}: PageProps<{ faqs?: Faq[]; kegiatanTypes?: KegiatanType[] }>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin" />
            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER SECTION */}
                    <div className="w-full">
                        <div className="mb-2 flex items-center gap-3">
                            <Settings className="h-8 w-8 text-[#427452]" />
                            <h1 className="text-3xl font-bold text-[#427452]">
                                Admin Panel
                            </h1>
                        </div>
                        <p className="text-sm text-[#427452]">
                            Kelola sistem dan konfigurasi aplikasi
                        </p>
                    </div>

                    {/* MENU GRID */}
                    <div className="mt-4 flex-1 overflow-y-auto rounded-2xl bg-white p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href="/dashboard/admin/faq"
                                className="group relative overflow-hidden rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-white shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-green-400/0 transition-all duration-300 group-hover:from-green-400/5 group-hover:to-green-400/10" />
                                <div className="relative p-6">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="rounded-lg bg-green-100/50 p-2 transition-colors group-hover:bg-green-100">
                                            <svg
                                                className="h-6 w-6 text-[#427452]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-[#427452] transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#427452] transition-colors group-hover:text-green-700">
                                        Kelola FAQ
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 transition-colors group-hover:text-gray-700">
                                        Kelola pertanyaan yang sering ditanyakan
                                        oleh pengguna.
                                    </p>
                                    <div className="mt-4 border-t border-green-100 pt-4">
                                        <p className="text-xs text-gray-500">
                                            Total:{' '}
                                            <span className="font-semibold text-[#427452]">
                                                {faqs.length} FAQ
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/admin/kegiatan-type"
                                className="group relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-blue-400/0 transition-all duration-300 group-hover:from-blue-400/5 group-hover:to-blue-400/10" />
                                <div className="relative p-6">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="rounded-lg bg-blue-100/50 p-2 transition-colors group-hover:bg-blue-100">
                                            <Layers className="h-6 w-6 text-[#427452]" />
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-[#427452] transition-transform group-hover:translate-x-1" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#427452] transition-colors group-hover:text-blue-700">
                                        Kelola Jenis Kegiatan
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 transition-colors group-hover:text-gray-700">
                                        Kelola berbagai jenis kegiatan yang
                                        tersedia dalam sistem.
                                    </p>
                                    <div className="mt-4 border-t border-blue-100 pt-4">
                                        <p className="text-xs text-gray-500">
                                            Total:{' '}
                                            <span className="font-semibold text-[#427452]">
                                                {kegiatanTypes.length} Jenis
                                                Kegiatan
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;
