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
  signInWithPopup,
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
        try {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
            
            // Store in localStorage for quick access
            localStorage.setItem('user_id', userDoc.data().userId);
            localStorage.setItem('api_key', userDoc.data().apiKey);
            localStorage.setItem('user_email', user.email || '');
            localStorage.setItem('firebase_uid', user.uid);
          } else {
            // User exists in Auth but not in Firestore - use uid as fallback
            localStorage.setItem('user_id', user.uid);
            localStorage.setItem('user_email', user.email || '');
            localStorage.setItem('firebase_uid', user.uid);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to Firebase user data if Firestore fails
          localStorage.setItem('user_id', user.uid);
          localStorage.setItem('user_email', user.email || '');
          localStorage.setItem('firebase_uid', user.uid);
        }
      } else {
        setUserProfile(null);
        localStorage.removeItem('user_id');
        localStorage.removeItem('api_key');
        localStorage.removeItem('user_email');
        localStorage.removeItem('firebase_uid');
      }
      
      setLoading(false);
    });

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
        localStorage.setItem('firebase_uid', user.uid);
      } else {
        // Create profile if it doesn't exist (for users created before profile system)
        const userId = generateUserId();
        const apiKey = generateApiKey();
        const newProfile: UserProfile = {
          userId,
          apiKey,
          email,
          name: user.displayName || 'User',
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', user.uid), newProfile);
        setUserProfile(newProfile);
        localStorage.setItem('user_id', userId);
        localStorage.setItem('api_key', apiKey);
        localStorage.setItem('user_email', email);
        localStorage.setItem('firebase_uid', user.uid);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Provide user-friendly error messages
      const errorCode = error.code;
      let message = 'Failed to login';
      switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message = 'Invalid email or password. Please check your credentials.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later.';
          break;
        default:
          message = error.message || 'Failed to login';
      }
      throw new Error(message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile exists in Firestore
      try {
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
          setUserProfile(userProfile);
          
          // Store in localStorage
          localStorage.setItem('user_id', userId);
          localStorage.setItem('api_key', apiKey);
          localStorage.setItem('user_email', user.email || '');
          localStorage.setItem('firebase_uid', user.uid);
        } else {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          localStorage.setItem('user_id', profile.userId);
          localStorage.setItem('api_key', profile.apiKey);
          localStorage.setItem('user_email', user.email || '');
          localStorage.setItem('firebase_uid', user.uid);
        }
      } catch (firestoreError) {
        console.error('Firestore error during Google login:', firestoreError);
        // Still allow login even if Firestore fails
        localStorage.setItem('user_id', user.uid);
        localStorage.setItem('user_email', user.email || '');
        localStorage.setItem('firebase_uid', user.uid);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      // Handle specific Google sign-in errors
      const errorCode = error.code;
      let message = 'Failed to login with Google';
      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          message = 'Sign-in popup was closed. Please try again.';
          break;
        case 'auth/popup-blocked':
          message = 'Popup was blocked by browser. Please allow popups for this site.';
          break;
        case 'auth/cancelled-popup-request':
          message = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection.';
          break;
        default:
          message = error.message || 'Failed to login with Google';
      }
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      localStorage.removeItem('user_id');
      localStorage.removeItem('api_key');
      localStorage.removeItem('user_email');
      localStorage.removeItem('firebase_uid');
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
