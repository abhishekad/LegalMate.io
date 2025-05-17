"use client";

import type React from 'react';
import type { ProcessedDocument } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryDisplay } from './SummaryDisplay';
import { KeyClausesList } from './KeyClausesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ListChecks, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentDisplayProps {
  document: ProcessedDocument;
}

export const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ document }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">{document.name}</h1>
        <p className="text-sm text-muted-foreground">
          Uploaded on: {format(new Date(document.uploadedAt), "MMMM d, yyyy 'at' h:mm a")}
        </p>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-primary/10 p-1 h-auto">
          <TabsTrigger value="summary" className="py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md">
            <FileText className="mr-2 h-4 w-4" /> Summary
          </TabsTrigger>
          <TabsTrigger value="keyClauses" className="py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md">
            <ListChecks className="mr-2 h-4 w-4" /> Key Clauses
          </TabsTrigger>
          <TabsTrigger value="originalText" className="py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md">
            <BookOpen className="mr-2 h-4 w-4" /> Original Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <SummaryDisplay summary={document.summary} />
        </TabsContent>

        <TabsContent value="keyClauses" className="mt-4">
          <KeyClausesList keyClauses={document.keyClauses} />
        </TabsContent>

        <TabsContent value="originalText" className="mt-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-primary" />
                Original Document Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] lg:h-[500px] border rounded-md p-4 bg-muted/30"> {/* Adjust height as needed */}
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono">{document.originalText}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
