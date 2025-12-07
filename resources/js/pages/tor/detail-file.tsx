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
import { Submisi, SubmisiFile } from '@/types';
import { router, useForm } from '@inertiajs/react';
import {
    ChevronsUpDown,
    Edit,
    File,
    Save,
    Trash2,
    X,
    Info,
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface DetailFileProps {
    submisi: Submisi;
    isEditable: boolean;
}

export default function DetailFile({ submisi, isEditable }: DetailFileProps) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [editingRow, setEditingRow] = React.useState<string | null>(null);
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );
    const [isOpen, setIsOpen] = React.useState(true);

    const { data, setData, post, reset, errors } = useForm<{
        id: string;
        file: File | null;
        nama: string;
        deskripsi: string;
        submisi_id: number;
        _method?: string;
    }>({
        id: '',
        file: null,
        nama: '',
        deskripsi: '',
        submisi_id: submisi.id,
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        // Combine all errors into a single string for display
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

    const handleSaveNew = () => {
        if (!data.file || !data.nama || !data.deskripsi) {
            setValidationError('Semua field wajib diisi.');
            return;
        }
        setValidationError(null); // Clear client-side error before posting
        post('/dashboard/submisi-file', {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            },
            preserveScroll: true,
            onError: (err) => {
                console.error(err);
            },
        });
    };

    const handleEdit = (file: SubmisiFile) => {
        if (!isEditable) return;
        setEditingRow(file.id);
        setData({
            id: file.id,
            nama: file.nama,
            deskripsi: file.deskripsi,
            file: null,
            submisi_id: submisi.id,
        });
        setValidationError(null);
    };

    const handleCancelEdit = () => {
        setEditingRow(null);
        reset();
        setValidationError(null);
    };

    const handleUpdate = () => {
        if (!data.nama || !data.deskripsi) {
            setValidationError('Syarat semua field wajib diisi itu');
            return;
        }
        setValidationError(null); // Clear client-side error before posting
        router.post(
            `/dashboard/submisi-file/${data.id}`,
            {
                ...data,
                _method: 'put',
            },
            {
                onSuccess: () => {
                    setEditingRow(null);
                    reset();
                },
                preserveScroll: true,
                onError: (err) => {
                    console.error(err);
                },
            },
        );
    };

    const handleDelete = (id: string) => {
        router.delete(`/dashboard/submisi-file/${id}`, {
            preserveScroll: true,
        });
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') {
            return <img src="/images/pdf.svg" alt="PDF" className="h-6 w-6" />;
        } else if (['jpg', 'jpeg'].includes(extension || '')) {
            return <img src="/images/jpg.svg" alt="JPG" className="h-6 w-6" />;
        } else if (extension === 'png') {
            return <img src="/images/png.svg" alt="PNG" className="h-6 w-6" />;
        }
        return <File className="h-6 w-6" />;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData((prevData) => ({
            ...prevData,
            file: file,
            nama: file ? file.name : '',
        }));
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                <CollapsibleTrigger asChild>
  <CardHeader className="flex cursor-pointer flex-row items-center justify-between">
    {/* Kiri: title + info */}
    <CardTitle className="flex items-center gap-1 text-xl font-semibold text-[#427452]">
      Lampiran File

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              onClick={(e) => e.preventDefault()}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F5EC]"
            >
              <Info className="h-3 w-3 text-[#427452]" />
            </span>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            sideOffset={6}
            className="bg-white border border-gray-300 text-gray-700 shadow-md rounded-md px-3 py-2"
          >
            Hanya file JPG, JPEG, PNG, dan PDF yang diperbolehkan.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardTitle>

    {/* Kanan: tombol collapse */}
    <Button variant="ghost" size="sm" className="w-9 px-0">
      <ChevronsUpDown className="h-4 w-4" />
      <span className="sr-only">Toggle</span>
    </Button>
  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <Table className="[&_th]:text-center [&_td]:text-center">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    {isEditable && <TableHead>Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submisi.submisi_file?.map((file, index) => (
                                    <TableRow key={file.id}>
                                        {editingRow === file.id && isEditable ? (
                                            <>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    {data.file ? (
                                                        <div className="flex items-center gap-2">
                                                            {getFileIcon(
                                                                data.file.name,
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setData(
                                                                        'file',
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                        >
                                                            Pilih File
                                                        </Button>
                                                    )}
                                                    <Input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={data.nama}
                                                        onChange={(e) =>
                                                            setData(
                                                                'nama',
                                                                e.target.value,
                                                            )
                                                        }
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
                                                <TableCell>
                                                    <a
                                                        href={`/dashboard/submisi-file/${file.id}/download`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {getFileIcon(file.nama)}
                                                    </a>
                                                </TableCell>
                                                <TableCell>{file.nama}</TableCell>
                                                <TableCell>{file.deskripsi}</TableCell>
                                                {isEditable && (
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-3">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleEdit(file)}
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
                                                                        the file.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                file.id,
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
                                            {submisi.submisi_file?.length
                                                ? submisi.submisi_file.length + 1
                                                : 1}
                                        </TableCell>
                                        <TableCell>
                                            {data.file ? (
                                                <div className="flex items-center gap-2">
                                                    {getFileIcon(data.file.name)}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setData('file', null)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                >
                                                    Pilih File
                                                </Button>
                                            )}
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Nama file"
                                                value={data.nama}
                                                onChange={(e) =>
                                                    setData('nama', e.target.value)
                                                }
                                                disabled={!data.file}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Deskripsi file"
                                                value={data.deskripsi}
                                                onChange={(e) =>
                                                    setData('deskripsi', e.target.value)
                                                }
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
                        {isEditable && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={handleAddNew}
                                disabled={isAdding || !!editingRow}
                                className="bg-[#427452] hover:bg-[#365d42] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tambah Lampiran
                            </Button>
                        </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
