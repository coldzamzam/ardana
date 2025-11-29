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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { IndikatorKinerja as IndikatorKinerjaType, Submisi } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Edit, Save, Trash2, X } from 'lucide-react';
import React from 'react';

interface DetailIndikatorProps {
    submisi: Submisi;
}

export default function DetailIndikator({ submisi }: DetailIndikatorProps) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingRow, setEditingRow] = React.useState<string | null>(null);

    const { data, setData, post, put, reset, errors } = useForm({
        id: '',
        bulan: '',
        keberhasilan: '',
        target: '' as number | '',
        submisi_id: submisi.id,
    });
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );

    const handleAddNew = () => {
        setIsAdding(true);
        reset();
        setValidationError(null);
    };

    const handleCancelAddNew = () => {
        setIsAdding(false);
        reset();
        setValidationError(null);
    };

    const handleSaveNew = () => {
        if (!data.bulan || !data.keberhasilan || !data.target) {
            setValidationError('Semua field harus diisi.');
            return;
        }
        if (
            typeof data.target === 'number' &&
            (data.target < 1 || data.target > 100)
        ) {
            setValidationError('Target harus diisi dengan angka 1-100');
            return;
        }
        setValidationError(null);
        post('/dashboard/indikator-kinerja', {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleEdit = (indikator: IndikatorKinerjaType) => {
        setEditingRow(indikator.id);
        setData(indikator);
        setValidationError(null);
    };

    const handleCancelEdit = () => {
        setEditingRow(null);
        reset();
        setValidationError(null);
    };

    const handleUpdate = () => {
        if (!data.bulan || !data.keberhasilan || !data.target) {
            setValidationError('Semua field harus diisi.');
            return;
        }
        if (
            typeof data.target === 'number' &&
            (data.target < 1 || data.target > 100)
        ) {
            setValidationError('Target harus diisi dengan angka 1-100');
            return;
        }
        setValidationError(null);
        put(`/dashboard/indikator-kinerja/${data.id}`, {
            onSuccess: () => {
                setEditingRow(null);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleDelete = (id: string) => {
        router.delete(`/dashboard/indikator-kinerja/${id}`, {
            preserveScroll: true,
        });
    };

    const bulanOptions = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];

    return (
        <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-[#427452]">
                    Indikator Kinerja
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Bulan</TableHead>
                            <TableHead>Deskripsi Keberhasilan</TableHead>
                            <TableHead>Target (%)</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submisi.indikator_kinerja?.map((indikator, index) => (
                            <TableRow key={indikator.id}>
                                {editingRow === indikator.id ? (
                                    <>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="month"
                                                value={
                                                    data.bulan.split(' ')[1]
                                                        ? `${data.bulan.split(' ')[1]}-${String(bulanOptions.indexOf(data.bulan.split(' ')[0]) + 1).padStart(2, '0')}`
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    const [year, month] =
                                                        e.target.value.split(
                                                            '-',
                                                        );
                                                    const monthName = new Date(
                                                        parseInt(year),
                                                        parseInt(month) - 1,
                                                        1,
                                                    ).toLocaleString('id-ID', {
                                                        month: 'long',
                                                    });
                                                    setData(
                                                        'bulan',
                                                        `${monthName} ${year}`,
                                                    );
                                                }}
                                                className="w-full rounded-md border border-gray-300 bg-white p-2"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={data.keberhasilan}
                                                onChange={(e) =>
                                                    setData(
                                                        'keberhasilan',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={data.target}
                                                onChange={(e) =>
                                                    setData(
                                                        'target',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || '',
                                                    )
                                                }
                                                min={1}
                                                max={100}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                onClick={handleUpdate}
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={handleCancelEdit}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{indikator.bulan}</TableCell>
                                        <TableCell>
                                            {indikator.keberhasilan}
                                        </TableCell>
                                        <TableCell>
                                            {indikator.target}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleEdit(indikator)
                                                }
                                                disabled={isAdding}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={isAdding}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
                                                            permanently delete
                                                            the indicator.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    indikator.id,
                                                                )
                                                            }
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                        {isAdding && (
                            <TableRow>
                                <TableCell>
                                    {submisi.indikator_kinerja?.length + 1}
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="month"
                                        onChange={(e) => {
                                            const [year, month] =
                                                e.target.value.split('-');
                                            const monthName = new Date(
                                                parseInt(year),
                                                parseInt(month) - 1,
                                                1,
                                            ).toLocaleString('id-ID', {
                                                month: 'long',
                                            });
                                            setData(
                                                'bulan',
                                                `${monthName} ${year}`,
                                            );
                                        }}
                                        className="w-full rounded-md border border-gray-300 bg-white p-2"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="Deskripsi Keberhasilan"
                                        value={data.keberhasilan}
                                        onChange={(e) =>
                                            setData(
                                                'keberhasilan',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        placeholder="1-100"
                                        value={data.target}
                                        onChange={(e) =>
                                            setData(
                                                'target',
                                                parseInt(e.target.value) || '',
                                            )
                                        }
                                        min={1}
                                        max={100}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" onClick={handleSaveNew}>
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleCancelAddNew}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        {validationError && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-red-500"
                                >
                                    {validationError}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={handleAddNew}
                        disabled={isAdding || !!editingRow}
                    >
                        Tambah
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
