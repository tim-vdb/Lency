import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/front/components/Private/Auth/LoginForm';

export const metadata: Metadata = {
    title: 'Connexion — Lency',
    description: 'Connectez-vous à votre compte Lency pour accéder à la communauté créative.',
};

export default function SignIn() {
  return (
    <div className="container">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
