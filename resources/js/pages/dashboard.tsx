import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Banknote,
    CheckCircle,
    FileText,
    Users,
} from 'lucide-react';
import React, { useMemo } from 'react';

// --- IMPORT RECHARTS ---
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';

// --- DEFINISI TIPE DATA ---
interface DashboardData {
    stats?: {
        tor_dibuat: number;
        lpj_dibuat: number;
        tor_disetujui: number;
        lpj_disetujui: number;
    };
    recent_revisions?: Array<{
        id: string;
        judul: string;
        type: string;
        keterangan: string;
        updated_at: string;
    }>;
    tor_stats?: Record<string, number>;
    lpj_stats?: Record<string, number>;
    financials?: {
        total_alokasi: number;
        total_realisasi: number;
    };
    activity?: {
        tor: Array<{ month: string; count: number }>;
        lpj: Array<{ month: string; count: number }>;
    };
    total_users?: number;
}

type ChartDataItem = {
    name: string;
    key: string;
    tor: number;
    lpj: number;
};

interface DashboardProps extends SharedData {
    dashboard_data: DashboardData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ dashboard_data }: DashboardProps) {
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

    // Process activity data for the chart
    const chartData: ChartDataItem[] = useMemo(() => {
        const initialChartData: ChartDataItem[] = Array.from(
            { length: 6 },
            (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                return {
                    name: d.toLocaleString('default', { month: 'short' }),
                    key:
                        d.getFullYear() +
                        '-' +
                        ('0' + (d.getMonth() + 1)).slice(-2),
                    tor: 0,
                    lpj: 0,
                };
            },
        ).reverse();

        const torActivity = dashboard_data.activity?.tor || [];
        const lpjActivity = dashboard_data.activity?.lpj || [];

        initialChartData.forEach((month) => {
            const torData = torActivity.find((d) => d.month === month.key);
            const lpjData = lpjActivity.find((d) => d.month === month.key);
            if (torData) month.tor = torData.count;
            if (lpjData) month.lpj = lpjData.count;
        });

        return initialChartData;
    }, [dashboard_data.activity]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-6">
                <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-md md:flex-row md:items-stretch">
                    {/* KIRI */}
                    <div className="min-w-0 flex-grow pb-2 md:w-2/5 md:pb-0">
                        <div className="flex flex-col justify-between gap-4">
                            <div className="space-y-3 text-[#2f5b3e]">
                                <h1 className="text-xl font-bold text-[#2f5b3e] md:text-3xl">
                                    Selamat Datang <br />
                                    <span>{user.name}!</span>
                                </h1>
                                <p className="text-sm text-[#427452]/90 capitalize">
                                    Status Login:{' '}
                                    <span className="rounded-md border border-[#73AD86]/30 bg-[#73AD86]/20 px-2 font-bold uppercase">
                                        {role}
                                    </span>
                                </p>
                                <p className="text-sm leading-relaxed text-[#2f5b3e]/90">
                                    Sistem Pengelolaan Dana Jurusan TIK PNJ.{' '}
                                    <br />
                                    Pantau status pengajuan, revisi, dan
                                    realisasi anggaran Anda di sini.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KANAN - CHART */}
                    {['admin', 'sekjur', 'kajur'].includes(role) && (
                        <div className="min-w-0 flex-grow md:w-3/5">
                            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-[#427452] p-4 shadow-xl">
                                <div className="absolute top-4 left-6 z-20">
                                    <p className="text-sm font-semibold text-white">
                                        Aktivitas Pengajuan
                                    </p>
                                    <p className="text-xs text-white/60">
                                        6 Bulan Terakhir (Disetujui)
                                    </p>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        barCategoryGap="20%"
                                        barGap={4}
                                    >
                                        <XAxis
                                            dataKey="name"
                                            tick={{
                                                fill: 'white',
                                                fontSize: 10,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            shared={false}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '12px',
                                            }}
                                            itemStyle={{ color: '#427452' }}
                                        />
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255, 255, 255, 0.2)"
                                        />
                                        <Bar
                                            dataKey="tor"
                                            name="TOR"
                                            fill="#F9D87A"
                                        />
                                        <Bar
                                            dataKey="lpj"
                                            name="LPJ"
                                            fill="#82d8d8"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* TAMPILAN MAHASISWA & DOSEN */}
                {(role === 'mahasiswa' || role === 'dosen') &&
                    dashboard_data.stats && (
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-4">
                                <StatCard
                                    label="TOR Dibuat"
                                    value={dashboard_data.stats.tor_dibuat}
                                    icon={
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    }
                                    color="bg-blue-50 text-blue-800"
                                />
                                <StatCard
                                    label="LPJ Dibuat"
                                    value={dashboard_data.stats.lpj_dibuat}
                                    icon={
                                        <FileText className="h-6 w-6 text-indigo-600" />
                                    }
                                    color="bg-indigo-50 text-indigo-800"
                                />
                                <StatCard
                                    label="TOR Disetujui"
                                    value={dashboard_data.stats.tor_disetujui}
                                    icon={
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    }
                                    color="bg-emerald-50 text-emerald-800"
                                />
                                <StatCard
                                    label="LPJ Disetujui"
                                    value={dashboard_data.stats.lpj_disetujui}
                                    icon={
                                        <CheckCircle className="h-6 w-6 text-purple-600" />
                                    }
                                    color="bg-purple-50 text-purple-800"
                                />
                            </div>

                            <div className="rounded-xl border border-[#73AD86]/20 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#2f5b3e]">
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                    Perlu Perbaikan (Revisi Terbaru)
                                </h3>
                                <div className="space-y-3">
                                    {dashboard_data.recent_revisions?.map(
                                        (item, idx) => (
                                            <RevisionItem
                                                key={idx}
                                                type={item.type}
                                                title={item.judul}
                                                note={item.keterangan}
                                                submisiId={item.id}
                                            />
                                        ),
                                    )}

                                    {(!dashboard_data.recent_revisions ||
                                        dashboard_data.recent_revisions
                                            .length === 0) && (
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
                    dashboard_data.financials && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-xl bg-gradient-to-br from-[#427452] to-[#2f5b3e] p-6 text-white shadow-lg">
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
                                            dashboard_data.financials
                                                .total_alokasi,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[#73AD86]/30 bg-white p-6 text-[#2f5b3e] shadow-md">
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
                                            dashboard_data.financials
                                                .total_realisasi,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="rounded-xl border border-[#73AD86]/20 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#2f5b3e]">
                                        <FileText className="h-5 w-5" />{' '}
                                        Statistik Pengajuan TOR
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatItemMini
                                            label="Diajukan"
                                            value={
                                                dashboard_data.tor_stats
                                                    ?.Diajukan
                                            }
                                        />
                                        <StatItemMini
                                            label="Revisi"
                                            value={
                                                dashboard_data.tor_stats?.Revisi
                                            }
                                            isWarning
                                        />
                                        <StatItemMini
                                            label="Divalidasi"
                                            value={
                                                dashboard_data.tor_stats
                                                    ?.Divalidasi
                                            }
                                        />
                                        <StatItemMini
                                            label="Diverifikasi"
                                            value={
                                                dashboard_data.tor_stats
                                                    ?.Diverifikasi
                                            }
                                        />
                                        <StatItemMini
                                            label="Disetujui"
                                            value={
                                                dashboard_data.tor_stats
                                                    ?.Disetujui
                                            }
                                            isSuccess
                                            className="col-span-2"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl border border-[#73AD86]/20 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 flex items-center gap-2 font-bold text-[#2f5b3e]">
                                        <FileText className="h-5 w-5" />{' '}
                                        Statistik Pengajuan LPJ
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatItemMini
                                            label="Diajukan"
                                            value={
                                                dashboard_data.lpj_stats
                                                    ?.Diajukan
                                            }
                                        />
                                        <StatItemMini
                                            label="Revisi"
                                            value={
                                                dashboard_data.lpj_stats?.Revisi
                                            }
                                            isWarning
                                        />
                                        <StatItemMini
                                            label="Divalidasi"
                                            value={
                                                dashboard_data.lpj_stats
                                                    ?.Divalidasi
                                            }
                                        />
                                        <StatItemMini
                                            label="Diverifikasi"
                                            value={
                                                dashboard_data.lpj_stats
                                                    ?.Diverifikasi
                                            }
                                        />
                                        <StatItemMini
                                            label="Disetujui"
                                            value={
                                                dashboard_data.lpj_stats
                                                    ?.Disetujui
                                            }
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
                        <div className="flex items-center justify-between rounded-xl border-l-4 border-[#427452] bg-white p-6 shadow-md">
                            <div>
                                <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                                    Total User
                                </p>
                                <p className="mt-2 text-4xl font-bold text-[#2f5b3e]">
                                    {dashboard_data.total_users || 0}
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
    submisiId,
}: {
    type: string;
    title: string;
    note: string;
    submisiId: string;
}) {
    return (
        <Link href={`/dashboard/submisi/${submisiId}`}>
            <div className="flex items-start gap-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4 transition-all hover:border-orange-300 hover:bg-orange-100">
                <span className="mt-0.5 rounded bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700 shadow-sm">
                    {type}
                </span>
                <div>
                    <p className="text-sm font-semibold text-gray-800">
                        {title}
                    </p>
                    <div className="mt-1 flex items-start gap-1.5">
                        <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-orange-400" />
                        <p className="text-xs text-gray-600 italic">"{note}"</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
