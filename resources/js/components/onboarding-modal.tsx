import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import DosenOnboardingForm from './dosen-onboarding-form';
import MahasiswaOnboardingForm from './mahasiswa-onboarding-form';

interface OnboardingModalProps {
    role: 'mahasiswa' | 'dosen';
}

export default function OnboardingModal({ role }: OnboardingModalProps) {
    return (
        <Dialog open={true}>
            <DialogContent
                // ✅ mobile-safe: width ikut layar, tinggi ikut dvh, konten di-manage scroll
                className="max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl border border-[#73AD86]/40 bg-[#F8FFFB] p-0 shadow-xl sm:max-w-[520px]"
                onInteractOutside={(e) => e.preventDefault()}
            >
                {/* WRAPPER flex column */}
                <div className="flex max-h-[calc(100dvh-1.5rem)] flex-col">
                    {/* HEADER fixed */}
                    <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
                        <DialogHeader className="space-y-3 text-left">
                            <DialogTitle className="text-2xl font-semibold text-[#427452]">
                                Lengkapi Profil Anda{' '}
                                {role === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
                            </DialogTitle>

                            <DialogDescription className="text-base leading-relaxed text-slate-700">
                                NIM/NIP tidak dapat diubah setelah disimpan.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* BODY scroll tunggal */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-6 sm:px-8 sm:pb-8">
                        <div className="space-y-4">
                            {role === 'mahasiswa' && (
                                <MahasiswaOnboardingForm />
                            )}
                            {role === 'dosen' && <DosenOnboardingForm />}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
