"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    userType: 'normal' | 'student';
    role: 'user' | 'admin' | 'superadmin';
    // 1. [key: string]: any; লাইনটি সরানো হয়েছে no-explicit-any error ঠিক করার জন্য।
    // যদি আপনার UserProfile এ অতিরিক্ত property থাকে, তাহলে সেগুলো এখানে স্পষ্টভাবে define করুন।
}

interface AuthContextType {
    user: User | UserProfile | null; // UserProfile is also a possibility
    userData: UserProfile | null;
    initializing: boolean;
    role: 'user' | 'admin' | 'superadmin' | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    initializing: true,
    role: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | UserProfile | null>(null);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setInitializing(true); 
                const userDocRef = doc(db, 'users', currentUser.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        const profileData = doc.data() as UserProfile;
                        setUserData(profileData);
                        // currentUser এর সাথে role এবং অন্যান্য তথ্য যোগ করা হচ্ছে
                        setUser({ ...currentUser, ...profileData });
                    } else {
                        setUserData(null);
                        setUser(currentUser); // শুধু firebase user object সেট করা হচ্ছে
                    }
                    setInitializing(false);
                });
                return () => unsubscribeSnapshot();
            } else {
                setUser(null);
                setUserData(null);
                setInitializing(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // 2. AuthContextType এর সাথে মিল রাখার জন্য value object এ role যোগ করা হয়েছে
    const value = {
        user,
        userData,
        initializing,
        role: userData?.role || null, // userData থেকে role নেওয়া হচ্ছে
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
