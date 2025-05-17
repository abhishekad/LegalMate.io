
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { ConfirmationResult } from 'firebase/auth';
import { Loader2, UserPlus } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, { message: "Invalid phone number. Include country code e.g. +12345678900" }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export default function SignUpPage() {
  const { signUpWithEmail, signInWithPhone, confirmOtp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEmailSignUp = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    const signedUpUser = await signUpWithEmail(values.email, values.password);
    if (signedUpUser) {
      router.push('/');
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    const result = await signInWithPhone(values.phoneNumber); // signInWithPhone also handles user creation if not exists
    if (result) {
      setConfirmationResult(result);
      setShowOtpForm(true);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    if (!confirmationResult) return;
    setIsLoading(true);
    const signedUpUser = await confirmOtp(confirmationResult, values.otp);
    if (signedUpUser) {
      router.push('/');
    }
    setIsLoading(false);
  };
  
  if (authLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <UserPlus className="h-8 w-8 text-primary" />
              Create Account
            </CardTitle>
            <CardDescription>Join LegalMate to simplify your legal documents.</CardDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone OTP</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <TabsContent value="email">
            <CardContent className="space-y-6">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailSignUp)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up with Email
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>

          <TabsContent value="phone">
            <CardContent className="space-y-6">
              {!showOtpForm ? (
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                    <FormField
                      control={phoneForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+12345678900" {...field} />
                          </FormControl>
                          <FormDescription>Include country code (e.g., +1).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send OTP
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enter OTP</FormLabel>
                          <FormControl>
                            <Input placeholder="123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify OTP & Sign Up
                    </Button>
                     <Button variant="link" onClick={() => {setShowOtpForm(false); setConfirmationResult(null); otpForm.reset(); phoneForm.reset()}} className="w-full">
                      Change phone number or method
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </TabsContent>
          
          <CardFooter className="flex flex-col items-center space-y-2 pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/login">Login</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}
