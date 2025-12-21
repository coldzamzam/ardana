import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="mt-2 mb-3 px-4 text-[11px] font-bold tracking-[0.15em] text-[#427452]/70 uppercase">
                Menu
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const itemUrl =
                        typeof item.href === 'string'
                            ? item.href
                            : item.href.url;
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={
                                    itemUrl === '/dashboard'
                                        ? page.url === '/dashboard'
                                        : page.url.startsWith(itemUrl)
                                }
                                tooltip={{ children: item.title }}
                                className="group relative h-auto overflow-hidden rounded-xl px-4 py-2.5 font-semibold text-[#427452]/90 transition-all duration-300 hover:bg-[#427452]/10 hover:pl-5 hover:text-[#427452] hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#427452] data-[active=true]:to-[#365d42] data-[active=true]:font-semibold data-[active=true]:text-white data-[active=true]:shadow-md data-[active=true]:ring-0 data-[active=true]:shadow-[#427452]/20"
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex items-center gap-3.5"
                                >
                                    {item.icon && (
                                        <item.icon className="size-[18px] transition-transform duration-300 group-data-[active=true]:text-white/90" />
                                    )}
                                    <span className="text-sm tracking-wide">
                                        {item.title}
                                    </span>

                                    {/* Active Decorator - subtle glow */}
                                    <div className="pointer-events-none absolute inset-0 bg-white/20 opacity-0 mix-blend-overlay group-data-[active=true]:opacity-100" />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
