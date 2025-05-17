'use server';

import { detectKeyClauses } from '@/ai/flows/detect-key-clauses';
import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';
import type { ProcessedDocument } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid: npm install uuid @types/uuid

export async function processDocumentAction(
  fileName: string,
  fileContent: string
): Promise<ProcessedDocument | { error: string }> {
  if (!fileContent) {
    return { error: 'Document content is empty.' };
  }

  try {
    // For very large documents, you might want to chunk or use streaming if supported by AI models.
    // For now, assuming documents fit within reasonable limits for direct processing.

    const [summaryResult, keyClausesResult] = await Promise.all([
      summarizeLegalDocument({ documentText: fileContent }),
      detectKeyClauses({ documentText: fileContent }),
    ]);

    if (!summaryResult.summary) {
        return { error: 'Failed to generate summary.' };
    }
    if (!keyClausesResult.keyClauses) {
        return { error: 'Failed to detect key clauses.' };
    }
    
    const processedDoc: ProcessedDocument = {
      id: uuidv4(),
      name: fileName,
      originalText: fileContent,
      summary: summaryResult.summary,
      keyClauses: keyClausesResult.keyClauses,
      uploadedAt: new Date().toISOString(),
    };

    return processedDoc;
  } catch (error) {
    console.error('Error processing document:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during document processing.';
    return { error: `AI processing failed: ${errorMessage}` };
  }
}
