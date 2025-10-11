'use client';

import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// A fallback component to show while the main component is loading
function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0915] text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">Loading...</h1>
            </div>
        </div>
    );
}

function FailView() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0915] text-white p-4 sm:p-6 lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,_58,_58,_0.15),_transparent_70%)] -z-0"></div>
            
            <div className="relative z-10 text-center bg-[#110D1A]/80 backdrop-blur-sm border border-[#4D2828] rounded-2xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl shadow-[#C14646]/10">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                    <XCircle className="h-10 w-10 text-red-600" aria-hidden="true" />
                </div>
                <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight">
                    Payment Failed
                </h1>
                <p className="mt-4 text-lg text-slate-400">
                    {/* FIX: Replaced ' with &apos; to fix build error */}
                    Unfortunately, we couldn&apos;t process your payment. No charges were made. Please try again.
                </p>

                <div className="mt-8">
                    <Link
                        href="/checkout?uid=new-attempt&plan=monthly" // A generic retry link
                        className="inline-flex items-center justify-center px-7 py-3 gap-2 border border-transparent text-base font-semibold rounded-full text-white bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
}

const DynamicFailView = dynamic(() => Promise.resolve(FailView), { 
    ssr: false, // Force client-side rendering
});

export default function FailPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DynamicFailView />
        </Suspense>
    );
}

