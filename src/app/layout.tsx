import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// AppLayout will be used in page.tsx as it needs client state

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LegalMate - AI Legal Document Assistant',
  description: 'Simplify your legal documents with AI-powered summaries and key clause detection.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        The suppressHydrationWarning prop is true.
        This can be useful if server-rendered and client-rendered markup might differ
        for reasons like timestamps or when integrating with browser extensions or
        libraries (like next-themes for theme switching) that might modify the DOM.
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* AppLayout is now part of page.tsx to manage client-side state for documents */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
