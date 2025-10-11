'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react'; // Import Suspense
import { ShieldCheck } from 'lucide-react';

// This is the main view of your checkout page.
// All the logic that depends on search params is inside this component.
function CheckoutView() {
    const searchParams = useSearchParams();
    const uid = searchParams.get('uid');
    const plan = searchParams.get('plan');

    const [isLoading, setIsLoading] = useState(false);

    const planDetails = {
        monthly: { amount: 25, currency: 'BDT' },
        yearly: { amount: 250, currency: 'BDT' }
    };
    
    const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.monthly;

    const handlePayment = async () => {
        if (!uid || !plan) {
            alert("Error: User ID or Plan is missing. Please go back and try again.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch('/api/initiate-ssl-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: uid,
                    plan: plan,
                    amount: currentPlan.amount,
                    currency: currentPlan.currency
                }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Payment initiation failed. Please try again.");
            }
        } catch (error) {
            console.error("Failed to initiate payment:", error);
            alert("An error occurred. Please check the console and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!uid || !plan) {
        return (
            <div className="bg-[#0D0915] min-h-screen flex items-center justify-center text-center text-[#D1D5DB]">
                <div>
                    <h1 className="text-2xl font-bold text-[#F3F4F6]">Invalid Checkout Link</h1>
                    <p className="mt-2">User ID or Plan information is missing from the URL.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="relative bg-[#0D0915] min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(109,_70,_193,_0.15),_transparent_70%)] -z-0"></div>
            <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/5 border border-[#2E284D] rounded-2xl shadow-xl backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    <ShieldCheck className="w-12 h-12 text-[#8B5CF6] mb-4" />
                    <h1 className="text-3xl font-extrabold text-[#F3F4F6]">Confirm Your Purchase</h1>
                    <p className="mt-2 text-[#D1D5DB]">You are upgrading to the <strong className="text-white">{plan.charAt(0).toUpperCase() + plan.slice(1)}</strong> plan.</p>
                </div>
                <div className="border-t border-[#2E284D] my-6"></div>
                <div className="space-y-4 text-left text-[#D1D5DB]">
                    <div className="flex justify-between items-center">
                        <span>User ID:</span>
                        <span className="font-mono text-xs bg-[#2E284D] text-[#c0b4f0] py-1 px-2 rounded">{uid}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold">
                        <span className="text-[#F3F4F6]">Total Amount:</span>
                        <span className="text-[#8B5CF6]">{currentPlan.amount} {currentPlan.currency}</span>
                    </div>
                </div>
                <button 
                    onClick={handlePayment} 
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center px-7 py-3 gap-2 border border-transparent text-base font-semibold rounded-full text-white bg-[#6D46C1] hover:bg-[#8B5CF6] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#6D46C1]/20 disabled:bg-gray-700 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : 'Pay and Upgrade Now'}
                </button>
            </div>
        </main>
    );
}

// A themed loading component to show while the page is hydrating
const LoadingState = () => (
    <div className="bg-[#0D0915] min-h-screen flex flex-col items-center justify-center text-center text-[#D1D5DB]">
        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4">Loading Checkout...</p>
    </div>
);

// The main default export for the page. It wraps our component in a Suspense boundary.
export default function CheckoutPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <CheckoutView />
        </Suspense>
    );
}

