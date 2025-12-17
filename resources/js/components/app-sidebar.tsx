import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type Role, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    ClipboardCheck,
    FileText,
    Folder,
    HelpCircle,
    LayoutGrid,
    ShieldCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    // contoh kalau nanti mau ditambah
    // {
    //   title: 'Documentation',
    //   href: 'https://laravel.com/docs',
    //   icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const hasRole = (roleName: string) => {
        return auth.user?.roles?.some(
            (role: Role) => role.role_name.trim() === roleName,
        );
    };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    if (hasRole('superadmin')) {
        mainNavItems.push(
            {
                title: 'Register User',
                href: '/dashboard/register',
                icon: UserPlus,
            },
            {
                title: 'List Mahasiswa',
                href: '/dashboard/list-mahasiswa',
                icon: Users,
            },
            {
                title: 'List Pegawai',
                href: '/dashboard/list-pegawai',
                icon: Users,
            },
        );
    }

    if (hasRole('admin')) {
        mainNavItems.push({
            title: 'Admin',
            href: '/dashboard/admin',
            icon: ShieldCheck,
        });
    }

    if (hasRole('admin') || hasRole('sekjur') || hasRole('kajur')) {
        mainNavItems.push(
            {
                title: 'Review Submisi',
                href: '/dashboard/review',
                icon: ClipboardCheck,
            },
            {
                title: 'Arsip TOR & LPJ',
                href: '/dashboard/rekap-tor-lpj',
                icon: FileText,
            },
        );
    }

    if (hasRole('mahasiswa') || hasRole('dosen')) {
        mainNavItems.push(
            {
                title: 'TOR',
                href: '/dashboard/submisi/tor',
                icon: BookOpen,
            },
            {
                title: 'LPJ',
                href: '/dashboard/submisi/lpj',
                icon: Folder,
            },
            {
                title: 'FAQ',
                href: '/dashboard/faq',
                icon: HelpCircle,
            },
        );
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-slate-200/70 bg-[#F6FBF8]"
        >
            <SidebarHeader className="flex h-[64px] items-center border-b border-slate-200/70">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href="/dashboard"
                                prefetch
                                className="flex items-center gap-2"
                            >
                                <AppLogo />
                                <span className="font-semibold tracking-tight text-slate-900">
                                    ARDANA
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-3">
                {/* Notification Icon */}
                <SidebarMenu className="px-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Notifikasi' }}
                        >
                            <Link href="/dashboard/notifikasi" prefetch>
                                <Bell />
                                <span>Notifikasi</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Main Navigation */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="mt-auto flex flex-col gap-1 border-t border-slate-200/70 px-2 pt-2 pb-2">
                <NavFooter items={footerNavItems} className="mt-auto" />

                <NavUser />

                <div className="mt-1 flex w-full justify-center text-[11px] text-slate-400">
                    <span className="whitespace-nowrap">
                        &copy; {new Date().getFullYear()} Ardana
                    </span>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
