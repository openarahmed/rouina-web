// File: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext"; // ★★★ পরিবর্তন: AuthProvider ইম্পোর্ট করা হয়েছে ★★★

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Routina - Your Daily Planner",
  description: "Plan your day, stay consistent, and reach your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* ★★★ পরিবর্তন: AuthProvider দিয়ে পুরো অ্যাপকে Wrap করা হয়েছে ★★★ */}
        <AuthProvider> 
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}