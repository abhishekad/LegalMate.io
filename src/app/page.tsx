
"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { DocumentUploadForm } from '@/components/DocumentUploadForm';
import { DocumentDisplay } from '@/components/DocumentDisplay';
import type { ProcessedDocument } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FileSearch, Info, Loader2 as IconLoader } from 'lucide-react'; // Renamed Loader2 to IconLoader to avoid conflict
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header'; // Import Header for standalone display when not logged in

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);
  const [isLoadingAIData, setIsLoadingAIData] = useState(false); // Global loading for AI processing
  const [isInitialDocLoad, setIsInitialDocLoad] = useState(true); // To manage initial localStorage load

  // Effect for redirecting if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load documents from localStorage on initial mount (if user is logged in)
  useEffect(() => {
    if (user && !authLoading) { // Only load if user is logged in and auth state is resolved
      try {
        const storedDocs = localStorage.getItem(`legalMateDocs_${user.uid}`); // User-specific storage
        if (storedDocs) {
          const parsedDocs: ProcessedDocument[] = JSON.parse(storedDocs);
          setProcessedDocuments(parsedDocs);
        }
      } catch (error) {
        console.error("Failed to load documents from localStorage:", error);
      }
      setIsInitialDocLoad(false);
    } else if (!user && !authLoading) {
      // If no user, clear any potentially loaded docs for a previous user / ensure clean state
      setProcessedDocuments([]);
      setCurrentDocument(null);
      setIsInitialDocLoad(false); // Mark doc loading as complete even if no user
    }
  }, [user, authLoading]);

  // Save documents to localStorage whenever processedDocuments changes (if user is logged in)
  useEffect(() => {
    if (user && !isInitialDocLoad) { 
        try {
            localStorage.setItem(`legalMateDocs_${user.uid}`, JSON.stringify(processedDocuments));
        } catch (error) {
            console.error("Failed to save documents to localStorage:", error);
        }
    }
  }, [processedDocuments, isInitialDocLoad, user]);


  const handleDocumentProcessed = (newDocument: ProcessedDocument) => {
    setProcessedDocuments(prevDocs => [newDocument, ...prevDocs]);
    setCurrentDocument(newDocument);
  };

  const handleSelectDocument = (id: string) => {
    const selectedDoc = processedDocuments.find(doc => doc.id === id);
    if (selectedDoc) {
      setCurrentDocument(selectedDoc);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Show header even during auth load for consistency */}
        <div className="flex flex-1 items-center justify-center">
          <IconLoader className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground sr-only">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If no user, and auth is not loading, this part should ideally not be reached due to redirect.
  // However, as a fallback or if redirect hasn't completed:
  if (!user) {
     return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Please <a href="/login" className="text-primary hover:underline">login</a> to continue.</p>
        </div>
      </div>
    );
  }

  // User is authenticated, proceed to render app content
  const renderContent = () => {
    if (isInitialDocLoad) { 
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <IconLoader className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your documents...</p>
        </div>
      );
    }

    if (isLoadingAIData) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <Skeleton className="h-12 w-full" /> 
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/4 mb-2" /> 
              <Skeleton className="h-40 w-full" /> 
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
            setIsLoadingGlobal={setIsLoadingAIData}
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
