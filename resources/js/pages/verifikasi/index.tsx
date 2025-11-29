import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type StatusSubmisi = {
    status: string;
};

type Submisi = {
    id: string;
    judul: string;
    jenis_kegiatan: string;
    created_at: string;
    status_submisi: StatusSubmisi[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Verifikasi TOR',
        href: '/dashboard/verifikasi',
    },
];

// bantu normalisasi status ke 3 kategori utama
function mapStatusKategori(
    rawStatus: string | null | undefined,
): 'sudah' | 'belum' | 'ditolak' {
    if (!rawStatus) return 'belum';

    const s = rawStatus.toLowerCase();

    if (
        [
            'disetujui',
            'diterima',
            'sudah diverifikasi',
            'approved',
            'verified',
        ].includes(s)
    ) {
        return 'sudah';
    }

    if (['ditolak', 'rejected'].includes(s)) {
        return 'ditolak';
    }

    return 'belum';
}

export default function TorVerificationPage({ tors }: { tors: Submisi[] }) {
    const { flash } = usePage<PageProps<SharedData>>().props;
    const [search, setSearch] = useState('');

    // filter berdasar search
    const filtered = useMemo(() => {
        const term = search.toLowerCase();
        if (!term) return tors;

        return tors.filter((tor) => {
            const text = (tor.judul ?? '') + ' ' + (tor.jenis_kegiatan ?? '');
            return text.toLowerCase().includes(term);
        });
    }, [tors, search]);

    // kelompokkan ke tiga kategori
    const { sudah, belum, ditolak } = useMemo(() => {
        const result = {
            sudah: [] as Submisi[],
            belum: [] as Submisi[],
            ditolak: [] as Submisi[],
        };

        filtered.forEach((tor) => {
            const latestStatus =
                tor.status_submisi.length > 0
                    ? tor.status_submisi[tor.status_submisi.length - 1].status
                    : null;

            const kategori = mapStatusKategori(latestStatus);

            if (kategori === 'sudah') result.sudah.push(tor);
            else if (kategori === 'ditolak') result.ditolak.push(tor);
            else result.belum.push(tor);
        });

        return result;
    }, [filtered]);

    // kirim aksi verifikasi ke backend (route Laravel nanti kamu sesuaikan)
    const handleAction = (torId: string, action: 'approve' | 'reject') => {
        router.post(
            `/dashboard/verifikasi/${torId}`,
            { action },
            {
                preserveScroll: true,
            },
        );
    };

    const renderCard = (tor: Submisi, options?: { showButtons?: boolean }) => {
        const latestStatus =
            tor.status_submisi.length > 0
                ? tor.status_submisi[tor.status_submisi.length - 1].status
                : 'Belum Diverifikasi';
        const tahun = new Date(tor.created_at).getFullYear();

        return (
            <div
                key={tor.id}
                className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 md:text-lg">
                            {tor.judul}
                        </h3>

                        <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                            <div>
                                <p className="font-semibold text-gray-700">
                                    Jenis Kegiatan
                                </p>
                                <p className="text-gray-600">
                                    {tor.jenis_kegiatan}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">
                                    Tahun
                                </p>
                                <p className="text-gray-600">{tahun}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">
                                    Status Pengajuan
                                </p>
                                <p className="text-gray-600">{latestStatus}</p>
                            </div>
                        </div>
                    </div>

                    {options?.showButtons && (
                        <div className="mt-3 flex flex-row gap-2 md:mt-0 md:flex-col md:items-end">
                            <Button
                                type="button"
                                className="rounded-full bg-[#4C51BF] px-4 py-1 text-sm text-white hover:bg-[#3b3fa0]"
                                onClick={() => handleAction(tor.id, 'approve')}
                            >
                                Terima
                            </Button>
                            <Button
                                type="button"
                                className="rounded-full bg-[#E53E3E] px-4 py-1 text-sm text-white hover:bg-[#c53030]"
                                onClick={() => handleAction(tor.id, 'reject')}
                            >
                                Tolak
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verifikasi TOR" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* HEADER + SEARCH */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#427452]">
                            Verifikasi
                        </h1>
                        <div className="mt-1 h-1 w-20 rounded-full bg-[#427452]" />
                    </div>

                    <div className="flex w-full justify-center md:justify-end">
                        <div className="relative w-full max-w-md">
                            <Input
                                className="w-full rounded-full border border-gray-300 bg-white pr-4 pl-10 shadow-sm"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* CONTAINER HIJAU SEPERTI FIGMA */}
                <div className="mt-4 space-y-10 rounded-3xl bg-[#73AD86]/50 p-6">
                    {/* SUDAH DIVERIFIKASI */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#4C51BF]">
                            Sudah Diverifikasi
                        </h2>
                        <div className="mt-1 h-[2px] w-full max-w-xs bg-white/70" />
                        <div className="mt-4">
                            {sudah.length > 0 ? (
                                sudah.map((tor) =>
                                    renderCard(tor, { showButtons: false }),
                                )
                            ) : (
                                <p className="text-sm text-gray-700">
                                    Belum ada TOR yang sudah diverifikasi.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* BELUM DIVERIFIKASI */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#C53030]">
                            Belum Diverifikasi
                        </h2>
                        <div className="mt-1 h-[2px] w-full max-w-xs bg-white/70" />
                        <div className="mt-4">
                            {belum.length > 0 ? (
                                belum.map((tor) =>
                                    renderCard(tor, { showButtons: true }),
                                )
                            ) : (
                                <p className="text-sm text-gray-700">
                                    Tidak ada TOR yang menunggu verifikasi.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* DITOLAK */}
                    <section>
                        <h2 className="text-xl font-semibold text-[#742A2A]">
                            Ditolak
                        </h2>
                        <div className="mt-1 h-[2px] w-full max-w-xs bg-white/70" />
                        <div className="mt-4">
                            {ditolak.length > 0 ? (
                                ditolak.map((tor) =>
                                    renderCard(tor, { showButtons: false }),
                                )
                            ) : (
                                <p className="text-sm text-gray-700">
                                    Belum ada TOR yang ditolak.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
