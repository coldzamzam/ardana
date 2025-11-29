import TiptapEditor from '@/components/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { jenisKegiatanOptions } from '@/lib/constants';
import { type BreadcrumbItem, type Submisi, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import DetailAnggota from './detail-anggota';
import DetailBiaya from './detail-biaya';
import DetailFile from './detail-file';
import DetailIndikator from './detail-indikator';
import React from 'react';

interface TorDetailProps {
    submisi: Submisi;
    dosens: User[];
}

export default function TorDetail({ submisi, dosens }: TorDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'TOR',
            href: '/dashboard/tor',
        },
        {
            title: 'TOR Detail',
            href: `/dashboard/tor/${submisi.id}`,
        },
        {
            title: submisi.judul,
            href: window.location.pathname,
        },
    ];

    const { data, setData, put, post, errors } = useForm({
        id: submisi.id,
        judul: submisi.judul,
        jenis_kegiatan: submisi.jenis_kegiatan,
        created_at: submisi.created_at,
        indikator_kinerja: submisi.detail_submisi?.iku || '',
        tanggal_mulai: submisi.detail_submisi?.tanggal_mulai || '',
        tanggal_selesai: submisi.detail_submisi?.tanggal_selesai || '',
        gambaran_umum: submisi.detail_submisi?.gambaran_umum || '',
        tujuan: submisi.detail_submisi?.tujuan || '',
        manfaat: submisi.detail_submisi?.manfaat || '',
        metode_pelaksanaan: submisi.detail_submisi?.metode_pelaksanaan || '',
        waktu_pelaksanaan: submisi.detail_submisi?.waktu_pelaksanaan || '',
        pic_id: submisi.detail_submisi?.pic_id || '',
        pic_name: '',
        pic_nip: '',
    });

    React.useEffect(() => {
        const selectedDosen = dosens.find(
            (dosen) => String(dosen.id) === data.pic_id,
        );
        if (selectedDosen) {
            setData((prevData) => ({
                ...prevData,
                pic_name: selectedDosen.name,
                pic_nip: selectedDosen.nip,
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                pic_name: '',
                pic_nip: '',
            }));
        }
    }, [data.pic_id, dosens]);

    const IKU = [
        'IKU 1',
        'IKU 2',
        'IKU 3',
        'IKU 4',
        'IKU 5',
        'IKU 6',
        'IKU 7',
        'IKU 8',
    ];

    const handleUpdate = () => {
        put(`/dashboard/tor/${submisi.id}`, {
            preserveScroll: true,
        });
    };

    const handleUpdateDetail = () => {
        post(`/dashboard/tor/${submisi.id}/draft`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail TOR - ${submisi.judul}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) =>
                                    setData('judul', e.target.value)
                                }
                                onBlur={handleUpdate}
                                className="bg-white"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="jenis_kegiatan">
                                    Jenis Kegiatan
                                </Label>
                                <Select
                                    onValueChange={(value) => {
                                        setData('jenis_kegiatan', value);
                                        handleUpdate();
                                    }}
                                    value={data.jenis_kegiatan}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Pilih jenis kegiatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jenisKegiatanOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="created_at">Dibuat</Label>
                                <Input
                                    id="created_at"
                                    value={new Date(
                                        submisi.created_at,
                                    ).toLocaleDateString()}
                                    readOnly
                                    className="bg-neutral-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 md:w-1/2">
                            <Label htmlFor="status">Status</Label>
                            <Input
                                id="status"
                                value={
                                    submisi.status_submisi &&
                                    submisi.status_submisi.length > 0
                                        ? submisi.status_submisi[
                                              submisi.status_submisi.length - 1
                                          ].status
                                        : 'Draft'
                                }
                                readOnly
                                className="bg-neutral-100 capitalize"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                    <CardHeader className="">
                        <CardTitle className="text-xl font-semibold text-[#427452]">
                            Detail TOR
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-1 md:w-1/2">
                            <Label htmlFor="indikator_kinerja">
                                Indikator Kinerja
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('indikator_kinerja', value)
                                }
                                defaultValue={data.indikator_kinerja}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Pilih Indikator Kinerja" />
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

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="tanggal_mulai">
                                    Tanggal Mulai
                                </Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="date"
                                    value={data.tanggal_mulai || ''}
                                    onChange={(e) =>
                                        setData('tanggal_mulai', e.target.value)
                                    }
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tanggal_selesai">
                                    Tanggal Selesai
                                </Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="date"
                                    value={data.tanggal_selesai || ''}
                                    onChange={(e) =>
                                        setData(
                                            'tanggal_selesai',
                                            e.target.value,
                                        )
                                    }
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gambaran_umum">Gambaran Umum</Label>
                            <div className="rounded-lg border bg-white p-2">
                                <TiptapEditor
                                    content={data.gambaran_umum || ''}
                                    onChange={(content) =>
                                        setData('gambaran_umum', content)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tujuan">Tujuan</Label>
                            <div className="rounded-lg border bg-white p-2">
                                <TiptapEditor
                                    content={data.tujuan || ''}
                                    onChange={(content) =>
                                        setData('tujuan', content)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="manfaat">Manfaat</Label>
                            <div className="rounded-lg border bg-white p-2">
                                <TiptapEditor
                                    content={data.manfaat || ''}
                                    onChange={(content) =>
                                        setData('manfaat', content)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metode_pelaksanaan">
                                Metode Pelaksanaan
                            </Label>
                            <div className="rounded-lg border bg-white p-2">
                                <TiptapEditor
                                    content={data.metode_pelaksanaan || ''}
                                    onChange={(content) =>
                                        setData('metode_pelaksanaan', content)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="waktu_pelaksanaan">
                                Waktu Pelaksanaan
                            </Label>
                            <div className="rounded-lg border bg-white p-2">
                                <TiptapEditor
                                    content={data.waktu_pelaksanaan || ''}
                                    onChange={(content) =>
                                        setData('waktu_pelaksanaan', content)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1 md:w-1/2">
                            <Label htmlFor="pic">PIC</Label>
                            <select
                                id="pic"
                                value={data.pic_id}
                                onChange={(e) => {
                                    const selectedDosen = dosens.find(
                                        (d) => String(d.id) === e.target.value,
                                    );
                                    if (selectedDosen) {
                                        setData({
                                            ...data,
                                            pic_id: String(selectedDosen.id),
                                            pic_name: selectedDosen.name,
                                            pic_nip: selectedDosen.nip,
                                        });
                                    }
                                }}
                                className="w-full rounded-md border border-gray-300 bg-white p-2"
                            >
                                <option value="">Pilih PIC</option>
                                {dosens.map((dosen) => (
                                    <option
                                        key={dosen.id}
                                        value={String(dosen.id)}
                                    >
                                        {dosen.name} - {dosen.nip}
                                    </option>
                                ))}
                            </select>
                            {data.pic_name && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Nama: {data.pic_name}</p>
                                    <p>NIP: {data.pic_nip}</p>
                                </div>
                            )}
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <div className="mt-4 text-center text-red-500">
                                Semua field wajib diisi.
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={handleUpdateDetail}
                                className="rounded-md bg-[#427452] px-6 hover:bg-[#365d42]"
                            >
                                Simpan Detail
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <DetailAnggota submisi={submisi} />
                <DetailIndikator submisi={submisi} />
                <DetailFile submisi={submisi} />
                <DetailBiaya submisi={submisi} />
            </div>
        </AppLayout>
    );
}
