import React from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Submisi } from '@/types';

// --- TYPES ---
type TorDetail = {
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;

    gambaran_umum?: string | null;
    tujuan?: string | null;
    manfaat?: string | null;

    metode_pelaksanaan?: string | null;
    waktu_pelaksanaan?: string | null;

    iku?: string | null;
    indikator_kinerja?: string | null;

    // PIC (fallback berlapis)
    pic_name?: string | null;
    pic_nip?: string | null;
    pic?:
        | {
              name?: string | null;
              nip?: string | null;
              dosen?: { nip?: string | null } | null;
          }
        | string
        | null;
};

type IndikatorRow = {
    id?: string | number;
    bulan?: string | null;
    keberhasilan?: string | null;
    target?: number | null;
};

type AnggotaRow = {
    id?: string | number;
    user?: {
        name?: string | null;
        mahasiswa?: {
            nim?: string | null;
            prodi?: string | null;
        } | null;
    } | null;
};

type FileRow = {
    id?: string | number;
    nama?: string | null;
    deskripsi?: string | null;
};

type BiayaRow = {
    id?: string | number;
    deskripsi?: string | null;
    satuan?: string | null;
    biaya_satuan?: number | null;
    jumlah_kali?: number | null;
    jumlah_org?: number | null;
};

type SubmisiWithRelations = Submisi & {
    kegiatanType?: { nama?: string | null } | null;
    kegiatan_type?: { nama?: string | null } | null;
    detail_submisi?: TorDetail | null;
    indikator_kinerja?: IndikatorRow[] | null;
    anggota_tim?: AnggotaRow[] | null;
    submisi_file?: FileRow[] | null;
    biaya?: BiayaRow[] | null;
    total_anggaran?: number | null;
};

interface DetailTemplateProps {
    submisi: Submisi;
}

export default function DetailTemplate({ submisi }: DetailTemplateProps) {
    const sub = submisi as SubmisiWithRelations;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'TOR', href: '/dashboard/tor' },
        { title: 'Template TOR', href: window.location.pathname },
    ];

    const detail: TorDetail | null = sub.detail_submisi ?? null;

    const year = detail?.tanggal_mulai
        ? new Date(detail.tanggal_mulai).getFullYear()
        : new Date().getFullYear();

    // --- HELPER FUNCTIONS ---
    const formatTanggalID = (dateStr?: string | null) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatRupiah = (n: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(n);

    const getExt = (name?: string | null) =>
        (name ?? '').split('.').pop()?.toLowerCase() ?? '';

    const getPreviewUrl = (id: string | number) => {
        return `/dashboard/submisi-file/${id}/download`;
    };

    const isImageExt = (ext: string) => ['jpg', 'jpeg', 'png'].includes(ext);
    const isPdfExt = (ext: string) => ext === 'pdf';

    const stripHtml = (html?: string | null) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
    };

    const getKegiatanNama = () => {
        return sub.kegiatan_type?.nama || sub.kegiatanType?.nama || '-';
    };

    const periodePelaksanaan = () => {
        const mulai = detail?.tanggal_mulai ?? null;
        const selesai = detail?.tanggal_selesai ?? null;
        if (!mulai && !selesai) return '-';
        if (mulai && !selesai) return formatTanggalID(mulai);
        if (!mulai && selesai) return formatTanggalID(selesai);
        return `${formatTanggalID(mulai)} s.d. ${formatTanggalID(selesai)}`;
    };

    const getPicNama = () => {
        if (detail?.pic_name) return detail.pic_name;
        if (typeof detail?.pic === 'string' && detail.pic.trim())
            return detail.pic;
        if (detail?.pic && typeof detail.pic === 'object' && detail.pic?.name)
            return detail.pic.name;
        return '-';
    };

    const getPicNip = () => {
        if (detail?.pic_nip) return detail.pic_nip;
        if (detail?.pic && typeof detail.pic === 'object') {
            return detail.pic?.nip || detail.pic?.dosen?.nip || '-';
        }
        return '-';
    };

    const ikuLabel = detail?.iku || detail?.indikator_kinerja || '';

    const indikatorRows = sub.indikator_kinerja ?? [];
    const anggotaRows = sub.anggota_tim ?? [];
    const fileRows = sub.submisi_file ?? [];
    const biayaRows = sub.biaya ?? [];
    const totalAnggaran = Number(sub.total_anggaran ?? 0);
    const maxTarget = indikatorRows.length
        ? Math.max(...indikatorRows.map((r) => Number(r.target ?? 0)))
        : null;

    // --- PDF DOWNLOAD (AUTO DOWNLOAD, BUKAN PRINT) ---
    // NOTE: pastikan dependency ini ada:
    // npm i html2pdf.js
    const pdfRef = React.useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = React.useState(false);

    const safeFileName = (name: string) =>
        name
            .trim()
            .replace(/[\\/:*?"<>|]/g, '')
            .replace(/\s+/g, ' ')
            .slice(0, 120);

    const handleDownloadTor = async () => {
        if (!pdfRef.current) return;

        try {
            setDownloading(true);

            // kasih kesempatan React nge-render state "downloading"
            await new Promise((r) => setTimeout(r, 50));

            const mod = await import('html2pdf.js');
            const html2pdf = (mod as { default?: unknown }).default ?? mod;

            const title = safeFileName(submisi.judul || 'TOR');
            const filename = `${title} - ${year}.pdf`;

            // CLONE biar kita bisa “buang” iframe tanpa ganggu tampilan asli
            const sourceEl = pdfRef.current;
            const clone = sourceEl.cloneNode(true) as HTMLElement;

            // penting: clone harus “hidup” di DOM supaya layout akurat
            clone.style.position = 'fixed';
            clone.style.left = '-100000px';
            clone.style.top = '0';
            clone.style.background = '#ffffff';
            clone.style.width = `${sourceEl.offsetWidth}px`;

            document.body.appendChild(clone);

            // HAPUS / GANTI iframe (ini biang freeze)
            clone.querySelectorAll('iframe').forEach((ifr) => {
                const box = document.createElement('div');
                box.style.border = '1px solid #cbd5e1';
                box.style.padding = '12px';
                box.style.fontSize = '12px';
                box.style.color = '#334155';
                box.style.background = '#f8fafc';
                box.innerText =
                    'Lampiran PDF tidak dimasukkan ke file hasil download (preview iframe). ' +
                    'Silakan unduh lampiran PDF secara terpisah.';
                ifr.replaceWith(box);
            });

            // OPTIONAL: kalau ada gambar yang ukurannya kegedean, scale dibuat lebih kecil biar nggak berat
            await html2pdf()
                .set({
                    margin: [8, 8, 8, 8],
                    filename,
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: {
                        scale: 1.5, // 2 itu berat; coba 1.25–1.5
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff',
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'a4',
                        orientation: 'portrait',
                    },
                    pagebreak: { mode: ['css'] },
                })
                .from(clone)
                .save();

            document.body.removeChild(clone);
        } catch (e) {
            console.error(e);
            alert(
                'Gagal membuat PDF. Coba kecilkan lampiran / matikan preview PDF iframe.',
            );
        } finally {
            setDownloading(false);
        }
    };

    // --- HELPER COMPONENTS ---
    const Page: React.FC<{
        children: React.ReactNode;
        breakAfter?: boolean;
    }> = ({ children, breakAfter = true }) => (
        <div className="mx-auto my-6 w-full max-w-[860px] print:my-0 print:max-w-none">
            <div
                className="mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white shadow-[0_10px_30px_rgba(2,6,23,0.10)] ring-1 ring-slate-200 print:shadow-none print:ring-0"
                style={{
                    pageBreakAfter: breakAfter ? 'always' : 'auto',
                    fontFamily: '"Times New Roman", serif',
                }}
            >
                {children}
            </div>
        </div>
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <p className="text-[15px] font-bold">{children}</p>
    );

    const SubTitle = ({ children }: { children: React.ReactNode }) => (
        <p className="mt-4 ml-4 font-bold">{children}</p>
    );

    const HtmlBlock = ({
        html,
        fallback,
        className = '',
    }: {
        html?: string | null;
        fallback?: string;
        className?: string;
    }) => {
        const has = !!stripHtml(html);
        if (!has) {
            return (
                <p
                    className={`mt-1 ml-6 text-justify text-[14px] text-slate-600 italic ${className}`}
                >
                    {fallback ?? '(Belum diisi)'}
                </p>
            );
        }
        return (
            <div
                className={`mt-1 ml-6 text-justify text-[14px] leading-relaxed ${className}`}
                dangerouslySetInnerHTML={{ __html: html ?? '' }}
            />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div
                id="tor-pdf-root"
                className="relative flex h-full flex-1 flex-col gap-6 overflow-y-auto bg-slate-50 p-4 text-black print:bg-white print:p-0"
            >
                {/* BUTTON DOWNLOAD */}
                <div
                    data-no-pdf="true"
                    className="sticky top-0 z-50 -mx-4 -mt-4 mb-2 border-b border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50 px-4 py-3 backdrop-blur-md print:hidden"
                >
                    <div className="flex w-full items-center justify-between">
                        {/* KIRI */}
                        <div className="flex min-w-0 items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="group h-11 shrink-0 rounded-xl border-2 border-slate-300 bg-white px-5 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
                                onClick={() => window.history.back()}
                            >
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    Kembali
                                </span>
                            </Button>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-700">
                                    Preview Dokumen TOR
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    Siap untuk diunduh atau dicetak
                                </p>
                            </div>
                        </div>

                        {/* KANAN */}
                        <Button
                            type="button"
                            className="h-11 rounded-xl bg-[#2B6CB0] px-6 text-white shadow-sm hover:bg-[#245a94] disabled:opacity-70"
                            onClick={handleDownloadTor}
                            disabled={downloading}
                        >
                            {downloading
                                ? 'Menyiapkan PDF...'
                                : 'Download TOR (PDF)'}
                        </Button>
                    </div>
                </div>

                {/* ✅ INI YANG AKAN DIJADIKAN PDF */}
                <div ref={pdfRef}>
                    {/* ================= HALAMAN 1 – COVER ================= */}

                    {/* ================= HALAMAN 1 – COVER ================= */}
                    <Page>
                        <div className="flex min-h-[1123px] items-center justify-center">
                            <div className="w-[520px] border border-black px-14 py-16 text-center leading-relaxed text-black">
                                <div className="mb-10 flex justify-center">
                                    <img
                                        src="/images/logo_pnj.jpg"
                                        alt="Logo Politeknik Negeri Jakarta"
                                        className="h-48 w-auto"
                                    />
                                </div>

                                <p className="text-3xl tracking-wide">
                                    KERANGKA ACUAN KERJA <br />
                                    TAHUN ANGGARAN {year}
                                </p>

                                <div className="mt-14 space-y-2 text-2xl">
                                    <p>Kegiatan :</p>
                                    <p className="font-bold">{submisi.judul}</p>
                                    <p className="text-xl">
                                        {getKegiatanNama()}
                                    </p>
                                </div>

                                <div className="mt-16 text-2xl">
                                    <p>Unit Kerja :</p>
                                    <p>Jurusan TIK</p>
                                </div>

                                <div className="mt-20 space-y-2 text-2xl">
                                    <p>Kementerian Pendidikan Tinggi,</p>
                                    <p>Sains, dan Teknologi</p>
                                    <p className="mt-8 text-2xl">
                                        Tahun {year}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Page>

                    {/* ================= HALAMAN 2 – METADATA + LATAR BELAKANG ================= */}
                    <Page>
                        <div className="min-h-[1123px] px-16 py-12 text-black">
                            <div className="mb-8 text-center leading-tight">
                                <p className="text-[15px] font-bold">
                                    KERANGKA ACUAN KERJA
                                </p>
                                <p className="mt-1 text-[15px]">
                                    Tahun Anggaran {year}
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className="mb-6 text-[15px] leading-relaxed">
                                <div className="flex">
                                    <span className="w-[210px]">
                                        Kementerian Negara/Lembaga
                                    </span>
                                    <span className="mx-2">:</span>
                                    <span>
                                        Kementerian Pendidikan Tinggi, Sains,
                                        dan Teknologi
                                    </span>
                                </div>

                                <div className="flex">
                                    <span className="w-[210px]">
                                        PTN/Kopertis
                                    </span>
                                    <span className="mx-2">:</span>
                                    <span>Politeknik Negeri Jakarta</span>
                                </div>

                                <div className="flex">
                                    <span className="w-[210px]">
                                        Unit Kerja
                                    </span>
                                    <span className="mx-2">:</span>
                                    <span>
                                        Jurusan Teknik Informatika dan Komputer
                                    </span>
                                </div>

                                <div className="flex items-start">
                                    <span className="w-[210px]">Kegiatan</span>
                                    <span className="mx-2">:</span>
                                    <span className="whitespace-pre-line">
                                        {submisi.judul}
                                        {'\n'}
                                        <span className="text-[14px] italic">
                                            {getKegiatanNama()}
                                        </span>
                                    </span>
                                </div>

                                <div className="mt-2 flex items-start">
                                    <span className="w-[210px]">
                                        Periode Pelaksanaan
                                    </span>
                                    <span className="mx-2">:</span>
                                    <span>{periodePelaksanaan()}</span>
                                </div>
                            </div>

                            {/* Program – Indikator Kerja */}
                            <div className="mb-4 flex items-start">
                                <span className="w-[210px]">
                                    Program – Indikator Kerja
                                </span>
                                <span className="mx-2">:</span>

                                <div className="-mt-1">
                                    <table className="w-[390px] border-collapse border border-black text-[14px] leading-tight">
                                        <tbody>
                                            <tr>
                                                <td
                                                    className="border border-black px-3 py-2 align-top"
                                                    colSpan={3}
                                                >
                                                    <span className="font-bold">
                                                        Program:
                                                    </span>
                                                    <br />
                                                    <span className="whitespace-pre-line">
                                                        {getKegiatanNama()}
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="w-[5px] border border-black px-3 py-2 align-top" />
                                                <td className="w-[310px] border border-black px-3 py-2 align-top">
                                                    <span className="font-bold">
                                                        Indikator Kinerja:
                                                    </span>{' '}
                                                    {ikuLabel ||
                                                        '(Belum dipilih)'}
                                                </td>
                                                <td className="w-[60px] border border-black px-4 py-2 text-center align-middle">
                                                    {maxTarget === null
                                                        ? '-'
                                                        : `${maxTarget}%`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* A. Latar Belakang */}
                            <section className="text-[14px] leading-relaxed">
                                <SectionTitle>A. Latar Belakang</SectionTitle>

                                <p className="mt-3 ml-4 font-bold">
                                    1. Dasar Hukum
                                </p>

                                <ol className="ml-10 list-[lower-alpha] text-justify leading-relaxed">
                                    <li>
                                        Undang-Undang Nomor 17 Tahun 2003
                                        tentang Keuangan Negara;
                                    </li>
                                    <li>
                                        Undang-Undang Nomor 20 Tahun 2003
                                        tentang Sistem Pendidikan Nasional;
                                    </li>
                                    <li>
                                        Undang-Undang Nomor 12 Tahun 2012
                                        tentang Pendidikan Tinggi;
                                    </li>
                                    <li>
                                        Peraturan Pemerintah Republik Indonesia
                                        Nomor 21 Tahun 2004 tentang Penyusunan
                                        Rencana Kerja dan Anggaran Kementerian
                                        Negara/Lembaga;
                                    </li>
                                    <li>
                                        Peraturan Pemerintah Nomor 90 Tahun 2010
                                        tentang Penyusunan RKA-K/L;
                                    </li>
                                    <li>
                                        Peraturan Pemerintah Nomor 17 Tahun 2010
                                        tentang Pengelolaan dan Penyelenggaraan
                                        Pendidikan;
                                    </li>
                                    <li>
                                        Peraturan Pemerintah Nomor 4 Tahun 2014
                                        tentang Penyelenggaraan Pendidikan
                                        Tinggi dan Pengelolaan Perguruan Tinggi;
                                    </li>
                                    <li>
                                        Peraturan Pemerintah Nomor 9 Tahun 2018
                                        tentang Penerimaan Negara Bukan Pajak;
                                    </li>
                                    <li>
                                        Rencana Strategis Politeknik Negeri
                                        Jakarta Tahun 2020–2024.
                                    </li>
                                </ol>

                                <p className="mt-5 ml-4 font-bold">
                                    2. Gambaran Umum
                                </p>
                                <HtmlBlock html={detail?.gambaran_umum} />

                                <p className="mt-5 ml-4 font-bold">3. Tujuan</p>
                                <HtmlBlock html={detail?.tujuan} />

                                <p className="mt-5 ml-4 font-bold">
                                    4. Manfaat
                                </p>
                                <HtmlBlock html={detail?.manfaat} />
                            </section>
                        </div>
                    </Page>

                    {/* ================= HALAMAN 3 – STRATEGI + INDIKATOR + BIAYA + TTd ================= */}
                    <Page>
                        <div className="min-h-[1123px] px-16 py-12 text-black">
                            <section className="text-[14px] leading-relaxed">
                                <p className="ml-4 text-[15px] font-bold">
                                    B. Strategi Pencapaian Keluaran
                                </p>

                                <p className="mt-2 ml-6 font-bold">
                                    1. Metode Pelaksanaan
                                </p>
                                <HtmlBlock
                                    html={detail?.metode_pelaksanaan}
                                    fallback="(Belum diisi metode pelaksanaan)"
                                />

                                <p className="mt-4 ml-6 font-bold">
                                    2. Waktu Pelaksanaan
                                </p>
                                <HtmlBlock
                                    html={detail?.waktu_pelaksanaan}
                                    fallback="(Belum diisi waktu pelaksanaan)"
                                />

                                {/* Indikator Kinerja - tabel */}
                                <p className="mt-6 ml-4 text-[15px] font-bold">
                                    C. Indikator Kinerja
                                </p>

                                <div className="mt-2 ml-6 flex justify-start">
                                    <table className="border-collapse border border-black text-[13px]">
                                        <thead>
                                            <tr>
                                                <th className="w-[40px] border border-black px-3 py-2">
                                                    No
                                                </th>
                                                <th className="w-[140px] border border-black px-3 py-2">
                                                    Bulan
                                                </th>
                                                <th className="w-[300px] border border-black px-3 py-2">
                                                    Indikator Keberhasilan
                                                </th>
                                                <th className="w-[80px] border border-black px-3 py-2">
                                                    Target
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {indikatorRows.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="border border-black px-3 py-3 text-center text-slate-600 italic"
                                                    >
                                                        (Belum ada indikator
                                                        kinerja)
                                                    </td>
                                                </tr>
                                            ) : (
                                                indikatorRows.map(
                                                    (
                                                        r: IndikatorRow,
                                                        i: number,
                                                    ) => (
                                                        <tr key={r.id ?? i}>
                                                            <td className="border border-black px-3 py-2 text-center">
                                                                {i + 1}
                                                            </td>
                                                            <td className="border border-black px-3 py-2">
                                                                {r.bulan ?? '-'}
                                                            </td>
                                                            <td className="border border-black px-3 py-2">
                                                                {r.keberhasilan ??
                                                                    '-'}
                                                            </td>
                                                            <td className="border border-black px-3 py-2 text-center">
                                                                {typeof r.target ===
                                                                'number'
                                                                    ? `${r.target}%`
                                                                    : '-'}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Kurun Waktu */}
                                <p className="mt-6 ml-4 text-[15px] font-bold">
                                    D. Kurun Waktu Pelaksanaan
                                </p>
                                <p className="mt-1 ml-6 text-justify text-[14px] leading-relaxed">
                                    Kegiatan ini dilaksanakan pada periode:{' '}
                                    <span className="font-bold">
                                        {periodePelaksanaan()}
                                    </span>
                                    .
                                </p>

                                {/* Biaya */}
                                <p className="mt-6 ml-4 text-[15px] font-bold">
                                    E. Biaya Yang Diperlukan
                                </p>
                                <p className="mt-1 ml-6 text-justify text-[14px] leading-relaxed">
                                    Biaya yang diperlukan untuk pelaksanaan
                                    kegiatan ini sebesar{' '}
                                    <span className="font-bold">
                                        {formatRupiah(totalAnggaran)}
                                    </span>
                                    .
                                </p>

                                {/* Tabel RAB */}
                                <div className="mt-4 ml-4 flex justify-start">
                                    <table className="border-collapse border border-black text-[13px]">
                                        <thead>
                                            <tr className="bg-slate-200">
                                                <th className="w-[240px] border border-black px-3 py-2">
                                                    Uraian
                                                </th>
                                                <th className="w-[220px] border border-black px-3 py-2">
                                                    Rincian
                                                </th>
                                                <th className="w-[80px] border border-black px-3 py-2">
                                                    Satuan
                                                </th>
                                                <th className="w-[110px] border border-black px-3 py-2">
                                                    Jumlah
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {biayaRows.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="border border-black px-3 py-3 text-center text-slate-600 italic"
                                                    >
                                                        (Belum ada rincian
                                                        anggaran)
                                                    </td>
                                                </tr>
                                            ) : (
                                                <>
                                                    {biayaRows.map(
                                                        (
                                                            b: BiayaRow,
                                                            idx: number,
                                                        ) => {
                                                            const satuan =
                                                                b.satuan ?? '-';
                                                            const biayaSatuan =
                                                                Number(
                                                                    b.biaya_satuan ??
                                                                        0,
                                                                );
                                                            const jumlahKali =
                                                                Number(
                                                                    b.jumlah_kali ??
                                                                        0,
                                                                );
                                                            const jumlahOrg =
                                                                Number(
                                                                    b.jumlah_org ??
                                                                        0,
                                                                );
                                                            const total =
                                                                biayaSatuan *
                                                                jumlahKali *
                                                                jumlahOrg;

                                                            const rincian = `${jumlahOrg} ORG × ${jumlahKali} KALI × ${formatRupiah(
                                                                biayaSatuan,
                                                            )}`;

                                                            return (
                                                                <tr
                                                                    key={
                                                                        b.id ??
                                                                        idx
                                                                    }
                                                                >
                                                                    <td className="border border-black px-3 py-2">
                                                                        {b.deskripsi ??
                                                                            '-'}
                                                                    </td>
                                                                    <td className="border border-black px-3 py-2">
                                                                        {
                                                                            rincian
                                                                        }
                                                                    </td>
                                                                    <td className="border border-black px-3 py-2 text-center">
                                                                        {satuan}
                                                                    </td>
                                                                    <td className="border border-black px-3 py-2 text-center">
                                                                        {formatRupiah(
                                                                            total,
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )}

                                                    <tr>
                                                        <td
                                                            className="border border-black px-3 py-2 text-right font-bold"
                                                            colSpan={3}
                                                        >
                                                            Total
                                                        </td>
                                                        <td className="border border-black px-3 py-2 text-center font-bold">
                                                            {formatRupiah(
                                                                totalAnggaran,
                                                            )}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Tanda tangan */}
                                <div className="mt-10 flex justify-end pr-10">
                                    <div className="text-right text-[14px] leading-relaxed">
                                        <p>
                                            Depok,{' '}
                                            {formatTanggalID(
                                                detail?.tanggal_mulai ?? null,
                                            )}
                                        </p>
                                        <p>Penanggung jawab,</p>

                                        <div className="mt-8 mb-2 flex justify-end">
                                            <img
                                                src="/images/ttd_placeholder.png"
                                                alt="Tanda Tangan"
                                                className="h-20 w-auto"
                                            />
                                        </div>

                                        <p className="font-bold">
                                            {getPicNama()}
                                        </p>
                                        <p>NIP. {getPicNip()}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </Page>

                    {/* ================= HALAMAN 4 – ANGGOTA + DAFTAR LAMPIRAN ================= */}
                    <Page>
                        <div className="min-h-[1123px] px-16 py-12 text-black">
                            <section className="text-[14px] leading-relaxed">
                                <SectionTitle>F. Lampiran</SectionTitle>

                                {/* Anggota Tim */}
                                <SubTitle>1. Anggota Tim</SubTitle>
                                <div className="mt-2 ml-6">
                                    <table className="w-full border-collapse border border-black text-[13px]">
                                        <thead>
                                            <tr className="bg-slate-200">
                                                <th className="w-[50px] border border-black px-3 py-2">
                                                    No
                                                </th>
                                                <th className="border border-black px-3 py-2">
                                                    Nama
                                                </th>
                                                <th className="w-[160px] border border-black px-3 py-2">
                                                    NIM
                                                </th>
                                                <th className="w-[180px] border border-black px-3 py-2">
                                                    Prodi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {anggotaRows.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="border border-black px-3 py-3 text-center text-slate-600 italic"
                                                    >
                                                        (Belum ada anggota tim)
                                                    </td>
                                                </tr>
                                            ) : (
                                                anggotaRows.map(
                                                    (
                                                        a: AnggotaRow,
                                                        i: number,
                                                    ) => (
                                                        <tr key={a.id ?? i}>
                                                            <td className="border border-black px-3 py-2 text-center">
                                                                {i + 1}
                                                            </td>
                                                            <td className="border border-black px-3 py-2">
                                                                {a.user?.name ??
                                                                    '-'}
                                                            </td>
                                                            <td className="border border-black px-3 py-2 text-center">
                                                                {a.user
                                                                    ?.mahasiswa
                                                                    ?.nim ??
                                                                    '-'}
                                                            </td>
                                                            <td className="border border-black px-3 py-2 text-center">
                                                                {a.user
                                                                    ?.mahasiswa
                                                                    ?.prodi ??
                                                                    '-'}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Lampiran File (Tabel List) */}
                                <SubTitle>2. Daftar Lampiran File</SubTitle>
                                <div className="mt-2 ml-6">
                                    <table className="w-full border-collapse border border-black text-[13px]">
                                        <thead>
                                            <tr className="bg-slate-200">
                                                <th className="w-[50px] border border-black px-3 py-2">
                                                    No
                                                </th>
                                                <th className="border border-black px-3 py-2">
                                                    Nama File
                                                </th>
                                                <th className="border border-black px-3 py-2">
                                                    Deskripsi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fileRows.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="border border-black px-3 py-3 text-center text-slate-600 italic"
                                                    >
                                                        (Belum ada lampiran
                                                        file)
                                                    </td>
                                                </tr>
                                            ) : (
                                                fileRows.map(
                                                    (f: FileRow, i: number) => (
                                                        <tr key={f.id ?? i}>
                                                            <td className="border border-black px-3 py-2 text-center">
                                                                {i + 1}
                                                            </td>
                                                            <td className="border border-black px-3 py-2">
                                                                {f.nama ?? '-'}
                                                            </td>
                                                            <td className="border border-black px-3 py-2">
                                                                {f.deskripsi ??
                                                                    '-'}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </Page>
                    {/* ================= HALAMAN TAMBAHAN – MERGE PREVIEW FILE ================= */}
                    {fileRows.map((file, index) => {
                        const ext = getExt(file.nama);
                        const previewUrl = getPreviewUrl(file.id!);

                        if (!isImageExt(ext) && !isPdfExt(ext)) return null;

                        return (
                            <Page
                                key={`merged-file-${file.id ?? index}`}
                                breakAfter={true}
                            >
                                <div className="min-h-[1123px] px-16 py-12 text-black">
                                    <SectionTitle>
                                        Lampiran {index + 1}: {file.nama}
                                    </SectionTitle>
                                    <p className="mb-4 text-sm text-gray-600 italic">
                                        {file.deskripsi}
                                    </p>
                                    <div className="flex justify-center border border-slate-200 p-2">
                                        {isImageExt(ext) ? (
                                            <img
                                                src={previewUrl}
                                                alt={file.nama || ''}
                                                className="max-h-[850px] w-auto object-contain"
                                            />
                                        ) : isPdfExt(ext) ? (
                                            <iframe
                                                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                className="h-[900px] w-full"
                                                title={file.nama || ''}
                                                style={{
                                                    border: 'none',
                                                    overflow: 'hidden',
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            </Page>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
