"use client";

import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/features/Login/components/LoginForm";

export default function SignIn() {
  return (
    <div className=" flex justify-center p-15">
      <Card>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
