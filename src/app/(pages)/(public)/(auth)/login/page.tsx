import { Suspense } from 'react';
import LoginForm from '@/front/components/Private/Auth/LoginForm';

export default function SignIn() {
  return (
    <div className="container">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
