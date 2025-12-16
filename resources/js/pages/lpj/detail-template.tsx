import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// This component uses static dummy data and does not require any props.
export default function LpjDetailTemplate() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'LPJ', href: '#' },
        { title: 'Template LPJ', href: window.location.pathname },
    ];

    const year = new Date().getFullYear();

    const handlePrint = () => {
        window.print();
    };

    const dummyHtml =
        '<p>Ini adalah contoh teks untuk bagian ini. Data sesungguhnya akan diambil dari input pengguna saat fitur diimplementasikan penuh.</p>';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Template LPJ - [Judul Kegiatan Dummy]`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto bg-slate-100 p-4 text-black print:bg-white">
                <div className="fixed right-6 bottom-6 flex flex-col gap-2 print:hidden">
                    <Button
                        type="button"
                        className="bg-[#2B6CB0] px-6 py-3 text-white shadow-lg hover:bg-[#245a94]"
                        onClick={handlePrint}
                    >
                        Cetak Halaman
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
                    <div className="w-[520px] border border-black px-14 py-16 text-center leading-relaxed text-black">
                        <div className="mb-10 flex justify-center">
                            <img
                                src="/images/logo_pnj.jpg"
                                alt="Logo Politeknik Negeri Jakarta"
                                className="h-48 w-auto"
                            />
                        </div>

                        <p className="text-3xl tracking-wide">
                            LAPORAN PERTANGGUNGJAWABAN <br />
                            TAHUN ANGGARAN {year}
                        </p>

                        <div className="mt-14 space-y-2 text-2xl">
                            <p>Kegiatan :</p>
                            <p className="font-bold">
                                Contoh Judul Kegiatan LPJ
                            </p>
                        </div>

                        <div className="mt-16 text-2xl">
                            <p>Unit Kerja :</p>
                            <p>Jurusan Teknik Informatika dan Komputer</p>
                        </div>

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
                    <div className="mb-8 text-center leading-tight">
                        <p className="text-[15px] font-bold">
                            LAPORAN PERTANGGUNGJAWABAN
                        </p>
                        <p className="mt-1 text-[15px]">
                            Tahun Anggaran {year}
                        </p>
                    </div>

                    <section className="text-[14px] leading-relaxed">
                        <p className="text-[15px] font-bold">
                            A. Gambaran Umum
                        </p>
                        <div
                            className="mt-1 ml-6 text-justify"
                            dangerouslySetInnerHTML={{ __html: dummyHtml }}
                        />

                        <p className="mt-6 text-[15px] font-bold">B. Tujuan</p>
                        <div
                            className="mt-1 ml-6 text-justify"
                            dangerouslySetInnerHTML={{ __html: dummyHtml }}
                        />

                        <p className="mt-6 text-[15px] font-bold">
                            C. Hasil Kegiatan
                        </p>
                        <div
                            className="mt-1 ml-6 text-justify"
                            dangerouslySetInnerHTML={{
                                __html: '<p>Ini adalah bagian <strong>Hasil Kegiatan</strong>. Di sini akan dijelaskan capaian dan output dari kegiatan yang telah dilaksanakan.</p>',
                            }}
                        />

                        <p className="mt-6 text-[15px] font-bold">
                            D. Peserta Kegiatan
                        </p>
                        <div
                            className="mt-1 ml-6 text-justify"
                            dangerouslySetInnerHTML={{
                                __html: '<p>Ini adalah bagian <strong>Peserta Kegiatan</strong>. Berisi deskripsi tentang siapa saja yang berpartisipasi dalam kegiatan ini.</p>',
                            }}
                        />

                        <p className="mt-6 text-[15px] font-bold">
                            E. Waktu dan Metode Pelaksanaan
                        </p>
                        <div
                            className="mt-1 ml-6 text-justify"
                            dangerouslySetInnerHTML={{
                                __html: '<p>Waktu: [Tanggal Mulai] - [Tanggal Selesai]</p><p>Metode: [Metode Pelaksanaan]</p>',
                            }}
                        />
                    </section>
                </div>

                {/* =================== HALAMAN 3 =================== */}
                <div
                    className="mx-auto my-4 min-h-[1123px] w-[794px] bg-white px-16 py-12 text-black shadow-md"
                    style={{
                        fontFamily: '"Times New Roman", serif',
                    }}
                >
                    <section className="text-[14px] leading-relaxed">
                        <p className="mt-6 ml-4 text-[15px] font-bold">
                            F. Susunan Tim Pelaksana
                        </p>
                        <div className="mt-4 ml-4 flex justify-start">
                            <table className="w-full border-collapse border border-black text-[13px]">
                                <thead>
                                    <tr className="bg-slate-200">
                                        <th className="w-[10%] border border-black px-3 py-2">
                                            No
                                        </th>
                                        <th className="w-[40%] border border-black px-3 py-2">
                                            Nama
                                        </th>
                                        <th className="w-[25%] border border-black px-3 py-2">
                                            NIM/NIP
                                        </th>
                                        <th className="w-[25%] border border-black px-3 py-2">
                                            Jabatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            1
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            John Doe
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            1234567890
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Ketua Pelaksana
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            2
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Jane Smith
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            0987654321
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Sekretaris
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-6 ml-4 text-[15px] font-bold">
                            G. Rincian Penggunaan Dana
                        </p>
                        <div className="mt-4 ml-4 flex justify-start">
                            <table className="w-full border-collapse border border-black text-[13px]">
                                <thead>
                                    <tr className="bg-slate-200">
                                        <th className="w-[10%] border border-black px-3 py-2">
                                            No
                                        </th>
                                        <th className="w-[40%] border border-black px-3 py-2">
                                            Uraian
                                        </th>
                                        <th className="w-[15%] border border-black px-3 py-2">
                                            Kuantitas
                                        </th>
                                        <th className="w-[20%] border border-black px-3 py-2">
                                            Harga Satuan
                                        </th>
                                        <th className="w-[20%] border border-black px-3 py-2">
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            1
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Sewa Gedung
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center">
                                            1
                                        </td>
                                        <td className="border border-black px-3 py-2 text-right">
                                            Rp 1.000.000
                                        </td>
                                        <td className="border border-black px-3 py-2 text-right">
                                            Rp 1.000.000
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black px-3 py-2 text-center">
                                            2
                                        </td>
                                        <td className="border border-black px-3 py-2">
                                            Konsumsi Peserta
                                        </td>
                                        <td className="border border-black px-3 py-2 text-center">
                                            50
                                        </td>
                                        <td className="border border-black px-3 py-2 text-right">
                                            Rp 20.000
                                        </td>
                                        <td className="border border-black px-3 py-2 text-right">
                                            Rp 1.000.000
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            className="border border-black px-3 py-2 text-right font-bold"
                                            colSpan={4}
                                        >
                                            Total
                                        </td>
                                        <td className="border border-black px-3 py-2 text-right font-bold">
                                            Rp 2.000.000
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-10 flex justify-end pr-10">
                            <div className="text-right text-[14px] leading-relaxed">
                                <p>
                                    Depok,{' '}
                                    {new Date().toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                                <p>Penanggung jawab,</p>

                                <div className="h-24">
                                    {/* Space for signature */}
                                </div>

                                <p className="font-bold">(Nama PIC Dummy)</p>
                                <p>NIP. (NIP PIC Dummy)</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
