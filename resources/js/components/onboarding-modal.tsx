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
                onInteractOutside={(e) => e.preventDefault()}
                className={[
                    // ukuran & style
                    'rounded-3xl border border-[#73AD86]/40 bg-[#F8FFFB] shadow-xl',

                    // MOBILE: full width minus margin, nempel atas, bukan center
                    'w-[calc(100vw-1.5rem)] max-w-[520px]',
                    'top-3 left-1/2 translate-x-[-50%] translate-y-0',

                    // tinggi aman + bisa scroll
                    'p-6 sm:p-8',
                    'overflow-y-auto',

                    // fallback: 100vh, dan kalau browser support 100dvh pakai itu
                    'max-h-[calc(100vh-1.5rem)]',
                    'supports-[height:100dvh]:max-h-[calc(100dvh-1.5rem)]',

                    // DESKTOP: baru center
                    'sm:top-1/2 sm:-translate-y-1/2',
                ].join(' ')}
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
