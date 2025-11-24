
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Submisi, Draft } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TiptapEditor from '@/components/tiptap-editor';
import { jenisKegiatanOptions } from '@/lib/constants';

interface TorDetailProps {
    submisi: Submisi;
    draft: Draft;
}

export default function TorDetail({ submisi, draft }: TorDetailProps) {
    const { data, setData, put, post, errors } = useForm({
        ...submisi,
        ...draft
    });

    const IKU = ['IKU 1', 'IKU 2', 'IKU 3', 'IKU 4', 'IKU 5', 'IKU 6', 'IKU 7', 'IKU 8'];

    const handleUpdate = () => {
        put(`/tor/${submisi.id}`);
    };

    const handleSaveDraft = () => {
        post(`/tor/${submisi.id}/draft`);
    };

    return (
        <AppLayout>
            <Head title={`Detail TOR - ${submisi.judul}`} />
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Detail TOR</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div>
                            <Label htmlFor='judul'>Judul</Label>
                            <Input
                                id='judul'
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                onBlur={handleUpdate}
                            />
                        </div>
                        <div>
                            <Label htmlFor='jenis_kegiatan'>Jenis Kegiatan</Label>
                            <Select
                                onValueChange={(value) => {
                                    setData('jenis_kegiatan', value);
                                    handleUpdate(); // Trigger update immediately
                                }}
                                value={data.jenis_kegiatan}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Pilih jenis kegiatan' />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisKegiatanOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor='created_at'>Dibuat</Label>
                            <Input
                                id='created_at'
                                value={new Date(submisi.created_at).toLocaleDateString()}
                                
                            />
                        </div>
                        <div>
                            <Label htmlFor='status'>Status</Label>
                            <Input
                                id='status'
                                value={submisi.status_submisi && submisi.status_submisi.length > 0 ? submisi.status_submisi[submisi.status_submisi.length - 1].status : 'Draft'}
                                
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Detail Kegiatan</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <div>
                            <Label htmlFor='indikator_kinerja'>Indikator Kinerja</Label>
                            <Select
                                onValueChange={(value) => setData('indikator_kinerja', value)}
                                defaultValue={data.indikator_kinerja}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Pilih Indikator Kinerja' />
                                </SelectTrigger>
                                <SelectContent>
                                    {IKU.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Label htmlFor='tanggal_mulai'>Tanggal Mulai</Label>
                                <Input
                                    id='tanggal_mulai'
                                    type='date'
                                    value={data.tanggal_mulai || ''}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor='tanggal_selesai'>Tanggal Selesai</Label>
                                <Input
                                    id='tanggal_selesai'
                                    type='date'
                                    value={data.tanggal_selesai || ''}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor='gambaran_umum'>Gambaran Umum</Label>
                            <TiptapEditor
                                content={data.gambaran_umum || ''}
                                onChange={(content) => setData('gambaran_umum', content)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='tujuan'>Tujuan</Label>
                            <TiptapEditor
                                content={data.tujuan || ''}
                                onChange={(content) => setData('tujuan', content)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='manfaat'>Manfaat</Label>
                            <TiptapEditor
                                content={data.manfaat || ''}
                                onChange={(content) => setData('manfaat', content)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='metode_pelaksanaan'>Metode Pelaksanaan</Label>
                            <TiptapEditor
                                content={data.metode_pelaksanaan || ''}
                                onChange={(content) => setData('metode_pelaksanaan', content)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='waktu_pelaksanaan'>Waktu Pelaksanaan</Label>
                            <TiptapEditor
                                content={data.waktu_pelaksanaan || ''}
                                onChange={(content) => setData('waktu_pelaksanaan', content)}
                            />
                        </div>
                        <Button onClick={handleSaveDraft}>Simpan Draft</Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
