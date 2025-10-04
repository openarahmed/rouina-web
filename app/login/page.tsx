'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import Link from 'next/link';
// 1. next/image থেকে Image component import করা হয়েছে
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

// আইকন কম্পোনেন্ট
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = ({ off }: { off?: boolean }) => off ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const { userData, initializing } = useAuth();

    useEffect(() => {
        // যদি লোডিং শেষ হয় এবং ব্যবহারকারীর ডেটা পাওয়া যায়
        if (!initializing && userData) {
            // যদি ব্যবহারকারী অ্যাডমিন বা সুপারঅ্যাডমিন হয়, তাকে ড্যাশবোর্ডে পাঠানো হবে
            if (userData.role === 'admin' || userData.role === 'superadmin') {
                router.push('/dashboard');
            } else {
                // যদি সাধারণ ব্যবহারকারী হয়, তাকে হোম পেজে পাঠানো হবে
                router.push('/');
            }
        }
    }, [userData, initializing, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // রিডাইরেকশনের কাজ এখন উপরের useEffect করবে
        // 2. 'any' type সরানো হয়েছে এবং error object টি console এ log করা হয়েছে
        } catch (err) {
            console.error("Login failed:", err); // ডিবাগিং এর জন্য error টি log করা হলো
            setError("Failed to log in. Please check your email and password.");
            setLoading(false);
        } 
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    {/* 3. <img> ট্যাগ এর পরিবর্তে <Image> component ব্যবহার করা হয়েছে */}
                    <Image
                        src="https://i.ibb.co/Nny0XrCt/logo.png"
                        alt="Routina Logo"
                        width={96}
                        height={96}
                        className="mx-auto mb-4"
                        priority
                    />
                    <h1 className="text-3xl font-bold text-gray-800">Hello Again!</h1>
                    <p className="text-gray-500 mt-2">Log into your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><MailIcon /></span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1]" required placeholder="Email Address" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><LockIcon /></span>
                        <input type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-3 pl-12 pr-12 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1]" required placeholder="Password" />
                        <button type="button" onClick={() => setPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                            <EyeIcon off={isPasswordVisible} />
                        </button>
                    </div>

                    <div className="text-right">
                        <Link href="/forgot-password" className="text-sm font-semibold text-[#6d46c1] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full mt-2 py-3 font-bold text-white bg-[#6d46c1] rounded-xl hover:bg-[#5b39a8] focus:outline-none disabled:bg-[#a58cd9]">
                        {loading ? 'Logging in...' : 'Continue'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-8">
                    {/* 4. "Don't" এর single quote টি HTML entity দিয়ে replace করা হয়েছে */}
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-semibold text-[#6d46c1] hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
