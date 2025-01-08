"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import authService from "@/components/service/auth.service";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const response = await authService.login( email, password)

  if (response.status === 200) {
    const data = response.data
    await createSession(data.id);
    redirect("/dashboard");
  } else {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
