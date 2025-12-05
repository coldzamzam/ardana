import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem, Submisi } from '@/types';


interface DetailTemplateProps {
    submisi: Submisi;
}

export default function DetailTemplate({ submisi }: DetailTemplateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'TOR', href: '/dashboard/tor' },
        { title: 'Template TOR', href: window.location.pathname },
    ];

    const year =
        submisi.detail_submisi?.tanggal_mulai
            ? new Date(submisi.detail_submisi.tanggal_mulai).getFullYear()
            : new Date().getFullYear();

    const handlePrintTor = () => {
        window.print();
    };

    const handleDownloadTor = () => {
        // OPTION 1: pakai URL langsung
        router.get(`/dashboard/tor/${submisi.id}/template/download`);

        // OPTION 2 (kalau pakai Ziggy & route bernama):
        // router.get(route('tor.template.download', submisi.id));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Template TOR - ${submisi.judul}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto bg-slate-100 p-4 print:bg-white">
                {/* =================== HALAMAN 1 – COVER =================== */}
                            <div className="mb-4 flex justify-end gap-3 print:hidden">
                <Button
                    type="button"
                    variant="outline"
                    className="border-slate-400 text-slate-700 hover:bg-slate-100"
                    onClick={handlePrintTor}
                >
                    Print TOR
                </Button>

                <Button
                    type="button"
                    className="bg-[#2B6CB0] text-white hover:bg-[#245a94]"
                    onClick={handleDownloadTor}
                >
                    Download TOR
                </Button>
            </div>
                <div
                    className="mx-auto my-4 w-[794px] min-h-[1123px] bg-white p-12 shadow-md border border-black"
                    style={{ pageBreakAfter: 'always' as any }}
                >
                    <div className="flex h-full flex-col items-center justify-between">
                        {/* Logo */}
                        <div className="mt-4 flex flex-col items-center gap-4">
                            {/* Ganti src logo sesuai path di project-mu */}
                            <img
                                src="/images/logo_sidana.png"
                                alt="Logo Politeknik Negeri Jakarta"
                                className="h-28 w-auto"
                            />

                            <div className="mt-4 text-center text-sm leading-relaxed">
                                <p className="font-semibold tracking-wide">
                                    KERANGKA ACUAN KERJA
                                </p>
                                <p className="mt-1 uppercase">
                                    TAHUN ANGGARAN {year}
                                </p>
                            </div>
                        </div>

                        {/* Judul Kegiatan */}
                        <div className="mt-8 max-w-md text-center text-sm leading-relaxed">
                            <p>Kegiatan :</p>
                            <p className="mt-2 font-semibold">
                                Pelatihan dan Sertifikasi
                            </p>
                            <p className="mt-1 font-semibold italic">
                                Kompetensi Dosen ENSA
                            </p>
                            <p className="italic text-xs">
                                (Enterprise Networking, Security and Automation)
                            </p>
                        </div>

                        {/* Unit Kerja */}
                        <div className="mt-10 max-w-md text-sm leading-relaxed">
                            <p>Unit Kerja :</p>
                            <p className="mt-1 font-semibold">
                                Jurusan Teknik Informatika dan Komputer
                            </p>
                        </div>

                        {/* Kementerian & Tahun */}
                        <div className="mb-8 mt-10 text-center text-sm leading-relaxed">
                            <p>Kementerian Pendidikan Tinggi,</p>
                            <p>Sains, dan Teknologi</p>

                            <p className="mt-6">Tahun {year}</p>
                        </div>
                    </div>
                </div>

                {/* =================== HALAMAN 2 – ISI LAPORAN =================== */}
                <div
                    className="mx-auto my-4 w-[794px] min-h-[1123px] bg-white px-12 py-10 shadow-md border border-black"
                    style={{ pageBreakAfter: 'always' as any }}
                >
                    {/* Header */}
                    <div className="mb-4 text-center text-xs leading-tight">
                        <p className="font-semibold uppercase">
                            KERANGKA ACUAN KERJA
                        </p>
                        <p className="mt-1">
                            Tahun Anggaran {year}
                        </p>
                        <p className="mt-2 text-[11px]">
                            Kementerian/Lembaga : Kementerian Pendidikan Tinggi, Sains, dan Teknologi
                        </p>
                        <p className="text-[11px]">
                            PTN/Keperitis : Politeknik Negeri Jakarta
                        </p>
                        <p className="text-[11px]">
                            Unit Kerja : Jurusan Teknik Informatika dan Komputer
                        </p>
                        <p className="text-[11px]">
                            Kegiatan : Pelatihan dan Sertifikasi Dosen ENSA
                        </p>
                    </div>

                    {/* Contoh tabel Program – Indikator Kinerja (sederhana) */}
                    <div className="mb-6 mt-4 text-[11px]">
                        <table className="w-full table-fixed border-collapse border border-black text-[11px]">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-black px-2 py-1 w-1/3">
                                        Program
                                    </th>
                                    <th className="border border-black px-2 py-1 w-1/3">
                                        Indikator Kinerja
                                    </th>
                                    <th className="border border-black px-2 py-1 w-1/3">
                                        Target
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black px-2 py-1 align-top">
                                        Peningkatan kualitas dosen melalui
                                        sertifikasi kompetensi di bidang jaringan
                                        dan keamanan.
                                    </td>
                                    <td className="border border-black px-2 py-1 align-top">
                                        Persentase dosen yang mengikuti dan
                                        lulus pelatihan/sertifikasi ENSA.
                                    </td>
                                    <td className="border border-black px-2 py-1 align-top text-center">
                                        85%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* A. Latar Belakang */}
                    <section className="mt-4 space-y-2 text-[11px] leading-relaxed">
                        <h2 className="font-bold">A. Latar Belakang</h2>

                        <h3 className="mt-1 font-semibold">1. Dasar Hukum</h3>
                        <ol className="ml-4 list-decimal space-y-1">
                            <li>Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara.</li>
                            <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.</li>
                            <li>Undang-Undang Nomor 12 Tahun 2012 tentang Pendidikan Tinggi.</li>
                            <li>
                                Peraturan Pemerintah Republik Indonesia Nomor 21 Tahun 2004 tentang
                                Penyusunan Rencana Kerja dan Anggaran Kementerian Negara/Lembaga.
                            </li>
                            <li>
                                Peraturan Pemerintah Nomor 90 Tahun 2010 tentang Penyusunan RKA-K/L.
                            </li>
                            <li>
                                Peraturan Pemerintah Nomor 17 Tahun 2010 tentang Pengelolaan dan
                                Penyelenggaraan Pendidikan.
                            </li>
                            <li>
                                Rencana Strategis Politeknik Negeri Jakarta serta Rencana Strategis
                                Jurusan Teknik Informatika dan Komputer.
                            </li>
                        </ol>

                        <h3 className="mt-2 font-semibold">2. Gambaran Umum</h3>
                        <p>
                            Pelatihan ENSA (Enterprise Networking, Security and Automation)
                            diselenggarakan untuk meningkatkan kompetensi dosen Program Studi
                            di bidang Jaringan dan Keamanan Jaringan. Kegiatan ini dirancang
                            untuk membekali dosen dengan keterampilan praktis yang relevan
                            dengan kebutuhan industri, khususnya terkait manajemen jaringan,
                            keamanan, dan otomatisasi jaringan. Hasil dari pelatihan ini
                            diharapkan dapat diintegrasikan dalam kurikulum dan proses
                            pembelajaran sehingga mendukung peningkatan mutu lulusan.
                        </p>
                    </section>

                    {/* B. Penerima Manfaat */}
                    <section className="mt-4 space-y-2 text-[11px] leading-relaxed">
                        <h2 className="font-bold">B. Penerima Manfaat</h2>
                        <p>
                            Kegiatan pelatihan dan sertifikasi ENSA ini dilaksanakan dalam
                            rangka meningkatkan kompetensi dosen Program Studi di bawah Jurusan
                            Teknik Informatika dan Komputer. Peserta pelatihan ditargetkan
                            berasal dari dosen pengampu mata kuliah yang berkaitan dengan
                            jaringan komputer dan keamanan jaringan.
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                            <li>
                                <span className="font-semibold">Dosen:</span> memperoleh
                                peningkatan kompetensi dan peluang sertifikasi.
                            </li>
                            <li>
                                <span className="font-semibold">Mahasiswa:</span> mendapatkan
                                materi pembelajaran yang lebih aplikatif dan mutakhir.
                            </li>
                            <li>
                                <span className="font-semibold">Institusi:</span> terbantu
                                dalam pencapaian indikator kinerja dan akreditasi.
                            </li>
                        </ul>
                    </section>

                    {/* C. Strategi Pencapaian Keluaran (ringkas) */}
                    <section className="mt-4 space-y-2 text-[11px] leading-relaxed">
                        <h2 className="font-bold">C. Strategi Pencapaian Keluaran</h2>

                        <h3 className="mt-1 font-semibold">1. Metode Pelaksanaan</h3>
                        <p>
                            Pelatihan ENSA akan diikuti oleh dosen homebase Program Studi di
                            lingkungan Jurusan Teknik Informatika dan Komputer. Kegiatan
                            dilaksanakan secara daring/luring dengan kombinasi pemaparan
                            materi, diskusi, dan praktik konfigurasi jaringan.
                        </p>
                        <ul className="ml-4 list-disc space-y-1">
                            <li>Pemaparan konsep jaringan, keamanan, dan otomatisasi.</li>
                            <li>Latihan konfigurasi perangkat dan studi kasus jaringan.</li>
                            <li>Diskusi dan tanya jawab terkait penerapan materi.</li>
                            <li>Persiapan ujian sertifikasi dari penyelenggara resmi.</li>
                        </ul>

                        <h3 className="mt-2 font-semibold">2. Indikator Kinerja</h3>
                        <table className="mt-1 w-full table-fixed border-collapse border border-black text-[11px]">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-black px-2 py-1 w-[60px]">
                                        No
                                    </th>
                                    <th className="border border-black px-2 py-1">
                                        Bulan
                                    </th>
                                    <th className="border border-black px-2 py-1">
                                        Indikator Keberhasilan
                                    </th>
                                    <th className="border border-black px-2 py-1 w-[80px]">
                                        Target
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black px-2 py-1 text-center">
                                        1
                                    </td>
                                    <td className="border border-black px-2 py-1">Agustus</td>
                                    <td className="border border-black px-2 py-1">
                                        Perencanaan kegiatan, koordinasi, dan
                                        penyiapan administrasi pelatihan.
                                    </td>
                                    <td className="border border-black px-2 py-1 text-center">
                                        50%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-2 py-1 text-center">
                                        2
                                    </td>
                                    <td className="border border-black px-2 py-1">September</td>
                                    <td className="border border-black px-2 py-1">
                                        Pelaksanaan pelatihan dan sertifikasi
                                        ENSA serta penyusunan laporan kegiatan.
                                    </td>
                                    <td className="border border-black px-2 py-1 text-center">
                                        100%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* D. Kurun Waktu Pelaksanaan */}
                    <section className="mt-4 space-y-2 text-[11px] leading-relaxed">
                        <h2 className="font-bold">D. Kurun Waktu Pelaksanaan</h2>
                        <p>
                            Kegiatan Pelatihan dan Sertifikasi Kompetensi ENSA ini akan
                            dilaksanakan dalam jangka waktu 4 (empat) hari pada tanggal
                            15–18 September {year}, secara online/berbasis daring melalui
                            platform yang ditetapkan penyelenggara.
                        </p>
                    </section>

                    {/* E. Biaya Yang Diperlukan (diisi lewat modul RAB di sistem) */}
                    <section className="mt-4 space-y-2 text-[11px] leading-relaxed">
                        <h2 className="font-bold">E. Biaya Yang Diperlukan</h2>
                        <p>
                            Biaya yang diperlukan untuk pelaksanaan kegiatan ini akan
                            dirinci dalam Rencana Anggaran Biaya (RAB) pada modul keuangan
                            sistem ARDANA, meliputi komponen belanja barang, pelatihan, dan
                            kebutuhan pendukung lainnya.
                        </p>
                        <p className="italic">
                            *Catatan: Rincian tabel RAB diinput melalui fitur RAB/biaya pada
                            sistem, dan akan tergenerate tersendiri pada dokumen akhir.*
                        </p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
