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
            className="border-r border-[#73AD86]/20 bg-[#F6FBF8] shadow-[1px_0_20px_0_rgba(0,0,0,0.02)]"
        >
            <SidebarHeader className="flex h-[72px] items-center border-b border-[#73AD86]/10 px-6 pt-4 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="active:bg-[#427452]/10"
                        >
                            <Link
                                href="/dashboard"
                                prefetch
                                className="flex items-center gap-3.5"
                            >
                                <div className="mr-2 flex h-[72px] items-center">
                                    <AppLogo />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-sans text-xl leading-none font-extrabold tracking-tight text-[#427452]">
                                        ARDANA
                                    </span>
                                    {/* <span className="text-[10px] font-medium text-[#427452]/80 tracking-widest uppercase">
                                        Workspace
                                    </span> */}
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="overflow-hidden px-3 py-6">
                {/* Notification Icon */}
                <SidebarMenu className="mb-4 px-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Notifikasi' }}
                            className="h-10 rounded-xl px-4 py-2.5 text-[#427452]/90 transition-all duration-300 hover:bg-[#427452]/10 hover:pl-5 hover:text-[#427452] hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#427452] data-[active=true]:to-[#365d42] data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-md data-[active=true]:ring-0 data-[active=true]:shadow-[#427452]/20"
                        >
                            <Link
                                href="/dashboard/notifikasi"
                                prefetch
                                className="flex items-center gap-3"
                            >
                                <div className="relative">
                                    <Bell className="size-5 items-center justify-center" />
                                </div>
                                <span className="font-semibold tracking-wide">
                                    Notifikasi
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Main Navigation */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="mt-auto flex flex-col gap-1 border-t border-[#73AD86]/10 bg-white/50 px-4 py-2 backdrop-blur-sm">
                <NavFooter items={footerNavItems} className="mt-auto" />

                <NavUser />

                <div className="flex w-full justify-center text-[10px] font-semibold tracking-widest text-[#427452]/60 uppercase">
                    {/* <span className="whitespace-nowrap">
                        &copy; {new Date().getFullYear()} Ardana
                    </span> */}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
