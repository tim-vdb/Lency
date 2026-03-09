import { Suspense } from 'react';
import LoginForm from '@/front/components/Private/Auth/LoginForm';

export default function SignIn() {
  return (
    <div className=" flex justify-center p-15">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
