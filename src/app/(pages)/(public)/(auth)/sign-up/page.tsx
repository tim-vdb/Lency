import type { Metadata } from 'next';
import SignUpForm from '@/front/components/Private/Auth/SignUpForm';

export const metadata: Metadata = {
    title: 'Inscription — Lency',
    description: 'Créez votre compte Lency et rejoignez la communauté des créatifs audiovisuels.',
};

export default function SignUpPage() {
    return (
        <div className="container">
            <SignUpForm />
        </div>
    );
}
