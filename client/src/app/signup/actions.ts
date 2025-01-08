// actions.ts
import { z } from "zod";

// Zod schema for signup validation
const signupSchema = z
  .object({
    name: z.string().min(1, { message: "Full name is required" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
    confirmPassword: z.string().min(8, { message: "Passwords must match" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

// Function to validate signup data
export const validateSignupData = (data: any) => {
  const result = signupSchema.safeParse(data);
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  return {
    isValid: true,
    errors: {},
  };
};