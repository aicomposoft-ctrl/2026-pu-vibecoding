import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth-check';
import { prisma } from '@/lib/db';
import { messageSchema } from '@/lib/validators/conversation';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const body = await request.json();
  const parsed = messageSchema.safeParse({
    ...body,
    conversationId: params.id,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const userId = (auth.user as Record<string, unknown>).id as string;

  const conversation = await prisma.conversation.findFirst({
    where: { id: params.id, userId },
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: params.id,
      role: parsed.data.role,
      content: parsed.data.content,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const userId = (auth.user as Record<string, unknown>).id as string;

  const conversation = await prisma.conversation.findFirst({
    where: { id: params.id, userId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(conversation.messages);
}
