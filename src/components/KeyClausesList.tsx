"use client";

import type React from 'react';
import type { KeyClause } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KeyClausesListProps {
  keyClauses: KeyClause[];
}

export const KeyClausesList: React.FC<KeyClausesListProps> = ({ keyClauses }) => {
  if (!keyClauses || keyClauses.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Key Clauses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No key clauses were identified in this document.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <AlertTriangle className="h-5 w-5 text-accent" />
          Identified Key Clauses
        </CardTitle>
        <CardDescription>Review the important clauses identified by the AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-350px)] lg:h-[500px] pr-2"> {/* Adjust height as needed */}
          <Accordion type="multiple" className="w-full">
            {keyClauses.map((clause, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b border-border last:border-b-0">
                <AccordionTrigger className="text-left hover:no-underline text-primary hover:text-accent transition-colors py-4">
                  <span className="font-medium text-base">{clause.clauseType || `Clause ${index + 1}`}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-primary" />
                      Clause Text:
                    </h4>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{clause.clauseText}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-md">
                    <h4 className="font-semibold text-sm mb-1">Justification:</h4>
                    <p className="text-sm leading-relaxed italic text-muted-foreground">{clause.justification}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
