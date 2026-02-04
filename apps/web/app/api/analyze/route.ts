import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth-check';
import { prisma } from '@/lib/db';
import { analyzeTranscriptSchema } from '@/lib/validators/conversation';
import { analyzeTranscript } from '@/lib/api/analyze';
import { rateLimit } from '@/lib/api/rate-limit';
import { RATE_LIMIT_CONFIG } from '@ai-sales-trainer/config';

const limiter = rateLimit(RATE_LIMIT_CONFIG.analyze);

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const userId = (auth.user as Record<string, unknown>).id as string;
  const { success } = limiter(userId);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await request.json();
  const parsed = analyzeTranscriptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: parsed.data.conversationId, userId },
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  try {
    const result = await analyzeTranscript(parsed.data.transcript, parsed.data.scenario);

    const analysis = await prisma.analysis.create({
      data: {
        conversationId: parsed.data.conversationId,
        ...result,
      },
    });

    return NextResponse.json({ success: true, analysis });
  } catch {
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
