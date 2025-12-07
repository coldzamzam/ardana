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
} from '@/components/ui/collapsible'; // Import Collapsible components
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Submisi, User } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronsUpDown, Loader2, Save, Trash2, X } from 'lucide-react'; // Import ChevronsUpDown
import React from 'react';

interface DetailAnggotaProps {
    submisi: Submisi;
    isEditable: boolean;
}

export default function DetailAnggota({
    submisi,
    isEditable,
}: DetailAnggotaProps) {
    const [showSearch, setShowSearch] = React.useState(false);
    const [mahasiswaSearch, setMahasiswaSearch] = React.useState('');
    const [mahasiswaResult, setMahasiswaResult] = React.useState<User | null>(
        null,
    );
    const [searchError, setSearchError] = React.useState<string | null>(null);
    const [isSearching, setIsSearching] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(true); // State for collapsible

    const handleSearchMahasiswa = async () => {
        if (!mahasiswaSearch.trim()) {
            setSearchError('NIM tidak boleh kosong.');
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        setMahasiswaResult(null);

        try {
            const res = await fetch(
                `/dashboard/mahasiswa/search?nim=${mahasiswaSearch}&submisi_id=${submisi.id}`,
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Terjadi kesalahan');
            }

            const data = await res.json();
            setMahasiswaResult(data);
        } catch (error: any) {
            setSearchError(error.message);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddAnggota = () => {
        if (mahasiswaResult) {
            router.post(
                '/dashboard/anggota-tim',
                {
                    submisi_id: submisi.id,
                    anggota_id: mahasiswaResult.id,
                },
                {
                    preserveScroll: true,
                },
            );
            setMahasiswaResult(null);
            setMahasiswaSearch('');
            setShowSearch(false);
        }
    };

    const handleDeleteAnggota = (anggotaId: string) => {
        router.delete(`/dashboard/anggota-tim/${anggotaId}`, {
            preserveScroll: true,
        });
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
                <CollapsibleTrigger asChild>
                    <CardHeader className="flex cursor-pointer flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-[#427452]">
                            Anggota Tim
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
                                    <TableHead>Nama</TableHead>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Prodi</TableHead>
                                    {isEditable && <TableHead>Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submisi.anggota_tim &&
                                    submisi.anggota_tim.map((anggota) => (
                                        <TableRow key={anggota.id}>
                                            <TableCell>
                                                {anggota.user.name}
                                            </TableCell>
                                            <TableCell>
                                                {anggota.user.mahasiswa?.nim}
                                            </TableCell>
                                            <TableCell>
                                                {anggota.user.mahasiswa?.prodi}
                                            </TableCell>
                                            {isEditable && (
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-3">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>
                                                                        Apakah
                                                                        anda
                                                                        yakin
                                                                        ingin
                                                                        menghapus
                                                                        peserta?
                                                                    </AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Ini akan
                                                                        menghapus
                                                                        peserta
                                                                        dari
                                                                        kegiatan
                                                                        ini.
                                                                        Anda
                                                                        dapat
                                                                        menambahkannya
                                                                        kembali
                                                                        nanti.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>
                                                                        Batal
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() =>
                                                                            handleDeleteAnggota(
                                                                                anggota.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        Lanjutkan
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        {isEditable && (
                            <>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        onClick={() =>
                                            setShowSearch(!showSearch)
                                        }
                                        className="bg-[#427452] text-white hover:bg-[#365d42]"
                                    >
                                        {showSearch ? (
                                            <X className="h-4 w-4" />
                                        ) : (
                                            'Tambah Peserta'
                                        )}
                                    </Button>
                                </div>
                                {showSearch && (
                                    <div className="space-y-4">
                                        <div className="my-4 flex items-center gap-2">
                                            <Input
                                                value={mahasiswaSearch}
                                                onChange={(e) =>
                                                    setMahasiswaSearch(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Cari NIM mahasiswa..."
                                            />
                                            <Button
                                                onClick={handleSearchMahasiswa}
                                            >
                                                Search
                                            </Button>
                                        </div>

                                        {isSearching ? (
                                            <div className="mt-4 flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                            </div>
                                        ) : mahasiswaResult ? (
                                            <Table className="">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Nama
                                                        </TableHead>
                                                        <TableHead>
                                                            NIM
                                                        </TableHead>
                                                        <TableHead>
                                                            Prodi
                                                        </TableHead>
                                                        <TableHead>
                                                            Aksi
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            {
                                                                mahasiswaResult.name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                mahasiswaResult.nim
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                mahasiswaResult.prodi
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                onClick={
                                                                    handleAddAnggota
                                                                }
                                                            >
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            searchError && (
                                                <div className="mt-4 text-center text-red-500">
                                                    {searchError}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
