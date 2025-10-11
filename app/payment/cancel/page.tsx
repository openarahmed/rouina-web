'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
    return (
        <main className="relative bg-[#0D0915] min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
             {/* Background glow matching cancellation theme */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(252,_211,_77,_0.15),_transparent_70%)] -z-0"></div>

            <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/5 border border-[#2E284D] rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
                    <h1 className="text-3xl font-extrabold text-[#F3F4F6]">Payment Canceled</h1>
                    <p className="mt-2 text-[#D1D5DB]">
                        Your payment process was canceled as requested. You have not been charged.
                    </p>
                </div>

                <div className="border-t border-[#2E284D] my-6"></div>

                 <Link
                    href="/"
                    className="w-full inline-flex items-center justify-center px-7 py-3 gap-2 border border-transparent text-base font-semibold rounded-full text-white bg-[#6D46C1] hover:bg-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#6D46C1]/20"
                >
                    Return to Homepage
                </Link>
            </div>
        </main>
    );
}
