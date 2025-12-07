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
import { type Biaya as BiayaType, type Submisi } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ChevronsUpDown, Edit, Save, Trash2, X } from 'lucide-react';
import React from 'react';

interface DetailBiayaProps {
    submisi: Submisi;
    isEditable: boolean;
}

export default function DetailBiaya({ submisi, isEditable }: DetailBiayaProps) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingRow, setEditingRow] = React.useState<string | null>(null);
    const [isOpen, setIsOpen] = React.useState(true);

    const { data, setData, post, put, reset, errors } = useForm({
        id: '',
        biaya_satuan: '' as number | '',
        satuan: '',
        jumlah_kali: '' as number | '',
        jumlah_org: '' as number | '',
        deskripsi: '',
        submisi_id: submisi.id,
    });
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );

    React.useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const messages = Object.values(errors).join(' ');
            setValidationError(messages);
        } else {
            setValidationError(null);
        }
    }, [errors]);

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

    const validateData = () => {
        if (
            !data.biaya_satuan ||
            !data.satuan ||
            !data.jumlah_kali ||
            !data.jumlah_org ||
            !data.deskripsi
        ) {
            setValidationError('Semua field wajib diisi.');
            return false;
        }
        if (data.biaya_satuan < 0 || data.biaya_satuan > 999999999) {
            setValidationError('Biaya Satuan harus antara 0 dan 999,999,999.');
            return false;
        }
        if (data.jumlah_kali < 0 || data.jumlah_kali > 999) {
            setValidationError('Jumlah Kali harus antara 0 dan 999.');
            return false;
        }
        if (data.jumlah_org < 0 || data.jumlah_org > 999) {
            setValidationError('Jumlah Orang harus antara 0 dan 999.');
            return false;
        }
        setValidationError(null);
        return true;
    };

    const handleSaveNew = () => {
        if (!validateData()) return;
        post('/dashboard/biaya', {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleEdit = (biaya: BiayaType) => {
        if (!isEditable) return;
        setEditingRow(biaya.id);
        setData(biaya);
        setValidationError(null);
    };

    const handleCancelEdit = () => {
        setEditingRow(null);
        reset();
        setValidationError(null);
    };

    const handleUpdate = () => {
        if (!validateData()) return;
        put(`/dashboard/biaya/${data.id}`, {
            onSuccess: () => {
                setEditingRow(null);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleDelete = (id: string) => {
        router.delete(`/dashboard/biaya/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                <CollapsibleTrigger asChild>
                    <CardHeader className="flex cursor-pointer flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-[#427452]">
                            Anggaran Biaya
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
                                    <TableHead>Biaya Satuan</TableHead>
                                    <TableHead>Satuan</TableHead>
                                    <TableHead>Jumlah Kali</TableHead>
                                    <TableHead>Jumlah Orang</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Total</TableHead>
                                    {isEditable && <TableHead>Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submisi.biaya?.map((item, index) => (
                                    <TableRow key={item.id}>
                                        {editingRow === item.id &&
                                        isEditable ? (
                                            <>
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={
                                                            data.biaya_satuan
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'biaya_satuan',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || '',
                                                            )
                                                        }
                                                        min={0}
                                                        max={999999999}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={data.satuan}
                                                        onChange={(e) =>
                                                            setData(
                                                                'satuan',
                                                                e.target.value.toUpperCase(),
                                                            )
                                                        }
                                                        maxLength={10}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={data.jumlah_kali}
                                                        onChange={(e) =>
                                                            setData(
                                                                'jumlah_kali',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || '',
                                                            )
                                                        }
                                                        min={0}
                                                        max={999}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={data.jumlah_org}
                                                        onChange={(e) =>
                                                            setData(
                                                                'jumlah_org',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || '',
                                                            )
                                                        }
                                                        min={0}
                                                        max={999}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={data.deskripsi}
                                                        onChange={(e) =>
                                                            setData(
                                                                'deskripsi',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>-</TableCell>
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
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        },
                                                    ).format(item.biaya_satuan)}
                                                </TableCell>
                                                <TableCell>
                                                    {item.satuan}
                                                </TableCell>
                                                <TableCell>
                                                    {item.jumlah_kali}
                                                </TableCell>
                                                <TableCell>
                                                    {item.jumlah_org}
                                                </TableCell>
                                                <TableCell>
                                                    {item.deskripsi}
                                                </TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                        },
                                                    ).format(
                                                        item.biaya_satuan *
                                                            item.jumlah_kali *
                                                            item.jumlah_org,
                                                    )}
                                                </TableCell>
                                                {isEditable && (
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        item,
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
                                                                            cost
                                                                            item.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    item.id,
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
                                ))}
                                {isAdding && isEditable && (
                                    <TableRow>
                                        <TableCell>
                                            {(submisi.biaya?.length || 0) + 1}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                placeholder="99999"
                                                value={data.biaya_satuan}
                                                onChange={(e) =>
                                                    setData(
                                                        'biaya_satuan',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || '',
                                                    )
                                                }
                                                min={0}
                                                max={999999999}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="PCS"
                                                value={data.satuan}
                                                onChange={(e) =>
                                                    setData(
                                                        'satuan',
                                                        e.target.value.toUpperCase(),
                                                    )
                                                }
                                                maxLength={10}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                value={data.jumlah_kali}
                                                onChange={(e) =>
                                                    setData(
                                                        'jumlah_kali',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || '',
                                                    )
                                                }
                                                min={0}
                                                max={999}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                value={data.jumlah_org}
                                                onChange={(e) =>
                                                    setData(
                                                        'jumlah_org',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || '',
                                                    )
                                                }
                                                min={0}
                                                max={999}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Deskripsi biaya"
                                                value={data.deskripsi}
                                                onChange={(e) =>
                                                    setData(
                                                        'deskripsi',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                )}
                                {validationError && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
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
                                    Tambah Anggaran
                                </Button>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end border-t pt-4">
                            <div className="text-lg font-bold">
                                <span>Total Anggaran: </span>
                                <span>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }).format(submisi.total_anggaran)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
