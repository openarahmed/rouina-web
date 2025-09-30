'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../lib/firebaseConfig';
import Link from 'next/link';

// আইকন কম্পোনেন্টগুলো এখানে তৈরি করা হলো
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const PersonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = ({ off }: { off?: boolean }) => off ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const ChevronDownIcon = ({ open }: { open?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const CheckboxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;


// ড্রপডাউনের জন্য ডেটা
const departmentItems = [
    { label: 'Select Department', value: '' },
    { label: 'Computer Science & Engineering', value: 'CSE' },
    { label: 'Electrical & Electronic Engineering', value: 'EEE' },
    { label: 'English', value: 'ENG' },
    { label: 'Business Administration', value: 'BBA' },
];
const semesterItems = [
    { label: 'Select Semester', value: '' },
    ...Array.from({ length: 12 }, (_, i) => ({ label: `Semester ${i + 1}`, value: `${i + 1}` }))
];
const sectionItems = [
    { label: 'Select Section', value: '' },
    ...'ABCDEFGHIJ'.split('').map(char => ({ label: `Section ${char}`, value: char }))
];


export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [agree, setAgree] = useState(false);
    
    const [userType, setUserType] = useState<'normal' | 'student'>('normal');
    const [showStudentFields, setShowStudentFields] = useState(false);

    const [studentId, setStudentId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [semester, setSemester] = useState('');
    const [section, setSection] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleStudentFields = () => {
        setShowStudentFields(!showStudentFields);
        setUserType(!showStudentFields ? 'student' : 'normal');
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name || !email || !password) { setError('Please fill in all required fields.'); return; }
        if (!agree) { setError('You must agree to the Terms & Conditions.'); return; }
        if (userType === 'student' && (!studentId || !departmentId || !semester || !section)) { setError('Please fill in all student details.'); return; }
        
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let userData: any = { 
                uid: user.uid, 
                name, 
                email, 
                userType, 
                role: 'user', // নতুন ব্যবহারকারীর ডিফল্ট Role
                createdAt: new Date(), 
                profileImageUrl: null 
            };

            if (userType === 'student') {
                userData = { ...userData, studentId, departmentId, semester, section };
            }

            await setDoc(doc(db, "users", user.uid), userData);
            router.push('/login'); // অ্যাডমিন প্যানেলে সরাসরি না পাঠিয়ে লগইন পেজে পাঠানো হলো
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') { setError('This email is already in use.'); } 
            else { setError('Failed to create an account. Please try again.'); }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    {/* Logo */}
                    <img src="https://i.ibb.co/Nny0XrCt/logo.png" alt="Routina Logo" className="w-24 h-24 mx-auto mb-4" onError={(e) => { e.currentTarget.src = 'https://placehold.co/96x96/e9e3f8/6d46c1?text=Logo' }}/>
                    <h1 className="text-3xl font-bold text-gray-800">Create your account</h1>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><PersonIcon /></span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1] border border-transparent" required placeholder="Full Name" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><MailIcon /></span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1] border border-transparent" required placeholder="Email Address" />
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><LockIcon /></span>
                        <input type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full py-3 pl-12 pr-12 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1] border border-transparent" required placeholder="Password" />
                        <button type="button" onClick={() => setPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                            <EyeIcon off={isPasswordVisible} />
                        </button>
                    </div>

                    <div className="border-t border-gray-200" />
                    
                    <div onClick={toggleStudentFields} className="flex justify-between items-center cursor-pointer py-2">
                        <span className="font-semibold text-gray-700">Are you a Student?</span>
                        <span className="text-[#6d46c1]"><ChevronDownIcon open={showStudentFields} /></span>
                    </div>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showStudentFields ? 'max-h-96' : 'max-h-0'}`}>
                        <div className="space-y-4 pt-2">
                            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1]" placeholder="Student ID" />
                            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1]">
                                {departmentItems.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1]">
                                {semesterItems.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                            <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full p-3 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6d46c1]">
                                {sectionItems.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center pt-2">
                        <button type="button" onClick={() => setAgree(!agree)} className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${agree ? 'bg-[#6d46c1] border-[#6d46c1]' : 'bg-white border-gray-300'}`}>
                            {agree && <CheckboxIcon />}
                        </button>
                        <label htmlFor="agree" onClick={() => setAgree(!agree)} className="ml-3 block text-sm text-gray-700 cursor-pointer">
                            I agree with <Link href="/terms" className="font-semibold text-[#6d46c1] hover:underline">Terms & Conditions</Link>
                        </label>
                    </div>

                    {error && <p className="text-sm text-center text-red-500 pt-2">{error}</p>}
                    
                    <button type="submit" disabled={loading || !agree} className="w-full mt-4 py-3 font-bold text-white bg-[#6d46c1] rounded-xl hover:bg-[#5b39a8] focus:outline-none disabled:bg-[#a58cd9] transition-colors">
                        {loading ? 'Creating Account...' : 'Create my account'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-8">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#6d46c1] hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}

