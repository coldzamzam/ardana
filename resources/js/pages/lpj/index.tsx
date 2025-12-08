import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Submisi } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LPJ',
        href: '/dashboard/submisi/lpj',
    },
];

export default function LpjPage({ lpjs }: { lpjs: Submisi[] }) {
    // Search & filter tahun
    const [search, setSearch] = useState('');
    const [selectedYear, setSelectedYear] = useState<'all' | string>('all');

    // Pagination
    const [page, setPage] = useState(1);
    const itemsPerPage = 3;

    // daftar tahun unik dari data LPJ
    const years = useMemo(() => {
        const set = new Set<number>();
        lpjs.forEach((lpj) => {
            const year = new Date(lpj.created_at).getFullYear();
            if (!isNaN(year)) set.add(year);
        });
        return Array.from(set).sort((a, b) => b - a); // descending
    }, [lpjs]);

    // filter berdasarkan search + tahun
    const filteredLpjs = useMemo(() => {
        const term = search.toLowerCase();

        return lpjs.filter((lpj) => {
            const year = new Date(lpj.created_at).getFullYear().toString();
            const matchYear = selectedYear === 'all' || selectedYear === year;

            const text =
                (lpj.judul ?? '') + ' ' + (lpj.kegiatan_type?.nama ?? '');
            const matchSearch = text.toLowerCase().includes(term);

            return matchYear && matchSearch;
        });
    }, [lpjs, search, selectedYear]);

    // total halaman
    const totalPages = Math.max(
        1,
        Math.ceil(filteredLpjs.length / itemsPerPage),
    );

    // data per halaman
    const paginatedLpjs = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredLpjs.slice(start, start + itemsPerPage);
    }, [filteredLpjs, page]);

    // kalau filter/search berubah, reset ke halaman 1
    useEffect(() => {
        setPage(1);
    }, [search, selectedYear, lpjs.length]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LPJ" />

            {/* OUTER sama seperti notifikasi */}
            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                {/* INNER panel hijau muda */}
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* TITLE */}
                    <div className="w-full">
                        <h1 className="text-2xl font-semibold text-[#427452]">
                            LPJ
                        </h1>
                    </div>

                    {/* BARIS KONTROL: Search + Filter Tahun */}
                    <div className="mt-2 flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
                        {/* TENGAH: Search */}
                        <div className="flex flex-1 justify-center">
                            <div className="relative w-full max-w-md">
                                <Input
                                    className="w-full rounded-md border border-gray-300 bg-white pr-4 pl-10 shadow-sm"
                                    placeholder="Cari LPJ"
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
                        <div className="flex justify-start md:justify-end">
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
                                        <SelectValue placeholder="Pilih berdasarkan tahun" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Tahun
                                    </SelectItem>
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

                    {/* LIST LPJ */}
                    {filteredLpjs.length > 0 ? (
                        <div className="mt-2 flex-1 space-y-3 overflow-y-auto rounded-2xl">
                            {paginatedLpjs.map((lpj) => (
                                <div
                                    key={lpj.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="mb-2">
                                        <h2 className="text-lg font-semibold text-[#333]">
                                            {lpj.judul}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 md:flex md:items-center md:justify-between">
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">
                                                Oleh
                                            </p>
                                            <p className="font-medium">
                                                {lpj.created_by?.name}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">
                                                Dibuat
                                            </p>
                                            <p className="font-medium">
                                                {format(
                                                    new Date(lpj.created_at),
                                                    'MMMM yyyy',
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">
                                                Jenis Kegiatan
                                            </p>
                                            <p className="font-medium">
                                                {lpj.kegiatan_type?.nama}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">
                                                Dana Diajukan
                                            </p>
                                            <p className="font-medium">
                                                {new Intl.NumberFormat(
                                                    'id-ID',
                                                    {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                    },
                                                ).format(lpj.total_anggaran)}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">
                                                Status
                                            </p>
                                            <p className="font-medium">
                                                {lpj.status_submisi.length > 0
                                                    ? lpj.status_submisi[
                                                          lpj.status_submisi
                                                              .length - 1
                                                      ].status_type.nama
                                                    : 'Draft'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2 md:items-end">
                                            {lpj.parent_tor_id && (
                                                <Link
                                                    href={`/dashboard/submisi/${lpj.parent_tor_id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-lg"
                                                    >
                                                        Lihat TOR Asal
                                                    </Button>
                                                </Link>
                                            )}
                                            <Link
                                                href={`/dashboard/submisi/${lpj.id}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="rounded-lg"
                                                >
                                                    Detail LPJ
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* PAGINATION */}
                            {filteredLpjs.length > itemsPerPage && (
                                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600">
                                    <Button
                                        disabled={page === 1}
                                        onClick={() =>
                                            setPage((prev) =>
                                                Math.max(1, prev - 1),
                                            )
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
                        // EMPTY STATE
                        <div className="mt-2 flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-600">
                            Belum ada LPJ yang dibuat.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
