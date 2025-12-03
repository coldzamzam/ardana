import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    onboarding: 'mahasiswa' | 'dosen' | null;
    sidebarOpen: boolean;
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: unknown;
}

export interface Role {
    id: string;
    role_name: string;
}

export interface Mahasiswa {
    id: number;
    user_id: string;
    nim: string;
    prodi: string;
}

export interface Dosen {
    id: string;
    nip: string;
    user_id: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    nim?: string;
    prodi?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    mahasiswa?: Mahasiswa;
    dosen?: Dosen;
    [key: string]: unknown; // This allows for additional properties...
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & SharedData;

export interface AnggotaTim {
    id: string;
    user: User;
    created_at: string;
    deleted_at?: string;
}

export interface IndikatorKinerja {
    id: string;
    bulan: string;
    keberhasilan: string;
    target: number;
}

export interface SubmisiFile {
    id: string;
    nama: string;
    file_location: string;
    deskripsi: string;
}

export interface Biaya {
    id: string;
    biaya_satuan: number;
    satuan: string;
    jumlah_kali: number;
    jumlah_org: number;
    deskripsi: string;
}

export interface KegiatanType {
    id: string;
    nama: string;
    created_at: string;
    updated_at: string;
}

export interface StatusType {
    id: string;
    nama: string;
}

export interface StatusSubmisi {
    id: string;
    status_type: StatusType;
    // tambahkan properti lain dari status_submisi jika diperlukan
}

export interface Submisi {
    id: number;
    judul: string;
    kegiatan_type_id: string;
    kegiatan_type?: KegiatanType;
    created_by?: User;
    created_at: string;
    total_anggaran: number;
    anggota_tim: AnggotaTim[];
    status_submisi: StatusSubmisi[];
    indikator_kinerja: IndikatorKinerja[];
    submisi_file?: SubmisiFile[];
    biaya?: Biaya[];
    detail_submisi?: DetailSubmisi;
    [key: string]: unknown;
}

export interface DetailSubmisi {
    gambaran_umum?: string;
    tujuan?: string;
    manfaat?: string;
    metode_pelaksanaan?: string;
    waktu_pelaksanaan?: string;
    iku?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    pic_id?: string;
}
