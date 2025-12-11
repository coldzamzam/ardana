import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Lock, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: edit(),
        icon: User,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: Lock,
    },
    // {
    //     title: 'Appearance',
    //     href: editAppearance(),
    //     icon: Palette,
    // },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { url } = usePage();
    const currentPath = url.split('?')[0];

    return (
        <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
            <div className="flex flex-1 flex-col gap-6 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                {/* TITLE (dibikin sama seperti TOR & LPJ) */}
                <div>
                    <h1 className="text-2xl font-semibold text-[#427452]">
                        Pengaturan
                    </h1>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-64 lg:flex-shrink-0">
                        <div className="rounded-2xl border border-[#73AD86]/40 bg-white/90 p-3 shadow-sm">
                            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                Menu
                            </p>
                            <nav className="flex flex-col gap-1">
                                {sidebarNavItems.map((item, index) => {
                                    const href =
                                        typeof item.href === 'string'
                                            ? item.href
                                            : item.href.url;
                                    const isActive = currentPath === href;
                                    const Icon = item.icon;

                                    return (
                                        <Button
                                            key={`${href}-${index}`}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                'w-full justify-start rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-[#427452] text-white hover:bg-[#365d42]'
                                                    : 'bg-transparent text-slate-700 hover:bg-white/70 hover:text-[#427452]',
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <span className="flex items-center gap-2">
                                                    {Icon && (
                                                        <Icon
                                                            className={cn(
                                                                'h-4 w-4',
                                                                isActive
                                                                    ? 'text-white'
                                                                    : 'text-[#427452]',
                                                            )}
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </span>
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* CONTENT CARD */}
                    <div className="flex-1">
                        <div className="max-w-2xl rounded-2xl border border-[#73AD86]/40 bg-white/90 p-4 shadow-sm md:p-6">
                            <section className="space-y-8">{children}</section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
