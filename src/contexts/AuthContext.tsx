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
import { auth } from '@/lib/firebase';

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
  email: string;
  name: string;
  createdAt: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => { },
  login: async () => { },
  loginWithGoogle: async () => { },
  logout: async () => { },
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
        // Create profile from Firebase Auth data only (no Firestore needed)
        const profile: UserProfile = {
          userId: user.uid,
          email: user.email || '',
          name: user.displayName || 'User',
          createdAt: user.metadata.creationTime || new Date().toISOString(),
        };
        setUserProfile(profile);

        // Store in localStorage for quick access
        localStorage.setItem('user_id', user.uid);
        localStorage.setItem('user_email', user.email || '');
        localStorage.setItem('firebase_uid', user.uid);
      } else {
        setUserProfile(null);
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('firebase_uid');
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Create user profile from Auth data
      const userProfile: UserProfile = {
        userId: user.uid,
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      localStorage.setItem('user_id', user.uid);
      localStorage.setItem('user_email', email);

      setUserProfile(userProfile);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User profile will be set by onAuthStateChanged
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

      // Create profile from Firebase Auth data
      const profile: UserProfile = {
        userId: user.uid,
        email: user.email || '',
        name: user.displayName || 'User',
        createdAt: user.metadata.creationTime || new Date().toISOString(),
      };

      setUserProfile(profile);

      // Store in localStorage
      localStorage.setItem('user_id', user.uid);
      localStorage.setItem('user_email', user.email || '');
      localStorage.setItem('firebase_uid', user.uid);

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
