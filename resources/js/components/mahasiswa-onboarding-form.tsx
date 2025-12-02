import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (
            window.confirm(
                'Apakah Anda yakin semua informasi sudah benar? NIM tidak bisa diubah setelah disimpan.',
            )
        ) {
            post('/dashboard/onboarding/mahasiswa');
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="nim">NIM</Label>
                    <Input
                        id="nim"
                        type="text"
                        required
                        autoFocus
                        name="nim"
                        placeholder="10-digit NIM"
                        value={data.nim}
                        onChange={(e) => setData('nim', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        NIM tidak bisa diubah setelah disimpan.
                    </p>
                    <InputError message={errors.nim} className="mt-2" />
                </div>

                <div className="grid gap-2">
                    <Label>Prodi</Label>
                    <Select
                        name="prodi"
                        required
                        onValueChange={(value) => setData('prodi', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                        <SelectContent>
                            {prodiOptions.map((prodi) => (
                                <SelectItem key={prodi} value={prodi}>
                                    {prodi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.prodi} />
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
