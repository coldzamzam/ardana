import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { type BreadcrumbItem, type PageProps, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'TOR',
        href: '/dashboard/tor',
    },
];

export default function TorPage({ tors }: { tors: Submisi[] }) {
    const { flash } = usePage<PageProps<SharedData>>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
        jenis_kegiatan: '',
    });

    // Search & filter tahun
    const [search, setSearch] = useState('');
    const [selectedYear, setSelectedYear] = useState<'all' | string>('all');

    // Pagination
    const [page, setPage] = useState(1);
    const itemsPerPage = 3;

    // daftar tahun unik dari data TOR
    const years = useMemo(() => {
        const set = new Set<number>();
        tors.forEach((tor) => {
            const year = new Date(tor.created_at).getFullYear();
            if (!isNaN(year)) set.add(year);
        });
        return Array.from(set).sort((a, b) => b - a); // descending
    }, [tors]);

    // filter berdasarkan search + tahun
    const filteredTors = useMemo(() => {
        const term = search.toLowerCase();

        return tors.filter((tor) => {
            const year = new Date(tor.created_at).getFullYear().toString();
            const matchYear = selectedYear === 'all' || selectedYear === year;

            const text = (tor.judul ?? '') + ' ' + (tor.jenis_kegiatan ?? '');
            const matchSearch = text.toLowerCase().includes(term);

            return matchYear && matchSearch;
        });
    }, [tors, search, selectedYear]);

    // total halaman
    const totalPages = Math.max(
        1,
        Math.ceil(filteredTors.length / itemsPerPage),
    );

    // data per halaman
    const paginatedTors = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredTors.slice(start, start + itemsPerPage);
    }, [filteredTors, page]);

    // kalau filter/search berubah, reset ke halaman 1
    useEffect(() => {
        setPage(1);
    }, [search, selectedYear, tors.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/tor', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    useEffect(() => {
        if (flash.success) {
            console.log(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="TOR" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* TITLE */}
                <div className="w-full">
                    <h1 className="text-2xl font-semibold text-[#427452]">
                        TOR
                    </h1>
                </div>

                {/* BARIS KONTROL: Tambah + Search + Filter Tahun */}
                <div className="mt-2 flex w-full items-center gap-4">
                    {/* KIRI: Dialog Tambah Pengajuan */}
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-md bg-[#73AD86] px-5 py-2 text-white hover:bg-[#5f9772]">
                                + Tambah Pengajuan
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Buat TOR Baru</DialogTitle>
                                <DialogDescription>
                                    Isi form di bawah untuk membuat TOR baru.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="judul">Judul</Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) =>
                                            setData('judul', e.target.value)
                                        }
                                    />
                                    {errors.judul && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.judul}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="jenis_kegiatan">
                                        Jenis Kegiatan
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData('jenis_kegiatan', value)
                                        }
                                        value={data.jenis_kegiatan}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis kegiatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jenisKegiatanOptions.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kegiatan && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.jenis_kegiatan}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Membuat...' : 'Buat TOR'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* TENGAH: Search bar (turun & sejajar) */}
                    <div className="flex flex-1 justify-center">
                        <div className="relative w-full max-w-md">
                            <Input
                                className="w-full rounded-md border border-gray-300 bg-white pr-4 pl-10 shadow-sm"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* KANAN: Filter Tahun */}
                    <div className="flex items-center">
                        <Select
                            value={selectedYear}
                            onValueChange={(value) =>
                                setSelectedYear(value as 'all' | string)
                            }
                        >
                            <SelectTrigger className="w-56 rounded-md border border-gray-300 bg-white text-[#427452] shadow-sm">
                                <div className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 4h18M6 10h12M10 16h4"
                                        />
                                    </svg>
                                    <SelectValue placeholder="Pilih Berdasarkan Tahun" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tahun</SelectItem>
                                {years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* LIST TOR */}
                {filteredTors.length > 0 ? (
                    <div className="mt-4 space-y-4 rounded-2xl bg-[#73AD86] p-4">
                        {paginatedTors.map((tor) => (
                            <div
                                key={tor.id}
                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                <div className="mb-2">
                                    <h2 className="text-lg font-semibold text-[#333]">
                                        {tor.judul}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:flex md:items-center md:justify-between">
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">
                                            Dibuat
                                        </p>
                                        <p className="font-medium">
                                            {format(
                                                new Date(tor.created_at),
                                                'MMMM yyyy',
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">
                                            Jenis Kegiatan
                                        </p>
                                        <p className="font-medium">
                                            {tor.jenis_kegiatan}
                                        </p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">
                                            Dana Diajukan
                                        </p>
                                        <p className="font-medium">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(tor.total_anggaran)}
                                        </p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="font-medium">
                                            {tor.status_submisi.length > 0
                                                ? tor.status_submisi[
                                                      tor.status_submisi
                                                          .length - 1
                                                  ].status
                                                : 'Draft'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 md:items-end">
                                        <Button
                                            variant="outline"
                                            disabled
                                            className="rounded-lg"
                                        >
                                            Buat LPJ
                                        </Button>
                                        <Link href={`/dashboard/tor/${tor.id}`}>
                                            <Button
                                                variant="outline"
                                                className="rounded-lg"
                                            >
                                                Detail TOR
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* PAGINATION */}
                        {filteredTors.length > itemsPerPage && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <Button
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((prev) => Math.max(1, prev - 1))
                                    }
                                    variant="outline"
                                    className="rounded-md"
                                >
                                    Prev
                                </Button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const pg = i + 1;
                                    return (
                                        <Button
                                            key={pg}
                                            onClick={() => setPage(pg)}
                                            variant={
                                                page === pg
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={`rounded-md px-4 ${
                                                page === pg
                                                    ? 'bg-[#427452] text-white'
                                                    : ''
                                            }`}
                                        >
                                            {pg}
                                        </Button>
                                    );
                                })}

                                <Button
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    variant="outline"
                                    className="rounded-md"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-10 text-center">
                        <p>Belum ada TOR yang dibuat.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
