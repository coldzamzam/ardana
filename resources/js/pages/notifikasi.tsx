import { useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem, type PageProps, type SharedData } from '@/types';

import {
    Archive,
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    Mail,
    MailOpen,
    MoreVertical,
    Search,
    Star,
    StarOff,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifikasi',
        href: '#',
    },
];

type NotificationCategory = 'utama' | 'pengajuan' | 'sistem';

type Notification = {
    id: number;
    title: string;
    indikator_kinerja: string;
    tahun: number;
    dana_diajukan: string;
    status_pengajuan: string;
    category: NotificationCategory;
    is_read: boolean;
    is_starred: boolean;
    created_at: string; // ISO date string
};

type NotificationsProps = PageProps<{
    notifications: Notification[];
    years: number[]; // untuk filter tahun
}>;

const CATEGORY_TABS: { key: NotificationCategory | 'semua'; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'utama', label: 'Utama' },
    { key: 'pengajuan', label: 'Pengajuan TOR & LPJ' },
    { key: 'sistem', label: 'Notifikasi Sistem' },
];

const PER_PAGE = 10;

export default function NotificationsPage({
    notifications,
    years,
}: NotificationsProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] =
        useState<(typeof CATEGORY_TABS)[number]['key']>('semua');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // --- Filtering & paging ---

    const filteredNotifications = useMemo(() => {
        let data = notifications;

        if (activeTab !== 'semua') {
            data = data.filter((n) => n.category === activeTab);
        }

        if (selectedYear !== 'all') {
            data = data.filter((n) => n.tahun === selectedYear);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (n) =>
                    n.title.toLowerCase().includes(q) ||
                    n.indikator_kinerja.toLowerCase().includes(q) ||
                    n.status_pengajuan.toLowerCase().includes(q),
            );
        }

        // sort terbaru di atas
        data = [...data].sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        );

        return data;
    }, [notifications, activeTab, selectedYear, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredNotifications.length / PER_PAGE),
    );
    const pageItems = filteredNotifications.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE,
    );

    const allSelectedOnPage =
        pageItems.length > 0 &&
        pageItems.every((n) => selectedIds.includes(n.id));

    // --- Handlers Gmail-like (sementara hanya state lokal) ---

    const toggleSelectAllOnPage = () => {
        if (allSelectedOnPage) {
            setSelectedIds((prev) =>
                prev.filter((id) => !pageItems.some((n) => n.id === id)),
            );
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...pageItems
                    .map((n) => n.id)
                    .filter((id) => !prev.includes(id)),
            ]);
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleMarkReadUnread = (read: boolean) => {
        // TODO: sambungkan ke backend (Inertia) kalau mau persisten
        console.log('mark read/unread', { ids: selectedIds, read });
    };

    const handleArchive = () => {
        // TODO: sambungkan ke backend
        console.log('archive', selectedIds);
    };

    const handleDelete = () => {
        // TODO: sambungkan ke backend
        console.log('delete', selectedIds);
    };

    const handleToggleStar = (id: number) => {
        // TODO: sambungkan ke backend
        console.log('toggle star', id);
    };

    // --- UI ---

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi" />

            {/* Container luar tanpa sidebar kiri */}
            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                {/* Main content */}
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* Header + search */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                Notifikasi
                            </h1>
                            <p className="text-sm text-[#427452]/80">
                                Pantau update pengajuan TOR &amp; LPJ, koreksi,
                                dan informasi penting lainnya di satu tempat.
                            </p>
                        </div>

                        <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                            <Search className="mr-1 h-4 w-4 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari notifikasi (judul, status, indikator)..."
                                className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* Toolbar ala Gmail */}
                    <div className="space-y-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                        {/* Row 1: checkbox + actions + pagination */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-2 text-xs md:text-sm">
                                <button
                                    type="button"
                                    onClick={toggleSelectAllOnPage}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-xs"
                                >
                                    {allSelectedOnPage ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        ''
                                    )}
                                </button>
                                <span className="text-slate-500">
                                    {selectedIds.length > 0
                                        ? `${selectedIds.length} dipilih`
                                        : 'Tidak ada yang dipilih'}
                                </span>

                                <div className="ml-3 hidden items-center gap-1 md:flex">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleMarkReadUnread(true)
                                        }
                                        disabled={selectedIds.length === 0}
                                    >
                                        <MailOpen className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleMarkReadUnread(false)
                                        }
                                        disabled={selectedIds.length === 0}
                                    >
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleArchive}
                                        disabled={selectedIds.length === 0}
                                    >
                                        <Archive className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleDelete}
                                        disabled={selectedIds.length === 0}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between gap-3 text-xs text-slate-500 md:justify-end">
                                <span>
                                    {filteredNotifications.length === 0
                                        ? '0 notifikasi'
                                        : `${(currentPage - 1) * PER_PAGE + 1}–${Math.min(
                                              currentPage * PER_PAGE,
                                              filteredNotifications.length,
                                          )} dari ${
                                              filteredNotifications.length
                                          }`}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(1, p - 1),
                                            )
                                        }
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            )
                                        }
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Tabs + filter tahun */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_TABS.map((tab) => {
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => {
                                                setActiveTab(tab.key);
                                                setCurrentPage(1);
                                            }}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                                isActive
                                                    ? 'bg-[#73AD86] text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 rounded-full border-slate-300 bg-white text-xs"
                                >
                                    <Filter className="h-3 w-3" />
                                    Filter lanjutan
                                </Button>

                                <select
                                    className="h-8 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-600 outline-none"
                                    value={selectedYear}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedYear(
                                            value === 'all'
                                                ? 'all'
                                                : Number(value),
                                        );
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">
                                        Semua tahun pengajuan
                                    </option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            Tahun {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* List notifikasi */}
                    <div className="mt-2 flex-1 space-y-2 overflow-y-auto rounded-2xl">
                        {pageItems.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-center text-sm text-slate-500">
                                <p>
                                    Belum ada notifikasi yang cocok dengan
                                    filter saat ini.
                                </p>
                                <p className="mt-1 text-xs">
                                    Coba ubah kata kunci pencarian atau pilih
                                    tahun lain.
                                </p>
                            </div>
                        ) : (
                            pageItems.map((notif) => {
                                const isSelected = selectedIds.includes(
                                    notif.id,
                                );

                                return (
                                    <button
                                        key={notif.id}
                                        type="button"
                                        className={`group flex w-full items-stretch gap-3 rounded-2xl border bg-white px-3 py-3 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md ${
                                            notif.is_read
                                                ? 'border-transparent'
                                                : 'border-[#73AD86]/50 bg-[#F6FFF9]'
                                        }`}
                                    >
                                        {/* Checkbox + star */}
                                        <div className="flex items-start gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelect(notif.id);
                                                }}
                                                className={`mt-[2px] flex h-5 w-5 items-center justify-center rounded border ${
                                                    isSelected
                                                        ? 'border-[#73AD86] bg-[#73AD86] text-white'
                                                        : 'border-slate-300 bg-white'
                                                }`}
                                            >
                                                {isSelected && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStar(notif.id);
                                                }}
                                                className="mt-[2px] text-[#F5B301] opacity-70 transition hover:opacity-100"
                                            >
                                                {notif.is_starred ? (
                                                    <Star className="h-4 w-4 fill-current" />
                                                ) : (
                                                    <StarOff className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col gap-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`text-sm font-semibold ${
                                                            notif.is_read
                                                                ? 'text-slate-800'
                                                                : 'text-[#235037]'
                                                        }`}
                                                    >
                                                        {notif.title}
                                                    </span>

                                                    {!notif.is_read && (
                                                        <span className="h-2 w-2 rounded-full bg-[#73AD86]" />
                                                    )}

                                                    <Badge
                                                        variant="outline"
                                                        className="border-[#73AD86]/40 bg-[#E9F7EF] px-2 py-0 text-[10px] uppercase tracking-wide text-[#356A47]"
                                                    >
                                                        {notif.category ===
                                                        'utama'
                                                            ? 'UTAMA'
                                                            : notif.category ===
                                                              'pengajuan'
                                                            ? 'PENGAJUAN'
                                                            : 'SISTEM'}
                                                    </Badge>
                                                </div>

                                                <span className="text-xs text-slate-500">
                                                    {new Date(
                                                        notif.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>

                                            <div className="mt-1 grid gap-2 text-xs text-slate-600 md:grid-cols-4">
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Indikator Kinerja
                                                    </p>
                                                    <p className="line-clamp-1">
                                                        {
                                                            notif.indikator_kinerja
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Tahun
                                                    </p>
                                                    <p>{notif.tahun}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Dana Diajukan
                                                    </p>
                                                    <p>{notif.dana_diajukan}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Status Pengajuan
                                                    </p>
                                                    <p className="font-medium text-[#427452]">
                                                        {
                                                            notif.status_pengajuan
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action kebab */}
                                        <div className="flex items-start pt-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 transition group-hover:opacity-100"
                                            >
                                                <MoreVertical className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
