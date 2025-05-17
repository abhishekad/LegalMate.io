
"use client";

import type React from 'react';
import { LegalMateLogo } from '@/components/icons/LegalMateLogo';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, UserPlus, UserCircle, Loader2 } from 'lucide-react';
// import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed for theme toggling
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const Header: React.FC = () => {
  // const { theme, setTheme } = useTheme(); 
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        {user && <SidebarTrigger className="md:hidden" />} {/* Only show sidebar trigger if user is logged in and on main app view */}
        <LegalMateLogo />
      </div>
      
      <div className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email || user.phoneNumber || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Link>
            </Button>
          </>
        )}
        {/* 
        // Theme toggle example:
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button> 
        */}
      </div>
    </header>
  );
};
