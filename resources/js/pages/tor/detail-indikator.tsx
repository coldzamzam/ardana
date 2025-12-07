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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { ChevronsUpDown, Edit, Save, Trash2, X } from 'lucide-react';
import React from 'react';

interface DetailIndikatorProps {
    submisi: Submisi;
    isEditable: boolean;
}

export default function DetailIndikator({
    submisi,
    isEditable,
}: DetailIndikatorProps) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingRow, setEditingRow] = React.useState<string | null>(null);
    const [isOpen, setIsOpen] = React.useState(true);

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
        if (!isEditable) return;
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
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                <CollapsibleTrigger asChild>
                    <CardHeader className="flex cursor-pointer flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-[#427452]">
                            Indikator Kinerja
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="w-9 px-0">
                            <ChevronsUpDown className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <Table className="[&_td]:text-center [&_th]:text-center">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Bulan</TableHead>
                                    <TableHead>
                                        Deskripsi Keberhasilan
                                    </TableHead>
                                    <TableHead>Target (%)</TableHead>
                                    {isEditable && <TableHead>Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submisi.indikator_kinerja?.map(
                                    (indikator, index) => (
                                        <TableRow key={indikator.id}>
                                            {editingRow === indikator.id &&
                                            isEditable ? (
                                                <>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="month"
                                                            value={
                                                                data.bulan.split(
                                                                    ' ',
                                                                )[1]
                                                                    ? `${data.bulan.split(' ')[1]}-${String(bulanOptions.indexOf(data.bulan.split(' ')[0]) + 1).padStart(2, '0')}`
                                                                    : ''
                                                            }
                                                            onChange={(e) => {
                                                                const [
                                                                    year,
                                                                    month,
                                                                ] =
                                                                    e.target.value.split(
                                                                        '-',
                                                                    );
                                                                const monthName =
                                                                    new Date(
                                                                        parseInt(
                                                                            year,
                                                                        ),
                                                                        parseInt(
                                                                            month,
                                                                        ) - 1,
                                                                        1,
                                                                    ).toLocaleString(
                                                                        'id-ID',
                                                                        {
                                                                            month: 'long',
                                                                        },
                                                                    );
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
                                                            value={
                                                                data.keberhasilan
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'keberhasilan',
                                                                    e.target
                                                                        .value,
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
                                                                        e.target
                                                                            .value,
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
                                                            onClick={
                                                                handleUpdate
                                                            }
                                                        >
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={
                                                                handleCancelEdit
                                                            }
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {indikator.bulan}
                                                    </TableCell>
                                                    <TableCell>
                                                        {indikator.keberhasilan}
                                                    </TableCell>
                                                    <TableCell>
                                                        {indikator.target}
                                                    </TableCell>
                                                    {isEditable && (
                                                        <TableCell>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            indikator,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isAdding
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            disabled={
                                                                                isAdding
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>
                                                                                Are
                                                                                you
                                                                                absolutely
                                                                                sure?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This
                                                                                action
                                                                                cannot
                                                                                be
                                                                                undone.
                                                                                This
                                                                                will
                                                                                permanently
                                                                                delete
                                                                                the
                                                                                indicator.
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
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                </>
                                            )}
                                        </TableRow>
                                    ),
                                )}
                                {isAdding && isEditable && (
                                    <TableRow>
                                        <TableCell className="text-center align-middle">
                                            {submisi.indikator_kinerja?.length +
                                                1}
                                        </TableCell>
                                        <TableCell className="text-center align-middle">
                                            <Input
                                                type="month"
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
                                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-center"
                                            />
                                        </TableCell>
                                        <TableCell className="text-center align-middle">
                                            <Input
                                                placeholder="Deskripsi Keberhasilan"
                                                value={data.keberhasilan}
                                                onChange={(e) =>
                                                    setData(
                                                        'keberhasilan',
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-center"
                                            />
                                        </TableCell>
                                        <TableCell className="text-center align-middle">
                                            <Input
                                                type="number"
                                                placeholder="1-100"
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
                                                className="text-center"
                                            />
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            <div className="flex items-center justify-center gap-3">
                                                <Button
                                                    size="sm"
                                                    onClick={handleSaveNew}
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={handleCancelAddNew}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
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
                        {isEditable && (
                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={handleAddNew}
                                    disabled={isAdding || !!editingRow}
                                    className="rounded-lg bg-[#427452] text-white transition-colors hover:bg-[#365d42] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Tambah Indikator
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
