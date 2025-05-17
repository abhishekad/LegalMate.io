"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface SummaryDisplayProps {
  summary: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" />
          Document Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] lg:h-[500px] pr-4"> {/* Adjust height as needed */}
          <p className="text-base leading-relaxed whitespace-pre-wrap">{summary}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
