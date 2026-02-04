import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth-check';
import { prisma } from '@/lib/db';
import { startConversationSchema } from '@/lib/validators/conversation';

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const body = await request.json();
  const parsed = startConversationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const userId = (auth.user as Record<string, unknown>).id as string;

  const conversation = await prisma.conversation.create({
    data: {
      userId,
      scenario: parsed.data.scenarioId,
      title: `Practice Session — ${new Date().toLocaleDateString()}`,
    },
  });

  return NextResponse.json({ conversationId: conversation.id }, { status: 201 });
}

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const userId = (auth.user as Record<string, unknown>).id as string;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        analysis: {
          select: { overallScore: true },
        },
      },
    }),
    prisma.conversation.count({ where: { userId } }),
  ]);

  return NextResponse.json({
    items: conversations.map((c) => ({
      id: c.id,
      title: c.title,
      scenario: c.scenario,
      status: c.status,
      duration: c.duration,
      createdAt: c.createdAt.toISOString(),
      overallScore: c.analysis?.overallScore,
    })),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  });
}
