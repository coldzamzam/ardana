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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Syarat & Ketentuan</DialogTitle>
                        <DialogDescription>
                            Harap baca dan pahami semua persyaratan sebelum
                            melanjutkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto py-4 text-sm">
                        <p className="mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </p>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate
                            velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
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
