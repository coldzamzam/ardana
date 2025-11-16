import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import MahasiswaOnboardingForm from './mahasiswa-onboarding-form';
import DosenOnboardingForm from './dosen-onboarding-form';

interface OnboardingModalProps {
    role: 'mahasiswa' | 'dosen';
}

export default function OnboardingModal({ role }: OnboardingModalProps) {
    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please provide some additional information to continue.
                    </DialogDescription>
                </DialogHeader>
                {role === 'mahasiswa' && <MahasiswaOnboardingForm />}
                {role === 'dosen' && <DosenOnboardingForm />}
            </DialogContent>
        </Dialog>
    );
}
