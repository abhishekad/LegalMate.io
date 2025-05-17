'use server';
/**
 * @fileOverview An AI agent to detect key clauses in a legal document.
 *
 * - detectKeyClauses - A function that handles the key clause detection process.
 * - DetectKeyClausesInput - The input type for the detectKeyClauses function.
 * - DetectKeyClausesOutput - The return type for the detectKeyClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectKeyClausesInputSchema = z.object({
  documentText: z.string().describe('The text of the legal document to analyze.'),
});
export type DetectKeyClausesInput = z.infer<typeof DetectKeyClausesInputSchema>;

const DetectKeyClausesOutputSchema = z.object({
  keyClauses: z
    .array(
      z.object({
        clauseType: z.string().describe('The type of key clause detected (e.g., termination, liability).'),
        clauseText: z.string().describe('The text of the key clause.'),
        justification: z.string().describe('Why this clause is considered a key clause.')
      })
    )
    .describe('An array of key clauses detected in the document.'),
});
export type DetectKeyClausesOutput = z.infer<typeof DetectKeyClausesOutputSchema>;

export async function detectKeyClauses(input: DetectKeyClausesInput): Promise<DetectKeyClausesOutput> {
  return detectKeyClausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectKeyClausesPrompt',
  input: {schema: DetectKeyClausesInputSchema},
  output: {schema: DetectKeyClausesOutputSchema},
  prompt: `You are an expert legal analyst. Analyze the following legal document and identify key clauses, such as termination clauses, liability limitations, and other important provisions. For each key clause, provide the clause text, its type (e.g., "Termination Clause"), and a brief justification for why it's considered a key clause.\n\nDocument:\n{{{documentText}}}`, 
});

const detectKeyClausesFlow = ai.defineFlow(
  {
    name: 'detectKeyClausesFlow',
    inputSchema: DetectKeyClausesInputSchema,
    outputSchema: DetectKeyClausesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
