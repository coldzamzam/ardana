import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function DosenOnboardingForm() {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (window.confirm('Apakah Anda yakin semua informasi sudah benar? NIP tidak bisa diubah setelah disimpan.')) {
            post('/onboarding/dosen');
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-6">
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
                    <InputError message={errors.nip} className="mt-2" />
                </div>

                <Button
                    type="submit"
                    className="mt-2 w-full"
                    disabled={processing}
                >
                    {processing && <Spinner />}
                    Simpan Informasi
                </Button>
            </div>
        </form>
    );
}
