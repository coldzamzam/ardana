import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Banknote,
    CheckCircle,
    FileText,
    Users,
} from 'lucide-react';

// --- IMPORT RECHARTS ---
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// --- DEFINISI TIPE DATA ---
interface DashboardProps extends SharedData {
    stats?: {
        tor_created: number;
        lpj_created: number;
        approved_items: number;
    };
    recent_revisions?: {
        tor: Array<{
            judul_tor: string;
            catatan_revisi: string;
            updated_at: string;
        }>;
        lpj: Array<{
            judul_lpj: string;
            catatan_revisi: string;
            updated_at: string;
        }>;
    };
    tor_stats?: {
        diajukan: number;
        revisi: number;
        tervalidasi: number;
        terverifikasi: number;
        disetujui: number;
    };
    lpj_stats?: {
        diajukan: number;
        revisi: number;
        tervalidasi: number;
        terverifikasi: number;
        disetujui: number;
    };
    financials?: {
        total_alokasi: number;
        total_realisasi: number;
    };
    total_users?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// --- DATA DUMMY GRAFIK ---
const activityData = [
    { name: 'Jan', tor: 4, lpj: 2 },
    { name: 'Feb', tor: 3, lpj: 1 },
    { name: 'Mar', tor: 5, lpj: 3 },
    { name: 'Apr', tor: 8, lpj: 5 },
    { name: 'May', tor: 6, lpj: 4 },
    { name: 'Jun', tor: 9, lpj: 7 },
];

export default function Dashboard(props: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const roleRaw = user?.roles?.[0]?.role_name?.trim() || 'mahasiswa';
    const role = roleRaw.toLowerCase();

    const formatRupiah = (num: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl bg-[#CBEBD5]/60 p-6">
                <div className="grid gap-6 rounded-3xl bg-[#CBEBD5] p-6 shadow-lg md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <div className="flex flex-col justify-between gap-4">
                        <div className="space-y-3 text-[#2f5b3e]">
                            <h1 className="text-2xl font-bold text-[#2f5b3e] md:text-3xl">
                                Selamat Datang, {user.name}!
                            </h1>
                            <p className="text-sm text-[#427452]/90 capitalize">
                                Status Login:{' '}
                                <span className="rounded-md border border-[#73AD86]/30 bg-[#73AD86]/20 px-2 py-0.5 font-bold uppercase">
                                    {role}
                                </span>
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-[#2f5b3e]/90">
                                Sistem Pengelolaan Dana Jurusan TIK PNJ. <br />
                                Pantau status pengajuan, revisi, dan realisasi
                                anggaran Anda di sini.
                            </p>
                        </div>
                    </div>

                    {/* --- GRAFIK RECHARTS --- */}
                    <div className="relative flex hidden items-center justify-center md:flex">
                        <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-[#427452] p-4 shadow-xl">
                            <div className="absolute top-4 left-6 z-20">
                                <p className="text-sm font-semibold text-white">
                                    Aktivitas Pengajuan
                                </p>
                                <p className="text-xs text-white/60">
                                    6 Bulan Terakhir
                                </p>
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient
                                            id="colorTor"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#F9D87A"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#F9D87A"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorLpj"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#ffffff"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#ffffff"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'white', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '12px',
                                        }}
                                        itemStyle={{ color: '#427452' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tor"
                                        stroke="#F9D87A"
                                        fillOpacity={1}
                                        fill="url(#colorTor)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="lpj"
                                        stroke="#ffffff"
                                        fillOpacity={1}
                                        fill="url(#colorLpj)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* TAMPILAN MAHASISWA  */}
                {role === 'mahasiswa' && props.stats && (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <StatCard
                                label="TOR Dibuat"
                                value={props.stats.tor_created}
                                icon={
                                    <FileText className="h-6 w-6 text-blue-600" />
                                }
                                color="bg-blue-50 text-blue-800"
                            />
                            <StatCard
                                label="LPJ Dibuat"
                                value={props.stats.lpj_created}
                                icon={
                                    <FileText className="h-6 w-6 text-emerald-600" />
                                }
                                color="bg-emerald-50 text-emerald-800"
                            />
                            <StatCard
                                label="Disetujui"
                                value={props.stats.approved_items}
                                icon={
                                    <CheckCircle className="h-6 w-6 text-purple-600" />
                                }
                                color="bg-purple-50 text-purple-800"
                            />
                        </div>

                        <div className="rounded-2xl border border-[#73AD86]/20 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#2f5b3e]">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Perlu Perbaikan (Revisi Terbaru)
                            </h3>
                            <div className="space-y-3">
                                {props.recent_revisions?.tor.map(
                                    (item, idx) => (
                                        <RevisionItem
                                            key={`tor-${idx}`}
                                            type="TOR"
                                            title={item.judul_tor}
                                            note={item.catatan_revisi}
                                        />
                                    ),
                                )}
                                {props.recent_revisions?.lpj.map(
                                    (item, idx) => (
                                        <RevisionItem
                                            key={`lpj-${idx}`}
                                            type="LPJ"
                                            title={item.judul_lpj}
                                            note={item.catatan_revisi}
                                        />
                                    ),
                                )}

                                {!props.recent_revisions?.tor.length &&
                                    !props.recent_revisions?.lpj.length && (
                                        <p className="py-4 text-center text-sm text-gray-400 italic">
                                            Tidak ada revisi aktif. Semua aman!
                                        </p>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAMPILAN STAFF (Admin, Sekjur, Kajur) */}
                {['admin', 'sekjur', 'kajur'].includes(role) &&
                    props.financials && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-2xl bg-gradient-to-br from-[#427452] to-[#2f5b3e] p-6 text-white shadow-lg">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-lg bg-white/20 p-2">
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium opacity-90">
                                            Total Alokasi (TOR)
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold tracking-tight">
                                        {formatRupiah(
                                            props.financials.total_alokasi,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#73AD86]/30 bg-white p-6 text-[#2f5b3e] shadow-md">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-lg bg-[#CBEBD5] p-2">
                                            <CheckCircle className="h-5 w-5 text-[#427452]" />
                                        </div>
                                        <span className="text-sm font-medium opacity-80">
                                            Total Realisasi (LPJ)
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold tracking-tight">
                                        {formatRupiah(
                                            props.financials.total_realisasi,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="rounded-2xl border border-[#73AD86]/20 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#2f5b3e]">
                                        <FileText className="h-5 w-5" />{' '}
                                        Statistik Pengajuan TOR
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatItemMini
                                            label="Diajukan"
                                            value={props.tor_stats?.diajukan}
                                        />
                                        <StatItemMini
                                            label="Revisi"
                                            value={props.tor_stats?.revisi}
                                            isWarning
                                        />
                                        <StatItemMini
                                            label="Tervalidasi"
                                            value={props.tor_stats?.tervalidasi}
                                        />
                                        <StatItemMini
                                            label="Terverifikasi"
                                            value={
                                                props.tor_stats?.terverifikasi
                                            }
                                        />
                                        <StatItemMini
                                            label="Disetujui"
                                            value={props.tor_stats?.disetujui}
                                            isSuccess
                                            className="col-span-2"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#73AD86]/20 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#2f5b3e]">
                                        <FileText className="h-5 w-5" />{' '}
                                        Statistik Pengajuan LPJ
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatItemMini
                                            label="Diajukan"
                                            value={props.lpj_stats?.diajukan}
                                        />
                                        <StatItemMini
                                            label="Revisi"
                                            value={props.lpj_stats?.revisi}
                                            isWarning
                                        />
                                        <StatItemMini
                                            label="Tervalidasi"
                                            value={props.lpj_stats?.tervalidasi}
                                        />
                                        <StatItemMini
                                            label="Terverifikasi"
                                            value={
                                                props.lpj_stats?.terverifikasi
                                            }
                                        />
                                        <StatItemMini
                                            label="Disetujui"
                                            value={props.lpj_stats?.disetujui}
                                            isSuccess
                                            className="col-span-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* TAMPILAN SUPERADMIN */}
                {role === 'superadmin' && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center justify-between rounded-2xl border-l-4 border-[#427452] bg-white p-6 shadow-md">
                            <div>
                                <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                                    Total User
                                </p>
                                <p className="mt-2 text-4xl font-bold text-[#2f5b3e]">
                                    {props.total_users || 0}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Terdaftar di sistem
                                </p>
                            </div>
                            <div className="rounded-full bg-[#CBEBD5] p-4 text-[#427452]">
                                <Users className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div
            className={`flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow`}
        >
            <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
        </div>
    );
}

function StatItemMini({
    label,
    value,
    isWarning,
    isSuccess,
    className,
}: {
    label: string;
    value?: number;
    isWarning?: boolean;
    isSuccess?: boolean;
    className?: string;
}) {
    let valueColor = 'text-gray-800';
    if (isWarning) valueColor = 'text-orange-600';
    if (isSuccess) valueColor = 'text-emerald-600';

    return (
        <div
            className={`rounded-lg border border-gray-100 bg-gray-50 p-3 ${className}`}
        >
            <p className="mb-1 text-[10px] font-bold text-gray-400 uppercase">
                {label}
            </p>
            <p className={`text-xl font-bold ${valueColor}`}>{value ?? 0}</p>
        </div>
    );
}

function RevisionItem({
    type,
    title,
    note,
}: {
    type: string;
    title: string;
    note: string;
}) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
            <span className="mt-0.5 rounded bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700 shadow-sm">
                {type}
            </span>
            <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <div className="mt-1 flex items-start gap-1.5">
                    <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-orange-400" />
                    <p className="text-xs text-gray-600 italic">"{note}"</p>
                </div>
            </div>
        </div>
    );
}
