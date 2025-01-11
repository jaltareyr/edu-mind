"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  useAuth, 
  useUser,
  SignInButton,
  SignedOut
} from '@clerk/nextjs'
import { useRouter } from "next/navigation";
import authService from "@/components/service/authService"

export default function LandingPage() {
  
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const createUser = async () => {
      // Check if the user is signed in and run the backend user creation logic
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          // Check if user already exists
          const res = await authService.check(token || "", user.id);
          if (res.status == 200) {
          const DBuser = res.data.user
        }
          else {
            // Call the authService signup method and wait for the response
            const response = await authService.signup(
              user.id,
              user.primaryEmailAddress?.emailAddress || "undefined",
              `${user.firstName || "undefined"} ${user.lastName || "undefined"}`
            );
            const DBuser = response.data
    
            // Check if the signup was successful
            if (response.status === 201 || response.status === 200) {
              console.log("User created successfully in MongoDB:", response.data);
            } else {
              console.error("Failed to create user in the backend:", response.status, response.data);
            }
          } 

          // store mongoDB userId in JWT claims

          router.push("/dashboard");
        } catch (error: any) {
          // Handle errors from the signup call
          console.error("An error occurred while creating the user in the backend:", error.message);
        }
      }
    };
  
    createUser(); // Execute the async function
  }, [isSignedIn, user]);
  

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to EDUMind</h1>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mb-6">
            EDUMind is an intuitive platform designed for educators to create and manage course assignments and quizzes effortlessly. Leveraging AI, it allows professors to transform their lecture notes into dynamic assessments and organized course materials.
          </p>
          <p className="mb-6">
            The platform promotes structured course management by categorizing materials into modules, chapters, and assignments, displayed neatly on a user-friendly dashboard.
          </p>
          <div className="mt-8">
            {/* "Get Started" button linking to login */}
            <SignedOut>
              <SignInButton>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 text-gray-600 p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 EDUMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}