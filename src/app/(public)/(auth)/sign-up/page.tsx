'use client';

import { Card, CardContent } from '@/components/ui/card';
import SignUpForm from '@/features/SignUp/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="container flex justify-center p-15">
      <Card>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
