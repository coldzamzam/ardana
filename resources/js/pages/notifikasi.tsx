import { useMemo, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

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
    Mail,
    MailOpen,
    MoreVertical,
    Search,
    Star,
    StarOff,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Notifikasi', href: '#' }];

type NotificationCategory = 'utama' | 'pengajuan' | 'sistem';
type TabKey = NotificationCategory | 'semua' | 'favorit';

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
    created_at: string;
};

type NotificationsProps = PageProps<{
    notifications: Notification[];
    years: number[];
}>;

const TABS: { key: TabKey; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'favorit', label: 'Favorit' },
    { key: 'utama', label: 'Utama' },
    { key: 'pengajuan', label: 'Pengajuan TOR & LPJ' },
    { key: 'sistem', label: 'Notifikasi Sistem' },
];

const PER_PAGE = 10;

export default function NotificationsPage({ notifications, years }: NotificationsProps) {
    const { auth } = usePage<SharedData>().props;

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>('semua');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedIndicator, setSelectedIndicator] = useState<string | 'all'>('all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [starredIds, setStarredIds] = useState<number[]>(() =>
        notifications.filter((n) => n.is_starred).map((n) => n.id),
    );

    const [readIds, setReadIds] = useState<number[]>(() =>
        notifications.filter((n) => n.is_read).map((n) => n.id),
    );

    // daftar indikator unik buat dropdown filter
    const indikatorOptions = useMemo<string[]>(
        () =>
            Array.from(
                new Set(
                    notifications
                        .map((n) => n.indikator_kinerja)
                        .filter((txt) => txt && txt.trim().length > 0),
                ),
            ),
        [notifications],
    );

    // inject state lokal ke daftar notifikasi
    const notificationsWithState = useMemo(
        () =>
            notifications.map((n) => ({
                ...n,
                is_starred: starredIds.includes(n.id) || n.is_starred,
                is_read: readIds.includes(n.id) || n.is_read,
            })),
        [notifications, starredIds, readIds],
    );

    const unreadCount = notificationsWithState.filter((n) => !n.is_read).length;

    // filter utama (tab + tahun + indikator + search)
    const filteredNotifications = useMemo(() => {
        let data = notificationsWithState;

        if (activeTab === 'favorit') {
            data = data.filter((n) => n.is_starred);
        } else if (activeTab !== 'semua') {
            data = data.filter((n) => n.category === activeTab);
        }

        if (selectedYear !== 'all') {
            data = data.filter((n) => n.tahun === selectedYear);
        }

        if (selectedIndicator !== 'all') {
            const qInd = selectedIndicator.toLowerCase();
            data = data.filter((n) =>
                n.indikator_kinerja.toLowerCase().includes(qInd),
            );
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

        // sorting: favorit dulu, lalu terbaru
        return [...data].sort((a, b) => {
            if (a.is_starred !== b.is_starred) {
                return b.is_starred ? 1 : -1;
            }
            return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
        });
    }, [
        notificationsWithState,
        activeTab,
        selectedYear,
        selectedIndicator,
        search,
    ]);

    const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PER_PAGE));
    const pageItems = filteredNotifications.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE,
    );

    const allSelectedOnPage =
        pageItems.length > 0 && pageItems.every((n) => selectedIds.includes(n.id));

    // -----------------------------
    // HANDLERS UTAMA
    // -----------------------------

    const toggleSelectAllOnPage = () => {
        if (allSelectedOnPage) {
            setSelectedIds((prev) =>
                prev.filter((id) => !pageItems.some((n) => n.id === id)),
            );
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...pageItems.map((n) => n.id).filter((id) => !prev.includes(id)),
            ]);
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    // MARK READ / UNREAD
    const handleMarkReadUnread = (read: boolean) => {
        if (selectedIds.length === 0) return;

        setReadIds((prev) => {
            if (read) return Array.from(new Set([...prev, ...selectedIds]));
            return prev.filter((id) => !selectedIds.includes(id));
        });

        router.post(
            route(read ? 'notifikasi.markRead' : 'notifikasi.markUnread'),
            { ids: selectedIds },
            { preserveScroll: true },
        );
    };

    // ARCHIVE
    const handleArchive = () => {
        if (selectedIds.length === 0) return;

        router.post(
            route('notifikasi.archive'),
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            },
        );
    };

    // DELETE
    const handleDelete = () => {
        if (selectedIds.length === 0) return;
        if (!confirm('Hapus permanen semua notifikasi terpilih?')) return;

        router.post(
            route('notifikasi.delete'),
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            },
        );
    };

    // FAVORITE
    const handleToggleStar = (id: number) => {
        setStarredIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    // -----------------------------
    // RENDER UI
    // -----------------------------
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi" />

            <div className="flex h-full flex-1 rounded-3xl bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-[#427452]">
                                Notifikasi
                            </h1>

                            {unreadCount > 0 && (
                                <span className="flex h-6 items-center rounded-full bg-[#73AD86] px-2 text-xs font-semibold text-white">
                                    {unreadCount} baru
                                </span>
                            )}
                        </div>

                        <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                            <Search className="mr-1 h-4 w-4 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari notifikasi..."
                                className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* TOOLBAR */}
                    <div className="space-y-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                        {/* Row 1: checkbox + aksi + pagination */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-2 text-xs md:text-sm">
                                <button
                                    onClick={toggleSelectAllOnPage}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white"
                                >
                                    {allSelectedOnPage && <Check className="h-4 w-4" />}
                                </button>

                                <span className="text-slate-500">
                                    {selectedIds.length > 0
                                        ? `${selectedIds.length} dipilih`
                                        : 'Tidak ada yang dipilih'}
                                </span>

                                <div className="ml-3 hidden gap-1 md:flex">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={selectedIds.length === 0}
                                        onClick={() => handleMarkReadUnread(true)}
                                    >
                                        <MailOpen className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={selectedIds.length === 0}
                                        onClick={() => handleMarkReadUnread(false)}
                                    >
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={selectedIds.length === 0}
                                        onClick={handleArchive}
                                    >
                                        <Archive className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={selectedIds.length === 0}
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:gap-3">
                                <span>
                                    {filteredNotifications.length === 0
                                        ? '0 notifikasi'
                                        : `${(currentPage - 1) * PER_PAGE + 1}–${Math.min(
                                              currentPage * PER_PAGE,
                                              filteredNotifications.length,
                                          )} dari ${filteredNotifications.length}`}
                                </span>

                                <div className="flex items-center gap-1 self-start md:self-auto">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
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

                        {/* Row 2: Tabs + filter kanan */}
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {TABS.map((tab) => {
                                    const active = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => {
                                                setActiveTab(tab.key);
                                                setCurrentPage(1);
                                            }}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                active
                                                    ? 'bg-[#73AD86] text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* pojok kanan: filter tahun + indikator */}
                            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                <select
                                    className="h-8 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-600 outline-none"
                                    value={selectedYear}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedYear(
                                            val === 'all' ? 'all' : Number(val),
                                        );
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">Semua tahun</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            Tahun {year}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="h-8 max-w-xs rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-600 outline-none"
                                    value={selectedIndicator}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedIndicator(
                                            val === 'all' ? 'all' : val,
                                        );
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="all">
                                        Semua indikator kinerja
                                    </option>
                                    {indikatorOptions.map((indikator) => (
                                        <option key={indikator} value={indikator}>
                                            {indikator}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* LIST NOTIF */}
                    <div className="mt-2 flex-1 space-y-2 overflow-y-auto rounded-2xl">
                        {pageItems.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg.white text-slate-600 text-sm">
                                Tidak ada notifikasi.
                            </div>
                        ) : (
                            pageItems.map((notif) => {
                                const selected = selectedIds.includes(notif.id);

                                return (
                                    <button
                                        key={notif.id}
                                        className={`group flex w-full items-start gap-3 rounded-2xl border bg-white px-3 py-3 shadow-sm transition hover:shadow-md ${
                                            notif.is_read
                                                ? 'border-transparent'
                                                : 'border-[#73AD86]/40 bg-[#F5FFFA]'
                                        }`}
                                    >
                                        {/* checkbox */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelect(notif.id);
                                            }}
                                            className={`mt-1 flex h-5 w-5 items-center justify-center rounded border ${
                                                selected
                                                    ? 'bg-[#73AD86] border-[#73AD86] text-white'
                                                    : 'border-slate-300'
                                            }`}
                                        >
                                            {selected && <Check className="h-3 w-3" />}
                                        </button>

                                        {/* star */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleStar(notif.id);
                                            }}
                                            className="mt-1 text-[#F5B301] opacity-70 hover:opacity-100"
                                        >
                                            {notif.is_starred ? (
                                                <Star className="h-4 w-4 fill-current" />
                                            ) : (
                                                <StarOff className="h-4 w-4" />
                                            )}
                                        </button>

                                        {/* konten notif */}
                                        <div className="flex flex-1 flex-col gap-1">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-sm font-semibold ${
                                                            notif.is_read
                                                                ? 'text-slate-700'
                                                                : 'text-[#2b5e44]'
                                                        }`}
                                                    >
                                                        {notif.title}
                                                    </span>

                                                    {!notif.is_read && (
                                                        <span className="h-2 w-2 rounded-full bg-[#73AD86]" />
                                                    )}

                                                    <Badge
                                                        variant="outline"
                                                        className="border-[#73AD86]/30 bg-[#E8F7EF] text-[10px]"
                                                    >
                                                        {notif.category.toUpperCase()}
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

                                            <div className="grid gap-3 text-left text-xs text-slate-600 md:grid-cols-4">
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Indikator Kinerja
                                                    </p>
                                                    <p>{notif.indikator_kinerja}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Tahun
                                                    </p>
                                                    <p>{notif.tahun}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Dana
                                                    </p>
                                                    <p>{notif.dana_diajukan}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        Status
                                                    </p>
                                                    <p className="font-medium text-[#427452]">
                                                        {notif.status_pengajuan}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 transition group-hover:opacity-100"
                                        >
                                            <MoreVertical className="h-4 w-4 text-slate-500" />
                                        </Button>
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
