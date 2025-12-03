import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const role = user?.roles?.[0]?.role_name?.trim();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* SEMUA KONTEN DI DALAM DIV INI */}
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl bg-[#CBEBD5]/60 p-6">
                {/* Hero utama */}
                <div className="grid gap-6 rounded-3xl bg-[#CBEBD5] p-6 shadow-lg md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <div className="flex flex-col justify-between gap-4">
                        <div className="space-y-3 text-[#2f5b3e]">
                            <h1 className="text-2xl font-bold text-[#2f5b3e] md:text-3xl">
                                Selamat Datang, {user.name}!
                            </h1>

                            {user && (
                                <p className="text-sm capitalize text-[#427452]/90">
                                    Anda login sebagai{' '}
                                    <span className="font-semibold">
                                        {role || 'Pengguna'}
                                    </span>
                                </p>
                            )}

                            <p className="mt-2 text-sm leading-relaxed text-[#2f5b3e]/90">
                                Sistem Pengelolaan Dana Jurusan adalah aplikasi
                                berbasis web yang dikembangkan oleh{' '}
                                <span className="font-semibold">Team Tomodachi</span>{' '}
                                untuk mendigitalisasi proses pengelolaan dana kegiatan
                                di Jurusan Teknik Informatika & Komputer Politeknik
                                Negeri Jakarta.
                            </p>
                        </div>

                        <div className="mt-3">
                            <Button className="rounded-full bg-[#73AD86] px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#5f9873]">
                                Mulai Sekarang
                            </Button>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-[#427452] px-4 py-4 shadow-xl md:h-64">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-white/15" />

                            <div className="relative z-10 flex h-full flex-col justify-between">
                                <div className="flex gap-3">
                                    <div className="w-28 rounded-xl bg-white p-3 shadow-md">
                                        <div className="mb-1 h-3 w-16 rounded bg-[#CBEBD5]" />
                                        <div className="mb-2 h-2 w-20 rounded bg-[#E6F5EB]" />
                                        <div className="flex items-end gap-1">
                                            <div className="h-10 w-2 rounded-full bg-[#73AD86]" />
                                            <div className="h-7 w-2 rounded-full bg-[#CBEBD5]" />
                                            <div className="h-12 w-2 rounded-full bg-[#F9D87A]" />
                                        </div>
                                    </div>

                                    <div className="flex-1 rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white backdrop-blur">
                                        <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#CBEBD5]">
                                            Ringkasan Dana
                                        </p>

                                        <p className="text-sm font-semibold">
                                            Progress Kegiatan
                                        </p>

                                        <p className="mt-1 text-[11px] text-[#E6F5EB]/90">
                                            Pantau status TOR &amp; LPJ secara real-time dalam satu dashboard.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 h-24 w-full rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <div className="flex h-full items-end gap-2">
                                        <div className="h-6 flex-1 rounded-full bg-[#CBEBD5]" />
                                        <div className="h-10 flex-1 rounded-full bg-[#F9D87A]" />
                                        <div className="h-14 flex-1 rounded-full bg-[#CBEBD5]" />
                                        <div className="h-20 flex-1 rounded-full bg-[#F9D87A]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards bawah */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/80 p-4 text-sm text-[#2f5b3e] shadow">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#73AD86]">
                            TOR Aktif
                        </p>
                        <p className="mt-2 text-2xl font-bold">—</p>
                        <p className="mt-1 text-xs text-[#517c60]">
                            Jumlah TOR dalam proses pengajuan.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/80 p-4 text-sm text-[#2f5b3e] shadow">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#73AD86]">
                            LPJ Menunggu
                        </p>
                        <p className="mt-2 text-2xl font-bold">—</p>
                        <p className="mt-1 text-xs text-[#517c60]">
                            LPJ yang perlu segera diselesaikan.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/80 p-4 text-sm text-[#2f5b3e] shadow">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#73AD86]">
                            Total Kegiatan
                        </p>
                        <p className="mt-2 text-2xl font-bold">—</p>
                        <p className="mt-1 text-xs text-[#517c60]">
                            Total kegiatan jurusan yang tercatat.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
