"use client";

import type React from 'react';
import type { ProcessedDocument } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { FileText, FileClock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProcessedDocumentListProps {
  documents: ProcessedDocument[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
}

export const ProcessedDocumentList: React.FC<ProcessedDocumentListProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
}) => {
  if (documents.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <FileClock className="mx-auto mb-2 h-10 w-10" />
        No documents processed yet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full flex-1">
      <SidebarMenu>
        {documents.map((doc) => (
          <SidebarMenuItem key={doc.id}>
            <SidebarMenuButton
              onClick={() => onSelectDocument(doc.id)}
              isActive={doc.id === selectedDocumentId}
              className="w-full justify-start text-left"
              tooltip={{
                children: (
                  <>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                    </p>
                  </>
                ),
                side: 'right',
                align: 'start',
              }}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate flex-grow">{doc.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </ScrollArea>
  );
};
