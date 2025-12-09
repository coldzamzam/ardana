import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Submisi } from '@/types';
import { Head } from '@inertiajs/react';

interface DetailTemplateProps {
    submisi: Submisi;
}

export default function DetailTemplate({ submisi }: DetailTemplateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'TOR', href: '/dashboard/tor' },
        { title: 'Template TOR', href: window.location.pathname },
    ];

    const detail = submisi.detail_submisi;

    const year = detail?.tanggal_mulai
        ? new Date(detail.tanggal_mulai).getFullYear()
        : new Date().getFullYear();

    const handleDownloadTor = () => {
        // nanti dihubungkan ke route download file
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Template TOR - ${submisi.judul}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto bg-slate-100 p-4 text-black print:bg-white">
                {/* ACTION BUTTONS */}
                {/* BUTTON DOWNLOAD DI PALING BAWAH */}
                <div className="fixed right-6 bottom-6 print:hidden">
                    <Button
                        type="button"
                        className="bg-[#2B6CB0] px-6 py-3 text-white shadow-lg hover:bg-[#245a94]"
                        onClick={handleDownloadTor}
                    >
                        Download TOR
                    </Button>
                </div>

                {/* ================= HALAMAN 1 – COVER ================= */}
                <div
                    className="mx-auto my-4 flex min-h-[1123px] w-[794px] items-center justify-center bg-white shadow-md"
                    style={{
                        pageBreakAfter: 'always',
                        fontFamily: '"Times New Roman", serif',
                    }}
                >
                    {/* Kotak Tengah */}
                    <div className="w-[520px] border border-black px-14 py-16 text-center leading-relaxed text-black">
                        {/* Logo */}
                        <div className="mb-10 flex justify-center">
                            <img
                                src="/images/logo_pnj.jpg"
                                alt="Logo Politeknik Negeri Jakarta"
                                className="h-48 w-auto"
                            />
                        </div>

                        {/* Judul */}
                        <p className="text-3xl tracking-wide">
                            KERANGKA ACUAN KERJA <br />
                            TAHUN ANGGARAN {year}
                        </p>

                        {/* Kegiatan */}
                        <div className="mt-14 space-y-2 text-2xl">
                            <p>Kegiatan :</p>
                            <p>Pelatihan dan Sertifikasi</p>
                            <p>Kompetensi Dosen ENSA</p>
                            <p className="mt-2 text-xl italic">
                                (Enterprise Networking, Security and Automation)
                            </p>
                        </div>

                        {/* Unit Kerja */}
                        <div className="mt-16 text-2xl">
                            <p>Unit Kerja :</p>
                            <p>Jurusan TIK</p>
                        </div>

                        {/* Footer */}
                        <div className="mt-20 space-y-2 text-2xl">
                            <p>Kementerian Pendidikan Tinggi,</p>
                            <p>Sains, dan Teknologi</p>

                            <p className="mt-8 text-2xl">Tahun {year}</p>
                        </div>
                    </div>
                </div>

                {/* =================== HALAMAN 2 =================== */}
                <div
                    className="mx-auto my-4 min-h-[1123px] w-[794px] bg-white px-16 py-12 text-black shadow-md"
                    style={{
                        pageBreakAfter: 'always',
                        fontFamily: '"Times New Roman", serif',
                    }}
                >
                    {/* Header */}
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
                                Kementerian Pendidikan Tinggi, Sains, dan
                                Teknologi
                            </span>
                        </div>

                        <div className="flex">
                            <span className="w-[210px]">PTN/Kopertis</span>
                            <span className="mx-2">:</span>
                            <span>Politeknik Negeri Jakarta</span>
                        </div>

                        <div className="flex">
                            <span className="w-[210px]">Unit Kerja</span>
                            <span className="mx-2">:</span>
                            <span>Jurusan Teknik Informatika dan Komputer</span>
                        </div>

                        <div className="flex items-start">
                            <span className="w-[210px]">Kegiatan</span>
                            <span className="mx-2">:</span>
                            <span>
                                Pelatihan dan Sertifikasi Dosen ENSA
                                <br />
                                <span className="text-[14px] italic">
                                    (Enterprise Networking Security and
                                    Automation)
                                </span>
                            </span>
                        </div>
                    </div>
                    {/* Baris Program – Indikator Kerja + Tabel (SEJEJAR) */}
                    <div className="mb-4 flex items-start">
                        {/* Kolom kiri: label */}
                        <span className="w-[210px]">
                            Program – Indikator Kerja
                        </span>
                        <span className="mx-2">:</span>

                        {/* Kolom kanan: tabel (naik sedikit pakai -mt-1 atau -mt-2) */}
                        <div className="-mt-1">
                            <table className="w-[390px] border-collapse border border-black text-[14px] leading-tight">
                                <tbody>
                                    {/* Baris Program */}
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
                                                6.2.1.3 Peningkatan kualitas
                                                dosen melalui sertifikasi
                                                kompetensi dan bidang ilmu{'\n'}
                                                6.2.1.6 Peningkatan mutu dosen
                                                tetap
                                            </span>
                                        </td>
                                    </tr>

                                    {/* Baris Indikator Kinerja */}
                                    <tr>
                                        {/* Kolom kecil kosong */}
                                        <td className="w-[5px] border border-black px-3 py-2 align-top" />

                                        {/* Kolom teks indikator */}
                                        <td className="w-[310px] border border-black px-3 py-2 align-top">
                                            <span className="font-bold">
                                                Indikator Kinerja:
                                            </span>{' '}
                                            Persentase jumlah dosen yang
                                            memiliki sertifikasi kompetensi dan
                                            bidang ilmu
                                        </td>

                                        {/* Kolom target */}
                                        <td className="w-[60px] border border-black px-4 py-2 text-center align-middle">
                                            85%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* a. Latar Belakang */}
                    <section className="text-[14px] leading-relaxed">
                        <p className="text-[15px] font-bold">
                            A. Latar Belakang
                        </p>

                        <p className="mt-3 ml-4 font-bold">1. Dasar Hukum</p>

                        <ol className="ml-10 list-[lower-alpha] text-justify leading-relaxed">
                            <li>
                                Undang-Undang Nomor 17 Tahun 2003 tentang
                                Keuangan Negara;
                            </li>
                            <li>
                                Undang-Undang Nomor 20 Tahun 2003 tentang Sistem
                                Pendidikan Nasional;
                            </li>
                            <li>
                                Undang-Undang Nomor 12 Tahun 2012 tentang
                                Pendidikan Tinggi;
                            </li>
                            <li>
                                Peraturan Pemerintah Republik Indonesia Nomor 21
                                Tahun 2004 tentang Penyusunan Rencana Kerja dan
                                Anggaran Kementerian Negara/Lembaga;
                            </li>
                            <li>
                                Peraturan Pemerintah Nomor 90 Tahun 2010 tentang
                                Penyusunan RKA-K/L;
                            </li>
                            <li>
                                Peraturan Pemerintah Nomor 17 Tahun 2010 tentang
                                Pengelolaan dan Penyelenggaraan Pendidikan;
                            </li>
                            <li>
                                Peraturan Pemerintah Nomor 4 Tahun 2014 tentang
                                Penyelenggaraan Pendidikan Tinggi dan
                                Pengelolaan Perguruan Tinggi;
                            </li>
                            <li>
                                Peraturan Pemerintah Nomor 9 Tahun 2018 tentang
                                Penerimaan Negara Bukan Pajak;
                            </li>
                            <li>
                                Rencana Strategis Politeknik Negeri Jakarta
                                Tahun 2020–2024.
                            </li>
                        </ol>

                        <p className="mt-5 ml-4 font-bold">2. Gambaran Umum</p>

                        {detail?.gambaran_umum ? (
                            <div
                                className="mt-1 ml-6 text-justify"
                                dangerouslySetInnerHTML={{
                                    __html: detail.gambaran_umum,
                                }}
                            />
                        ) : (
                            <p className="mt-1 ml-6 text-justify text-[14px]">
                                Pelatihan ENSA (Enterprise Networking Security
                                and Automation) diselenggarakan untuk
                                meningkatkan kompetensi dosen dalam bidang
                                jaringan dan keamanan jaringan, serta mendukung
                                pengembangan kurikulum yang responsif terhadap
                                kebutuhan industri.
                            </p>
                        )}
                        {/* ================= B. Penerima Manfaat ================= */}
                        <p className="mt-6 text-[15px] font-bold">
                            B. Penerima Manfaat
                        </p>

                        <p className="mt-1 ml-6 text-justify">
                            Kegiatan pelatihan CCNA SRWE ini dilaksanakan dalam
                            rangka meningkatkan kompetensi dosen Program Studi
                            TMJ dalam menyelenggarakan pembelajaran terutama
                            mata kuliah Jaringan Komputer Lanjut. Luaran
                            (output) kegiatan ini berupa Sertifikat Pelatihan
                            dan hasil (outcome) berupa kemampuan dalam
                            mengembangkan jaringan komputer.
                        </p>
                    </section>
                </div>

                {/* =================== HALAMAN 3 =================== */}
                <div
                    className="mx-auto my-4 min-h-[1123px] w-[794px] bg-white px-16 py-12 text-black shadow-md"
                    style={{
                        pageBreakAfter: 'always',
                        fontFamily: '"Times New Roman", serif',
                    }}
                >
                    <section className="text-[14px] leading-relaxed">
                        {/* ================= C. STRATEGI PENCAPAIAN KELUARAN ================= */}
                        <p className="mt-6 ml-4 text-[15px] font-bold">
                            C. Strategi Pencapaian Keluaran
                        </p>

                        {/* ================= 1. Metode Pelaksanaan ================= */}
                        <p className="mt-2 ml-6 font-bold">
                            1. Metode Pelaksanaan
                        </p>

                        <ol className="mt-1 ml-10 list-decimal text-justify text-[14px] leading-relaxed">
                            <li>
                                Dosen peserta Pelatihan CCNA SRWE mengikuti
                                pelatihan yang diselenggarakan oleh CISCO
                                ACADEMY secara Online, dengan silabus materi
                                pelatihan terlampir.
                            </li>

                            <li>
                                Waktu Pelaksanaan
                                <p>
                                    Pelatihan CCNA SRWE ini dilaksanakan dalam
                                    jangka waktu 3 Minggu yaitu : 19 Agustus – 6
                                    September 2024, pada pukul 13.00 – 15.00 WIB
                                    (24 jam).
                                </p>
                            </li>
                        </ol>

                        {/* ================= 2. Indikator Kinerja ================= */}
                        <p className="mt-4 ml-6 text-[15px] font-bold">
                            2. Indikator Kinerja
                        </p>

                        <div className="mt-2 ml-6 flex justify-start">
                            <table className="border-collapse border border-black text-[13px]">
                                <thead>
                                    <tr>
                                        <th className="w-[40px] border border-black px-3 py-2">
                                            No
                                        </th>
                                        <th className="w-[120px] border border-black px-3 py-2">
                                            Bulan
                                        </th>
                                        <th className="w-[260px] border border-black px-3 py-2">
                                            Indikator Keberhasilan
                                        </th>
                                        <th className="w-[80px] border border-black px-3 py-2">
                                            Target
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            1
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Agustus
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Rencana Kegiatan
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center">
                                            50%
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            2
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            September
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Pelatihan dan sertifikasi kompetensi
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center">
                                            100%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* ================= D. KURUN WAKTU PELAKSANAAN ================= */}
                        <p className="mt-6 ml-4 text-[15px] font-bold">
                            D. Kurun Waktu Pelaksanaan
                        </p>

                        <p className="mt-1 ml-6 text-justify text-[14px] leading-relaxed">
                            Kegiatan Pelatihan dan Sertifikasi Kompetensi Dosen
                            ini akan dilaksanakan dalam jangka waktu 2 bulan
                            dimulai dari Agustus sampai dengan September {year}.
                        </p>

                        {/* ================= E. BIAYA YANG DIPERLUKAN ================= */}
                        <p className="mt-6 ml-4 text-[15px] font-bold">
                            E. Biaya Yang Diperlukan
                        </p>

                        <p className="mt-1 ml-6 text-justify text-[14px] leading-relaxed">
                            Biaya yang diperlukan untuk pelaksanaan kegiatan ini
                            sebesar Rp21.000.000,-
                        </p>

                        {/* =============== TABEL RAB =============== */}
                        <div className="mt-4 ml-4 flex justify-start">
                            <table className="border-collapse border border-black text-[13px]">
                                <thead>
                                    <tr className="bg-slate-200">
                                        <th className="w-[100px] border border-black px-3 py-2">
                                            Kode Akun
                                        </th>
                                        <th className="w-[200px] border border-black px-3 py-2">
                                            Uraian
                                        </th>
                                        <th className="w-[200px] border border-black px-3 py-2">
                                            Rincian
                                        </th>
                                        <th className="w-[80px] border border-black px-3 py-2">
                                            Satuan
                                        </th>
                                        <th className="w-[80px] border border-black px-3 py-2">
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/* BARIS UTAMA */}
                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            525112
                                        </td>
                                        <td className="border border-black px-3 py-2 font-bold">
                                            Belanja Barang
                                        </td>
                                        <td className="border border-black px-3 py-2"></td>
                                        <td className="border border-black px-3 py-2"></td>
                                        <td className="border border-black px-3 py-2"></td>
                                    </tr>

                                    {/* SUB-ITEM */}
                                    <tr>
                                        <td className="border border-black px-3 py-2"></td>
                                        <td className="border border-black px-3 py-2">
                                            CCNA: Switching, Routing, and
                                            Wireless Essentials
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            6 ORG × 1 KALI × Rp 3.500.000
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center">
                                            OK
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center">
                                            Rp 21.000.000
                                        </td>
                                    </tr>

                                    {/* BARIS TOTAL */}
                                    <tr>
                                        <td
                                            className="border border-black px-3 py-2 text-right font-bold"
                                            colSpan={4}
                                        >
                                            Total
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center font-bold">
                                            Rp 21.000.000
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* =============== TANDA TANGAN =============== */}
                        <div className="mt-10 flex justify-end pr-10">
                            <div className="text-right text-[14px] leading-relaxed">
                                <p>Depok, 16 Agustus {year}</p>
                                <p>Penanggung jawab,</p>

                                {/* Tanda tangan */}
                                <div className="mt-8 mb-2 flex justify-end">
                                    <img
                                        src="/images/ttd_placeholder.png" // ganti file ttd jika ada
                                        alt="Tanda Tangan"
                                        className="h-20 w-auto"
                                    />
                                </div>

                                <p className="font-bold">
                                    Dr., Anita Hidayati, S.Kom., M.Kom
                                </p>
                                <p>NIP. 197908032003122003</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
