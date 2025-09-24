"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
