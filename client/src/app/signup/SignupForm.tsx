"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import authService from "@/components/service/auth.service";
import { validateSignupData } from "./actions";

type Errors = {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = { name, email, password, confirmPassword };
    const { isValid, errors } = validateSignupData(formData);

    if (!isValid) {
      setErrors(errors);
      setGeneralError("Please fix the errors below to proceed.");
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setGeneralError(null);

    try {
      const response = await authService.signup(name, email, password);

      if (response.status === 201) {
        console.log("Signup successful:", response.message);
        window.location.href = "/login";
      } else {
        console.error("Signup failed:", response.error);
        setGeneralError(`Signup failed: ${response.error}`);
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
    
      if (error instanceof Error) {
        // If the error has a `message` property, display it
        setGeneralError(error.message);
      } else {
        // Fallback for unexpected error types
        setGeneralError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md bg-white">
      {generalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{generalError}</span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-black">Create an Account</CardTitle>
        <CardDescription className="text-center text-gray-600">Sign up for your CourseMind account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors?.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors?.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors?.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-black">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors?.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword[0]}</p>}
          </div>
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 transition-colors">
            Sign Up
          </Button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}