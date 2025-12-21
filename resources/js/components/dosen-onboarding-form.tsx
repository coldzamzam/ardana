import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
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
import { Spinner } from '@/components/ui/spinner';

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

export default function DosenOnboardingForm() {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
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

        // safeguard tambahan walaupun tombol sudah disabled jika !isTermsChecked
        if (!isTermsChecked) return;

        // buka dialog konfirmasi modern (bukan window.confirm)
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        post('/dashboard/onboarding/dosen', {
            onFinish: () => setShowConfirm(false),
        });
    };

    return (
        <>
            <form onSubmit={submit} className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-4 sm:gap-5">
                    {/* NIP */}
                    <div className="grid gap-2">
                        <Label htmlFor="nip" className="text-sm font-medium">
                            NIP
                        </Label>
                        <Input
                            id="nip"
                            type="text"
                            required
                            autoFocus
                            name="nip"
                            placeholder="18-digit NIP"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                            /* REVISI: Mobile h-11 & text-base (mencegah zoom auto iOS), Desktop h-10 & text-sm */
                            className="h-11 text-base sm:h-10 sm:text-sm"
                        />
                        {/* REVISI: text-xs (12px) agar lebih terbaca di HP daripada text-[11px] */}
                        <p className="text-xs text-muted-foreground">
                            NIP tidak bisa diubah setelah disimpan.
                        </p>
                        <InputError message={errors.nip} className="mt-1" />
                    </div>

                    {/* Checkbox S&K */}
                    <div className="mt-1 flex items-start space-x-3 sm:space-x-2">
                        <Checkbox
                            id="terms"
                            /* REVISI: mt-0.5 agar sejajar baris pertama teks, shrink-0 agar kotak tidak gepeng */
                            className="mt-0.5 h-4 w-4 shrink-0 sm:mt-1"
                            checked={isTermsChecked}
                            onCheckedChange={(checkedState) => {
                                const isChecked = checkedState === true;
                                setIsTermsChecked(isChecked);
                            }}
                        />
                        <Label
                            htmlFor="terms"
                            /* REVISI: leading-tight agar spasi antar baris rapat saat teks turun ke bawah di layar kecil */
                            className="text-xs leading-tight text-muted-foreground sm:text-sm sm:leading-normal"
                        >
                            <span className="mr-1">
                                Saya menyetujui semua persyaratan yang berlaku
                            </span>
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-xs font-bold text-primary underline decoration-primary/50 underline-offset-2 sm:text-sm"
                                onClick={() => setIsModalOpen(true)}
                            >
                                S&K
                            </Button>
                            .
                        </Label>
                    </div>

                    {/* BUTTON */}
                    <Button
                        type="submit"
                        /* REVISI: Fixed height h-12 (48px) standar jempol di mobile, h-10 di desktop */
                        className="mt-2 h-12 w-full rounded-lg bg-[#427452] text-sm font-semibold hover:bg-[#365d42] sm:h-10"
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
                    {/* Animasi halus */}
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
                                            Harap baca dan pahami seluruh
                                            ketentuan sebelum melanjutkan.
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>
                        </div>

                        {/* BODY (scroll area – hanya ini yang scroll) */}
                        <div className="tnc-scroll flex-1 overflow-y-auto px-6 py-5">
                            {/* Callout ringkas */}
                            <div className="mb-4 rounded-2xl border border-[#73AD86]/25 bg-[#73AD86]/10 p-4 text-sm text-[#193422]">
                                <p className="font-semibold">
                                    Ringkasan penting:
                                </p>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                    <li>
                                        Data identitas (terutama NIP) harus
                                        benar dan tidak bisa diubah.
                                    </li>
                                    <li>
                                        Evaluasi submisi wajib objektif dan
                                        sesuai pedoman.
                                    </li>
                                    <li>
                                        Informasi submisi bersifat rahasia dan
                                        tidak untuk disebarkan.
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                                <p className="text-justify">
                                    Dengan membuat akun dan menggunakan platform
                                    ARDANA (Sistem Manajemen Pengelolaan Dana
                                    Kegiatan Jurusan), Anda sebagai
                                    Dosen/Pegawai menyatakan telah membaca,
                                    memahami, dan menyetujui setiap poin dalam
                                    Syarat dan Ketentuan ini.
                                </p>

                                <ol className="space-y-4">
                                    {/* 1 */}
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
                                                    data akurat dan valid,
                                                    terutama <b>NIP</b>.
                                                </li>
                                                <li>
                                                    NIP bersifat <b>final</b>{' '}
                                                    dan tidak dapat diubah.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 2 */}
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            2
                                        </div>

                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Peran dan Tanggung Jawab
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Evaluasi submisi harus
                                                    objektif dan sesuai pedoman.
                                                </li>
                                                <li>
                                                    Jaga kerahasiaan data
                                                    submisi.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 3 */}
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
                                                    Hanya untuk pengajuan &
                                                    pengelolaan pendanaan
                                                    kegiatan.
                                                </li>
                                                <li>
                                                    Dilarang menyalahgunakan
                                                    sistem untuk hal melanggar
                                                    hukum/etika.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 4 */}
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            4
                                        </div>

                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Integritas Keputusan
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Keputusan berdasarkan
                                                    kriteria jelas, tanpa
                                                    konflik kepentingan.
                                                </li>
                                                <li>
                                                    Masukan/penolakan disertai
                                                    alasan konstruktif.
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                    {/* 5 */}
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73AD86]/25 text-sm font-bold text-[#193422] ring-1 ring-[#73AD86]/30">
                                            5
                                        </div>

                                        <div className="flex-1 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                Keamanan Akun
                                            </p>
                                            <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                <li>
                                                    Pengguna bertanggung jawab
                                                    menjaga kerahasiaan login.
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
                                        terikat pada semua ketentuan di atas.
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

            {/* KONFIRMASI MODERN (dari kode pertama) */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold text-slate-900">
                            Simpan informasi ini?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-sm text-slate-600">
                            Pastikan NIP Anda sudah benar.{' '}
                            <span className="font-medium text-[#427452]">
                                NIP tidak dapat diubah setelah disimpan.
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
