'use server';
/**
 * @fileOverview AI agent to summarize a student's clearance progress.
 *
 * - summarizeClearanceProgress - A function that summarizes the clearance progress based on uploaded documents.
 * - SummarizeClearanceProgressInput - The input type for the summarizeClearanceProgress function.
 * - SummarizeClearanceProgressOutput - The return type for the summarizeClearanceProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClearanceProgressInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  documents: z.array(
    z.object({
      documentName: z.string().describe('The name of the document.'),
      documentDataUri: z
        .string()
        .describe(
          'The document as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'        ),
    })
  ).describe('An array of documents uploaded by the student.'),
});
export type SummarizeClearanceProgressInput = z.infer<typeof SummarizeClearanceProgressInputSchema>;

const SummarizeClearanceProgressOutputSchema = z.object({
  summary: z.string().describe('A summary of the student\'s clearance progress.'),
  progress: z.string().describe('A short, one-sentence summary of the clearance progress.')
});
export type SummarizeClearanceProgressOutput = z.infer<typeof SummarizeClearanceProgressOutputSchema>;

export async function summarizeClearanceProgress(input: SummarizeClearanceProgressInput): Promise<SummarizeClearanceProgressOutput> {
  return summarizeClearanceProgressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeClearanceProgressPrompt',
  input: {schema: SummarizeClearanceProgressInputSchema},
  output: {schema: SummarizeClearanceProgressOutputSchema},
  prompt: `You are an AI assistant helping to summarize a student's clearance progress based on the documents they have uploaded.

  Student ID: {{{studentId}}}

  Uploaded Documents:
  {{#each documents}}
  - Document Name: {{{documentName}}}
    Document Data URI: {{media url=documentDataUri}}
  {{/each}}

  Please provide a concise summary of the student's clearance progress based on the content of the uploaded documents.
  Also, add a one sentence summary of the student's progress in the progress field.
  `,
});

const summarizeClearanceProgressFlow = ai.defineFlow(
  {
    name: 'summarizeClearanceProgressFlow',
    inputSchema: SummarizeClearanceProgressInputSchema,
    outputSchema: SummarizeClearanceProgressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
