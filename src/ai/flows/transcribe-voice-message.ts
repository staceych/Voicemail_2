'use server';
/**
 * @fileOverview A voice message transcription AI agent.
 *
 * - transcribeVoiceMessage - A function that handles the voice message transcription process.
 * - TranscribeVoiceMessageInput - The input type for the transcribeVoiceMessage function.
 * - TranscribeVoiceMessageOutput - The return type for the transcribeVoiceMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeVoiceMessageInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeVoiceMessageInput = z.infer<typeof TranscribeVoiceMessageInputSchema>;

const TranscribeVoiceMessageOutputSchema = z.object({
  transcript: z.string().describe('The text transcript of the voice message.'),
});
export type TranscribeVoiceMessageOutput = z.infer<typeof TranscribeVoiceMessageOutputSchema>;

export async function transcribeVoiceMessage(input: TranscribeVoiceMessageInput): Promise<TranscribeVoiceMessageOutput> {
  return transcribeVoiceMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeVoiceMessagePrompt',
  input: {schema: TranscribeVoiceMessageInputSchema},
  output: {schema: TranscribeVoiceMessageOutputSchema},
  prompt: `You are a transcription expert. Please transcribe the following audio message to text.\n\nAudio: {{media url=audioDataUri}}`,
});

const transcribeVoiceMessageFlow = ai.defineFlow(
  {
    name: 'transcribeVoiceMessageFlow',
    inputSchema: TranscribeVoiceMessageInputSchema,
    outputSchema: TranscribeVoiceMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
