import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type KegiatanType,
    type PageProps,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit2, Layers, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/dashboard/admin',
    },
    {
        title: 'Kelola Jenis Kegiatan',
        href: '/dashboard/admin/kegiatan-type',
    },
];

function Index({
    kegiatanTypes,
}: PageProps<{ kegiatanTypes: KegiatanType[] }>) {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        errors,
    } = useForm<{
        id?: string;
        nama: string;
    }>({
        nama: '',
    });

    const handleEdit = (type: KegiatanType) => {
        setIsEdit(true);
        setOpen(true);
        setData({
            id: type.id,
            nama: type.nama,
        });
    };

    const handleDelete = (id: string) => {
        setTypeToDelete(id);
        setDeleteConfirmationOpen(true);
    };

    const confirmDelete = () => {
        if (typeToDelete) {
            destroy('/dashboard/admin/kegiatan-type/' + typeToDelete, {
                onSuccess: () => {
                    setDeleteConfirmationOpen(false);
                    setTypeToDelete(null);
                    toast.success('Berhasil', {
                        description: 'Jenis kegiatan berhasil dihapus',
                    });
                },
            });
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put('/dashboard/admin/kegiatan-type/' + data.id, {
                onSuccess: () => {
                    setOpen(false);
                    setIsEdit(false);
                    setData({
                        nama: '',
                    });
                    toast.success('Berhasil', {
                        description: 'Jenis kegiatan berhasil diperbarui',
                    });
                },
            });
        } else {
            post('/dashboard/admin/kegiatan-type', {
                onSuccess: () => {
                    setOpen(false);
                    setData({
                        nama: '',
                    });
                    toast.success('Berhasil', {
                        description: 'Jenis kegiatan berhasil ditambahkan',
                    });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Jenis Kegiatan" />
            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER SECTION */}
                    <div className="w-full">
                        <div className="mb-2 flex items-center gap-3">
                            <Layers className="h-8 w-8 text-[#427452]" />
                            <h1 className="text-3xl font-bold text-[#427452]">
                                Kelola Jenis Kegiatan
                            </h1>
                        </div>
                        <p className="text-sm text-[#427452]">
                            Kelola berbagai jenis kegiatan yang tersedia
                        </p>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="mt-2">
                        <Dialog
                            open={open}
                            onOpenChange={(isOpen) => {
                                setOpen(isOpen);
                                if (!isOpen) {
                                    setIsEdit(false);
                                    setData({
                                        nama: '',
                                    });
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2 rounded-md bg-[#73AD86] px-5 py-2 text-white hover:bg-[#5f9772]">
                                    <Plus className="h-4 w-4" />
                                    Tambah Jenis Kegiatan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-[#427452]">
                                        {isEdit
                                            ? 'Edit Jenis Kegiatan'
                                            : 'Tambah Jenis Kegiatan Baru'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="nama"
                                                className="text-[#427452]"
                                            >
                                                Nama Jenis Kegiatan
                                            </Label>
                                            <Input
                                                id="nama"
                                                value={data.nama}
                                                onChange={(e) =>
                                                    setData(
                                                        'nama',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan nama jenis kegiatan..."
                                                className="border-gray-300"
                                            />
                                            {errors.nama && (
                                                <p className="text-xs text-red-500">
                                                    {errors.nama}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setOpen(false);
                                                setIsEdit(false);
                                                setData({ nama: '' });
                                            }}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-[#73AD86] hover:bg-[#5f9772]"
                                        >
                                            {isEdit
                                                ? 'Simpan Perubahan'
                                                : 'Tambah Jenis Kegiatan'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* TABLE CONTENT */}
                    <div className="mt-4 flex-1 overflow-y-auto rounded-2xl bg-white p-6 shadow-sm">
                        {kegiatanTypes.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-2 border-gray-200 hover:bg-gray-50/30">
                                            <TableHead className="font-semibold text-[#427452]">
                                                No.
                                            </TableHead>
                                            <TableHead className="font-semibold text-[#427452]">
                                                Nama Jenis Kegiatan
                                            </TableHead>
                                            <TableHead className="text-right font-semibold text-[#427452]">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kegiatanTypes.map((type, index) => (
                                            <TableRow
                                                key={type.id}
                                                className="border-b border-gray-100 hover:bg-gray-50/40"
                                            >
                                                <TableCell className="w-12 font-medium text-gray-900">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {type.nama}
                                                </TableCell>
                                                <TableCell className="space-x-2 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(type)
                                                        }
                                                        className="gap-2 border-gray-300 text-[#427452] hover:bg-gray-50"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                type.id,
                                                            )
                                                        }
                                                        className="gap-2 bg-red-500 hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Hapus
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Layers className="mb-3 h-12 w-12 text-gray-300" />
                                <p className="text-gray-500">
                                    Belum ada jenis kegiatan yang dibuat. Klik
                                    tombol "Tambah Jenis Kegiatan" untuk
                                    memulai.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DELETE CONFIRMATION DIALOG */}
            <AlertDialog
                open={deleteConfirmationOpen}
                onOpenChange={setDeleteConfirmationOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Jenis Kegiatan?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Jenis kegiatan
                            akan dihapus secara permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}

export default Index;
