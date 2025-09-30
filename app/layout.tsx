// File: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

// ThemeProvider import সরিয়ে ফেলা হয়েছে
// import { ThemeProvider } from "./context/ThemeContext";

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
    // suppressHydrationWarning সরিয়ে ফেলা হয়েছে কারণ থিম পরিবর্তন হচ্ছে না
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      
      {/* <body> থেকে dark mode এর ক্লাসগুলো সরিয়ে শুধুমাত্র light mode এর ক্লাস রাখা হয়েছে */}
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* ThemeProvider সরিয়ে দেওয়া হয়েছে */}
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}