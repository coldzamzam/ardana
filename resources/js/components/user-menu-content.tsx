import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    return (
        <div className="p-1">
            <DropdownMenuLabel className="mb-1 p-0 font-normal">
                <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-[#e9f9ef]">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-[#73AD86]/20" />
            <DropdownMenuGroup>
                <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg text-[#193422]/80 transition-colors duration-200 focus:bg-[#427452]/10 focus:text-[#193422]"
                >
                    <Link
                        href="/dashboard/settings/profile"
                        onClick={cleanup}
                        className="flex w-full items-center py-1"
                    >
                        <Settings className="mr-2.5 h-4 w-4 text-[#427452]/70" />
                        <span className="font-medium tracking-wide">
                            Settings
                        </span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-[#73AD86]/20" />
            <DropdownMenuItem
                asChild
                className="group cursor-pointer rounded-lg text-[#193422]/80 transition-colors duration-200 focus:bg-red-50 focus:text-red-600"
            >
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center py-1 text-left"
                    onFinish={cleanup}
                >
                    <LogOut className="mr-2.5 h-4 w-4 text-[#427452]/70 transition-colors group-focus:text-red-500" />
                    <span className="font-medium tracking-wide">Log out</span>
                </Link>
            </DropdownMenuItem>
        </div>
    );
}
