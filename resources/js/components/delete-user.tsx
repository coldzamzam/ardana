import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useRef } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            {/* Danger zone card */}
            <div className="rounded-2xl border border-red-200 bg-white/90 p-5 shadow-sm">
                {/* Header row */}
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                            <p className="text-xs font-semibold tracking-wide text-red-600 uppercase">
                                Delete Account
                            </p>
                            <p className="text-sm font-medium text-slate-800">
                                This action is irreversible
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="mb-4 max-w-xl text-xs leading-relaxed text-slate-600">
                    Deleting your account will permanently erase all data
                    associated with it, including your profile, settings, and
                    any other stored information. Please make sure you have
                    exported or saved everything you need before continuing.
                </p>

                {/* Delete button + dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="mt-1 inline-flex rounded-md px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md"
                            data-test="delete-user-button"
                        >
                            Delete account
                        </Button>
                    </DialogTrigger>

                    {/* Dialog Box */}
                    <DialogContent className="rounded-2xl border border-red-200/60 bg-white p-6 shadow-2xl sm:max-w-md">
                        <DialogHeader className="space-y-3 text-left">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                </span>
                                <DialogTitle className="text-base font-semibold text-red-700">
                                    Are you sure you want to delete your
                                    account?
                                </DialogTitle>
                            </div>

                            <DialogDescription className="mt-1 text-sm leading-relaxed text-slate-600">
                                This action cannot be undone. All resources and
                                data associated with your account will be
                                permanently removed. Please confirm this action
                                by entering your password below.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Form */}
                        <Form
                            {...ProfileController.destroy.form()}
                            options={{ preserveScroll: true }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-5 pt-2"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-slate-800"
                                        >
                                            Password
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Enter your password to confirm"
                                            autoComplete="current-password"
                                            className="bg-white text-sm"
                                        />

                                        <InputError
                                            message={errors.password}
                                            className="mt-1 text-xs"
                                        />
                                    </div>

                                    {/* Footer Buttons */}
                                    <DialogFooter className="mt-1 flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-lg border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                            className="rounded-lg px-4 text-sm font-semibold"
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                {processing
                                                    ? 'Deleting...'
                                                    : 'Yes, delete my account'}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
