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
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LPJ',
        href: '/lpj',
    },
];

export default function LpjPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LPJ" />

            {/* OUTER: sama gaya Notifikasi & TOR */}
            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                {/* INNER panel hijau muda */}
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* TITLE */}
                    <div className="w-full">
                        <h1 className="text-2xl font-semibold text-[#427452]">
                            LPJ
                        </h1>
                    </div>

                    {/* BARIS KONTROL: Tambah + Search + Filter Tahun (UI saja, belum fungsi) */}
                    <div className="mt-2 flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
                        {/* KIRI: tombol tambah LPJ (placeholder) */}
                        <Button
                            className="rounded-md bg-[#73AD86] px-5 py-2 text-white hover:bg-[#5f9772]"
                            disabled
                        >
                            Tambah LPJ
                        </Button>

                        {/* TENGAH: Search */}
                        <div className="flex flex-1 justify-center">
                            <div className="relative w-full max-w-md">
                                <Input
                                    className="w-full rounded-md border border-gray-300 bg-white pr-4 pl-10 shadow-sm"
                                    placeholder="Cari LPJ"
                                />
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* KANAN: Filter tahun (dummy) */}
                        <div className="flex justify-start md:justify-end">
                            <Select defaultValue="all">
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
                                    {/* Nanti tahun-tahun dinamis bisa ditambahkan di sini */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* KONTEN: placeholder white card seperti Notifikasi/TOR */}
                    <div className="mt-2 flex-1 space-y-3 overflow-y-auto rounded-2xl">
                        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-600">
                            Belum ada LPJ yang dibuat.
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
