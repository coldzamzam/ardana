import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { prodiOptions } from '@/lib/constants';

export default function MahasiswaOnboardingForm() {
    const { data, setData, post, processing, errors } = useForm({
        nim: '',
        prodi: '',
    });

    // dari kode pertama: dialog konfirmasi
    const [showConfirm, setShowConfirm] = useState(false);

    // dari kode kedua: checkbox + modal S&K
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsTermsChecked(true); // otomatis centang setelah baca S&K
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // safeguard ekstra walaupun tombol sudah disabled kalau !isTermsChecked
        if (!isTermsChecked) return;

        // tampilkan dialog konfirmasi modern (bukan window.confirm)
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        post('/dashboard/onboarding/mahasiswa', {
            onFinish: () => setShowConfirm(false),
        });
    };

    return (
        <>
            <form onSubmit={submit} className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-4 sm:gap-5">
                    {/* NIM */}
                    <div className="grid gap-2">
                        <Label htmlFor="nim" className="text-sm font-medium">
                            NIM
                        </Label>
                        <Input
                            id="nim"
                            type="text"
                            required
                            autoFocus
                            name="nim"
                            placeholder="10-digit NIM"
                            value={data.nim}
                            onChange={(e) => setData('nim', e.target.value)}
                            /* REVISI: h-11 untuk mobile (touch friendly), h-10 untuk desktop */
                            className="h-11 text-base sm:h-10 sm:text-sm"
                        />
                        {/* REVISI: text-xs (12px) lebih terbaca daripada 11px */}
                        <p className="text-xs text-muted-foreground">
                            NIM tidak bisa diubah setelah disimpan.
                        </p>
                        <InputError message={errors.nim} className="mt-1" />
                    </div>

                    {/* PRODI */}
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium">Prodi</Label>
                        <Select
                            name="prodi"
                            required
                            onValueChange={(value) => setData('prodi', value)}
                        >
                            {/* REVISI: Tinggi trigger disamakan dengan input (h-11 mobile / h-10 desktop) */}
                            <SelectTrigger className="h-11 w-full text-base sm:h-10 sm:text-sm">
                                <SelectValue placeholder="Pilih program studi" />
                            </SelectTrigger>
                            <SelectContent>
                                {prodiOptions.map((prodi) => (
                                    <SelectItem
                                        key={prodi}
                                        value={prodi}
                                        className="text-sm sm:text-sm"
                                    >
                                        {prodi}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.prodi} className="mt-1" />
                    </div>

                    {/* Checkbox S&K */}
                    <div className="mt-1 flex items-start space-x-3 sm:space-x-2">
                        <Checkbox
                            id="terms"
                            /* REVISI: mt-0.5 agar sejajar dengan baris pertama teks */
                            className="mt-0.5 h-4 w-4 shrink-0 sm:mt-1"
                            checked={isTermsChecked}
                            onCheckedChange={(checkedState) => {
                                const isChecked = checkedState === true;
                                setIsTermsChecked(isChecked);
                            }}
                        />
                        <Label
                            htmlFor="terms"
                            className="text-xs leading-tight text-muted-foreground sm:text-sm sm:leading-normal"
                        >
                            <span className="mr-1">
                                Saya menyetujui semua persyaratan yang berlaku
                            </span>
                            <Button
                                type="button"
                                variant="link"
                                /* REVISI: h-auto dan p-0 agar tombol terlihat menyatu dengan teks */
                                className="h-auto p-0 text-xs font-bold text-primary underline decoration-primary/50 underline-offset-2 sm:text-sm"
                                onClick={() => setIsModalOpen(true)}
                            >
                                S&K
                            </Button>
                            .
                        </Label>
                    </div>

                    {/* BUTTON SUBMIT */}
                    <Button
                        type="submit"
                        /* REVISI: Menggunakan fixed height (h-12) di mobile agar gagah tapi rapi, h-10 di desktop */
                        className="mt-2 h-12 w-full rounded-lg bg-[#427452] text-sm font-semibold hover:bg-[#365d42] sm:h-10 sm:py-2"
                        disabled={processing || !isTermsChecked}
                    >
                        {processing && <Spinner className="mr-2 h-4 w-4" />}
                        Simpan Informasi
                    </Button>
                </div>
            </form>

            {/* Dialog S&K */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[85vh] w-[min(720px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-0 shadow-2xl backdrop-blur-xl dark:bg-zinc-950/70">
                    <style>{`
      @keyframes modalPop {
        0% { opacity: 0; transform: translateY(10px) scale(.98); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .tnc-pop { animation: modalPop .22s ease-out both; }

      .tnc-scroll::-webkit-scrollbar { width: 10px; }
      .tnc-scroll::-webkit-scrollbar-thumb {
        background: rgba(115,173,134,.35);
        border-radius: 999px;
        border: 3px solid rgba(255,255,255,.55);
      }
      .tnc-scroll::-webkit-scrollbar-track { background: transparent; }

      @media (prefers-reduced-motion: reduce) {
        .tnc-pop { animation: none !important; }
      }
    `}</style>

                    <div className="tnc-pop flex max-h-[85vh] flex-col">
                        {/* HEADER (fixed) */}
                        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#193422] via-[#2f5b3e] to-[#73AD86] px-6 py-5 text-white">
                            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                            <DialogHeader className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="h-5 w-5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9m-10 0l4 4m-4-4v8"
                                            />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <DialogTitle className="text-xl font-bold tracking-tight">
                                            Syarat & Ketentuan
                                        </DialogTitle>
                                        <DialogDescription className="text-white/85">
                                            Harap baca dan pahami semua
                                            persyaratan sebelum melanjutkan.
                                        </DialogDescription>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                                        Berlaku untuk Pengguna
                                    </span>
                                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                                        Data penting bersifat final
                                    </span>
                                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                                        Tanggung jawab dokumen
                                    </span>
                                </div>
                            </DialogHeader>
                        </div>

                        {/* BODY (scroll tunggal) */}
                        <div className="tnc-scroll flex-1 overflow-y-auto px-6 py-5">
                            {/* Ringkasan */}
                            <div className="mb-4 rounded-2xl border border-[#73AD86]/25 bg-[#73AD86]/10 p-4 text-sm text-[#193422]">
                                <p className="font-semibold">
                                    Ringkasan penting:
                                </p>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                    <li>
                                        Data (NIM, Nama, Prodi) harus valid dan
                                        akurat.
                                    </li>
                                    <li>
                                        Dokumen TOR/LPJ dan lampiran adalah
                                        tanggung jawab Pengguna.
                                    </li>
                                    <li>
                                        Keputusan peninjau bersifat final sesuai
                                        ketentuan jurusan.
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                                <p className="text-justify">
                                    Dengan membuat akun dan menggunakan platform
                                    ARDANA (Sistem Manajemen Pengelolaan Dana
                                    Kegiatan Jurusan), Anda menyatakan telah
                                    membaca, memahami, dan menyetujui setiap
                                    poin dalam Syarat dan Ketentuan ini.
                                </p>

                                {/* LIST dengan penomoran badge */}
                                <ol className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            1
                                        </div>
                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Akurasi Data Pengguna
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Pengguna wajib memberikan
                                                    data yang akurat, valid, dan
                                                    terkini saat melakukan
                                                    pendaftaran, termasuk NIM,
                                                    Nama Lengkap, dan Program
                                                    Studi.
                                                </li>
                                                <li>
                                                    Informasi yang telah
                                                    disimpan, khususnya NIM,
                                                    bersifat{' '}
                                                    <span className="font-semibold">
                                                        final
                                                    </span>{' '}
                                                    dan tidak dapat diubah.
                                                    Kesalahan data menjadi
                                                    tanggung jawab penuh
                                                    Pengguna.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            2
                                        </div>
                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Tanggung Jawab Submisi
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Pengguna bertanggung jawab
                                                    penuh atas semua konten yang
                                                    diunggah, termasuk proposal,
                                                    LPJ, dan dokumen pendukung.
                                                </li>
                                                <li>
                                                    Pengguna menjamin semua
                                                    dokumen adalah karya asli,
                                                    bebas plagiarisme, dan tidak
                                                    melanggar hak kekayaan
                                                    intelektual.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            3
                                        </div>
                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Penggunaan Sistem
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Sistem ARDANA digunakan
                                                    untuk pengajuan dan
                                                    pengelolaan pendanaan
                                                    kegiatan sesuai prosedur
                                                    jurusan.
                                                </li>
                                                <li>
                                                    Dilarang menyalahgunakan
                                                    sistem untuk aktivitas yang
                                                    melanggar hukum atau etika
                                                    akademik yang berlaku di
                                                    institusi.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            4
                                        </div>
                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Peninjauan dan Keputusan
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Semua submisi akan ditinjau
                                                    oleh tim yang ditunjuk
                                                    jurusan.
                                                </li>
                                                <li>
                                                    Keputusan tim peninjau
                                                    (disetujui, direvisi, atau
                                                    ditolak) bersifat{' '}
                                                    <span className="font-semibold">
                                                        mutlak
                                                    </span>
                                                    .
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ol>

                                <div className="rounded-2xl border border-[#193422]/15 bg-[#193422]/5 p-4">
                                    <p className="font-semibold text-[#193422] dark:text-white">
                                        Pernyataan Persetujuan
                                    </p>
                                    <p className="mt-1">
                                        Dengan menyetujui dokumen ini, Anda
                                        terikat pada semua ketentuan yang telah
                                        disebutkan di atas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER (fixed) */}
                        <div className="shrink-0 border-t border-zinc-200 bg-white/75 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
                            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                <p className="text-center text-xs text-zinc-600 sm:text-left dark:text-zinc-300">
                                    Dengan menekan tombol, Anda menyatakan sudah
                                    membaca dan memahami S&K.
                                </p>

                                <DialogFooter className="m-0 w-full sm:w-auto">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            onClick={handleModalClose}
                                            className="w-full rounded-full bg-[#427452] px-6 font-semibold text-white hover:bg-[#355C45] sm:w-auto"
                                        >
                                            Saya Mengerti
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ALERT DIALOG KONFIRMASI */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                            Simpan informasi ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-600">
                            Pastikan NIM dan prodi sudah benar.{' '}
                            <span className="font-medium text-[#427452]">
                                NIM tidak dapat diubah setelah disimpan.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2">
                        <AlertDialogCancel className="mt-0 w-full rounded-md sm:w-auto">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className="w-full rounded-md bg-[#427452] hover:bg-[#365d42] sm:w-auto"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Ya, simpan'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
