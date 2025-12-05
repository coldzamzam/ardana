import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DetailSubmisi } from '@/types';
import TiptapEditor from './tiptap-editor';
import React from 'react';

interface DetailSubmisiViewProps {
    detailSubmisi: DetailSubmisi;
}

export default function DetailSubmisiView({ detailSubmisi }: DetailSubmisiViewProps) {
    const data = {
        indikator_kinerja: detailSubmisi.iku || '',
        tanggal_mulai: detailSubmisi.tanggal_mulai || '',
        tanggal_selesai: detailSubmisi.tanggal_selesai || '',
        gambaran_umum: detailSubmisi.gambaran_umum || '',
        tujuan: detailSubmisi.tujuan || '',
        manfaat: detailSubmisi.manfaat || '',
        metode_pelaksanaan: detailSubmisi.metode_pelaksanaan || '',
        waktu_pelaksanaan: detailSubmisi.waktu_pelaksanaan || '',
        pic_id: detailSubmisi.pic_id || '',
    };

    return (
        <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#427452]">
                    Detail TOR
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-1 md:w-1/2">
                    <Label>Indikator Kinerja</Label>
                    <Input value={data.indikator_kinerja} readOnly className="bg-neutral-100" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <Label>Tanggal Mulai</Label>
                        <Input type="date" value={data.tanggal_mulai} readOnly className="bg-neutral-100" />
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal Selesai</Label>
                        <Input type="date" value={data.tanggal_selesai} readOnly className="bg-neutral-100" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Gambaran Umum</Label>
                    <div className="rounded-lg border bg-white p-2">
                        <TiptapEditor content={data.gambaran_umum} editable={false} onChange={() => {}} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Tujuan</Label>
                    <div className="rounded-lg border bg-white p-2">
                        <TiptapEditor content={data.tujuan} editable={false} onChange={() => {}} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Manfaat</Label>
                    <div className="rounded-lg border bg-white p-2">
                        <TiptapEditor content={data.manfaat} editable={false} onChange={() => {}} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label>Metode Pelaksanaan</Label>
                    <div className="rounded-lg border bg-white p-2">
                        <TiptapEditor content={data.metode_pelaksanaan} editable={false} onChange={() => {}} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Waktu Pelaksanaan</Label>
                    <div className="rounded-lg border bg-white p-2">
                        <TiptapEditor content={data.waktu_pelaksanaan} editable={false} onChange={() => {}} />
                    </div>
                </div>
                
                <div className="space-y-1 md:w-1/2">
                    <Label>PIC</Label>
                    <Input value={detailSubmisi.pic?.name || 'N/A'} readOnly className="bg-neutral-100" />
                </div>
            </CardContent>
        </Card>
    );
}
