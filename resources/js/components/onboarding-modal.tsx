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
                className="rounded-3xl border border-[#73AD86]/40 bg-[#F8FFFB] p-6 shadow-xl sm:max-w-[520px] sm:p-8"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="space-y-3 text-left">
                    <DialogTitle className="text-2xl font-semibold text-[#427452]">
                        Lengkapi Profil Anda{' '}
                        {role === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}
                    </DialogTitle>

                    <DialogDescription className="text-base leading-relaxed text-slate-700">
                        NIM/NIP tidak dapat diubah setelah disimpan.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {role === 'mahasiswa' && <MahasiswaOnboardingForm />}
                    {role === 'dosen' && <DosenOnboardingForm />}
                </div>
            </DialogContent>
        </Dialog>
    );
}
