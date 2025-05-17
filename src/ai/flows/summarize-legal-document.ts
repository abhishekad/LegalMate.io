'use server';

/**
 * @fileOverview Summarizes a legal document into plain English key points.
 *
 * - summarizeLegalDocument - A function that summarizes a legal document.
 * - SummarizeLegalDocumentInput - The input type for the summarizeLegalDocument function.
 * - SummarizeLegalDocumentOutput - The return type for the summarizeLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLegalDocumentInputSchema = z.object({
  documentText: z.string().describe('The text of the legal document to summarize.'),
});

export type SummarizeLegalDocumentInput = z.infer<typeof SummarizeLegalDocumentInputSchema>;

const SummarizeLegalDocumentOutputSchema = z.object({
  summaryPoints: z.array(z.string()).describe('A list of key summary points, each as a separate string, in plain English.'),
});

export type SummarizeLegalDocumentOutput = z.infer<typeof SummarizeLegalDocumentOutputSchema>;

export async function summarizeLegalDocument(input: SummarizeLegalDocumentInput): Promise<SummarizeLegalDocumentOutput> {
  return summarizeLegalDocumentFlow(input);
}

const summarizeLegalDocumentPrompt = ai.definePrompt({
  name: 'summarizeLegalDocumentPrompt',
  input: {schema: SummarizeLegalDocumentInputSchema},
  output: {schema: SummarizeLegalDocumentOutputSchema},
  prompt: `You are an expert legal professional, skilled at summarizing complex legal documents into plain, easy-to-understand English.

  Please provide a list of key summary points for the following legal document. Each point should be a concise sentence. Focus on the most important aspects and translate any legal jargon into simple terms.

  Document: {{{documentText}}}`,
});

const summarizeLegalDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeLegalDocumentFlow',
    inputSchema: SummarizeLegalDocumentInputSchema,
    outputSchema: SummarizeLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeLegalDocumentPrompt(input);
    return output!;
  }
);
