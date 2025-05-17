"use client";

import type React from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2 } from 'lucide-react';
import type { ProcessedDocument } from '@/lib/types';
import { processDocumentAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DocumentUploadFormProps {
  onDocumentProcessed: (document: ProcessedDocument) => void;
  setIsLoadingGlobal: (isLoading: boolean) => void;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onDocumentProcessed, setIsLoadingGlobal }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === 'text/plain') {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a .txt file.',
          variant: 'destructive',
        });
        setFile(null);
        if(fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a document to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setIsLoadingGlobal(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const textContent = e.target?.result as string;
      if (textContent) {
        const result = await processDocumentAction(file.name, textContent);
        if ('error' in result) {
          toast({
            title: 'Processing Failed',
            description: result.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Document Processed',
            description: `${file.name} has been successfully analyzed.`,
          });
          onDocumentProcessed(result);
          setFile(null); // Reset file state
          if(fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
          }
        }
      } else {
        toast({
          title: 'File Read Error',
          description: 'Could not read file content.',
          variant: 'destructive',
        });
      }
      setIsProcessing(false);
      setIsLoadingGlobal(false);
    };
    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'Failed to read the file.',
        variant: 'destructive',
      });
      setIsProcessing(false);
      setIsLoadingGlobal(false);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          Upload Legal Document
        </CardTitle>
        <CardDescription>
          Upload a .txt file for AI-powered summarization and key clause detection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document-upload" className="text-base">Select Document (.txt)</Label>
            <Input
              id="document-upload"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              disabled={isProcessing}
            />
            {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
          </div>
          <Button type="submit" className="w-full text-base py-3" disabled={isProcessing || !file}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Analyze Document'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
