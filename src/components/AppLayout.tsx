"use client";

import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Header } from '@/components/Header';
import { LegalMateLogo } from '@/components/icons/LegalMateLogo'; 
import type { ProcessedDocument } from '@/lib/types';
import { ProcessedDocumentList } from './ProcessedDocumentList';

interface AppLayoutProps {
  children: React.ReactNode;
  documents: ProcessedDocument[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children,
  documents,
  selectedDocumentId,
  onSelectDocument 
}) => {
  return (
    <SidebarProvider defaultOpen={true} open={true}> {/* Control open state from parent if needed */}
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
          <SidebarHeader className="p-4 border-b flex items-center justify-center">
            {/* Expanded state logo */}
            <LegalMateLogo className="group-data-[collapsible=icon]:hidden" imageSize={40} /> 
            {/* Collapsed state logo - smaller image */}
            <LegalMateLogo collapsed className="hidden group-data-[collapsible=icon]:!flex" imageSize={32} /> 
          </SidebarHeader>
          <SidebarContent className="p-0">
            <ProcessedDocumentList 
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={onSelectDocument}
            />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-[calc(var(--sidebar-width-icon)_+_1rem)] group-data-[state=expanded]:sm:pl-[calc(var(--sidebar-width)_+_1rem)] transition-[padding-left] duration-200 ease-linear">
          <Header />
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};
