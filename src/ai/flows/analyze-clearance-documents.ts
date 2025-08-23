// This file contains the Genkit flow for analyzing clearance documents and suggesting clearance status.

'use server';

/**
 * @fileOverview AI flow to analyze uploaded documents and suggest the most appropriate clearance status.
 *
 * - analyzeClearanceDocuments - A function that handles the document analysis process.
 * - AnalyzeClearanceDocumentsInput - The input type for the analyzeClearanceDocuments function.
 * - AnalyzeClearanceDocumentsOutput - The return type for the analyzeClearanceDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeClearanceDocumentsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z.string().describe('A description of the document.'),
  studentId: z.string().describe('The ID of the student submitting the document.'),
});
export type AnalyzeClearanceDocumentsInput = z.infer<typeof AnalyzeClearanceDocumentsInputSchema>;

const AnalyzeClearanceDocumentsOutputSchema = z.object({
  suggestedClearanceStatus: z
    .string()
    .describe('The suggested clearance status based on the document analysis.'),
  analysisSummary: z.string().describe('A summary of the document analysis.'),
});
export type AnalyzeClearanceDocumentsOutput = z.infer<typeof AnalyzeClearanceDocumentsOutputSchema>;

export async function analyzeClearanceDocuments(
  input: AnalyzeClearanceDocumentsInput
): Promise<AnalyzeClearanceDocumentsOutput> {
  return analyzeClearanceDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeClearanceDocumentsPrompt',
  input: {schema: AnalyzeClearanceDocumentsInputSchema},
  output: {schema: AnalyzeClearanceDocumentsOutputSchema},
  prompt: `You are an AI assistant that analyzes student documents for university clearance.

  Based on the document content and description, determine the most appropriate clearance status.
  Provide a brief summary of your analysis and suggest a clearance status.

  Student ID: {{{studentId}}}
  Document Description: {{{documentDescription}}}
  Document: {{media url=documentDataUri}}
  \n  Respond in markdown format.
  `,
});

const analyzeClearanceDocumentsFlow = ai.defineFlow(
  {
    name: 'analyzeClearanceDocumentsFlow',
    inputSchema: AnalyzeClearanceDocumentsInputSchema,
    outputSchema: AnalyzeClearanceDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
