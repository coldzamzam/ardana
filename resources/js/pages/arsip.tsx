import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type Submisi } from '@/types';

import { Search } from 'lucide-react';

type ArsipPageProps = PageProps<{
    arsip: Submisi[];
}>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Arsip',
        href: '/dashboard/arsip',
    },
];

export default function ArsipPage({ arsip }: ArsipPageProps) {
    const [selectedId, setSelectedId] = useState<number | null>(
        arsip[0]?.id ?? null,
    );
    const [search, setSearch] = useState('');

    const filteredArsip = useMemo(() => {
        if (!search.trim()) return arsip;

        const q = search.toLowerCase();

        return arsip.filter((item) => {
            const judul = item.judul?.toLowerCase() ?? '';
            const jenis = item.kegiatan_type?.nama?.toLowerCase() ?? '';
            const indikator = item.detail_submisi?.iku?.toLowerCase() ?? '';
            const tahun = item.detail_submisi?.tanggal_mulai
                ? String(
                      new Date(item.detail_submisi.tanggal_mulai).getFullYear(),
                  ).toLowerCase()
                : '';

            const combined = `${judul} ${jenis} ${indikator} ${tahun}`;

            return combined.includes(q);
        });
    }, [arsip, search]);

    const selected =
        filteredArsip.find((a) => a.id === selectedId) ??
        filteredArsip[0] ??
        null;

    const getYear = (item: Submisi) => {
        const tanggal = item.detail_submisi?.tanggal_mulai ?? item.created_at;
        return new Date(tanggal).getFullYear();
    };

    const renderHtml = (html?: string | null) => {
        if (!html) return <span className="text-slate-500">-</span>;

        return (
            <span
                className="prose prose-sm max-w-none text-slate-700"
                dangerouslySetInnerHTML={{
                    __html: html as string,
                }}
            />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arsip" />

            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex w-full flex-col gap-5 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                Arsip Pengajuan
                            </h1>
                        </div>

                        {/* SEARCH */}
                        <div className="flex w-full max-w-sm items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                            <Search className="h-4 w-4 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul, indikator, atau tahun..."
                                className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-1 flex-col gap-4 md:flex-row">
                        {/* LEFT: LIST / SIDEBAR ARSIP */}
                        <div className="md:w-[42%]">
                            <div className="flex items-center justify-between pb-2">
                                <p className="text-sm font-medium text-slate-700">
                                    Daftar Arsip
                                </p>
                                <p className="text-xs text-slate-500">
                                    {filteredArsip.length} dokumen
                                </p>
                            </div>

                            <div className="h-[420px] space-y-3 overflow-y-auto rounded-2xl bg-[#CBEBD5]/60 p-3">
                                {filteredArsip.length === 0 ? (
                                    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-600">
                                        Tidak ada arsip yang cocok dengan
                                        pencarian.
                                    </div>
                                ) : (
                                    filteredArsip.map((item) => {
                                        const year = getYear(item);
                                        const isActive =
                                            selected?.id === item.id;

                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedId(item.id)
                                                }
                                                className={`flex w-full flex-col gap-2 rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition hover:-translate-y-[1px] hover:shadow-md ${
                                                    isActive
                                                        ? 'border-[#427452] bg-white'
                                                        : 'border-transparent bg-white/90'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                                                            {item.judul}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {item.kegiatan_type
                                                                ?.nama ?? '-'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="rounded-full bg-[#E6F5EC] px-3 py-0.5 text-[11px] font-semibold tracking-wide text-[#427452] uppercase">
                                                            {item.type ?? 'TOR'}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">
                                                            Tahun {year}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] text-slate-600">
                                                    <span className="line-clamp-1">
                                                        IKU:{' '}
                                                        {item.detail_submisi
                                                            ?.iku ?? '-'}
                                                    </span>
                                                    <span className="line-clamp-1 text-right">
                                                        Pengusul:{' '}
                                                        {item.created_by
                                                            ?.name ?? '-'}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* RIGHT: DETAIL */}
                        <div className="md:w-[58%]">
                            <div className="flex items-center justify-between pb-2">
                                <p className="text-sm font-medium text-slate-700">
                                    Detail Dokumen
                                </p>
                                {selected && (
                                    <p className="text-xs text-slate-500">
                                        Terakhir diubah:{' '}
                                        {new Date(
                                            selected.updated_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                )}
                            </div>

                            <div className="h-[420px] overflow-y-auto rounded-2xl bg-white p-5 shadow-md">
                                {!selected ? (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        Pilih salah satu arsip di sebelah kiri
                                        untuk melihat detail.
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 text-sm text-slate-800">
                                        {/* Judul */}
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {selected.judul}
                                            </h2>
                                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                                                <span className="rounded-full bg-[#E6F5EC] px-3 py-0.5 font-medium text-[#427452]">
                                                    {selected.type ?? 'TOR'}
                                                </span>
                                                {selected.kegiatan_type
                                                    ?.nama && (
                                                    <span className="rounded-full bg-slate-100 px-3 py-0.5">
                                                        {
                                                            selected
                                                                .kegiatan_type
                                                                .nama
                                                        }
                                                    </span>
                                                )}
                                                <span className="rounded-full bg-slate-100 px-3 py-0.5">
                                                    Tahun {getYear(selected)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Meta ringkas */}
                                        <div className="grid gap-3 rounded-2xl bg-[#F6FBF7] p-3 text-xs text-slate-700 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-900">
                                                    Indikator Kinerja
                                                </p>
                                                <p>
                                                    {selected.detail_submisi
                                                        ?.iku ?? '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-900">
                                                    Pengusul
                                                </p>
                                                <p>
                                                    {selected.created_by
                                                        ?.name ?? '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-900">
                                                    Periode
                                                </p>
                                                <p>
                                                    {selected.detail_submisi
                                                        ?.tanggal_mulai &&
                                                    selected.detail_submisi
                                                        ?.tanggal_selesai
                                                        ? `${selected.detail_submisi.tanggal_mulai} s.d. ${selected.detail_submisi.tanggal_selesai}`
                                                        : '-'}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-900">
                                                    Dibuat pada
                                                </p>
                                                <p>
                                                    {new Date(
                                                        selected.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Isi TOR / LPJ */}
                                        <div className="space-y-3 text-xs leading-relaxed">
                                            <section>
                                                <p className="mb-1 font-semibold text-slate-900">
                                                    Gambaran Umum
                                                </p>
                                                {renderHtml(
                                                    selected.detail_submisi
                                                        ?.gambaran_umum ?? null,
                                                )}
                                            </section>

                                            <section>
                                                <p className="mb-1 font-semibold text-slate-900">
                                                    Tujuan
                                                </p>
                                                {renderHtml(
                                                    selected.detail_submisi
                                                        ?.tujuan ?? null,
                                                )}
                                            </section>

                                            <section>
                                                <p className="mb-1 font-semibold text-slate-900">
                                                    Manfaat
                                                </p>
                                                {renderHtml(
                                                    selected.detail_submisi
                                                        ?.manfaat ?? null,
                                                )}
                                            </section>

                                            <section>
                                                <p className="mb-1 font-semibold text-slate-900">
                                                    Metode Pelaksanaan
                                                </p>
                                                {renderHtml(
                                                    selected.detail_submisi
                                                        ?.metode_pelaksanaan ??
                                                        null,
                                                )}
                                            </section>

                                            <section>
                                                <p className="mb-1 font-semibold text-slate-900">
                                                    Waktu Pelaksanaan
                                                </p>
                                                {renderHtml(
                                                    selected.detail_submisi
                                                        ?.waktu_pelaksanaan ??
                                                        null,
                                                )}
                                            </section>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
