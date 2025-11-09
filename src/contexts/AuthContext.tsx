'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  userProfile: UserProfile | null;
}

interface UserProfile {
  userId: string;
  apiKey: string;
  email: string;
  name: string;
  createdAt: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  userProfile: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
          
          // Store in localStorage for quick access
          localStorage.setItem('user_id', userDoc.data().userId);
          localStorage.setItem('api_key', userDoc.data().apiKey);
          localStorage.setItem('user_email', user.email || '');
        }
      } else {
        setUserProfile(null);
        localStorage.removeItem('user_id');
        localStorage.removeItem('api_key');
        localStorage.removeItem('user_email');
      }
      
      setLoading(false);
    });

    // Handle redirect result from Google Sign In
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;
          
          // Check if user profile exists
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (!userDoc.exists()) {
            // Create new user profile for first-time Google sign-in
            const userId = generateUserId();
            const apiKey = generateApiKey();

            const userProfile: UserProfile = {
              userId,
              apiKey,
              email: user.email || '',
              name: user.displayName || 'User',
              createdAt: new Date().toISOString(),
            };

            await setDoc(doc(db, 'users', user.uid), userProfile);
            
            // Store in localStorage
            localStorage.setItem('user_id', userId);
            localStorage.setItem('api_key', apiKey);
            localStorage.setItem('user_email', user.email || '');
            
            setUserProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };

    handleRedirectResult();

    return unsubscribe;
  }, []);

  const generateApiKey = () => {
    return 'rg_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateUserId = () => {
    return 'usr_' + Math.random().toString(36).substring(2, 15);
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Generate user credentials
      const userId = generateUserId();
      const apiKey = generateApiKey();

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        userId,
        apiKey,
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Store in localStorage
      localStorage.setItem('user_id', userId);
      localStorage.setItem('api_key', apiKey);
      localStorage.setItem('user_email', email);
      
      setUserProfile(userProfile);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        setUserProfile(profile);
        
        // Store in localStorage
        localStorage.setItem('user_id', profile.userId);
        localStorage.setItem('api_key', profile.apiKey);
        localStorage.setItem('user_email', email);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // User will be redirected and handled by getRedirectResult in useEffect
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      localStorage.removeItem('user_id');
      localStorage.removeItem('api_key');
      localStorage.removeItem('user_email');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
