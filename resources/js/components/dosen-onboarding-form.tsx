import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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

    const [showConfirm, setShowConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowConfirm(true); // buka dialog konfirmasi dulu
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

                    {/* BUTTON */}
                    <Button
                        type="submit"
                        className="mt-2 w-full rounded-lg bg-[#427452] hover:bg-[#365d42]"
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Simpan Informasi
                    </Button>
                </div>
            </form>

            {/* KONFIRMASI MODERN */}
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
