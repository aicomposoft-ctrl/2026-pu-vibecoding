import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth-check';
import { rateLimit } from '@/lib/api/rate-limit';
import { RATE_LIMIT_CONFIG } from '@ai-sales-trainer/config';

const limiter = rateLimit(RATE_LIMIT_CONFIG.conversation);

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const userId = (auth.user as Record<string, unknown>).id as string;
  const { success } = limiter(userId);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: 'ElevenLabs not configured' },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 502 }
    );
  }

  const data = await response.json();

  return NextResponse.json({ signedUrl: data.signed_url });
}
