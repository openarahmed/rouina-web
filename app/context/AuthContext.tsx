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
  [key: string]: any; 
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  initializing: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ★★★ পরিবর্তন: Firestore থেকে ডেটা আনার আগে লোডিং স্টেট চালু করা হলো ★★★
        setInitializing(true); 
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data() as UserProfile);
          } else {
            setUserData(null);
          }
          // ★★★ পরিবর্তন: Firestore থেকে ডেটা আনা শেষ হলে লোডিং স্টেট বন্ধ করা হলো ★★★
          setInitializing(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
        setInitializing(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const value = {
    user,
    userData,
    initializing,
  };

  // ★★★ পরিবর্তন: children গুলোকে সবসময় রেন্ডার করা হচ্ছে ★★★
  // এর ফলে ProtectedRoute নিজের লোডিং স্টেট নিজেই পরিচালনা করতে পারবে।
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

