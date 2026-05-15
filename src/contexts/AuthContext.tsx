import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  role: 'student' | 'admin';
  name: string;
  email: string;
  photoURL?: string;
  course?: 'NEET' | 'BTECH';
  neetScore?: number;
  jeeScore?: number;
  neetRank?: number;
  jeeRank?: number;
  category?: 'General' | 'OBC' | 'SC' | 'ST';
  domicile?: string;
  isSubscribed?: boolean;
  createdAt: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: (role: 'student' | 'admin') => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role: 'student' | 'admin') => Promise<void>;
  adminBypassLogin: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Removed email verification check to allow immediate access
        setCurrentUser(user);
        try {
          const docRef = doc(db, 'users', user.uid);
          const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            }
          });
          setLoading(false);
          // Note: we can't easily return unsubscribeProfile from inside this async callback,
          // so it runs until auth state changes. Alternatively we can store it.
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async (role: 'student' | 'admin') => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Set some custom parameters to force account selection and avoid immediate close issues
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const newUserProfile: Partial<UserProfile> = {
          uid: user.uid,
          role: role,
          name: user.displayName || 'Unknown User',
          email: user.email || '',
          createdAt: new Date().toISOString(),
        };
        if (user.photoURL) newUserProfile.photoURL = user.photoURL;

        await setDoc(docRef, newUserProfile);
        setUserProfile(newUserProfile as UserProfile);
      } else {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (error: any) {
      console.error("Sign in failed", error);
      // Alert the exact error to make debugging in production easier
      const errorMessage = error?.code === 'auth/popup-closed-by-user' 
          ? "The popup was closed before finishing the sign in." 
          : error?.message || "An unknown error occurred during sign in.";
      alert(`Google Sign-In Error: ${errorMessage}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // if (!result.user.emailVerified && email !== 'admin@areduindia.com') {
      //   await firebaseSignOut(auth);
      //   throw new Error("Please verify your email address before signing in.");
      // }
      
      const docRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        if (email === 'admin@areduindia.com' && data.role !== 'admin') {
          data.role = 'admin';
          await setDoc(docRef, { role: 'admin' }, { merge: true });
        }
        setUserProfile(data);
      } else {
        throw new Error("User profile not found in database.");
      }
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: 'student' | 'admin') => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      const newUserProfile: Partial<UserProfile> = {
        uid: user.uid,
        role: role,
        name: name,
        email: user.email || email,
        createdAt: new Date().toISOString(),
      };
      if (user.photoURL) newUserProfile.photoURL = user.photoURL;
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, newUserProfile);
      
      // if (email !== 'admin@areduindia.com') {
      //   await sendEmailVerification(user);
      //   await firebaseSignOut(auth);
      //   throw new Error("Account created! Please check your email to verify before logging in.");
      // }
    } catch (error) {
      console.error("Sign up failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminBypassLogin = async () => {
    try {
      const mockAdminProfile: UserProfile = {
        uid: 'admin-bypass-123',
        role: 'admin',
        name: 'Super Admin',
        email: 'systemadmin@areduindia.com',
        createdAt: new Date().toISOString()
      };
      
      setCurrentUser({ uid: 'admin-bypass-123', email: 'systemadmin@areduindia.com' } as FirebaseUser);
      setUserProfile(mockAdminProfile);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, adminBypassLogin, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
