import { z } from 'zod';

export const startConversationSchema = z.object({
  scenarioId: z.string().min(1, 'Scenario is required'),
});

export const analyzeTranscriptSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation ID'),
  transcript: z.string().min(50, 'Transcript must be at least 50 characters'),
  scenario: z.string().min(1, 'Scenario is required'),
});

export const messageSchema = z.object({
  conversationId: z.string().cuid('Invalid conversation ID'),
  role: z.enum(['USER', 'ASSISTANT', 'SYSTEM']),
  content: z.string().min(1, 'Message content is required'),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type AnalyzeTranscriptInput = z.infer<typeof analyzeTranscriptSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
