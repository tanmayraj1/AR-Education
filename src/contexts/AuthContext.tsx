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
  category?: 'General' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS' | 'OBC' | string;
  domicile?: string;
  mobile?: string;
  gender?: string;
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
          // Try to get the doc first before setting up the listener
          // If it fails with offline, we can still set a fallback profile
          getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            } else {
              // Construct a basic profile from auth user if it doesn't exist in FS
              setUserProfile({
                  uid: user.uid,
                  email: user.email || '',
                  name: user.displayName || 'Unknown User',
                  role: 'student', // Default assumed
                  createdAt: new Date().toISOString()
              } as UserProfile);
            }
            setLoading(false);
          }).catch(err => {
             console.warn("Firestore access failed, using fallback profile", err);
             setUserProfile({
                  uid: user.uid,
                  email: user.email || '',
                  name: user.displayName || 'Unknown User',
                  role: 'student', // Default assumed
                  createdAt: new Date().toISOString()
              } as UserProfile);
              setLoading(false);
          });
          
          // Set up snapshot listener in background
          onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            }
          }, (err) => {
             console.warn("Snapshot listener failed", err);
          });
          
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback profile
          setUserProfile({
              uid: user.uid,
              email: user.email || '',
              name: user.displayName || 'Unknown User',
              role: 'student',
              createdAt: new Date().toISOString()
          } as UserProfile);
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
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      let docExists = false;
      let existingData = null;
      
      try {
        const docSnap = await getDoc(docRef);
        docExists = docSnap.exists();
        if (docExists) {
            existingData = docSnap.data();
        }
      } catch (err) {
        console.warn("Could not fetch user profile during sign in", err);
      }

      if (!docExists) {
        const newUserProfile: Partial<UserProfile> = {
          uid: user.uid,
          role: role,
          name: user.displayName || 'Unknown User',
          email: user.email || `${user.uid}@no-email.areduindia.com`,
          createdAt: new Date().toISOString(),
        };
        if (user.photoURL) newUserProfile.photoURL = user.photoURL;

        try {
          await setDoc(docRef, newUserProfile);
        } catch (err) {
          console.warn("Could not save new user profile", err);
        }
        setUserProfile(newUserProfile as UserProfile);
      } else {
        setUserProfile(existingData as UserProfile);
      }
    } catch (error: any) {
      console.error("Sign in failed", error);
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
      const user = result.user;
      
      const docRef = doc(db, 'users', user.uid);
      
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          if (email === 'admin@areduindia.com' && data.role !== 'admin') {
            data.role = 'admin';
            try { await setDoc(docRef, { role: 'admin' }, { merge: true }); } catch (e) {}
          }
          setUserProfile(data);
        } else {
           // Provide fallback if auth succeeds but firestore is missing
           setUserProfile({
              uid: user.uid,
              email: user.email || '',
              name: 'User',
              role: email === 'admin@areduindia.com' ? 'admin' : 'student',
              createdAt: new Date().toISOString()
          } as UserProfile);
        }
      } catch (err) {
        console.warn("Could not fetch data during email signin", err);
        setUserProfile({
            uid: user.uid,
            email: user.email || '',
            name: 'User',
            role: email === 'admin@areduindia.com' ? 'admin' : 'student',
            createdAt: new Date().toISOString()
        } as UserProfile);
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
      try {
        await setDoc(docRef, newUserProfile);
      } catch (err) {
        console.warn("Could not save to firestore during signup", err);
      }
      
      // User is created and logged in via Firebase Auth, AuthContext state will update via onAuthStateChanged
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
