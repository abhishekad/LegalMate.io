
"use client";

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  type User, 
  type Auth,
  type ConfirmationResult
} from 'firebase/auth';
import { app, auth as firebaseAuth, initializeRecaptchaVerifier } from '@/lib/firebase'; // Use the auth instance from firebase.ts
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  confirmOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const signUpWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      setUser(userCredential.user);
      toast({ title: 'Success', description: 'Account created successfully!' });
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({ title: 'Sign Up Error', description: error.message || 'Failed to create account.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
      setUser(userCredential.user);
      toast({ title: 'Success', description: 'Signed in successfully!' });
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({ title: 'Sign In Error', description: error.message || 'Failed to sign in.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
    setLoading(true);
    try {
      const recaptchaVerifier = initializeRecaptchaVerifier('recaptcha-container-invisible');
      if (!recaptchaVerifier) {
        throw new Error("RecaptchaVerifier not initialized");
      }
      // Ensure reCAPTCHA is rendered before signInWithPhoneNumber is called
      await recaptchaVerifier.render(); 
      const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, recaptchaVerifier);
      toast({ title: 'OTP Sent', description: 'An OTP has been sent to your phone.' });
      return confirmationResult;
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      // Reset reCAPTCHA on error
      if (typeof grecaptcha !== 'undefined' && (window as any).recaptchaWidgetId) {
        grecaptcha.reset((window as any).recaptchaWidgetId);
      }
      toast({ title: 'OTP Error', description: error.message || 'Failed to send OTP.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const confirmOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<User | null> => {
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      setUser(userCredential.user);
      toast({ title: 'Success', description: 'Signed in successfully via phone!' });
      return userCredential.user;
    } catch (error: any) {
      console.error("Error confirming OTP:", error);
      toast({ title: 'OTP Confirmation Error', description: error.message || 'Failed to confirm OTP.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(firebaseAuth);
      setUser(null);
      toast({ title: 'Logged Out', description: 'You have been logged out.' });
      router.push('/login');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({ title: 'Logout Error', description: error.message || 'Failed to log out.', variant: 'destructive'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUpWithEmail, signInWithEmail, signInWithPhone, confirmOtp, logout }}>
      {children}
      {/* Invisible reCAPTCHA container for phone auth */}
      <div id="recaptcha-container-invisible"></div>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
