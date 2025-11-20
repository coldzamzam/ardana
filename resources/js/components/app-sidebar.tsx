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
import { dashboard } from '@/routes';
import { type NavItem, type User, type SharedData, type Role } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, UserPlus } from 'lucide-react';
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
        return auth.user?.roles?.some((role: Role) => role.role_name.trim() === roleName);
    };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (hasRole('superadmin')) {
        mainNavItems.push({
            title: 'Register User',
            href: '/register',
            icon: UserPlus,
        });
    }

    if (hasRole('mahasiswa') || hasRole('dosen')) {
        mainNavItems.push({
            title: 'TOR',
            href: '/tor',
            icon: BookOpen,
        });
        mainNavItems.push({
            title: 'LPJ',
            href: '/lpj',
            icon: Folder,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch className="flex items-center">
                                <AppLogo />
                                <span className="ml-2 font-semibold">ARDANA</span>
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
                <div className="relative z-10 text-sm px-2 text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Ardana
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
