import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Submisi, StatusType } from '@/types';
import InputError from '@/components/input-error';

interface SubmissionActionCardProps {
    submisi: Submisi;
    availableStatuses: StatusType[];
}

export default function SubmissionActionCard({ submisi, availableStatuses }: SubmissionActionCardProps) {
    const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        status_type_id: '',
        keterangan: '',
    });

    const handleStatusChange = (value: string) => {
        const status = availableStatuses.find(s => s.id === value) || null;
        setSelectedStatus(status);
        setData('status_type_id', value);
    };

    const needsKeterangan = selectedStatus?.nama.trim() === 'Revisi' || selectedStatus?.nama.trim() === 'Ditolak';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/dashboard/review/${submisi.id}/status`);
    };

    return (
        <Card className="overflow-hidden rounded-2xl border border-blue-500/40 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-700">
                    Tindakan Review
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="status">Pilih Status</Label>
                        <Select onValueChange={handleStatusChange} value={data.status_type_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status untuk submisi ini..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableStatuses.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                        {status.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status_type_id} />
                    </div>

                    {needsKeterangan && (
                        <div className="space-y-1">
                            <Label htmlFor="keterangan">Catatan Revisi / Penolakan</Label>
                            <Textarea
                                id="keterangan"
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                placeholder="Jelaskan alasan revisi atau penolakan..."
                            />
                            <InputError message={errors.keterangan} />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Memproses...' : 'Kirim'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}