"use client";

import type React from 'react';
import { LegalMateLogo } from '@/components/icons/LegalMateLogo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed for theme toggling

export const Header: React.FC = () => {
  // const { theme, setTheme } = useTheme(); // Example for theme toggle
  
  // Simplified: no theme toggle for now to avoid adding next-themes dependency without explicit instruction
  // If next-themes is available, the below can be uncommented and used.

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <LegalMateLogo />
      </div>
      {/* 
      // Theme toggle example:
      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button> 
      */}
    </header>
  );
};
