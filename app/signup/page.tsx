'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // সফলভাবে সাইন আপ হলে ড্যাশবোর্ডে পাঠিয়ে দেওয়া হবে
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Firebase SignUp Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          <p className="mt-2 text-gray-500">Get started with your new admin account</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 transition"
              required
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 transition"
              required
              placeholder="Minimum 6 characters"
            />
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none disabled:bg-purple-400 transition-colors"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-purple-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
