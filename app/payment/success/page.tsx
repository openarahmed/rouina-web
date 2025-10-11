'use client'; 

import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// A fallback component to show while the main component is loading
function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0915] text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">Loading Payment Details...</h1>
                <p className="mt-4 text-lg text-slate-400">Please wait while we confirm your transaction.</p>
            </div>
        </div>
    );
}


function SuccessView() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('tran_id');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0915] text-white p-4 sm:p-6 lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(109,_70,_193,_0.15),_transparent_70%)] -z-0"></div>
            
            <div className="relative z-10 text-center bg-[#110D1A]/80 backdrop-blur-sm border border-[#2E284D] rounded-2xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl shadow-[#6D46C1]/10">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
                </div>
                <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight">
                    Payment Successful!
                </h1>
                <p className="mt-4 text-lg text-slate-400">
                    Thank you for your purchase. Your premium access has been activated.
                </p>

                {transactionId && (
                    <div className="mt-6 text-sm text-slate-500">
                        <p>Transaction ID:</p>
                        <p className="font-mono bg-slate-800/50 inline-block px-2 py-1 rounded-md mt-1">{transactionId}</p>
                    </div>
                )}

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-7 py-3 gap-2 border border-transparent text-base font-semibold rounded-full text-white bg-[#6D46C1] hover:bg-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#6D46C1]/20"
                    >
                        Go to Your Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// --- FINAL FIX: Using next/dynamic to force client-side rendering ---
// This prevents the server from crashing when trying to render useSearchParams.
const DynamicSuccessView = dynamic(() => Promise.resolve(SuccessView), { 
    ssr: false, // This is the key: server-side rendering is disabled
});


// The main page component now wraps the DYNAMIC view in Suspense
export default function SuccessPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DynamicSuccessView />
        </Suspense>
    );
}

