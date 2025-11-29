import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function UserProfile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const role = user?.roles?.[0]?.role_name?.trim(); // Get the first role name and trim it

    return (
        <div className="flex items-center">
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {user ? user.name : 'Guest'}
                </span>
                {role && (
                    <span className="truncate text-xs leading-tight text-muted-foreground capitalize">
                        {role}
                    </span>
                )}
            </div>
        </div>
    );
}
