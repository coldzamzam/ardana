import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { Shield, ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Two-Factor Authentication',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* CARD UTAMA */}
                    <div className="mx-auto w-full max-w-3xl">
                        <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                            {/* HEADER CARD */}
                            <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#73AD86] text-[#ffffff]">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-semibold text-[#2f5d3e]">
                                            Two-Factor Authentication
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Tambahkan lapisan keamanan ekstra
                                            saat login.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {twoFactorEnabled ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                            <span className="mr-1.5 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                            Enabled
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="destructive"
                                            className="bg-red-100 text-red-700 hover:bg-red-100"
                                        >
                                            <span className="mr-1.5 inline-flex h-2 w-2 rounded-full bg-red-500" />
                                            Disabled
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* ISI CARD */}
                            <div className="space-y-6 p-6 md:p-8">
                                {twoFactorEnabled ? (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-base font-semibold text-[#2f5d3e]">
                                                Status: 2FA aktif
                                            </h3>
                                            <p className="text-sm text-muted-foreground"></p>
                                        </div>

                                        {/* KODE RECOVERY */}
                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={
                                                recoveryCodesList
                                            }
                                            fetchRecoveryCodes={
                                                fetchRecoveryCodes
                                            }
                                            errors={errors}
                                        />

                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <p className="text-xs text-muted-foreground">
                                                Nonaktifkan 2FA hanya jika kamu
                                                benar-benar yakin dan paham
                                                risikonya.
                                            </p>
                                            <Form {...disable.form()}>
                                                {({ processing }) => (
                                                    <Button
                                                        variant="destructive"
                                                        type="submit"
                                                        disabled={processing}
                                                        className="inline-flex items-center gap-2 rounded-full px-4"
                                                    >
                                                        <ShieldBan className="h-4 w-4" />
                                                        Disable 2FA
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-base font-semibold text-[#2f5d3e]">
                                                Aktifkan Two-Factor
                                                Authentication
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Pastikan kamu sudah menyiapkan
                                                aplikasi autentikator sebelum
                                                memulai proses ini.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            {hasSetupData ? (
                                                <Button
                                                    onClick={() =>
                                                        setShowSetupModal(true)
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-full bg-[#73AD86] px-5 hover:bg-[#5f9772]"
                                                >
                                                    <ShieldCheck className="h-4 w-4" />
                                                    Continue setup
                                                </Button>
                                            ) : (
                                                <Form
                                                    {...enable.form()}
                                                    onSuccess={() =>
                                                        setShowSetupModal(true)
                                                    }
                                                >
                                                    {({ processing }) => (
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-full bg-[#73AD86] px-5 hover:bg-[#5f9772]"
                                                        >
                                                            <ShieldCheck className="h-4 w-4" />
                                                            Enable 2FA
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MODAL SETUP QR / MANUAL KEY */}
                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
