import QuillEditor from '@/components/quill-editor';
import StatusHistoryCard from '@/components/status-history-card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import DetailAnggota from '@/pages/tor/detail-anggota';
import DetailBiaya from '@/pages/tor/detail-biaya';
import DetailFile from '@/pages/tor/detail-file';
import DetailIndikator from '@/pages/tor/detail-indikator';
import {
    type BreadcrumbItem,
    type StatusSubmisi as StatusSubmisiType,
    type Submisi,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

interface LpjDetailProps {
    submisi: Submisi;
    latestStatus: StatusSubmisiType | null;
}

export default function LpjDetail({ submisi, latestStatus }: LpjDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'LPJ',
            href: '/dashboard/submisi/lpj',
        },
        {
            title: 'LPJ Detail',
            href: `/dashboard/submisi/${submisi.id}`,
        },
        {
            title: submisi.judul,
            href: window.location.pathname,
        },
    ];

    const { data, setData, post, errors } = useForm({
        // Pre-fill all fields from the TOR's detail, making them editable for the LPJ
        indikator_kinerja: submisi.detail_submisi?.iku || '',
        tanggal_mulai: submisi.detail_submisi?.tanggal_mulai || '',
        tanggal_selesai: submisi.detail_submisi?.tanggal_selesai || '',
        gambaran_umum: submisi.detail_submisi?.gambaran_umum || '',
        tujuan: submisi.detail_submisi?.tujuan || '',
        manfaat: submisi.detail_submisi?.manfaat || '',
        metode_pelaksanaan: submisi.detail_submisi?.metode_pelaksanaan || '',
        waktu_pelaksanaan: submisi.detail_submisi?.waktu_pelaksanaan || '',

        // LPJ specific fields are also editable
        peserta_kegiatan: submisi.detail_submisi?.peserta_kegiatan || '',
        hasil_kegiatan: submisi.detail_submisi?.hasil_kegiatan || '',
    });

    const isEditable =
        !latestStatus || latestStatus.status_type.nama.trim() === 'Revisi';

    const handleUpdateDetail = () => {
        if (!isEditable) return;

        const isRevision = latestStatus?.status_type.nama.trim() === 'Revisi';
        const isFirstSaveInRevision =
            isRevision &&
            latestStatus?.detail_submisi_id === submisi.detail_submisi?.id;

        if (isFirstSaveInRevision) {
            post(`/dashboard/submisi/${submisi.id}/new-version`, {
                preserveScroll: true,
            });
        } else {
            post(`/dashboard/submisi/${submisi.id}/draft`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmitSubmission = () => {
        router.post(`/dashboard/submisi/${submisi.id}/submit`);
    };

    // An LPJ is submittable if its own specific required fields have been filled and saved.
    const isSubmittable =
        submisi.detail_submisi?.peserta_kegiatan
            ?.replace(/<[^>]+>/g, '')
            ?.trim() &&
        submisi.detail_submisi?.hasil_kegiatan?.replace(/<[^>]+>/g, '')?.trim();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail LPJ - ${submisi.judul}`} />

            <div className="flex h-full flex-1 flex-col gap-3 overflow-x-auto rounded-xl p-4">
                <StatusHistoryCard submisi={submisi} />

                <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-1">
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                id="judul"
                                value={submisi.judul}
                                disabled
                                className="bg-neutral-100"
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="kegiatan_type_id">
                                    Jenis Kegiatan
                                </Label>
                                <Input
                                    id="kegiatan_type_id"
                                    value={submisi.kegiatan_type?.nama}
                                    disabled
                                    className="bg-neutral-100"
                                />
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="created_by">Oleh</Label>
                                <Input
                                    id="created_by"
                                    value={submisi.created_by?.name || ''}
                                    readOnly
                                    className="bg-neutral-100"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="status">Status</Label>
                                <Input
                                    id="status"
                                    value={
                                        latestStatus?.status_type.nama ||
                                        'Draft'
                                    }
                                    readOnly
                                    className="bg-neutral-100 capitalize"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-[#427452]">
                            Detail Laporan
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
                                disabled={!isEditable}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Pilih Indikator Kinerja" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Lulusan Mendapat Pekerjaan yang Layak',
                                        'Mahasiswa Mendapat Pengalaman di Luar Kampus',
                                        'Dosen Berkegiatan di Luar Kampus',
                                        'Praktisi Mengajar di Dalam Kampus',
                                        'Hasil Kerja Dosen Digunakan oleh Masyarakat',
                                        'Program Studi Bekerjasama dengan Mitra Kelas Dunia',
                                        'Kelas yang Kolaboratif dan Partisipatif',
                                        'Program Studi Berstandar Internasional',
                                    ].map((item) => (
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
                                    disabled={!isEditable}
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
                                    disabled={!isEditable}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gambaran_umum">Gambaran Umum</Label>
                            <QuillEditor
                                content={data.gambaran_umum || ''}
                                onChange={(c) => setData('gambaran_umum', c)}
                                editable={isEditable}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tujuan">Tujuan</Label>
                            <QuillEditor
                                content={data.tujuan || ''}
                                onChange={(c) => setData('tujuan', c)}
                                editable={isEditable}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manfaat">Manfaat</Label>
                            <QuillEditor
                                content={data.manfaat || ''}
                                onChange={(c) => setData('manfaat', c)}
                                editable={isEditable}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metode_pelaksanaan">
                                Metode Pelaksanaan
                            </Label>
                            <QuillEditor
                                content={data.metode_pelaksanaan || ''}
                                onChange={(c) =>
                                    setData('metode_pelaksanaan', c)
                                }
                                editable={isEditable}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="waktu_pelaksanaan">
                                Waktu Pelaksanaan
                            </Label>
                            <QuillEditor
                                content={data.waktu_pelaksanaan || ''}
                                onChange={(c) =>
                                    setData('waktu_pelaksanaan', c)
                                }
                                editable={isEditable}
                            />
                        </div>

                        <div className="space-y-1 md:w-1/2">
                            <Label htmlFor="pic">PIC</Label>
                            <Input
                                id="pic"
                                value={submisi.detail_submisi?.pic?.name || ''}
                                disabled
                                className="bg-neutral-100"
                            />
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <Label
                                htmlFor="peserta_kegiatan"
                                className="text-base font-semibold"
                            >
                                Peserta Kegiatan
                            </Label>
                            <QuillEditor
                                content={data.peserta_kegiatan || ''}
                                onChange={(c) => setData('peserta_kegiatan', c)}
                                editable={isEditable}
                            />
                            {errors.peserta_kegiatan && (
                                <p className="text-sm text-red-500">
                                    {errors.peserta_kegiatan}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="hasil_kegiatan"
                                className="text-base font-semibold"
                            >
                                Hasil Kegiatan
                            </Label>
                            <QuillEditor
                                content={data.hasil_kegiatan || ''}
                                onChange={(c) => setData('hasil_kegiatan', c)}
                                editable={isEditable}
                            />
                            {errors.hasil_kegiatan && (
                                <p className="text-sm text-red-500">
                                    {errors.hasil_kegiatan}
                                </p>
                            )}
                        </div>

                        {isEditable && (
                            <div className="flex justify-end pt-2">
                                <Button
                                    onClick={handleUpdateDetail}
                                    className="rounded-md bg-[#427452] px-6 hover:bg-[#365d42]"
                                >
                                    Simpan Detail
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <DetailAnggota submisi={submisi} isEditable={false} />
                <DetailIndikator submisi={submisi} isEditable={false} />
                <DetailFile submisi={submisi} isEditable={isEditable} />
                <DetailBiaya submisi={submisi} isEditable={isEditable} />

                <div className="flex items-start justify-end gap-3 pt-4 pb-10">
                    <a
                        href="/dashboard/lpj/template-preview"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="bg-[#2B6CB0] hover:bg-[#245a94]">
                            Print Template
                        </Button>
                    </a>
                    {isEditable ? (
                        <div className="flex flex-col items-end">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        disabled={!isSubmittable}
                                        className="rounded-md bg-[#427452] text-white hover:bg-[#365d42]"
                                    >
                                        Kirim Pengajuan LPJ
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Apakah Anda yakin ingin mengajukan
                                            LPJ ini?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Pastikan semua data sudah benar
                                            sebelum diajukan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleSubmitSubmission}
                                        >
                                            Lanjutkan
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            {!isSubmittable && (
                                <p className="mt-2 text-xs text-slate-600">
                                    Silakan simpan & isi field LPJ untuk
                                    mengirim pengajuan
                                </p>
                            )}
                        </div>
                    ) : (
                        <Button
                            disabled
                            className="rounded-md bg-gray-500 px-6 text-white"
                        >
                            Telah Diajukan
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
