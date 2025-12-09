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
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    {/* NIP */}
                    <div className="grid gap-2">
                        <Label htmlFor="nip">NIP</Label>
                        <Input
                            id="nip"
                            type="text"
                            required
                            autoFocus
                            name="nip"
                            placeholder="18-digit NIP"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            NIP tidak bisa diubah setelah disimpan.
                        </p>
                        <InputError message={errors.nip} className="mt-1" />
                    </div>

                    {/* Checkbox S&K */}
                    <div className="mt-2 flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={isTermsChecked}
                            onCheckedChange={(checkedState) => {
                                const isChecked = checkedState === true;
                                setIsTermsChecked(isChecked);
                            }}
                        />
                        <Label
                            htmlFor="terms"
                            className="text-sm leading-none font-medium"
                        >
                            {' '}
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 align-baseline"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Saya menyetujui semua persyaratan yang berlaku
                                S&K
                            </Button>
                            .
                        </Label>
                    </div>

                    {/* BUTTON */}
                    <Button
                        type="submit"
                        className="mt-2 w-full rounded-lg bg-[#427452] hover:bg-[#365d42]"
                        disabled={processing || !isTermsChecked}
                    >
                        {processing && <Spinner />}
                        Simpan Informasi
                    </Button>
                </div>
            </form>

            {/* Dialog S&K */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[425px] md:w-full">
                    <DialogHeader>
                        <DialogTitle>Syarat & Ketentuan</DialogTitle>
                        <DialogDescription>
                            Harap baca dan pahami semua persyaratan sebelum
                            melanjutkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto py-4 text-sm">
                        <div className="space-y-4 px-2 text-justify">
                            <p>
                                Dengan membuat akun dan menggunakan platform
                                ARDANA (Sistem Manajemen Pengelolaan Dana
                                Kegiatan Jurusan), Anda sebagai Dosen/Pegawai
                                (selanjutnya disebut "Pengguna") menyatakan
                                telah membaca, memahami, dan menyetujui setiap
                                poin dalam Syarat dan Ketentuan ini.
                            </p>
                            <ol className="list-decimal space-y-3 pl-5">
                                <li>
                                    <strong className="font-semibold">
                                        Akurasi Data Pengguna:
                                    </strong>
                                    <ul className="mt-1 list-[circle] space-y-1 pl-5">
                                        <li>
                                            Pengguna wajib memberikan data yang
                                            akurat, valid, dan terkini saat
                                            melakukan pendaftaran, terutama
                                            Nomor Induk Pegawai (NIP).
                                        </li>
                                        <li>
                                            Informasi yang telah disimpan,
                                            khususnya NIP, bersifat final dan
                                            tidak dapat diubah.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong className="font-semibold">
                                        Peran dan Tanggung Jawab:
                                    </strong>
                                    <ul className="mt-1 list-[circle] space-y-1 pl-5">
                                        <li>
                                            Pengguna bertanggung jawab
                                            mengevaluasi setiap submisi secara
                                            objektif, adil, dan sesuai pedoman.
                                        </li>
                                        <li>
                                            Kerahasiaan data dan informasi dalam
                                            submisi harus dijaga dengan baik.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong className="font-semibold">
                                        Penggunaan Sistem:
                                    </strong>
                                    <ul className="mt-1 list-[circle] space-y-1 pl-5">
                                        <li>
                                            Sistem ARDANA digunakan hanya untuk
                                            tujuan meninjau dan mengelola proses
                                            pengajuan pendanaan kegiatan
                                            kemahasiswaan.
                                        </li>
                                        <li>
                                            Dilarang menyalahgunakan wewenang
                                            atau sistem untuk aktivitas yang
                                            melanggar hukum atau etika akademik
                                            yang berlaku di institusi.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong className="font-semibold">
                                        Integritas Keputusan:
                                    </strong>
                                    <ul className="mt-1 list-[circle] space-y-1 pl-5">
                                        <li>
                                            Keputusan harus didasarkan pada
                                            kriteria yang jelas, tanpa konflik
                                            kepentingan.
                                        </li>
                                        <li>
                                            Setiap masukan atau penolakan harus
                                            disertai alasan yang konstruktif.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong className="font-semibold">
                                        Keamanan Akun:
                                    </strong>
                                    <ul className="mt-1 list-[circle] space-y-1 pl-5">
                                        <li>
                                            Pengguna bertanggung jawab menjaga
                                            kerahasiaan informasi login akunnya.
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                            <p className="pt-2">
                                Dengan menyetujui dokumen ini, Anda terikat pada
                                semua ketentuan yang telah disebutkan di atas.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleModalClose}>
                                Saya Mengerti
                            </Button>
                        </DialogClose>
                    </DialogFooter>
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

                    <AlertDialogFooter>
                        <AlertDialogCancel className="mt-0 rounded-md">
                            Batal
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleConfirm}
                            className="rounded-md bg-[#427452] hover:bg-[#365d42]"
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
