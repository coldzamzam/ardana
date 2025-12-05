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
import { Bell, BookOpen, Folder, LayoutGrid, UserPlus, Users } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
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
        {
            title: 'Notifikasi',
            href: '/dashboard/notifikasi',
            icon: Bell,
        },
    ];

    if (hasRole('superadmin')) {
        mainNavItems.push({
            title: 'Register User',
            href: '/dashboard/register',
            icon: UserPlus,
        });
        mainNavItems.push({
            title: 'List Mahasiswa',
            href: '/dashboard/list-mahasiswa',
            icon: Users,
        });
        mainNavItems.push({
            title: 'List Pegawai',
            href: '/dashboard/list-pegawai',
            icon: Users,
        });
    }

    if (hasRole('admin') || hasRole('sekjur') || hasRole('kajur')) {
        mainNavItems.push({
            title: 'Review Submisi',
            href: '/dashboard/review',
            icon: BookOpen,
        });
    }

    if (hasRole('mahasiswa') || hasRole('dosen')) {
        mainNavItems.push({
            title: 'TOR',
            href: '/dashboard/tor',
            icon: BookOpen,
        });
        mainNavItems.push({
            title: 'LPJ',
            href: '/dashboard/lpj',
            icon: Folder,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href="/dashboard"
                                prefetch
                                className="flex items-center"
                            >
                                <AppLogo />
                                <span className="ml-2 font-semibold">
                                    ARDANA
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
                <div className="relative z-10 px-2 text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Ardana
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
