'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

// A fallback component to show on the server and initial client render
function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0915] text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold">Loading...</h1>
            </div>
        </div>
    );
}

// The actual view of the page, which will only render on the client
function SuccessView() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('tran_id');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0915] text-white p-4 sm:p-6 lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(70,_193,_118,_0.15),_transparent_70%)] -z-0"></div>
            
            <div className="relative z-10 text-center bg-[#110D1A]/80 backdrop-blur-sm border border-[#284D37] rounded-2xl p-8 sm:p-12 max-w-2xl w-full shadow-2xl shadow-[#46C176]/10">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
                </div>
                <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight">
                    Payment Successful!
                </h1>
                <p className="mt-4 text-lg text-slate-400">
                    Thank you for your purchase. Your premium features are now unlocked. You can now close this window and return to the app.
                </p>
                {transactionId && (
                    <div className="mt-4 text-sm text-slate-500">
                        <p>Transaction ID: {transactionId}</p>
                    </div>
                )}
                <div className="mt-8">
                    <Link
                        href="/dashboard" // Link to the user's dashboard or app's main page
                        className="inline-flex items-center justify-center px-7 py-3 gap-2 border border-transparent text-base font-semibold rounded-full text-white bg-[#6D46C1] hover:bg-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#6D46C1]/20"
                    >
                        Go to Dashboard <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// A wrapper component that uses Suspense
function SuccessPageContent() {
    return (
        <Suspense fallback={<Loading />}>
            <SuccessView />
        </Suspense>
    );
}

export default function SuccessPage() {
    const [isClient, setIsClient] = useState(false);

    // This hook ensures that the component only renders on the client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // On the server or during the initial render, show the loading component.
    if (!isClient) {
        return <Loading />;
    }

    // Once mounted on the client, render the actual page view.
    return <SuccessPageContent />;
}

