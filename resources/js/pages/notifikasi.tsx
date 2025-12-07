import { useMemo, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
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

// Definisi tipe data untuk payload JSON di kolom `data` notifikasi
type NotificationDataPayload = {
    actor_name: string;
    action_text: string;
    object_title: string;
    link?: string;
    // tambahkan properti lain yang ingin disimpan di sini
};

// Definisi tipe data untuk notifikasi dari database Laravel
type DatabaseNotification = {
    id: string; // ID notifikasi
    user_id: string; // penerima
    type: string; // tipe class notifikasi Laravel
    notifiable_type: string; // model yang terkait
    notifiable_id: string; // id model yang terkait
    data: NotificationDataPayload; // payload JSON
    read_at: string | null; // kapan dibaca
    created_at: string;
    updated_at: string;
};

type NotificationsProps = PageProps<{
    notifications: DatabaseNotification[];
}>;

const PER_PAGE = 10;

export default function NotificationsPage({ notifications }: NotificationsProps) {
    console.log('Props di Frontend:', notifications);
    const { auth } = usePage<SharedData>().props;

    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredNotifications = useMemo(() => {
    let data = notifications;

    if (search.trim()) {
        const q = search.toLowerCase();

        data = data.filter((n) => {
            const text = `
                ${n.data.actor_name ?? ''}
                ${n.data.action_text ?? ''}
                ${n.data.object_title ?? ''}
            `
                .toLowerCase()
                .trim();

            return text.includes(q);
        });
    }
    
    return [...data].sort(
        (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
    );
}, [notifications, search]);

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
            setSelectedIds([]);
        } else {
            setSelectedIds(pageItems.map((n) => n.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleMarkReadUnread = (read: boolean) => {
        if (selectedIds.length === 0) return;
        const url = read ? '/dashboard/notifikasi/mark-read' : '/dashboard/notifikasi/mark-unread';
        router.post(url, { ids: selectedIds }, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm('Hapus permanen semua notifikasi terpilih?')) {
            router.post('/dashboard/notifikasi/delete', { ids: selectedIds }, { 
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
            });
        }
    };

    // Placeholder untuk fitur masa depan
    const handleArchive = () => console.log('Archive:', selectedIds);
    const handleToggleStar = (id: string) => console.log('Toggle star:', id);

    // -----------------------------
    // -----------------------------
    // RENDER UI
    // -----------------------------
    const unreadCount = useMemo(() => notifications.filter(n => !n.read_at).length, [notifications]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifikasi" />

            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
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

                        <div className="relative w-[300px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari Notifikasi"
                                className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* TOOLBAR */}
                    <div className="space-y-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
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
                                {/* Placeholder untuk aksi massal */}
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
                    </div>

                    {/* LIST NOTIF */}
                    <div className="mt-2 flex-1 space-y-2 overflow-y-auto rounded-2xl">
                        {pageItems.length === 0 ? (
                            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-600 text-sm">
                                <p>Tidak ada notifikasi.</p>
                            </div>
                        ) : (
                            pageItems.map((notif) => {
                                const selected = selectedIds.includes(notif.id);
                                const isRead = !!notif.read_at;

                                return (
                                    <button
                                        key={notif.id}
                                        onClick={() => notif.data.link && router.get(notif.data.link)}
                                        className={`group flex w-full items-start gap-3 rounded-2xl border bg-white px-3 py-3 text-left shadow-sm transition hover:shadow-md ${
                                            isRead
                                                ? 'border-transparent'
                                                : 'border-[#73AD86]/40 bg-[#F5FFFA]'
                                        }`}
                                    >
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelect(notif.id);
                                            }}
                                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                                selected
                                                    ? 'bg-[#73AD86] border-[#73AD86] text-white'
                                                    : 'border-slate-300'
                                            }`}
                                        >
                                            {selected && <Check className="h-3 w-3" />}
                                        </div>
                                        
                                        <div className="flex w-full flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {!isRead && (
                                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <p
                                                            className={`text-sm font-semibold ${
                                                                isRead
                                                                    ? 'text-slate-600'
                                                                    : 'text-slate-900'
                                                            }`}
                                                        >
                                                            <strong>{notif.data.actor_name}</strong> {notif.data.action_text}
                                                        </p>
                                                        {notif.data.link ? (
                                                            <a href={notif.data.link} className="text-xs text-blue-600 hover:underline">
                                                                "<em>{notif.data.object_title}</em>"
                                                            </a>
                                                        ) : (
                                                            <p className="text-xs text-slate-500">
                                                                "<em>{notif.data.object_title}</em>"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(
                                                        notif.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                </span>
                                            </div>
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
