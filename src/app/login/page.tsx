
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { ConfirmationResult } from 'firebase/auth';
import { Loader2, LogIn } from 'lucide-react';

// Inline SVG for Google icon
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="18" height="18" className="mr-2">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.13-10.36 7.13-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const countryCodes = [
  { name: "USA (+1)", code: "+1", country: "US" },
  { name: "Canada (+1)", code: "+1", country: "CA" },
  { name: "India (+91)", code: "+91", country: "IN" },
  { name: "UK (+44)", code: "+44", country: "GB" },
  { name: "Australia (+61)", code: "+61", country: "AU" },
  { name: "Germany (+49)", code: "+49", country: "DE" },
  { name: "France (+33)", code: "+33", country: "FR" },
  { name: "Brazil (+55)", code: "+55", country: "BR" },
  { name: "South Africa (+27)", code: "+27", country: "ZA" },
  { name: "Nigeria (+234)", code: "+234", country: "NG" },
  { name: "Japan (+81)", code: "+81", country: "JP" },
  { name: "Mexico (+52)", code: "+52", country: "MX" },
];

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const phoneSchema = z.object({
  countryCode: z.string().min(1, { message: "Please select a country code." }),
  subscriberNumber: z.string().regex(/^[0-9]+$/, { message: "Phone number must contain only digits." })
                      .min(5, {message: "Phone number seems too short."})
                      .max(15, {message: "Phone number seems too long."}),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});


export default function LoginPage() {
  const { signInWithEmail, signInWithPhone, confirmOtp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { countryCode: countryCodes[0].code, subscriberNumber: "" },
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

  const handleEmailLogin = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    const loggedInUser = await signInWithEmail(values.email, values.password);
    if (loggedInUser) {
      router.push('/');
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    const fullPhoneNumber = `${values.countryCode}${values.subscriberNumber}`;
    const result = await signInWithPhone(fullPhoneNumber);
    if (result) {
      setConfirmationResult(result);
      setShowOtpForm(true);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (values: z.infer<typeof otpSchema>) => {
    if (!confirmationResult) return;
    setIsLoading(true);
    const loggedInUser = await confirmOtp(confirmationResult, values.otp);
    if (loggedInUser) {
      router.push('/');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const loggedInUser = await signInWithGoogle();
    if (loggedInUser) {
      router.push('/');
    }
    setIsGoogleLoading(false);
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
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setShowOtpForm(false); setIsLoading(false);}} className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <LogIn className="h-8 w-8 text-primary" />
              Login to LegalMate
            </CardTitle>
            <CardDescription>Access your legal document analysis.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Sign In with Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="pt-4">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailLogin)} className="space-y-6">
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
                  <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login with Email
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="phone" className="pt-4">
              {!showOtpForm ? (
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-6">
                    <div className="grid grid-cols-3 gap-x-2 gap-y-4 items-start">
                      <FormField
                        control={phoneForm.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem className="col-span-3 sm:col-span-1">
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Code" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countryCodes.map((country) => (
                                  <SelectItem key={`${country.country}-${country.code}-${country.name}`} value={country.code}>
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={phoneForm.control}
                        name="subscriberNumber"
                        render={({ field }) => (
                          <FormItem className="col-span-3 sm:col-span-2">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormDescription className="col-span-3 text-xs">
                        Select your country code and enter the rest of your phone number.
                       </FormDescription>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
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
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify OTP & Login
                    </Button>
                    <Button variant="link" onClick={() => {setShowOtpForm(false); setConfirmationResult(null); otpForm.reset(); phoneForm.reset({ countryCode: countryCodes[0].code, subscriberNumber: "" }); setIsLoading(false);}} className="w-full">
                      Change phone number or method
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center space-y-2 pt-6 border-t">
             <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </p>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}
