// File: app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Navbar and Footer imports are removed from here
import { AuthProvider } from "./context/AuthContext";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      
      {/* <body> tag is now clean, without any specific theme classes */}
      <body className={inter.className}>
        <AuthProvider>
          {/* Navbar and Footer are no longer here. */}
          {/* This layout now simply renders the children from the route group layouts. */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}