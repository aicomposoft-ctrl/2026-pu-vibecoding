import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth-check';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const completeSchema = z.object({
  duration: z.number().int().positive(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const body = await request.json();
  const parsed = completeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
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

  const updated = await prisma.conversation.update({
    where: { id: params.id },
    data: {
      status: 'COMPLETED',
      duration: parsed.data.duration,
    },
  });

  return NextResponse.json({ success: true, conversation: updated });
}
