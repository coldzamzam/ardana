import { usePage } from '@inertiajs/react';
import { SharedData, User } from '@/types';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const role = user?.roles?.[0]?.role_name?.trim(); // Get the first role name and trim it

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold leading-tight">
                    {user ? user.name : 'Guest'}
                </span>
                {role && (
                    <span className="truncate text-xs capitalize leading-tight text-muted-foreground">
                        {role}
                    </span>
                )}
            </div>
        </>
    );
}
