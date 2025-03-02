import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseMind",
  description: "AI-powered course management for educators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <nav className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                EDUMind
              </Link>
              <div className="space-x-6 flex items-center">
                <SignedOut>
                  <SignInButton>
                    <button className="hover:bg-white hover:text-black transition-colors duration-300 bg-transparent text-white border border-white px-4 py-2 rounded-md font-semibold">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
