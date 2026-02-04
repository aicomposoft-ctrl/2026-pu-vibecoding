import OpenAI from 'openai';
import type { AnalysisResult } from '@ai-sales-trainer/shared-types';
import { ANALYSIS_CATEGORIES } from '@ai-sales-trainer/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `You are an expert B2B sales coach. Analyze this sales conversation transcript and provide detailed scoring and feedback.

Score each category from 0-100:
- Rapport Building: How well did the rep establish trust and connection?
- Needs Discovery: How effectively did the rep uncover pain points and needs?
- Value Presentation: How compelling was the value proposition delivery?
- Objection Handling: How skillfully were objections addressed?
- Closing Technique: How effectively did the rep move toward commitment?

Scenario Context: {scenario}

Transcript:
{transcript}

Respond with ONLY valid JSON in this exact format:
{
  "rapport": <number>,
  "discovery": <number>,
  "presentation": <number>,
  "objections": <number>,
  "closing": <number>,
  "feedback": "<detailed paragraph of overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}`;

export async function analyzeTranscript(
  transcript: string,
  scenario: string
): Promise<Omit<AnalysisResult, 'id'>> {
  const prompt = ANALYSIS_PROMPT
    .replace('{transcript}', transcript)
    .replace('{scenario}', scenario);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No analysis response from OpenAI');
  }

  const parsed = JSON.parse(content);

  const overallScore = Math.round(
    ANALYSIS_CATEGORIES.reduce((sum, cat) => {
      return sum + (parsed[cat.key] ?? 0) * cat.weight;
    }, 0)
  );

  return {
    overallScore,
    rapport: parsed.rapport,
    discovery: parsed.discovery,
    presentation: parsed.presentation,
    objections: parsed.objections,
    closing: parsed.closing,
    feedback: parsed.feedback,
    strengths: parsed.strengths,
    improvements: parsed.improvements,
  };
}
