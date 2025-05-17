"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { DocumentUploadForm } from '@/components/DocumentUploadForm';
import { DocumentDisplay } from '@/components/DocumentDisplay';
import type { ProcessedDocument } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FileSearch, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Global loading for AI processing
  const [isInitialLoad, setIsInitialLoad] = useState(true); // To manage initial localStorage load

  // Load documents from localStorage on initial mount
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem('legalMateDocs');
      if (storedDocs) {
        const parsedDocs: ProcessedDocument[] = JSON.parse(storedDocs);
        setProcessedDocuments(parsedDocs);
        // Optionally, select the most recent document or the first one
        if (parsedDocs.length > 0) {
           // Sort by date to get the most recent one first if desired
           // parsedDocs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
           // setCurrentDocument(parsedDocs[0]); 
        }
      }
    } catch (error) {
      console.error("Failed to load documents from localStorage:", error);
      // Handle potential JSON parsing errors or other issues
    }
    setIsInitialLoad(false);
  }, []);

  // Save documents to localStorage whenever processedDocuments changes
  useEffect(() => {
    if (!isInitialLoad) { // Avoid writing back initial empty/default state before loading
        try {
            localStorage.setItem('legalMateDocs', JSON.stringify(processedDocuments));
        } catch (error) {
            console.error("Failed to save documents to localStorage:", error);
            // Handle potential storage full errors or other issues
        }
    }
  }, [processedDocuments, isInitialLoad]);


  const handleDocumentProcessed = (newDocument: ProcessedDocument) => {
    setProcessedDocuments(prevDocs => [newDocument, ...prevDocs]); // Add to the beginning of the list
    setCurrentDocument(newDocument);
  };

  const handleSelectDocument = (id: string) => {
    const selectedDoc = processedDocuments.find(doc => doc.id === id);
    if (selectedDoc) {
      setCurrentDocument(selectedDoc);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <Skeleton className="h-12 w-full" /> {/* Tabs skeleton */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/4 mb-2" /> {/* Title skeleton */}
              <Skeleton className="h-40 w-full" /> {/* Content skeleton */}
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentDocument) {
      return <DocumentDisplay document={currentDocument} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <DocumentUploadForm 
            onDocumentProcessed={handleDocumentProcessed} 
            setIsLoadingGlobal={setIsLoading}
        />
        {processedDocuments.length === 0 && (
            <Card className="mt-8 w-full max-w-lg bg-accent/10 border-accent/30">
                <CardContent className="p-6">
                    <div className="flex items-center text-accent">
                        <Info className="h-6 w-6 mr-3 shrink-0" />
                        <div>
                            <h3 className="font-semibold">Welcome to LegalMate!</h3>
                            <p className="text-sm ">
                                Upload your first legal document (in .txt format) to get started.
                                Your processed documents will appear in the sidebar.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
         {processedDocuments.length > 0 && !currentDocument && (
             <Card className="mt-8 w-full max-w-lg bg-primary/10 border-primary/30">
                <CardContent className="p-6">
                    <div className="flex items-center text-primary">
                        <FileSearch className="h-10 w-10 mr-4 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-lg">Select a Document</h3>
                            <p className="text-sm">
                                Choose a document from the sidebar to view its analysis, or upload a new one.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
         )}
      </div>
    );
  };
  
  if (isInitialLoad && typeof window !== 'undefined') { // Prevent server-side rendering of loading state if it depends on localStorage
    return ( // Or a more generic page loading spinner
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <AppLayout
      documents={processedDocuments}
      selectedDocumentId={currentDocument?.id ?? null}
      onSelectDocument={handleSelectDocument}
    >
      {renderContent()}
    </AppLayout>
  );
}

// Helper component for loader
const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
