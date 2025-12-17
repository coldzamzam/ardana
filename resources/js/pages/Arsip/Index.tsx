import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type Submisi } from '@/types';
import { Head } from '@inertiajs/react';
import { Download, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

type ArsipPageProps = PageProps<{
    arsip: Submisi[];
}>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Arsip TOR & LPJ',
        href: '/dashboard/arsip-tor-lpj',
    },
];

export default function ArsipPage({ arsip }: ArsipPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'TOR' | 'LPJ'>('TOR');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Filter for search and type (real-time table display)
    const searchFiltered = useMemo(() => {
        let data = arsip;

        // Filter by search term
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            data = data.filter((item) => {
                const judul = item.judul?.toLowerCase() ?? '';
                const jenis = item.kegiatan_type?.nama?.toLowerCase() ?? '';
                const createdBy = item.created_by?.name?.toLowerCase() ?? '';
                const iku = item.detail_submisi?.iku?.toLowerCase() ?? '';

                return (
                    judul.includes(q) ||
                    jenis.includes(q) ||
                    createdBy.includes(q) ||
                    iku.includes(q)
                );
            });
        }

        // Filter by type (real-time)
        data = data.filter((item) => item.type === filterType);

        return data;
    }, [arsip, searchTerm, filterType]);

    // Filter for export (additional date range filtering)
    const exportFiltered = useMemo(() => {
        return searchFiltered.filter((item) => {
            if (filterStartDate || filterEndDate) {
                const itemStart = item.detail_submisi?.tanggal_mulai
                    ? new Date(item.detail_submisi.tanggal_mulai)
                    : null;

                if (filterStartDate) {
                    const start = new Date(filterStartDate);
                    if (itemStart && itemStart < start) return false;
                }

                if (filterEndDate) {
                    const end = new Date(filterEndDate);
                    if (itemStart && itemStart > end) return false;
                }
            }

            return true;
        });
    }, [searchFiltered, filterStartDate, filterEndDate]);

    const handleExportExcel = () => {
        const data = exportFiltered.map((item) => ({
            'Dibuat Oleh': item.created_by?.name ?? '-',
            Judul: item.judul ?? '-',
            'Tipe Pengajuan': item.type ?? '-',
            'Jenis Kegiatan': item.kegiatan_type?.nama ?? '-',
            'Total Dana Diajukan':
                item.total_anggaran?.toLocaleString('id-ID') ?? '0',
            'Indikator Kinerja': item.detail_submisi?.iku ?? '-',
            'Tanggal Mulai': item.detail_submisi?.tanggal_mulai
                ? new Date(
                      item.detail_submisi.tanggal_mulai,
                  ).toLocaleDateString('id-ID')
                : '-',
            'Tanggal Selesai': item.detail_submisi?.tanggal_selesai
                ? new Date(
                      item.detail_submisi.tanggal_selesai,
                  ).toLocaleDateString('id-ID')
                : '-',
            PIC: item.detail_submisi?.pic?.name ?? '-',
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Arsip TOR & LPJ');
        // Set column widths
        const colWidths = [20, 30, 12, 20, 18, 25, 15, 15, 20];
        ws['!cols'] = colWidths.map((w) => ({ wch: w }));

        XLSX.writeFile(wb, 'Arsip_TOR_LPJ.xlsx');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Arsip TOR & LPJ" />

            <div className="flex h-full w-full max-w-full flex-1 overflow-hidden bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex w-full max-w-full flex-1 flex-col gap-4 overflow-hidden rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER */}
                    <div className="w-full">
                        <h1 className="text-xl font-semibold text-[#427452] md:text-2xl">
                            Arsip TOR & LPJ
                        </h1>
                        <p className="text-xs text-[#427452]/80 md:text-sm">
                            Arsip pengajuan yang telah diterima
                        </p>
                    </div>

                    {/* FILTERS */}
                    <div className="space-y-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                        {/* Row 1: Search - Type */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {/* Search */}
                            <div className="relative w-full">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Cari Pengajuan"
                                    className="w-full rounded-md border border-gray-300 bg-white pr-4 pl-10 text-xs shadow-sm md:text-sm"
                                />
                            </div>

                            {/* Type Filter */}
                            <div>
                                <Select
                                    value={filterType}
                                    onValueChange={(v: 'TOR' | 'LPJ') =>
                                        setFilterType(v)
                                    }
                                >
                                    <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white text-xs shadow-sm md:text-sm">
                                        <SelectValue placeholder="Tipe Pengajuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TOR">TOR</SelectItem>
                                        <SelectItem value="LPJ">LPJ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 2: Date Range - Export */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            {/* Dari Tanggal */}
                            <div>
                                <Input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) =>
                                        setFilterStartDate(e.target.value)
                                    }
                                    placeholder="Dari Tanggal"
                                    className="w-full rounded-md text-xs md:text-sm"
                                />
                            </div>

                            {/* Sampai Tanggal */}
                            <div>
                                <Input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) =>
                                        setFilterEndDate(e.target.value)
                                    }
                                    placeholder="Sampai Tanggal"
                                    className="w-full rounded-md text-xs md:text-sm"
                                />
                            </div>

                            {/* Export Button */}
                            <Button
                                onClick={handleExportExcel}
                                className="gap-2 bg-[#73AD86] text-sm hover:bg-[#5f9772]"
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden md:inline">
                                    Export Excel
                                </span>
                                <span className="md:hidden">Export</span>
                            </Button>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>
                                {searchFiltered.length === 0
                                    ? '0 pengajuan'
                                    : `${searchFiltered.length} pengajuan`}
                            </span>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="mt-2 w-full max-w-full overflow-hidden rounded-2xl border border-[#73AD86]/40 bg-white shadow-sm">
                        {searchFiltered.length > 0 ? (
                            <div className="w-full max-w-full overflow-x-auto">
                                <div className="hidden w-full md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b-2 border-gray-200 hover:bg-gray-50/30">
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    No.
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Dibuat Oleh
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Judul
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Tipe
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Jenis Kegiatan
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Total Dana
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    IKU
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Tanggal Mulai
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    Tanggal Selesai
                                                </TableHead>
                                                <TableHead className="font-semibold whitespace-nowrap text-[#427452]">
                                                    PIC
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {searchFiltered.map(
                                                (item, index) => (
                                                    <TableRow
                                                        key={item.id}
                                                        className="border-b border-gray-100 hover:bg-gray-50/40"
                                                    >
                                                        <TableCell className="w-12 font-medium whitespace-nowrap text-gray-900">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-gray-900">
                                                            {item.created_by
                                                                ?.name ?? '-'}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {item.judul ?? '-'}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                    item.type ===
                                                                    'TOR'
                                                                        ? 'bg-blue-100 text-blue-700'
                                                                        : 'bg-green-100 text-green-700'
                                                                }`}
                                                            >
                                                                {item.type ??
                                                                    '-'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-gray-900">
                                                            {item.kegiatan_type
                                                                ?.nama ?? '-'}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-gray-900">
                                                            {item.total_anggaran
                                                                ? new Intl.NumberFormat(
                                                                      'id-ID',
                                                                      {
                                                                          style: 'currency',
                                                                          currency:
                                                                              'IDR',
                                                                          minimumFractionDigits: 0,
                                                                      },
                                                                  ).format(
                                                                      item.total_anggaran,
                                                                  )
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {item.detail_submisi
                                                                ?.iku ?? '-'}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-gray-900">
                                                            {item.detail_submisi
                                                                ?.tanggal_mulai
                                                                ? new Date(
                                                                      item
                                                                          .detail_submisi
                                                                          .tanggal_mulai,
                                                                  ).toLocaleDateString(
                                                                      'id-ID',
                                                                  )
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-gray-900">
                                                            {item.detail_submisi
                                                                ?.tanggal_selesai
                                                                ? new Date(
                                                                      item
                                                                          .detail_submisi
                                                                          .tanggal_selesai,
                                                                  ).toLocaleDateString(
                                                                      'id-ID',
                                                                  )
                                                                : '-'}
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap text-gray-900">
                                                            {item.detail_submisi
                                                                ?.pic?.name ??
                                                                '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* MOBILE CARD VIEW */}
                                <div className="md:hidden">
                                    <div className="divide-y divide-gray-200">
                                        {searchFiltered.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="border-b border-gray-100 p-4 last:border-b-0 hover:bg-gray-50/40"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="text-xs font-semibold text-[#427452]">
                                                            #{index + 1}
                                                        </div>
                                                        <span
                                                            className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                item.type ===
                                                                'TOR'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-green-100 text-green-700'
                                                            }`}
                                                        >
                                                            {item.type ?? '-'}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Dibuat Oleh
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.created_by
                                                                ?.name ?? '-'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Judul
                                                        </p>
                                                        <p className="line-clamp-2 text-sm font-medium text-gray-900">
                                                            {item.judul ?? '-'}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Jenis Kegiatan
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item
                                                                    .kegiatan_type
                                                                    ?.nama ??
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Total Dana
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item.total_anggaran
                                                                    ? new Intl.NumberFormat(
                                                                          'id-ID',
                                                                          {
                                                                              style: 'currency',
                                                                              currency:
                                                                                  'IDR',
                                                                              minimumFractionDigits: 0,
                                                                          },
                                                                      ).format(
                                                                          item.total_anggaran,
                                                                      )
                                                                    : '-'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Tanggal Mulai
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item
                                                                    .detail_submisi
                                                                    ?.tanggal_mulai
                                                                    ? new Date(
                                                                          item
                                                                              .detail_submisi
                                                                              .tanggal_mulai,
                                                                      ).toLocaleDateString(
                                                                          'id-ID',
                                                                      )
                                                                    : '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Tanggal Selesai
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item
                                                                    .detail_submisi
                                                                    ?.tanggal_selesai
                                                                    ? new Date(
                                                                          item
                                                                              .detail_submisi
                                                                              .tanggal_selesai,
                                                                      ).toLocaleDateString(
                                                                          'id-ID',
                                                                      )
                                                                    : '-'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                IKU
                                                            </p>
                                                            <p className="line-clamp-1 text-sm font-medium text-gray-900">
                                                                {item
                                                                    .detail_submisi
                                                                    ?.iku ??
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                PIC
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item
                                                                    .detail_submisi
                                                                    ?.pic
                                                                    ?.name ??
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center p-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Tidak ada pengajuan yang sesuai dengan
                                    pencarian.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
