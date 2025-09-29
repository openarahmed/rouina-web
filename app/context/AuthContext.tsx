"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; // আপনার Firebase কনফিগারেশন

// Context এর জন্য টাইপ ডিফাইন করা হচ্ছে
interface AuthContextType {
  user: User | null;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
});

// একটি Provider কম্পোনেন্ট তৈরি করা হচ্ছে
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Firebase থেকে ব্যবহারকারীর লগইন অবস্থার পরিবর্তন শোনা হচ্ছে
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    initializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// একটি কাস্টম হুক তৈরি করা হচ্ছে, যা দিয়ে সহজেই user state পাওয়া যাবে
export const useAuth = () => {
  return useContext(AuthContext);
};
