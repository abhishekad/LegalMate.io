"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, List } from 'lucide-react'; // Changed FileText to List for better semantics, or keep FileText if preferred

interface SummaryDisplayProps {
  summaryPoints: string[]; // Changed from summary: string
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summaryPoints }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" /> 
          {/* Or use <List className="h-5 w-5 text-primary" /> if that feels more appropriate for bullet points */}
          Document Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] lg:h-[500px] pr-4"> {/* Adjust height as needed */}
          {(!summaryPoints || summaryPoints.length === 0) ? (
            <p className="text-muted-foreground">No summary points available for this document.</p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed">
              {summaryPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
