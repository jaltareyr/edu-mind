"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-black">Welcome Back</CardTitle>
        <CardDescription className="text-center text-gray-600">Login to your CourseMind account</CardDescription>
      </CardHeader>
      <form action={loginAction} className="space-y-4">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input id="email" name="email" placeholder="you@example.com" required />
          </div>
          {state?.errors?.email && (
            <p className="text-red-500">{state.errors.email}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Password" required />
          </div>
          {state?.errors?.password && (
            <p className="text-red-500">{state.errors.password}</p>
          )}

          <SubmitButton />

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="w-full bg-black text-white hover:bg-gray-800">
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}