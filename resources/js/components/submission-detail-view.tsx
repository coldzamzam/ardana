import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DetailAnggota from '@/pages/tor/detail-anggota';
import DetailBiaya from '@/pages/tor/detail-biaya';
import DetailFile from '@/pages/tor/detail-file';
import DetailIndikator from '@/pages/tor/detail-indikator';
import { Submisi } from '@/types';
import TiptapEditor from './tiptap-editor';

interface SubmissionDetailViewProps {
    submisi: Submisi;
}

export default function SubmissionDetailView({
    submisi,
}: SubmissionDetailViewProps) {
    const data = {
        indikator_kinerja: submisi.detail_submisi?.iku || '',
        tanggal_mulai: submisi.detail_submisi?.tanggal_mulai || '',
        tanggal_selesai: submisi.detail_submisi?.tanggal_selesai || '',
        gambaran_umum: submisi.detail_submisi?.gambaran_umum || '',
        tujuan: submisi.detail_submisi?.tujuan || '',
        manfaat: submisi.detail_submisi?.manfaat || '',
        metode_pelaksanaan: submisi.detail_submisi?.metode_pelaksanaan || '',
        waktu_pelaksanaan: submisi.detail_submisi?.waktu_pelaksanaan || '',
        pic_id: submisi.detail_submisi?.pic_id || '',
    };

    return (
        <>
            <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#427452]">
                        Detail TOR
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="space-y-1 md:w-1/2">
                        <Label>Indikator Kinerja</Label>
                        <Input
                            value={data.indikator_kinerja}
                            readOnly
                            className="bg-neutral-100"
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label>Tanggal Mulai</Label>
                            <Input
                                type="date"
                                value={data.tanggal_mulai}
                                readOnly
                                className="bg-neutral-100"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Tanggal Selesai</Label>
                            <Input
                                type="date"
                                value={data.tanggal_selesai}
                                readOnly
                                className="bg-neutral-100"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Gambaran Umum</Label>
                        <div className="rounded-lg border bg-white p-2">
                            <TiptapEditor
                                content={data.gambaran_umum}
                                editable={false}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Tujuan</Label>
                        <div className="rounded-lg border bg-white p-2">
                            <TiptapEditor
                                content={data.tujuan}
                                editable={false}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Manfaat</Label>
                        <div className="rounded-lg border bg-white p-2">
                            <TiptapEditor
                                content={data.manfaat}
                                editable={false}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Metode Pelaksanaan</Label>
                        <div className="rounded-lg border bg-white p-2">
                            <TiptapEditor
                                content={data.metode_pelaksanaan}
                                editable={false}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Waktu Pelaksanaan</Label>
                        <div className="rounded-lg border bg-white p-2">
                            <TiptapEditor
                                content={data.waktu_pelaksanaan}
                                editable={false}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                    <div className="space-y-1 md:w-1/2">
                        <Label>PIC</Label>
                        <Input
                            value={submisi.detail_submisi?.pic?.name || 'N/A'}
                            readOnly
                            className="bg-neutral-100"
                        />
                    </div>
                </CardContent>
            </Card>

            <DetailAnggota submisi={submisi} isEditable={false} />
            <DetailIndikator submisi={submisi} isEditable={false} />
            <DetailFile submisi={submisi} isEditable={false} />
            <DetailBiaya submisi={submisi} isEditable={false} />
        </>
    );
}
