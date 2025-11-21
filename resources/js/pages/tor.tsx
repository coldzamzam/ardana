import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
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
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'TOR',
        href: '/tor',
    },
];

type Submisi = {
    id: string;
    judul: string;
    jenis_kegiatan: string;
    created_at: string;
    status_submisi: { status: string }[];
};

const jenisKegiatanOptions = [
    'Pelatihan dan Sertifikasi Kompetensi Dosen',
    'Lomba Mahasiswa',
    'Acara Pameran dan Kompetensi',
    'Pengabdian Masyarakat',
    'Acara Kompetisi',
];

export default function TorPage({ tors }: { tors: Submisi[] }) {
    const { flash } = usePage<PageProps<SharedData>>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
        jenis_kegiatan: '',
    });

    // === NEW: state utk search dan filter tahun ===
    const [search, setSearch] = useState('');
    const [selectedYear, setSelectedYear] = useState<'all' | string>('all');

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

            const text =
                (tor.judul ?? '') +
                ' ' +
                (tor.jenis_kegiatan ?? '');
            const matchSearch = text.toLowerCase().includes(term);

            return matchYear && matchSearch;
        });
    }, [tors, search, selectedYear]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tor', {
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

                {/* HEADER: Title + Search */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#427452]">
                            TOR
                        </h1>
                    </div>

                    {/* Search bar ala Figma */}
                    <div className="relative">
                        <Input
                            className="w-64 rounded-md bg-white pl-10 pr-4 border border-gray-300 shadow-sm"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {/* icon search simple */}
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

                {/* ACTION BAR: Tambah + Filter Tahun */}
                <div className="mt-2 flex items-center justify-between gap-3">
                    {/* Dialog Tambah Pengajuan */}
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
                                        <p className="text-xs mt-1 text-red-500">
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
                                        <p className="text-xs mt-1 text-red-500">
                                            {errors.jenis_kegiatan}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Membuat...'
                                            : 'Buat TOR'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Filter Tahun ala "Pilih Berdasarkan Tahun" */}
                    <div className="flex items-center">
                        <Select
                            value={selectedYear}
                            onValueChange={(value) =>
                                setSelectedYear(value as 'all' | string)
                            }
                        >
                            <SelectTrigger className="w-56 rounded-md bg-white border border-gray-300 shadow-sm text-[#427452]">
                                <div className="flex items-center gap-2">
                                    {/* icon filter simple */}
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
                                    <SelectValue
                                        placeholder="Pilih Berdasarkan Tahun"
                                    />
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

                {/* LIST TOR */}
                {filteredTors.length > 0 ? (
                    <div className="mt-4 rounded-2xl bg-[#73AD86]/40 p-4 space-y-4">
                        {filteredTors.map((tor) => (
                            <div
                                key={tor.id}
                                className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm"
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
                                        {/* masih dummy */}
                                        <p className="font-medium">Rp 0</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="font-medium">
                                            {tor.status_submisi.length > 0
                                                ? tor.status_submisi[
                                                      tor.status_submisi.length -
                                                          1
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
                                        <Button
                                            variant="outline"
                                            className="rounded-lg"
                                        >
                                            Detail TOR
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
