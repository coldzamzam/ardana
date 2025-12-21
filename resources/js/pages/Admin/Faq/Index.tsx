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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem, type Faq } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Edit2, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/dashboard/admin',
    },
    {
        title: 'Kelola FAQ',
        href: '/dashboard/admin/faq',
    },
];

function Index({ faqs }: PageProps<{ faqs: Faq[] }>) {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        errors,
    } = useForm<{
        id?: string;
        question: string;
        answer: string;
    }>({
        question: '',
        answer: '',
    });

    const handleEdit = (faq: Faq) => {
        setIsEdit(true);
        setOpen(true);
        setData({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
        });
    };

    const handleDelete = (id: string) => {
        setFaqToDelete(id);
        setDeleteConfirmationOpen(true);
    };

    const confirmDelete = () => {
        if (faqToDelete) {
            destroy('/dashboard/admin/faq/' + faqToDelete, {
                onSuccess: () => {
                    setDeleteConfirmationOpen(false);
                    setFaqToDelete(null);
                    toast.success('Berhasil', {
                        description: 'FAQ berhasil dihapus',
                    });
                },
            });
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put('/dashboard/admin/faq/' + data.id, {
                onSuccess: () => {
                    setOpen(false);
                    setIsEdit(false);
                    setData({
                        question: '',
                        answer: '',
                    });
                    toast.success('Berhasil', {
                        description: 'FAQ berhasil diperbarui',
                    });
                },
            });
        } else {
            post('/dashboard/admin/faq', {
                onSuccess: () => {
                    setOpen(false);
                    setData({
                        question: '',
                        answer: '',
                    });
                    toast.success('Berhasil', {
                        description: 'FAQ berhasil ditambahkan',
                    });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola FAQ" />
            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER SECTION */}
                    <div className="w-full">
                        <div className="mb-2 flex items-center gap-3">
                            <HelpCircle className="h-8 w-8 text-[#427452]" />
                            <h1 className="text-3xl font-bold text-[#427452]">
                                Kelola FAQ
                            </h1>
                        </div>
                        <p className="text-sm text-[#427452]">
                            Kelola pertanyaan yang sering diajukan
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
                                        question: '',
                                        answer: '',
                                    });
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="gap-2 rounded-md bg-[#73AD86] px-5 py-2 text-white hover:bg-[#5f9772]">
                                    <Plus className="h-4 w-4" />
                                    Tambah FAQ
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-[#427452]">
                                        {isEdit
                                            ? 'Edit FAQ'
                                            : 'Tambah FAQ Baru'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="question"
                                                className="text-[#427452]"
                                            >
                                                Pertanyaan
                                            </Label>
                                            <Input
                                                id="question"
                                                value={data.question}
                                                onChange={(e) =>
                                                    setData(
                                                        'question',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan pertanyaan..."
                                                className="border-gray-300"
                                            />
                                            {errors.question && (
                                                <p className="text-xs text-red-500">
                                                    {errors.question}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="answer"
                                                className="text-[#427452]"
                                            >
                                                Jawaban
                                            </Label>
                                            <Textarea
                                                id="answer"
                                                value={data.answer}
                                                onChange={(e) =>
                                                    setData(
                                                        'answer',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan jawaban..."
                                                className="min-h-32 border-gray-300"
                                            />
                                            {errors.answer && (
                                                <p className="text-xs text-red-500">
                                                    {errors.answer}
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
                                                setData({
                                                    question: '',
                                                    answer: '',
                                                });
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
                                                : 'Tambah FAQ'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* TABLE CONTENT */}
                    <div className="mt-4 flex-1 overflow-y-auto rounded-2xl bg-white p-6 shadow-sm">
                        {faqs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-2 border-gray-200 hover:bg-gray-50/30">
                                            <TableHead className="font-semibold text-[#427452]">
                                                Pertanyaan
                                            </TableHead>
                                            <TableHead className="font-semibold text-[#427452]">
                                                Jawaban
                                            </TableHead>
                                            <TableHead className="text-center font-semibold text-[#427452]">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {faqs.map((faq) => (
                                            <TableRow
                                                key={faq.id}
                                                className="border-b border-gray-100 hover:bg-gray-50/40"
                                            >
                                                <TableCell className="max-w-xs truncate font-medium text-gray-900">
                                                    {faq.question}
                                                </TableCell>
                                                <TableCell className="max-w-md truncate text-gray-700">
                                                    {faq.answer}
                                                </TableCell>
                                                <TableCell className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEdit(faq)
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
                                                            handleDelete(faq.id)
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
                                <HelpCircle className="mb-3 h-12 w-12 text-gray-300" />
                                <p className="text-gray-500">
                                    Belum ada FAQ yang dibuat. Klik tombol
                                    "Tambah FAQ" untuk memulai.
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
                        <AlertDialogTitle>Hapus FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. FAQ akan
                            dihapus secara permanen dari sistem.
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
